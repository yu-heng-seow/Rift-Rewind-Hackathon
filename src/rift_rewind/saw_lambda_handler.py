import json
import os
from strengths_weaknesses import analyze_strengths_weaknesses

import boto3
import time
from decimal import Decimal


# The "structured" event sent by the ai agent is specified to look like this:
# {
#   "actionGroup": "strengths-weaknesses-analysis",
#   "apiPath": "/analyze",
#   "httpMethod": "POST",
#   "requestBody": {
#     "content": {
#       "application/json": {
#         "properties": [
#           {"name": "game_name", "value": "Faker"},
#           {"name": "tagline", "value": "KR1"},
#           {"name": "region", "value": "asia"}
#         ]
#       }
#     }
#   }
# }

dynamodb = boto3.resource('dynamodb')
table_name = os.getenv("DYNAMODB_TABLE", "playerUserData")
table = dynamodb.Table(table_name)

#dynamoDB doenst support storing float, so this helps to convert every  float to decimal
def convert_floats_to_decimal(obj):
    if isinstance(obj, float):
        return Decimal(str(obj))
    elif isinstance(obj, dict):
        return {k: convert_floats_to_decimal(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_floats_to_decimal(v) for v in obj]
    else:
        return obj
    
# convert the decimal back to float
def convert_decimal_to_float(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    elif isinstance(obj, dict):
        return {k: convert_decimal_to_float(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_decimal_to_float(v) for v in obj]
    else:
        return obj
    

def lambda_handler(event, context):
    print("Event received: " + json.dumps(event))  # Debug log

    # reads the metadata from incoming event (which endpoint, which method, etc)
    action_group = event.get('actionGroup')
    api_path = event.get('apiPath', '/analyze')
    http_method = event.get('httpMethod', 'POST')  

    # validate action group, If the AI agent accidentally calls this Lambda with the wrong “action group” name, it will return a 400 error.
    if action_group != 'strengths-weaknesses-analysis':
        print("Invalid action group")
        return format_response(400, {'error': 'Invalid action group'}, action_group, api_path, http_method, event)

    # Parse Bedrock-style request
    request_body = event.get('requestBody', {}).get('content', {}).get('application/json', {})
    properties = request_body.get('properties', [])

    parameters = {prop['name']: prop['value'] for prop in properties if 'name' in prop and 'value' in prop}
    print("Parsed parameters: " + json.dumps(parameters))
    # Bedrock sends parameters as a list of name-value pairs(i cant change it, its Bedrock) (not a normal dict (JSON object)).
    # This loop converts that list into a clean dictionary:

    game_name = parameters.get('game_name')
    tagline = parameters.get('tagline')
    region = parameters.get('region')
    

    # validate parameters
    if not all([game_name, tagline, region]):
        print("Missing parameters")
        return format_response(400, {'error': 'Missing required parameters: game_name, tagline, region'}, action_group, api_path, http_method, event)
    

    # for dynamoDB
    pk = f"{game_name}#{tagline}#{region}"
    sk = "2025#SAW"

    try:
        # Check DynamoDB cache, if got then return cache
        cached = table.get_item(Key={'player': pk, 'year#feature': sk})
        if 'Item' in cached and 'result' in cached['Item']:
            print("Returning cached result from database")
            clean_result = convert_decimal_to_float(cached['Item']['result'])
            return format_response(200, clean_result, action_group, api_path, http_method, event)


        # calling core analysis function and store result into dynamoDB
        result = analyze_strengths_weaknesses(game_name, tagline, region)

        # if no data
        if result is None or 'error' in result:
            print("Analysis failed or returned no data")
            return format_response(404, result or {'error': 'No data returned'}, action_group, api_path, http_method, event)

        # Else if got data save to DynamoDB
        table.put_item(Item={
            # Partition key attribute
            'player': pk,
            # Sort key attribute
            'year#feature': sk,
            # auto adds new attributes 
            'result': convert_floats_to_decimal(result),
            'timestamp': int(time.time())
        })

        # else if got data, print results
        print ("Stored new results in DynamoDB")
        print("Analysis result: " + json.dumps(result))
        return format_response(200, result, action_group, api_path, http_method, event)

    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return format_response(500, {'error': str(e)}, action_group, api_path, http_method, event)

# format the response to match the OpenAPI schema
def format_response(status_code, body_dict, action_group, api_path, http_method, event):
    return {
        'messageVersion': '1.0',
        'response': {
            'actionGroup': action_group,
            'apiPath': api_path,
            'httpMethod': http_method,
            'httpStatusCode': status_code,
            'responseBody': {
                'application/json': {
                    'body': json.dumps(body_dict)
                }
            }
        },
        'sessionAttributes': event.get('sessionAttributes', {}),
        'promptSessionAttributes': event.get('promptSessionAttributes', {})
    }

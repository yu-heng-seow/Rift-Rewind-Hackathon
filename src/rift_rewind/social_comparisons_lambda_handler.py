import json
import os
# Import the new function from your social_comparison.py script
from strengths_weaknesses import analyze_strengths_weaknesses
from social_comparisons import generate_social_comparison

import boto3
import time
from decimal import Decimal


# The "structured" event for this handler should look like this:
# {
#   "actionGroup": "social-comparison-analysis",
#   "apiPath": "/compare",
#   "httpMethod": "POST",
#   "requestBody": {
#     "content": {
#       "application/json": {
#         "properties": [
#           {"name": "game_name_1", "value": "PlayerOne"},
#           {"name": "tagline_1", "value": "NA1"},
#           {"name": "region_1", "value": "americas"},
#           {"name": "game_name_2", "value": "PlayerTwo"},
#           {"name": "tagline_2", "value": "EUW"},
#           {"name": "region_2", "value": "europe"}
#         ]
#       }
#     }
#   }
# }

dynamodb = boto3.resource('dynamodb')
table_name = os.getenv("DYNAMODB_TABLE", "playerUserData")
table = dynamodb.Table(table_name)

# --- DynamoDB Helper Functions ---
# (Copied from your template)

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

    # reads the metadata from incoming event
    action_group = event.get('actionGroup')
    api_path = event.get('apiPath', '/compare') # Default to compare path
    http_method = event.get('httpMethod', 'POST')  

    # validate action group
    if action_group != 'social-comparison-analysis':
        print("Invalid action group")
        return format_response(400, {'error': 'Invalid action group, expected "social-comparison-analysis"'}, action_group, api_path, http_method, event)

    # Parse Bedrock-style request
    request_body = event.get('requestBody', {}).get('content', {}).get('application/json', {})
    properties = request_body.get('properties', [])

    parameters = {prop['name']: prop['value'] for prop in properties if 'name' in prop and 'value' in prop}
    print("Parsed parameters: " + json.dumps(parameters))

    # Extract all 6 parameters for the two players
    game_name_1 = parameters.get('game_name_1')
    tagline_1 = parameters.get('tagline_1')
    region_1 = parameters.get('region_1')
    game_name_2 = parameters.get('game_name_2')
    tagline_2 = parameters.get('tagline_2')
    region_2 = parameters.get('region_2')
    

    # validate parameters
    required_params = ['game_name_1', 'tagline_1', 'region_1', 'game_name_2', 'tagline_2', 'region_2']
    if not all(parameters.get(p) for p in required_params):
        print("Missing parameters")
        return format_response(400, {'error': f'Missing required parameters: {", ".join(required_params)}'}, action_group, api_path, http_method, event)
    

    # Create sorted, order-independent keys for DynamoDB
    pk1 = f"{game_name_1}#{tagline_1}#{region_1}"
    pk2 = f"{game_name_2}#{tagline_2}#{region_2}"
    
    # Sort PKs to ensure (PlayerA vs PlayerB) and (PlayerB vs PlayerA) use the same cache key
    sorted_pks = sorted([pk1, pk2])
    
    pk = f"{sorted_pks[0]}##{sorted_pks[1]}" # Combined partition key
    sk = "2025#COMP" # Sort key for "Comparison"

    try:
        # Check DynamoDB cache
        cached = table.get_item(Key={'player': pk, 'year#feature': sk})
        if 'Item' in cached and 'result' in cached['Item']:
            print("Returning cached result from database")
            clean_result = convert_decimal_to_float(cached['Item']['result'])
            return format_response(200, clean_result, action_group, api_path, http_method, event)


        # If not cached, call the core comparison function
        print("Cache miss, running new comparison")
        player1_cached_data = table.get_item(Key={'player': pk1, 'year#feature': '2025#SAW'})
        if 'Item' in player1_cached_data and 'result' in player1_cached_data['Item']:
            player1_data = convert_decimal_to_float(player1_cached_data['Item']['result'])
        else:
            player1_data = analyze_strengths_weaknesses(game_name_1, tagline_1, region_1)
        
        player2_cached_data = table.get_item(Key={'player': pk2, 'year#feature': '2025#SAW'})
        if 'Item' in player2_cached_data and 'result' in player2_cached_data['Item']:
            player2_data = convert_decimal_to_float(player2_cached_data['Item']['result'])
        else:
            player2_data = analyze_strengths_weaknesses(game_name_2, tagline_2, region_2)
        
        result = generate_social_comparison(player1_data, player2_data)

        # if no data or error from the function
        if result is None or 'error' in result:
            print("Comparison failed or returned no data")
            return format_response(404, result or {'error': 'No data returned'}, action_group, api_path, http_method, event)

        # Else if got data, save to DynamoDB
        table.put_item(Item={
            'player': pk,          # Combined partition key
            'year#feature': sk,    # "Comparison" sort key
            'result': convert_floats_to_decimal(result),
            'timestamp': int(time.time())
        })

        print ("Stored new comparison results in DynamoDB")
        print("Comparison result: " + json.dumps(result))
        return format_response(200, result, action_group, api_path, http_method, event)

    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return format_response(500, {'error': str(e)}, action_group, api_path, http_method, event)

# format the response to match the OpenAPI schema
# (Copied from your template)
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
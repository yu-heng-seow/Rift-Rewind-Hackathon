import boto3
import time
import json
from year_end_summary import summary

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("playerUserData")

def lambda_handler(event, context):
    # 1. PARSE THE BODY FROM API GATEWAY
    try:
        body = json.loads(event.get('body', '{}'))
    except json.JSONDecodeError:
        return {
            "statusCode": 400,
            "headers": {
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            "body": "Invalid JSON in request body"
        }

    # 2. GET DATA FROM THE PARSED BODY
    game_name = body.get("gameName")
    tag_line = body.get("tagLine")
    region = body.get("region", "sea")  # expects "sea", "americas", etc.

    if not (game_name and tag_line):
        return {
            "statusCode": 400,
            "headers": {
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            "body": "Missing required fields"
        }

    player_key = f"{game_name}#{tag_line}#{region}"
    year_feature_key = "2025#YES"

    try:
        # 1 Check if record exists
        response = table.get_item(
            Key={
                "player": player_key,
                "year#feature": year_feature_key
            }
        )

        if "Item" in response:
            # 2️ Return cached result
            return {
                "statusCode": 200,
                "headers": {
                    "Access-Control-Allow-Origin": "*", 
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                },
                "body": response["Item"]["result"]
            }

        # 3️ Compute new summary - now passing region routing values
        result = summary(game_name, tag_line, region)

        result_string = json.dumps(result)

        # 4️ Store as string to avoid Decimal/float issues
        table.put_item(
            Item={
                "player": player_key,
                "year#feature": year_feature_key,
                "result": result_string,
                "timestamp": int(time.time())
            }
        )

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            "body": result_string
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            "body": f"Error: {str(e)}"
        }
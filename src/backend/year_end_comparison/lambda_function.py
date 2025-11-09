import boto3
import time
import json
from year_end_summary import summary

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("playerUserData")

def lambda_handler(event, context):
    game_name = event.get("gameName")
    tag_line = event.get("tagLine")
    region = event.get("region", "sg2")

    if not (game_name and tag_line):
        return {
            "statusCode": 400,
            "body": "Missing required fields"
        }

    player_key = f"{game_name}#{tag_line}#{region}"
    year_feature_key = "2025#YES"

    try:
        # 1️⃣ Check if record exists
        response = table.get_item(
            Key={
                "player": player_key,
                "year#feature": year_feature_key
            }
        )

        if "Item" in response:
            # 2️⃣ Return cached result (load from JSON string)
            cached_result = json.loads(response["Item"]["result"])
            return {
                "statusCode": 200,
                "body": cached_result
            }

        # 3️⃣ Compute new summary
        result = summary(game_name, tag_line, region)

        # 4️⃣ Store as string to avoid Decimal/float issues
        table.put_item(
            Item={
                "player": player_key,
                "year#feature": year_feature_key,
                "result": json.dumps(result),
                "timestamp": int(time.time())
            }
        )

        return {
            "statusCode": 200,
            "body": result
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": f"Error: {str(e)}"
        }

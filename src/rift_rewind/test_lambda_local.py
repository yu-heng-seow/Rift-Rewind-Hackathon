import json
from saw_lambda_handler import lambda_handler

# Simulate a Bedrock-style request event
event = {
    "actionGroup": "strengths-weaknesses-analysis",
    "apiPath": "/analyze",
    "httpMethod": "POST",
    "requestBody": {
        "content": {
            "application/json": {
                "properties": [
                    {"name": "game_name", "value": "QuantumF1zz1cs"},
                    {"name": "tagline", "value": "1420"},
                    {"name": "region", "value": "sea"}
                ]
            }
        }
    },
    "sessionAttributes": {},
    "promptSessionAttributes": {}
}

# Simulate AWS Lambda context (can be empty for local testing)
context = {}

# Run the handler
response = lambda_handler(event, context)

# Pretty print the result
print(json.dumps(response, indent=2))

import json
import os
from .strengths_weaknesses import analyze_strengths_weaknesses  # Modular import for logic

def lambda_handler(event, context):
    # Parse Bedrock Agent event (e.g., query like "Analyze strengths for player Doublelift#NA1 in NA")
    action_group = event.get('actionGroup')
    if action_group != 'strengths-weaknesses-analysis':  # Validate action group (my action group name)
        return {'error': 'Invalid action group'}

    # Extract parameters (player info from Agent) (game_name, tagline, region)
    parameters = {p['name']: p['value'] for p in event.get('parameters', [])}
    game_name = parameters.get('game_name')  # e.g., summoner name
    tagline = parameters.get('tagline')
    region = parameters.get('region')  # Riot routing value

    if not all([game_name, tagline, region]):
        return {'error': 'Missing required parameters'}
    

    # Call modular logic to fetch and process (this is to run analysis)
    try:
        gpi_data = analyze_strengths_weaknesses(game_name, tagline, region)
        response_body = {
            'application/json': {
                'body': json.dumps(gpi_data)  # Return scores + metrics for Agent to describe
            }
        }
        http_status = 200
    except Exception as e:
        response_body = {
            'application/json': {
                'body': json.dumps({'error': str(e)})
            }
        }
        http_status = 500

    # Build Bedrock-compatible response
    response = {
        'actionGroup': action_group,
        'apiPath': event.get('apiPath', '/analyze-strengths-weaknesses'),
        'httpMethod': event.get('httpMethod', 'POST'),
        'httpStatusCode': http_status,
        'responseBody': response_body
    }

    return {
        'messageVersion': '1.0',
        'response': response,
        'sessionAttributes': event.get('sessionAttributes', {}),
        'promptSessionAttributes': event.get('promptSessionAttributes', {})
    }
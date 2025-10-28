import json
import os
import traceback
from strengths_weaknesses import analyze_strengths_weaknesses

def lambda_handler(event, context):
    """
    Lambda handler for Bedrock Agent - Strengths & Weaknesses Analysis
    """
    print("=" * 80)
    print("LAMBDA INVOCATION START")
    print("=" * 80)
    print("Full event received:")
    print(json.dumps(event, indent=2, default=str))
    print("=" * 80)
    
    # Extract basic event info
    action_group = event.get('actionGroup', 'unknown')
    api_path = event.get('apiPath', '/analyze')
    http_method = event.get('httpMethod', 'POST')
    
    # Initialize response structure
    response_body = {
        'application/json': {
            'body': ''
        }
    }
    http_status = 500
    
    try:
        # Validate action group
        print(f"Validating action group: {action_group}")
        if action_group != 'strengths-weaknesses-analysis':
            error_msg = f"Invalid action group: {action_group}"
            print(f"ERROR: {error_msg}")
            response_body['application/json']['body'] = json.dumps({
                'error': error_msg
            })
            http_status = 400
        else:
            # Parse parameters from requestBody
            print("Parsing request parameters...")
            request_body_content = event.get('requestBody', {}).get('content', {}).get('application/json', {})
            properties = request_body_content.get('properties', [])
            
            parameters = {}
            for prop in properties:
                if 'name' in prop and 'value' in prop:
                    parameters[prop['name']] = prop['value']
                    print(f"  Parameter: {prop['name']} = {prop['value']}")
            
            # Extract required parameters
            game_name = parameters.get('game_name')
            tagline = parameters.get('tagline')
            region = parameters.get('region')
            
            # Validate parameters
            if not all([game_name, tagline, region]):
                missing = []
                if not game_name: missing.append('game_name')
                if not tagline: missing.append('tagline')
                if not region: missing.append('region')
                
                error_msg = f"Missing required parameters: {', '.join(missing)}"
                print(f"ERROR: {error_msg}")
                response_body['application/json']['body'] = json.dumps({
                    'error': error_msg,
                    'received_parameters': parameters
                })
                http_status = 400
            else:
                # Call analysis function
                print(f"Analyzing player: {game_name}#{tagline} in {region}")
                try:
                    gpi_data = analyze_strengths_weaknesses(game_name, tagline, region)
                    
                    if gpi_data is None:
                        print("WARNING: Analysis returned None")
                        response_body['application/json']['body'] = json.dumps({
                            'error': 'No data returned from analysis'
                        })
                        http_status = 500
                    else:
                        print("SUCCESS: Analysis completed")
                        print(f"Scores: {gpi_data.get('scores', {})}")
                        response_body['application/json']['body'] = json.dumps(gpi_data)
                        http_status = 200
                
                except ValueError as ve:
                    # Player not found or validation error
                    error_msg = str(ve)
                    print(f"VALIDATION ERROR: {error_msg}")
                    response_body['application/json']['body'] = json.dumps({
                        'error': error_msg,
                        'error_type': 'player_not_found',
                        'player': f"{game_name}#{tagline}",
                        'region': region
                    })
                    http_status = 404
                
                except Exception as analysis_error:
                    # Unexpected error
                    error_msg = f"Analysis failed: {str(analysis_error)}"
                    print(f"ANALYSIS ERROR: {error_msg}")
                    print("Traceback:")
                    print(traceback.format_exc())
                    response_body['application/json']['body'] = json.dumps({
                        'error': error_msg,
                        'error_type': 'analysis_failed'
                    })
                    http_status = 500
    
    except Exception as handler_error:
        # Top-level error
        error_msg = f"Handler error: {str(handler_error)}"
        print(f"CRITICAL ERROR: {error_msg}")
        print("Traceback:")
        print(traceback.format_exc())
        response_body['application/json']['body'] = json.dumps({
            'error': error_msg,
            'error_type': 'handler_error'
        })
        http_status = 500
    
    # Build final response
    print("=" * 80)
    print(f"HTTP Status: {http_status}")
    print(f"Response body preview: {response_body['application/json']['body'][:200]}...")
    
    response = {
        'actionGroup': action_group,
        'apiPath': api_path,
        'httpMethod': http_method,
        'httpStatusCode': http_status,
        'responseBody': response_body
    }
    
    final_response = {
        'messageVersion': '1.0',
        'response': response,
        'sessionAttributes': event.get('sessionAttributes', {}),
        'promptSessionAttributes': event.get('promptSessionAttributes', {})
    }
    
    print("LAMBDA INVOCATION END")
    print("=" * 80)
    
    return final_response
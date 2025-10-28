"""
Test script for the Lambda handler with correct event format
"""
import json
import os

# Make sure your API key is set
# os.environ['RIOT_API_KEY'] = 'your_key_here'

# Uncomment this section to test the analysis function directly
# =============================================================
# from strengths_weaknesses import analyze_strengths_weaknesses
# 
# print("Testing direct analysis function...")
# print("=" * 80)
# try:
#     result = analyze_strengths_weaknesses("Tyler1", "15422", "na")
#     result['metrics']['champion_variety'] = list(result['metrics']['champion_variety'])
#     print(json.dumps(result, indent=4))
# except Exception as e:
#     print(f"Error: {str(e)}")
#     import traceback
#     traceback.print_exc()
# =============================================================


# Test the Lambda handler with correct Bedrock event format
print("\n" + "=" * 80)
print("Testing Lambda handler with Bedrock event format...")
print("=" * 80)

from saw_lambda_handler import lambda_handler

# Test 1: Tyler1 (should work)
print("\nTest 1: Tyler1#15422 in NA")
print("-" * 80)
mock_event_tyler = {
    'actionGroup': 'strengths-weaknesses-analysis',
    'apiPath': '/analyze',
    'httpMethod': 'POST',
    'requestBody': {
        'content': {
            'application/json': {
                'properties': [
                    {'name': 'game_name', 'value': 'Tyler1'},
                    {'name': 'tagline', 'value': '15422'},
                    {'name': 'region', 'value': 'na'}
                ]
            }
        }
    },
    'sessionAttributes': {},
    'promptSessionAttributes': {}
}

try:
    result = lambda_handler(mock_event_tyler, None)
    print("\nResponse:")
    print(json.dumps(result, indent=2, default=str))
    
    # Extract and display the main info
    response = result.get('response', {})
    status = response.get('httpStatusCode')
    body_str = response.get('responseBody', {}).get('application/json', {}).get('body', '{}')
    body = json.loads(body_str)
    
    print(f"\nStatus Code: {status}")
    if status == 200:
        print(f"✓ SUCCESS")
        print(f"Scores: {json.dumps(body.get('scores', {}), indent=2)}")
    else:
        print(f"✗ FAILED")
        print(f"Error: {body.get('error', 'Unknown error')}")
except Exception as e:
    print(f"✗ Exception occurred: {str(e)}")
    import traceback
    traceback.print_exc()


# Test 2: A player that might not exist
print("\n\nTest 2: 1T1T1T1T1T1#NA1 in NA")
print("-" * 80)
mock_event_test = {
    'actionGroup': 'strengths-weaknesses-analysis',
    'apiPath': '/analyze',
    'httpMethod': 'POST',
    'requestBody': {
        'content': {
            'application/json': {
                'properties': [
                    {'name': 'game_name', 'value': '1T1T1T1T1T1'},
                    {'name': 'tagline', 'value': 'NA1'},
                    {'name': 'region', 'value': 'na'}
                ]
            }
        }
    },
    'sessionAttributes': {},
    'promptSessionAttributes': {}
}

try:
    result = lambda_handler(mock_event_test, None)
    print("\nResponse:")
    print(json.dumps(result, indent=2, default=str))
    
    # Extract and display the main info
    response = result.get('response', {})
    status = response.get('httpStatusCode')
    body_str = response.get('responseBody', {}).get('application/json', {}).get('body', '{}')
    body = json.loads(body_str)
    
    print(f"\nStatus Code: {status}")
    if status == 200:
        print(f"✓ SUCCESS")
        print(f"Scores: {json.dumps(body.get('scores', {}), indent=2)}")
    elif status == 404:
        print(f"✓ CORRECTLY HANDLED - Player not found")
        print(f"Error: {body.get('error', 'Unknown error')}")
    else:
        print(f"✗ FAILED with unexpected status")
        print(f"Error: {body.get('error', 'Unknown error')}")
except Exception as e:
    print(f"✗ Exception occurred: {str(e)}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 80)
print("Testing complete!")
print("=" * 80)
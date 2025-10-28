# this is just for testing the logic of strengths and weaknesses.py
from .strengths_weaknesses import analyze_strengths_weaknesses  
import json

# Sample inputs (use real player data)
# other player: QuantumF1zz1cs #1420
game_name = "Tyler1"
tagline = "15422"
region = "na"  # Or "sea", etc.

result = analyze_strengths_weaknesses(game_name, tagline, region)

result['metrics']['champion_variety'] = list(result['metrics']['champion_variety'])  # Convert set to list

print(json.dumps(result, indent=4))  # Pretty-print output



# this is for testing the lambda handler that incorporates strengths and weaknesses.py

# from .saw_lambda_handler import lambda_handler  # Adjust import
# import json

# # Mock event
# mock_event = {
#     'actionGroup': 'strengths-weaknesses-analysis',
#     'parameters': [
#         {'name': 'game_name', 'value': 'Tyler1'},
#         {'name': 'tagline', 'value': '15422'},
#         {'name': 'region', 'value': 'na'}
#     ]
# }

# result = lambda_handler(mock_event, None)
# print(json.dumps(result, indent=4))
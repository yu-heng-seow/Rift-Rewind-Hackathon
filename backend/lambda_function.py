import json
import uuid
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('player_data')

def get_named_parameter(event, name):
    """
    Get a parameter from the lambda event
    """
    return next(item for item in event['parameters'] if item['name'] == name)['value']

def get_player_data(player_id):
    """
    Retrieve game data of a specific player
    
    Args:
        player_id (string): The unique identifier for the player.
    """
    try:
        response = table.get_item(Key={'player_id': player_id})
        if 'Item' in response:
            return response['Item']
        else:
            return {'message': f'No data found with ID {player_id}'}
    except Exception as e:
        return {'error': str(e)}
    
def create_lol_player(player_name, rank, region, main_role, favorite_champion):
    """
    Create a new League of Legends player profile.
    
    Args:
        player_name (string): The in-game name of the player.
        rank (string): The current rank of the player (e.g. 'Gold IV', 'Diamond I').
        region (string): The server region (e.g. 'NA', 'EUW', 'SG').
        main_role (string): The player’s main role (e.g. 'Top', 'Jungle', 'Mid', 'ADC', 'Support').
        favorite_champion (string): The champion the player uses most frequently.
    """
    try:
        player_id = str(uuid.uuid4())[:8]
        table.put_item(
            Item={
                'player_id': player_id,
                'player_name': player_name,
                'rank': rank,
                'region': region,
                'main_role': main_role,
                'favorite_champion': favorite_champion
            }
        )
        return {'player_id': player_id}
    except Exception as e:
        return {'error': str(e)}
    
def lambda_handler(event, context):
    # get the action group used during the invocation of the lambda function
    actionGroup = event.get('actionGroup', '')
    
    # name of the function that should be invoked
    function = event.get('function', '')
    
    # parameters to invoke function with
    parameters = event.get('parameters', [])

    if function == 'get_player_data':
        player_id = get_named_parameter(event, "player_id")
        if player_id:
            response = str(get_player_data(player_id))
            responseBody = {'TEXT': {'body': json.dumps(response)}}
        else:
            responseBody = {'TEXT': {'body': 'Missing player_id parameter'}}
    
    elif function == 'create_lol_player':
        player_name = get_named_parameter(event, "player_name")
        rank = get_named_parameter(event, "rank")
        region = get_named_parameter(event, "region")
        main_role = get_named_parameter(event, "main_role")
        favorite_champion = get_named_parameter(event, "favorite_champion")
        
        if all([player_name, rank, region, main_role, favorite_champion]):
            response = str(create_lol_player(player_name, rank, region, main_role, favorite_champion))
            responseBody = {'TEXT': {'body': json.dumps(response)}}
        else:
            responseBody = {'TEXT': {'body': 'Missing required parameters'}}

    else:
        responseBody = {'TEXT': {'body': 'Invalid function'}}

    action_response = {
        'actionGroup': actionGroup,
        'function': function,
        'functionResponse': {
            'responseBody': responseBody
        }
    }

    function_response = {'response': action_response, 'messageVersion': event['messageVersion']}
    print("Response: {}".format(function_response))

    return function_response

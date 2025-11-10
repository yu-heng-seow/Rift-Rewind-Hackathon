# account_api.py
# This module handles fetching data from the ACCOUNT-V1 API endpoints.
# Base URL: https://{routing}.api.riotgames.com (routing: americas, europe, asia, sea)

import requests

#: str, -> dict are type hints, just hint what type to put and return

def get_account_by_riot_id(api_key: str, region: str, game_name: str, tag_line: str) -> dict:
    """
    Fetches account info by Riot ID (gameName and tagLine).
    
    :param api_key: Riot API key
    :param routing: Regional routing value (e.g., 'americas', 'europe', 'asia', 'sea')
    :param game_name: The game name part of the Riot ID
    :param tag_line: The tag line part of the Riot ID
    :return: JSON response with account details (including PUUID)
    """

     # f = formatted string literal

    url = f"https://{region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{game_name}/{tag_line}"

    # Creates HTTP headers (metadata), need api key,( requests module library), header method is more recommended for security reason instead of appending api_key at the back  
    headers = {"X-Riot-Token": api_key}
    response = requests.get(url, headers=headers) # will return a response object not json. 

    if response.status_code == 200:   # if the status code is 200, then. 
        return response.json()
    else:
        response.raise_for_status()

def get_account_by_puuid(api_key: str, region: str, puuid: str) -> dict:
    """
    Fetches account info by PUUID.
    
    :param api_key: Riot API key
    :param routing: Regional routing value (e.g., 'americas', 'europe', 'asia', 'sea')
    :param puuid: The player's PUUID
    :return: JSON response with account details
    """
    url = f"https://{region}.api.riotgames.com/riot/account/v1/accounts/by-puuid/{puuid}"
    headers = {"X-Riot-Token": api_key}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def get_active_shard_for_player(api_key: str, region: str, puuid: str, game: str = "lol") -> dict:
    """
    Fetches the active shard for a player in a specific game (default: lol).
    
    :param api_key: Riot API key
    :param routing: Regional routing value (e.g., 'americas', 'europe', 'asia', 'sea')
    :param puuid: The player's PUUID
    :param game: The game identifier (e.g., 'lol', 'val', etc.)
    :return: JSON response with active shard details
    """
    url = f"https://{region}.api.riotgames.com/riot/account/v1/active-shards/by-game/{game}/by-puuid/{puuid}"
    headers = {"X-Riot-Token": api_key}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()  # automatically converts into python dict 
    else:
        response.raise_for_status()   


# For testing purposes 
if __name__ == "__main__":
    # Example test call
    result = get_account_by_riot_id("RGAPI-29953c59-8169-4d95-bae3-aaa8949f9228", "SEA", "QuantumF1zz1cs", "1420")
    print(result)

    # result1 = get_account_by_puuid("RGAPI-29953c59-8169-4d95-bae3-aaa8949f9228", "americas", "NeX5C4QTYVE3P0pmOfLmsHdksiJShs_qdg-f6lxjDnq9WR4O-yfCbR7tiP7CwTnMQwY-Uvm1usapLw")
    # print(result1)
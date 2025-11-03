# summoner_api.py
# This module handles fetching data from the SUMMONER-V4 API endpoints.
# Base URL: https://{platform}.api.riotgames.com (platform: na1, euw1, etc.)

import requests

def get_summoner_by_name(api_key: str, platform: str, summoner_name: str) -> dict:
    """
    Fetches summoner info by summoner name.
    
    :param api_key: Riot API key
    :param platform: Platform routing value (e.g., 'na1', 'euw1', 'kr')
    :param summoner_name: The summoner's name
    :return: JSON response with summoner details (including PUUID, summoner ID)
    """
    url = f"https://{platform}.api.riotgames.com/lol/summoner/v4/summoners/by-name/{summoner_name}"
    headers = {"X-Riot-Token": api_key}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def get_summoner_by_puuid(api_key: str, platform: str, puuid: str) -> dict:
    """
    Fetches summoner info by PUUID.
    
    :param api_key: Riot API key
    :param platform: Platform routing value (e.g., 'na1', 'euw1', 'kr')
    :param puuid: The summoner's PUUID
    :return: JSON response with summoner details
    """
    url = f"https://{platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{puuid}"
    headers = {"X-Riot-Token": api_key}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def get_summoner_by_account_id(api_key: str, platform: str, account_id: str) -> dict:
    """
    Fetches summoner info by encrypted account ID.
    
    :param api_key: Riot API key
    :param platform: Platform routing value (e.g., 'na1', 'euw1', 'kr')
    :param account_id: The encrypted account ID
    :return: JSON response with summoner details
    """
    url = f"https://{platform}.api.riotgames.com/lol/summoner/v4/summoners/by-account/{account_id}"
    headers = {"X-Riot-Token": api_key}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def get_summoner_by_summoner_id(api_key: str, platform: str, summoner_id: str) -> dict:
    """
    Fetches summoner info by encrypted summoner ID.
    
    :param api_key: Riot API key
    :param platform: Platform routing value (e.g., 'na1', 'euw1', 'kr')
    :param summoner_id: The encrypted summoner ID
    :return: JSON response with summoner details
    """
    url = f"https://{platform}.api.riotgames.com/lol/summoner/v4/summoners/{summoner_id}"
    headers = {"X-Riot-Token": api_key}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()


        
if __name__ == "__main__":
# Example test call
    result = get_summoner_by_puuid("RGAPI-29953c59-8169-4d95-bae3-aaa8949f9228", "na1", "NeX5C4QTYVE3P0pmOfLmsHdksiJShs_qdg-f6lxjDnq9WR4O-yfCbR7tiP7CwTnMQwY-Uvm1usapLw")
    print(result)

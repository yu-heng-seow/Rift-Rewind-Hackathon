# mastery_api.py
# This module handles fetching data from the CHAMPION-MASTERY-V4 API endpoints.
# Base URL: https://{platform}.api.riotgames.com (platform: na1, euw1, etc.)

import requests

def get_all_champion_masteries(api_key: str, platform: str, summoner_id: str) -> list:
    """
    Fetches all champion masteries for a summoner.
    
    :param api_key: Riot API key
    :param platform: Platform routing value (e.g., 'na1', 'euw1', 'kr')
    :param summoner_id: The encrypted summoner ID
    :return: List of JSON objects with mastery details for each champion
    """
    url = f"https://{platform}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/{summoner_id}"
    headers = {"X-Riot-Token": api_key}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def get_champion_mastery_by_champion(api_key: str, platform: str, summoner_id: str, champion_id: int) -> dict:
    """
    Fetches mastery for a specific champion for a summoner.
    
    :param api_key: Riot API key
    :param platform: Platform routing value (e.g., 'na1', 'euw1', 'kr')
    :param summoner_id: The encrypted summoner ID
    :param champion_id: The champion ID
    :return: JSON response with mastery details for the champion
    """
    url = f"https://{platform}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/{summoner_id}/by-champion/{champion_id}"
    headers = {"X-Riot-Token": api_key}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def get_mastery_scores(api_key: str, platform: str, summoner_id: str) -> int:
    """
    Fetches the total mastery score for a summoner.
    
    :param api_key: Riot API key
    :param platform: Platform routing value (e.g., 'na1', 'euw1', 'kr')
    :param summoner_id: The encrypted summoner ID
    :return: Integer total mastery score
    """
    url = f"https://{platform}.api.riotgames.com/lol/champion-mastery/v4/scores/by-summoner/{summoner_id}"
    headers = {"X-Riot-Token": api_key}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def get_top_champion_masteries(api_key: str, platform: str, puuid: str, count: int = 3) -> list:
    """
    Fetches top champion masteries for a summoner by PUUID.
    
    :param api_key: Riot API key
    :param platform: Platform routing value (e.g., 'na1', 'euw1', 'kr')
    :param puuid: The summoner's PUUID
    :param count: Number of top champions to return (default: 3)
    :return: List of JSON objects with top mastery details
    """
    url = f"https://{platform}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid}/top"
    params = {"count": count}
    headers = {"X-Riot-Token": api_key}
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()



# if __name__ == "__main__":
# # Example test call
#     result = get_all_champion_masteries("RGAPI-29953c59-8169-4d95-bae3-aaa8949f9228", "na1", "NeX5C4QTYVE3P0pmOfLmsHdksiJShs_qdg-f6lxjDnq9WR4O-yfCbR7tiP7CwTnMQwY-Uvm1usapLw")
#     print(result)



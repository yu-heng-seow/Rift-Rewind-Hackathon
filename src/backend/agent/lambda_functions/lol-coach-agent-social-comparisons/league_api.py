# league_api.py
# This module handles fetching data from the LEAGUE-V4 API endpoints.
# Base URL: https://{platform}.api.riotgames.com (platform: na1, euw1, etc.)

import requests

def get_league_entries_for_summoner(api_key: str, platform: str, summoner_id: str) -> list:
    """
    Fetches league entries (ranked info) for a summoner.
    
    :param api_key: Riot API key
    :param platform: Platform routing value (e.g., 'na1', 'euw1', 'kr')
    :param summoner_id: The encrypted summoner ID
    :return: List of JSON objects with league entries (Solo/Duo, Flex, etc.)
    """
    url = f"https://{platform}.api.riotgames.com/lol/league/v4/entries/by-summoner/{summoner_id}"
    headers = {"X-Riot-Token": api_key}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def get_challenger_league(api_key: str, platform: str, queue: str = "RANKED_SOLO_5x5") -> dict:
    """
    Fetches the Challenger league for a queue.
    
    :param api_key: Riot API key
    :param platform: Platform routing value (e.g., 'na1', 'euw1', 'kr')
    :param queue: The queue type (e.g., 'RANKED_SOLO_5x5')
    :return: JSON response with Challenger league details
    """
    url = f"https://{platform}.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/{queue}"
    headers = {"X-Riot-Token": api_key}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def get_grandmaster_league(api_key: str, platform: str, queue: str = "RANKED_SOLO_5x5") -> dict:
    """
    Fetches the Grandmaster league for a queue.
    
    :param api_key: Riot API key
    :param platform: Platform routing value (e.g., 'na1', 'euw1', 'kr')
    :param queue: The queue type (e.g., 'RANKED_SOLO_5x5')
    :return: JSON response with Grandmaster league details
    """
    url = f"https://{platform}.api.riotgames.com/lol/league/v4/grandmasterleagues/by-queue/{queue}"
    headers = {"X-Riot-Token": api_key}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def get_master_league(api_key: str, platform: str, queue: str = "RANKED_SOLO_5x5") -> dict:
    """
    Fetches the Master league for a queue.
    
    :param api_key: Riot API key
    :param platform: Platform routing value (e.g., 'na1', 'euw1', 'kr')
    :param queue: The queue type (e.g., 'RANKED_SOLO_5x5')
    :return: JSON response with Master league details
    """
    url = f"https://{platform}.api.riotgames.com/lol/league/v4/masterleagues/by-queue/{queue}"
    headers = {"X-Riot-Token": api_key}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def get_league_by_id(api_key: str, platform: str, league_id: str) -> dict:
    """
    Fetches a league by its ID.
    
    :param api_key: Riot API key
    :param platform: Platform routing value (e.g., 'na1', 'euw1', 'kr')
    :param league_id: The league ID
    :return: JSON response with league details
    """
    url = f"https://{platform}.api.riotgames.com/lol/league/v4/leagues/{league_id}"
    headers = {"X-Riot-Token": api_key}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def get_league_entries(api_key: str, platform: str, queue: str, tier: str, division: str, page: int = 1) -> list:
    """
    Fetches league entries for a specific queue, tier, and division.
    
    :param api_key: Riot API key
    :param platform: Platform routing value (e.g., 'na1', 'euw1', 'kr')
    :param queue: The queue type (e.g., 'RANKED_SOLO_5x5')
    :param tier: The tier (e.g., 'DIAMOND')
    :param division: The division (e.g., 'I')
    :param page: Page number for pagination (default: 1)
    :return: List of JSON objects with league entries
    """
    url = f"https://{platform}.api.riotgames.com/lol/league/v4/entries/{queue}/{tier}/{division}"
    params = {"page": page}
    headers = {"X-Riot-Token": api_key}
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()
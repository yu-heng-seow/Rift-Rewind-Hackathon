# champion_api.py
# This module handles fetching data from the CHAMPION-V3 API endpoints.
# Base URL: https://{platform}.api.riotgames.com (platform: na1, euw1, etc.)

import requests

def get_champion_rotations(api_key: str, platform: str) -> dict:
    """
    Fetches the current free champion rotations.
    
    :param api_key: Riot API key
    :param platform: Platform routing value (e.g., 'na1', 'euw1', 'kr')
    :return: JSON response with free champion IDs and max new player level
    """
    url = f"https://{platform}.api.riotgames.com/lol/platform/v3/champion-rotations"
    headers = {"X-Riot-Token": api_key}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()
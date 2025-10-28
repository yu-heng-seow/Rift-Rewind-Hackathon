# match_api.py
# This module handles fetching data from the MATCH-V5 API endpoints.
# Base URL: https://{routing}.api.riotgames.com (routing: americas, europe, asia, sea)

import requests

def get_match_ids_by_puuid(api_key: str, region: str, puuid: str, start: int = 0, count: int = 1, **kwargs) -> list:
    """
    Fetches a list of match IDs for a player by PUUID.
    
    :param api_key: Riot API key
    :param routing: Regional routing value (e.g., 'americas', 'europe', 'asia', 'sea')
    :param puuid: The player's PUUID
    :param start: Starting index (default: 0)
    :param count: Number of matches to return (default: 20, max: 100)
    :param kwargs: Additional filters like queue, type, startTime, endTime
    :return: List of match IDs (strings)
    """
    url = f"https://{region}.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids"
    params = {"start": start, "count": count, **kwargs}
    headers = {"X-Riot-Token": api_key}
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def get_match_details(api_key: str, region: str, match_id: str) -> dict:
    """
    Fetches detailed info for a specific match.
    
    :param api_key: Riot API key
    :param routing: Regional routing value (e.g., 'americas', 'europe', 'asia', 'sea')
    :param match_id: The match ID (e.g., 'NA1_1234567890')
    :return: JSON response with full match details
    """

     # this returns JSON object with two top-level keys
      # metadata: Basic match info, including dataVersion (string for data schema version), matchId (the match ID string), and participants (array of 10 PUUID strings identifying players).
      # info: Detailed match data, including gameCreation (timestamp when match was created), gameDuration (length in seconds), gameEndTimestamp, gameId (numeric ID), gameMode (e.g., "CLASSIC"), 
      # gameName, gameStartTimestamp, gameType (e.g., "MATCHED_GAME"), gameVersion (patch version), mapId, platformId (server region), queueId (queue type), tournamentCode (if applicable), 
      # teams (array of 2 team objects with bans, objectives like kills on baron/dragon/towers, teamId, and win status), and participants (array of 10 detailed player objects).
    url = f"https://{region}.api.riotgames.com/lol/match/v5/matches/{match_id}"
    headers = {"X-Riot-Token": api_key}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def get_match_timeline(api_key: str, region: str, match_id: str) -> dict:
    """
    Fetches the timeline for a specific match.
    
    :param api_key: Riot API key
    :param routing: Regional routing value (e.g., 'americas', 'europe', 'asia', 'sea')
    :param match_id: The match ID (e.g., 'NA1_1234567890')
    :return: JSON response with match timeline data
    """
    url = f"https://{region}.api.riotgames.com/lol/match/v5/matches/{match_id}/timeline"
    headers = {"X-Riot-Token": api_key}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

#for testing
if __name__ == "__main__":
# Example test call
    result = get_match_ids_by_puuid("RGAPI-29953c59-8169-4d95-bae3-aaa8949f9228", "sea", "iAubk9TOB9azye4xJToxbAOiztfCul32Lb8hgs-7Z6keSowDgIlz2L_imL1IQ--emGdtejaOo416Fw")

    print(result)


    # result1 = get_match_details("RGAPI-29953c59-8169-4d95-bae3-aaa8949f9228", "americas", "NA1_5394780916")

    # print(result1)

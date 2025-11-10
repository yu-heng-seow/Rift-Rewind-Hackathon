from functionality import request_with_retry
import os
api_key = os.getenv("RIOT_API_KEY")

START_EPOCH_TIME_STAMP = 1730379600  # Nov 1, 2024 (FIXED!)
END_EPOCH_TIME_STAMP = 1761915600  # Nov 1, 2025

# mapping REGION_TO_PLATFORMS
REGION_ROUTING = {
    "americas": "americas",
    "europe": "europe",
    "asia": "asia",
    "sea": "sea"
}

def get_routing_value(region_code):
    """Simply return the region as-is since we're using routing values now"""
    return REGION_ROUTING.get(region_code.lower(), "sea")

def get_matches_by_puuid(puuid, region="sea", api_key=api_key, start_time=START_EPOCH_TIME_STAMP, end_time=END_EPOCH_TIME_STAMP, start=0, game_type=""):
    routing = get_routing_value(region)
    url = f"https://{routing}.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?type={game_type}&startTime={start_time}&endTime={end_time}&start={start}&count=100&api_key={api_key}"
    response = request_with_retry(url)
    return response.json()

def get_full_year_matches(puuid, region="sea", api_key=api_key, start_time=START_EPOCH_TIME_STAMP, game_type=""):
    result = []
    matches = get_matches_by_puuid(puuid, region, api_key, start_time, game_type=game_type)
    i = 0
    while matches:
        result.extend(matches)
        matches = get_matches_by_puuid(puuid, region, api_key, start_time, start=100*(i+1), game_type=game_type)
        i += 1
    return result

def get_match_details_by_match_id(match_id, region="sea", api_key=api_key):
    routing = get_routing_value(region)
    url = f"https://{routing}.api.riotgames.com/lol/match/v5/matches/{match_id}?api_key={api_key}"
    response = request_with_retry(url)
    return response.json()
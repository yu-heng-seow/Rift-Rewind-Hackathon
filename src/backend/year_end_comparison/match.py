from functionality import request_with_retry
import os

api_key = os.getenv("RIOT_API_KEY")

# START_EPOCH_TIME_STAMP = 1730379600 # November 1, 2024
START_EPOCH_TIME_STAMP = 1750379600 # November 1, 2024
END_EPOCH_TIME_STAMP = 1761915600 # November 1, 2025

REGION_ROUTING = {
    "na": "americas",
    "br": "americas",
    "lan": "americas",
    "las": "americas",
    "kr": "asia",
    "jp": "asia",
    "eune": "europe",
    "euw": "europe",
    "me1": "europe",
    "tr": "europe",
    "ru": "europe",
    "oce": "sea",
    "sg2": "sea",
    "tw2": "sea",
    "vn2": "sea",
    "americas": "americas",
    "asia": "asia",
    "europe": "europe",
    "sea": "sea"
}

def get_routing_value(region_code):
    return REGION_ROUTING.get(region_code.lower()) 


def get_matches_by_puuid(puuid, region="sea", api_key=api_key, start_time=START_EPOCH_TIME_STAMP, end_time=END_EPOCH_TIME_STAMP, start=0, game_type=""):
    region = get_routing_value(region)
    url = f"https://{region}.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?type={game_type}&startTime={start_time}&endTime={end_time}&start={start}&count=100&api_key={api_key}"
    response = request_with_retry(url)
    return response.json()

def get_full_year_matches(puuid, region="sea", api_key=api_key, start_time=START_EPOCH_TIME_STAMP, game_type=""):
    region = get_routing_value(region)
    result = []
    matches = get_matches_by_puuid(puuid, region, api_key, start_time, game_type=game_type)
    i = 0
    while matches:
        result.extend(matches)
        matches = get_matches_by_puuid(puuid, region, api_key, start_time, start=100*(i+1), game_type=game_type)
        i += 1
    return result


def get_match_details_by_match_id(match_id, region="sea", api_key=api_key):
    region = get_routing_value(region)
    url = f"https://{region}.api.riotgames.com/lol/match/v5/matches/{match_id}?api_key={api_key}"
    response = request_with_retry(url)
    return response.json()


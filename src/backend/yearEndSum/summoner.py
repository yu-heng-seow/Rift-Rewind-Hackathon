import requests
from functionality import request_with_retry
import os
api_key = os.getenv("RIOT_API_KEY")

# Match YOUR region system
REGION_TO_ACCOUNT_API = {
    'americas': 'americas',
    'europe': 'europe',
    'asia': 'asia',
    'sea': 'asia'  # SEA uses asia for account API 
}

REGION_TO_PLATFORMS = {
    'americas': ['na1', 'br1', 'la1', 'la2', 'oc1'],
    'europe': ['euw1', 'eun1', 'tr1', 'ru'],
    'asia': ['kr', 'jp1'],
    'sea': ['sg2', 'ph2', 'th2', 'tw2', 'vn2']
}

def get_account_details_by_name(summoner_name, tagline, region, api_key=api_key):
    # Use asia for SEA account API, otherwise use region as-is
    account_region = REGION_TO_ACCOUNT_API.get(region.lower(), 'asia')
    url = f"https://{account_region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{summoner_name}/{tagline}?api_key={api_key}"
    response = request_with_retry(url)
    return response.json()

def get_summoner_details_by_puuid(puuid, region, api_key=api_key):
    # Use first platform from region
    platform = REGION_TO_PLATFORMS.get(region.lower(), ['sg2'])[0]
    url = f"https://{platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{puuid}?api_key={api_key}"
    response = request_with_retry(url)
    return response.json()

def get_summoner_mastery_by_puuid(puuid, region, api_key=api_key):
    platform = REGION_TO_PLATFORMS.get(region.lower(), ['sg2'])[0]
    url = f"https://{platform}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid}?api_key={api_key}"
    response = request_with_retry(url)
    return response.json()

def get_summoner_rank_by_puuid(puuid, region, api_key=api_key):
    platform = REGION_TO_PLATFORMS.get(region.lower(), ['sg2'])[0]
    url = f"https://{platform}.api.riotgames.com/lol/league/v4/entries/by-puuid/{puuid}?api_key={api_key}"
    response = request_with_retry(url)
    data = response.json()
    
    # Default: unranked
    if not data or not isinstance(data, list):
        return {
            'rank': 'Unranked',
            'lp': 0,
            'tier': None,
            'queueType': None,
        }
    
    # --- Define rank hierarchy ---
    tier_order = {
        "IRON": 1, "BRONZE": 2, "SILVER": 3, "GOLD": 4, "PLATINUM": 5,
        "EMERALD": 6, "DIAMOND": 7, "MASTER": 8, "GRANDMASTER": 9, "CHALLENGER": 10
    }
    division_order = {"IV": 1, "III": 2, "II": 3, "I": 4}
    
    def rank_value(entry):
        tier = entry.get("tier", "IRON").upper()
        division = entry.get("rank", "IV").upper()
        return tier_order.get(tier, 0) * 10 + division_order.get(division, 0)
    
    # --- Select the highest rank between all queues ---
    ranked_entry = max(data, key=rank_value)
    tier = ranked_entry.get('tier', 'UNRANKED').title()
    division = ranked_entry.get('rank', '')
    rank = f"{tier} {division}" if tier != 'UNRANKED' else 'Unranked'
    lp = ranked_entry.get('leaguePoints', 0)
    
    return {
        'rank': rank,
        'lp': lp,
        'tier': tier,
        'queueType': ranked_entry.get('queueType'),
        'wins': ranked_entry.get('wins', 0),
        'losses': ranked_entry.get('losses', 0),
    }

def get_challenge_by_puuid(puuid, region, api_key=api_key):
    platform = REGION_TO_PLATFORMS.get(region.lower(), ['sg2'])[0]
    url = f"https://{platform}.api.riotgames.com/lol/challenges/v1/player-data/{puuid}?api_key={api_key}"
    response = request_with_retry(url)
    return response.json()

def get_challenge_config_by_id(challenge_id, region, api_key=api_key):
    platform = REGION_TO_PLATFORMS.get(region.lower(), ['sg2'])[0]
    url = f"https://{platform}.api.riotgames.com/lol/challenges/v1/challenges/{challenge_id}/config?api_key={api_key}"
    response = request_with_retry(url)
    return response.json()
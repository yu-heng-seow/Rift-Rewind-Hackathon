import numpy as np
from collections import defaultdict
from match_api import get_match_ids_by_puuid, get_match_details
from mastery_api import get_top_champion_masteries
from summoner_api import get_summoner_by_puuid
from account_api import get_account_by_riot_id
import os
# import dotenv
import requests

# dotenv.load_dotenv()
api_key = os.getenv("RIOT_API_KEY")

START_EPOCH_TIME_STAMP = 1735689600  # Jan 1, 2025

# just getting raw data and putting them into metrics[] from api calls
def get_raw_metrics(api_key, puuid, region):
    metrics = defaultdict(int)
    metrics['champion_variety'] = set() # use sets because each champion is unique, set removes duplicates
    impact_list = []

    match_ids = get_match_ids_by_puuid(api_key, region, puuid, count=20)
    for match_id in match_ids:
        match = get_match_details(api_key, region, match_id)
        info = match['info']
        metadata = match['metadata']
        idx = metadata['participants'].index(puuid)
        p = info['participants'][idx]

        metrics['total_games'] += 1
        metrics['kills'] += p.get('kills', 0)
        metrics['deaths'] += p.get('deaths', 0)
        metrics['assists'] += p.get('assists', 0)
        metrics['damage'] += p.get('totalDamageDealtToChampions', 0)
        metrics['gold'] += p.get('goldEarned', 0)
        metrics['cs'] += p.get('totalMinionsKilled', 0) + p.get('neutralMinionsKilled', 0)
        metrics['vision'] += p.get('visionScore', 0)
        metrics['wins'] += 1 if p.get('win') else 0
        metrics['champion_variety'].add(p.get('championName', 'Unknown'))
        impact_list.append(p.get('kills', 0) + p.get('assists', 0) - p.get('deaths', 0))

    return metrics, impact_list

# derived metrics from raw metrics, impact_list, mastery_data
def get_derived_metrics(metrics, impact_list, mastery_data):
    total_games = metrics['total_games']
    kda = (metrics['kills'] + metrics['assists']) / max(1, metrics['deaths'])
    avg_damage = metrics['damage'] / total_games
    win_rate = (metrics['wins'] / total_games) * 100
    assists_ratio = metrics['assists'] / max(1, metrics['kills'])
    unique_champs = len(metrics['champion_variety'])
    avg_mastery = sum(m['championPoints'] for m in mastery_data) / len(mastery_data) if mastery_data else 0

    return {
        'kda': kda,
        'avg_damage': avg_damage,
        'win_rate': win_rate,
        'assists_ratio': assists_ratio,
        'unique_champs': unique_champs,
        'avg_mastery': avg_mastery,
        'impact_list': impact_list
    }

# Calculate the final scores from raw metrics and derived metrics
def calculate_scores(metrics, derived):
    total_games = metrics['total_games']
    return {
        'farming': round(score_farming(metrics['cs'], metrics['gold'], total_games), 1),
        'vision': round(score_vision(metrics['vision'], total_games), 1),
        'aggression': round(score_aggression(derived['kda'], derived['avg_damage']), 1),
        'teamplay': round(score_teamplay(derived['win_rate'], derived['assists_ratio']), 1),
        'consistency': round(score_consistency(derived['impact_list']), 1),
        'versatility': round(score_versatility(derived['unique_champs'], derived['avg_mastery']), 1)
    }

## Logics for each category
# 🧩 FARMING
def score_farming(cs_total, gold_total, total_games):
    avg_cs = cs_total / total_games
    avg_gold = gold_total / total_games
    cs_score = (avg_cs / BENCHMARKS['farming_cs_per_game']) * 70
    gold_score = (avg_gold / 12000) * 30  # 12k is a decent gold/game
    return min(100, cs_score + gold_score)

# 👁️ VISION
def score_vision(vision_total, total_games):
    avg_vision = vision_total / total_games
    return min(100, (avg_vision / BENCHMARKS['vision_score_per_game']) * 100)

# ⚔️ AGGRESSION
def score_aggression(kda, avg_damage):
    kda_score = (kda / BENCHMARKS['kda_good']) * 50
    damage_score = (avg_damage / BENCHMARKS['damage_per_game']) * 50
    return min(100, kda_score + damage_score)

# 🤝 TEAMPLAY
def score_teamplay(win_rate, assists_ratio):
    win_score = (win_rate / BENCHMARKS['win_rate_percent']) * 60
    assist_score = assists_ratio / BENCHMARKS['assists_ratio'] * 40
    return min(100, win_score + assist_score)

# 🔁 CONSISTENCY
def score_consistency(impact_list):
    std_dev = np.std(impact_list)
    return max(0, 100 - (std_dev / BENCHMARKS['impact_std_max']) * 100)

# 🧠 VERSATILITY
def score_versatility(unique_champs, avg_mastery):
    champ_score = (unique_champs / BENCHMARKS['unique_champs_good']) * 50
    mastery_score = (avg_mastery / BENCHMARKS['avg_mastery_good']) * 50
    return min(100, champ_score + mastery_score)


# Benchmarks for normalization, the benchmark that will be calculated upon
BENCHMARKS = {
    'farming_cs_per_game': 150,
    'vision_score_per_game': 40,
    'kda_good': 3.0,
    'damage_per_game': 20000,
    'win_rate_percent': 50,
    'assists_ratio': 1.5,
    'impact_std_max': 10,
    'unique_champs_good': 5,
    'avg_mastery_good': 50000
}


# Ive realised an issue with this is that it isnt always accurate, when quantumfizzics play on sg2 it routse to sea but account is on asia
# # Helper to convert platform to region
# def platform_to_region(platform):
#     mapping = {
#         'na1': 'americas',
#         'br1': 'americas',
#         'la1': 'americas',
#         'la2': 'americas',
#         'oc1': 'americas',
#         'euw1': 'europe',
#         'eun1': 'europe',
#         'tr1': 'europe',
#         'ru': 'europe',
#         'kr': 'asia',
#         'jp1': 'asia',
#         'sg2': 'sea',
#         'ph2': 'sea',
#         'th2': 'sea',
#         'tw2': 'sea',
#         'vn2': 'sea'
#     }
#     return mapping.get(platform, 'americas')  # default fallback

# resort to looping through possible regions, if succeed, return the region and the account details altogether
# def find_valid_region(api_key, game_name, tag_line):
#     possible_regions = ['americas', 'asia', 'europe', 'sea']
#     for region in possible_regions:
#         try:
#             account = get_account_by_riot_id(api_key, region, game_name, tag_line)
#             return region, account
#         except requests.exceptions.HTTPError:
#             continue
#     raise Exception("Unable to resolve region for this player.")

# same logic as above, but instead let user input region, and route to platform
REGION_TO_PLATFORMS = {
    'americas': ['na1', 'br1', 'la1', 'la2', 'oc1'],
    'europe': ['euw1', 'eun1', 'tr1', 'ru'],
    'asia': ['kr', 'jp1'],
    'sea': ['sg2', 'ph2', 'th2', 'tw2', 'vn2']
}

def find_valid_platform(api_key, puuid, region):
    platforms = REGION_TO_PLATFORMS.get(region.lower(), [])
    for platform in platforms:
        try:
            get_summoner_by_puuid(api_key, platform, puuid)  # Just test if it works
            return platform # returns the first platform found , 
        except requests.exceptions.HTTPError:
            continue
    return None


def analyze_strengths_weaknesses(game_name, tag_line, region):
    # dont use this 
    # region = platform_to_region(platform)

    # riot api doesnt have sea region for account v1 api call, so use asia for account v1, but remains sea for other apis
    account_region = 'asia' if region == 'sea' else region
    account = get_account_by_riot_id(api_key, account_region, game_name, tag_line)
    
    puuid = account['puuid']
    # find valid platforms
    platform = find_valid_platform(api_key, puuid, region)
    if not platform:
        return {"error": "Unable to resolve platform for this region and player."}

    summoner = get_summoner_by_puuid(api_key, platform, puuid)
    mastery_data = get_top_champion_masteries(api_key, platform, puuid, count=5)

    raw_metrics, impact_list = get_raw_metrics(api_key, puuid, region)
    if raw_metrics['total_games'] == 0:
        return {"error": "No matches found"}

    derived_metrics = get_derived_metrics(raw_metrics, impact_list, mastery_data)
    scores = calculate_scores(raw_metrics, derived_metrics)


    raw_metrics['champion_variety'] = list(raw_metrics['champion_variety'])  # fix serialization, make set into list completely 
    
    # in the end a final dict is returned containing these infos. 
    return {
        'player': {
            'gameName': game_name,
            'tagLine': tag_line,
            'puuid': puuid,
            'summonerLevel': summoner['summonerLevel'],
            'profileIconId': summoner['profileIconId']
        },
        'metrics': dict(raw_metrics),
        'scores': scores,
        'champion_variety': raw_metrics['champion_variety'],
        'mastery': mastery_data
    }

        
if __name__ == "__main__":
# Example test call
    result = analyze_strengths_weaknesses("QuantumF1zz1cs", "1420", "sea")
    # result = analyze_strengths_weaknesses("Tyler1", "15422", "na1")
    print(result)

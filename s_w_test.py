import numpy as np
from collections import defaultdict
from match_api import get_match_ids_by_puuid, get_match_details
from mastery_api import get_top_champion_masteries
from summoner_api import get_summoner_by_puuid
from account_api import get_account_by_riot_id

# Benchmarks for normalization
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

# 🧠 MAIN ANALYSIS FUNCTION
def analyze_strengths_weaknesses(game_name, tag_line, routing):

    #1. get puuid first
    account = get_account_by_riot_id(api_key, routing, game_name, tag_line)
    puuid = account['puuid']

    # routing americas  to na1 (platform)
    platform = routing_to_platform(routing)

    # 2. get summoner details 
    summoner = get_summoner_by_puuid(api_key, platform, puuid)

    # create player metrics to be calculated and compute final score 
    metrics = defaultdict(int)  # creates a dictionary where missing keys default to 0
    metrics['champion_variety'] = set() # creates a collection of unique items, no duplicates, so champion variety in matrics dict is unique set 
    impact_list = [] # an empty list to store per-game impact values like (kills + assists - deaths)

    # 3. Get Match details and store them into metrics to be calculated
    match_ids = get_match_ids_by_puuid(api_key, routing, puuid, count=20)
    for match_id in match_ids:
        match = get_match_details(api_key, routing, match_id)
        info = match['info']
        metadata = match['metadata']
        participants = info['participants']
        idx = metadata['participants'].index(puuid) # only getting the index of that particular player
        p = participants[idx] 

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

    if metrics['total_games'] == 0:
        return {"error": "No matches found"}

    # 4. Get Mastery data
    mastery_data = get_top_champion_masteries(api_key, platform, puuid, count=5)
    avg_mastery = sum(m['championPoints'] for m in mastery_data) / len(mastery_data) if mastery_data else 0

    # Derived metrics from raw metrics 
    kda = (metrics['kills'] + metrics['assists']) / max(1, metrics['deaths'])
    avg_damage = metrics['damage'] / metrics['total_games']
    win_rate = (metrics['wins'] / metrics['total_games']) * 100
    assists_ratio = metrics['assists'] / max(1, metrics['kills'])
    unique_champs = len(metrics['champion_variety'])

    # Final scores, (caluclate frmo derived metrics and raw metrics)
    scores = {
        'farming': round(score_farming(metrics['cs'], metrics['gold'], metrics['total_games']), 1),
        'vision': round(score_vision(metrics['vision'], metrics['total_games']), 1),
        'aggression': round(score_aggression(kda, avg_damage), 1),
        'teamplay': round(score_teamplay(win_rate, assists_ratio), 1),
        'consistency': round(score_consistency(impact_list), 1),
        'versatility': round(score_versatility(unique_champs, avg_mastery), 1)
    }

    return {
        'player': {
            'gameName': game_name,
            'tagLine': tag_line,
            'puuid': puuid,
            'summonerLevel': summoner['summonerLevel'],
            'profileIconId': summoner['profileIconId']
        },
        'metrics': dict(metrics),
        'scores': scores,
        'champion_variety': list(metrics['champion_variety']),
        'mastery': mastery_data
    }

# Helper to convert routing to platform
def routing_to_platform(routing):
    mapping = {
        'americas': 'na1',
        'europe': 'euw1',
        'asia': 'kr',
        'sea': 'sg2'
    }
    return mapping.get(routing, 'na1')

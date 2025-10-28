
import numpy as np
from collections import defaultdict
from match_api import get_match_ids_by_puuid, get_match_details
from mastery_api import get_top_champion_masteries
from summoner_api import get_summoner_by_puuid
from account_api import get_account_by_riot_id

#  what we measure: 1. Farming: cs, gold per minute, jungle efficiency
#                         How: (CS per min/ role averaeg )x 100

# 2. Vision: wards placed, wards cleared, vision score, 
# how:( vision score/role average ) x100

# 3. aggression: kill participation% , damage dealt, solo kills
# How : (KP% + Damage share%) /2 x100

# 4. Teamplay: (assists+ objectives KP%) /2 x100

# 5. consistency: 100 - (Death rate × penalty factor)

# 6. versatility: (Unique champs / total games) × 100


# Benchmarks for normalization (based on average pro/amateur stats; adjustable)
BENCHMARKS = {
    'farming_cs_per_game': 150,  # Good CS per game
    'vision_score_per_game': 40,  # Good vision score
    'kda_good': 3.0,  # Solid KDA
    'damage_per_game': 20000,  # Avg damage to champs
    'win_rate_percent': 50,  # Baseline win rate
    'assists_ratio': 1.5,  # Assists per kill
    'impact_std_max': 10,  # Low std dev for consistency (invert for score)
    'unique_champs_good': 5,  # Variety in champions
    'avg_mastery_good': 50000  # Avg mastery points for top champs
}

def analyze_strengths_weaknesses(game_name, tagline, region):
    return

# the farming calculation and logic
def score_farming(avg_cs: float, benchmarks: dict) -> float:
    return min(100, (avg_cs / benchmarks['farming_cs_per_game']) * 100)

def score_farming(cs_total, gold_total, total_games):
    avg_cs = cs_total / total_games
    avg_gold = gold_total / total_games
    cs_score = (avg_cs / BENCHMARKS['farming_cs_per_game']) * 70
    gold_score = (avg_gold / 12000) * 30  # 12k is a decent gold/game
    return min(100, cs_score + gold_score)

# vision logic
def score_vision(avg_vision: float, benchmarks: dict) -> float:
    return min(100, (avg_vision / benchmarks['vision_score_per_game']) * 100)

# aggression logic
def score_aggression(kda: float, avg_damage: float, benchmarks: dict) -> float:
    kda_score = (kda / benchmarks['kda_good']) * 50
    damage_score = (avg_damage / benchmarks['damage_per_game']) * 5
    return min(100, kda_score + damage_score)

# teamplay logic
def score_teamplay(win_rate: float, assists_ratio: float, benchmarks: dict) -> float:
    win_score = (win_rate / benchmarks['win_rate_percent']) * 100
    assist_score = assists_ratio * 10
    return min(100, win_score + assist_score)

# consistency logic
def score_consistency(impact_std: float, benchmarks: dict) -> float:
    return max(0, 100 - (impact_std / benchmarks['impact_std_max']) * 100)

# versatility logic
def score_versatility(unique_champs: int, avg_mastery: float, benchmarks: dict) -> float:
    champ_score = (unique_champs / benchmarks['unique_champs_good']) * 100
    mastery_score = (avg_mastery / benchmarks['avg_mastery_good'])
    return min(100, champ_score + mastery_score)


scores = {
    'farming': round(score_farming(avg_cs, BENCHMARKS), 1),
    'vision': round(score_vision(avg_vision, BENCHMARKS), 1),
    'aggression': round(score_aggression(kda, avg_damage, BENCHMARKS), 1),
    'teamplay': round(score_teamplay(win_rate, assists_ratio, BENCHMARKS), 1),
    'consistency': round(score_consistency(impact_std, BENCHMARKS), 1),
    'versatility': round(score_versatility(unique_champs, avg_mastery, BENCHMARKS), 1)
}




import match, summoner
from collections import defaultdict
import numpy as np  # For std dev calculation in consistency


def analyze_strengths_weaknesses(game_name, tagline, region):
    acc_details = summoner.get_account_details_by_name(game_name, tagline, region)
    puuid = acc_details['puuid']
    details = summoner.get_summoner_details_by_puuid(puuid, region)
    
    ret = {
        'participant': {
            'gameName': acc_details['gameName'], 
            'tagLine': acc_details['tagLine'], 
            'region': region,
            'puuid': puuid,
            'profileIconId': details['profileIconId'],
            'summonerLevel': details['summonerLevel'],
            'revisionDate': details['revisionDate']
        },
        'metrics': {
            'total_games': 0,
            'kda': {'kills': 0, 'deaths': 0, 'assists': 0},
            'damage_dealt': 0,
            'gold_earned': 0,
            'cs': 0,  # Minions + neutrals
            'vision_score': 0,
            'win_count': 0,
            'champion_variety': set(),
            'per_game_impact': [],  # For consistency (K + A - D per game)
        },
        'mastery': []  # Will fetch from CHAMPION-MASTERY-V4
    }

    # Fetch mastery for versatility (using CHAMPION-MASTERY-V4)
    mastery_data = get_champion_mastery(puuid, region)  # Implement this helper below
    ret['mastery'] = mastery_data[:5]  # Top 5 for avg
    avg_mastery = sum(m['championPoints'] for m in ret['mastery']) / len(ret['mastery']) if ret['mastery'] else 0

    # Fetch all matches for the year
    matches = match.get_full_year_matches(puuid, region)  # This gets every match id 
    for match_id in matches:
        match_details = match.get_match_details_by_match_id(match_id, region)   # This gets all the match details (including metadata, info, participants)
        metadata = match_details['metadata']
        info = match_details['info']

        # Find player index
        participants = metadata['participants']
        if puuid not in participants:
            continue
        idx = participants.index(puuid)

        # Extract participant info
        p = info['participants'][idx]
        ret['metrics']['total_games'] += 1
        ret['metrics']['kda']['kills'] += p.get('kills', 0)
        ret['metrics']['kda']['deaths'] += p.get('deaths', 0)
        ret['metrics']['kda']['assists'] += p.get('assists', 0)
        ret['metrics']['damage_dealt'] += p.get('totalDamageDealtToChampions', 0)
        ret['metrics']['gold_earned'] += p.get('goldEarned', 0)
        ret['metrics']['cs'] += p.get('totalMinionsKilled', 0) + p.get('neutralMinionsKilled', 0)
        ret['metrics']['vision_score'] += p.get('visionScore', 0)
        ret['metrics']['win_count'] += 1 if p.get('win', False) else 0
        ret['metrics']['champion_variety'].add(p.get('championName', 'Unknown'))
        
        # Per-game impact for consistency
        impact = p.get('kills', 0) + p.get('assists', 0) - p.get('deaths', 0)
        ret['metrics']['per_game_impact'].append(impact)

    # If no games, return early with zeros
    total_games = ret['metrics']['total_games']
    if total_games == 0:
        return {**ret, 'scores': {key: 0 for key in ['farming', 'vision', 'aggression', 'teamplay', 'consistency', 'versatility']}}

    # Calculate aggregated averages
    avg_cs = ret['metrics']['cs'] / total_games
    avg_vision = ret['metrics']['vision_score'] / total_games
    kda = (ret['metrics']['kda']['kills'] + ret['metrics']['kda']['assists']) / max(1, ret['metrics']['kda']['deaths'])
    avg_damage = ret['metrics']['damage_dealt'] / total_games
    win_rate = (ret['metrics']['win_count'] / total_games) * 100
    assists_ratio = ret['metrics']['kda']['assists'] / max(1, ret['metrics']['kda']['kills'])
    impact_std = np.std(ret['metrics']['per_game_impact']) if ret['metrics']['per_game_impact'] else 0
    unique_champs = len(ret['metrics']['champion_variety'])

    # Compute normalized scores (0-100) for hexagon GPI
    scores = {
        # Farming: Based on avg CS (scale to benchmark)
        'farming': min(100, (avg_cs / BENCHMARKS['farming_cs_per_game']) * 100),
        
        # Vision: Based on avg vision score
        'vision': min(100, (avg_vision / BENCHMARKS['vision_score_per_game']) * 100),
        
        # Aggression: Combined KDA and damage (50% each)
        'aggression': min(100, ((kda / BENCHMARKS['kda_good']) * 50) + ((avg_damage / BENCHMARKS['damage_per_game']) * 5)),  # Scaled for balance
        
        # Teamplay: Win rate + assists ratio
        'teamplay': min(100, (win_rate / BENCHMARKS['win_rate_percent'] * 100) + (assists_ratio * 10)),  # Cap at 100
        
        # Consistency: Invert std dev (low variance = high score)
        'consistency': max(0, 100 - (impact_std / BENCHMARKS['impact_std_max'] * 100)),
        
        # Versatility: Unique champs + avg mastery
        'versatility': min(100, (unique_champs / BENCHMARKS['unique_champs_good'] * 100) + (avg_mastery / BENCHMARKS['avg_mastery_good']))
    }

    # Round scores to 1 decimal
    scores = {k: round(v, 1) for k, v in scores.items()}

    # Convert set to list for JSON serialization
    ret['metrics']['champion_variety'] = list(ret['metrics']['champion_variety'])

    return {**ret, 'scores': scores}

# Helper for CHAMPION-MASTERY-V4 (add to summoner.py if not present, but included here for completeness)
def get_champion_mastery(puuid, region, api_key=match.api_key):  # Reuse api_key from match.py
    ROUTING = {
        "na": "na1", "br": "br1", "lan": "la1", "las": "la2", "kr": "kr", "jp": "jp1",
        "eune": "eun1", "euw": "euw1", "me1": "me1", "tr": "tr1", "ru": "ru",
        "oce": "oc1", "sg2": "sg2", "tw2": "tw2", "vn2": "vn2"
    }
    region_code = ROUTING.get(region.lower())
    url = f"https://{region_code}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid}?api_key={api_key}"
    response = summoner.request_with_retry(url)  # Reuse from summoner.py
    return response.json()
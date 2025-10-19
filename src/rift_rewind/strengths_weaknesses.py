from . import match, summoner
from collections import defaultdict
import numpy as np  # For std dev calculation in consistency

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
    matches = match.get_full_year_matches(puuid, region)
    for match_id in matches:
        match_details = match.get_match_details_by_match_id(match_id, region)
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

    # return {**ret, 'scores': scores}

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
from collections import defaultdict
import match
import summoner
from mapping import champion_position_map, champion_id_map

# --- Position normalization map ---
POSITION_ALIASES = {
    "TOP": "Top",
    "JUNGLE": "Jungle",
    "MIDDLE": "Middle",
    "MID": "Middle",
    "BOTTOM": "Bottom",
    "BOT": "Bottom",
    "SUPPORT": "Support",
    "UTILITY": "Support",
}

def _normalize_champion_name(value: str) -> str:
    return "".join(ch.lower() for ch in value if ch.isalnum())

# --- Build normalized champion ID map for mastery lookup ---
NORMALIZED_ID_MAP = {
    _normalize_champion_name(name): champ_id for name, champ_id in champion_id_map.items()
}

_ID_ALIAS_SOURCE = {
    "nunuwillump": "nunu",
    "renataglasc": "renata",
    "wukong": "monkeyking",
}

for alias, source in _ID_ALIAS_SOURCE.items():
    if alias not in NORMALIZED_ID_MAP and source in NORMALIZED_ID_MAP:
        NORMALIZED_ID_MAP[alias] = NORMALIZED_ID_MAP[source]

# --- Main summary logic ---
def summary(game_name, tagline, region):
    acc_details = summoner.get_account_details_by_name(game_name, tagline, region)
    puuid = acc_details['puuid']
    details = summoner.get_summoner_details_by_puuid(puuid, region)
    rank_info = summoner.get_summoner_rank_by_puuid(puuid, region)
    base = {
        'summoner': {
            'name': acc_details['gameName'],
            'tagLine': acc_details['tagLine'],
            'level': details['summonerLevel'],
            'rank': rank_info['rank'],
            'lp': rank_info['lp'],
            'winRate': 0,
            'region': region.upper(),
        },
        'yearStats': {},
        'performanceMetrics': [],
        'monthlyProgress': [],
        'topChampions': [],
        'roleDistribution': [],
        'recentAchievements': [],
        'bestDuo': None,
    }

    matches = match.get_full_year_matches(puuid, region)

    # === Monthly timestamp boundaries (AEDT) ===
    month_boundaries = [
        ("Nov", 1730379600),
        ("Dec", 1732971600),
        ("Jan", 1735650000),
        ("Feb", 1738328400),
        ("Mar", 1740747600),
        ("Apr", 1743426000),
        ("May", 1746021600),
        ("Jun", 1748700000),
        ("Jul", 1751292000),
        ("Aug", 1753970400),
        ("Sep", 1756648800),
        ("Oct", 1759240800),
        ("Nov", 1761915600),
    ]

    stats = {
        'gamesPlayed': 0,
        'wins': 0,
        'losses': 0,
        'hoursPlayed': 0,
        'kills': 0,
        'deaths': 0,
        'assists': 0,
        'pentakills': 0,
        'quadrakills': 0,
        'triplekills': 0,
        'roles': defaultdict(int),
        'champions': defaultdict(lambda: {
            'games': 0,
            'wins': 0,
            'losses': 0,
            'kills': 0,
            'deaths': 0,
            'assists': 0
        }),
    }

    monthly_data = defaultdict(lambda: {
        'wins': 0,
        'losses': 0,
        'kills': 0,
        'deaths': 0,
        'assists': 0
    })

    duo_counts = defaultdict(int)
    duo_profiles = {}

    for match_id in matches:
        m = match.get_match_details_by_match_id(match_id)
        metadata, info = m['metadata'], m['info']
        if puuid not in metadata['participants']:
            continue

        idx = metadata['participants'].index(puuid)
        p = info['participants'][idx]

        # === Aggregate general stats ===
        stats['gamesPlayed'] += 1
        stats['hoursPlayed'] += info.get('gameDuration', 0) / 3600
        stats['kills'] += p.get('kills', 0)
        stats['deaths'] += p.get('deaths', 0)
        stats['assists'] += p.get('assists', 0)
        stats['wins'] += 1 if p.get('win', False) else 0
        stats['losses'] += 0 if p.get('win', False) else 1
        stats['pentakills'] += p.get('pentaKills', 0)
        stats['quadrakills'] += p.get('quadraKills', 0)
        stats['triplekills'] += p.get('tripleKills', 0)

        raw_pos = (p.get('individualPosition') or "").upper()
        role = POSITION_ALIASES.get(raw_pos, "Unknown")
        stats['roles'][role] += 1

        # === Champion stats ===
        champ = p.get('championName', 'Unknown')
        cstats = stats['champions'][champ]
        cstats['games'] += 1
        if p.get('win', False):
            cstats['wins'] += 1
        else:
            cstats['losses'] += 1
        cstats['kills'] += p.get('kills', 0)
        cstats['deaths'] += p.get('deaths', 0)
        cstats['assists'] += p.get('assists', 0)

        # === Aggregate Monthly Progress ===
        created_time = info.get('gameCreation', 0) / 1000
        month_name = None
        for i, (name, start_ts) in enumerate(month_boundaries):
            next_start = month_boundaries[i + 1][1] if i + 1 < len(month_boundaries) else float("inf")
            if start_ts <= created_time < next_start:
                month_name = name
                break
        if not month_name:
            month_name = "Unknown"

        mdata = monthly_data[month_name]
        if p.get('win', False):
            mdata['wins'] += 1
        else:
            mdata['losses'] += 1
        mdata['kills'] += p.get('kills', 0)
        mdata['deaths'] += p.get('deaths', 0)
        mdata['assists'] += p.get('assists', 0)

        # === Track duo partners ===
        team_start = (idx // 5) * 5
        team_end = min(team_start + 5, len(metadata['participants']))
        for teammate_idx in range(team_start, team_end):
            if teammate_idx == idx or teammate_idx >= len(info['participants']):
                continue
            teammate_puuid = metadata['participants'][teammate_idx]
            if teammate_puuid == puuid:
                continue
            duo_counts[teammate_puuid] += 1
            teammate_info = info['participants'][teammate_idx]
            duo_profiles.setdefault(teammate_puuid, {
                'name': teammate_info.get('riotIdGameName') or teammate_info.get('summonerName') or "Unknown",
                'tagline': teammate_info.get('riotIdTagline'),
            })

    # === Yearly summary ===
    base['yearStats'] = {
        'gamesPlayed': stats['gamesPlayed'],
        'wins': stats['wins'],
        'losses': stats['losses'],
        'hoursPlayed': round(stats['hoursPlayed'], 1),
        'totalKills': stats['kills'],
        'totalDeaths': stats['deaths'],
        'totalAssists': stats['assists'],
        'pentakills': stats['pentakills'],
        'quadrakills': stats['quadrakills'],
        'triplekills': stats['triplekills'],
    }

    # === Monthly Progress summary ===
    base['monthlyProgress'] = []
    for month, data in sorted(monthly_data.items(), key=lambda x: month_boundaries.index(next((b for b in month_boundaries if b[0] == x[0]), ("ZZZ", 0)))):
        total_games = data['wins'] + data['losses']
        kda = round((data['kills'] + data['assists']) / max(1, data['deaths']), 2) if total_games else 0
        base['monthlyProgress'].append({
            'month': month,
            'wins': data['wins'],
            'losses': data['losses'],
            'kda': kda
        })

    # === Role distribution ===
    total_roles = sum(stats['roles'].values()) or 1
    base['roleDistribution'] = [
        {'role': r, 'value': round(v / total_roles * 100, 1)}
        for r, v in stats['roles'].items() if r != "Unknown"
    ]

    # === Top Champions Summary ===
    top_champs = sorted(
        stats['champions'].items(),
        key=lambda x: x[1]['games'],
        reverse=True
    )[:5]

    # Get mastery data for the summoner
    mastery_data = summoner.get_summoner_mastery_by_puuid(puuid, region)
    
    # Create a lookup dictionary for mastery by champion ID
    mastery_lookup = {}
    for mastery in mastery_data:
        champ_id = mastery.get('championId')
        mastery_lookup[champ_id] = {
            'championLevel': mastery.get('championLevel'),
            'championPoints': mastery.get('championPoints'),
            'tokensEarned': mastery.get('tokensEarned', 0)
        }

    base['topChampions'] = []
    for name, data in top_champs:
        wins = data.get('wins', 0)
        losses = data.get('losses', 0)
        kills = data.get('kills', 0)
        deaths = data.get('deaths', 0)
        assists = data.get('assists', 0)
        games = data.get('games', 0)

        winrate = round(wins / games * 100, 1) if games else 0
        kda = round((kills + assists) / max(1, deaths), 2)

        # Get champion ID from champion_id_map
        champion_id = champion_id_map.get(name)
        
        # Get mastery info for this champion
        mastery_info = mastery_lookup.get(champion_id, {})

        base['topChampions'].append({
            'name': name,
            'games': games,
            'wins': wins,
            'losses': losses,
            'winRate': winrate,
            'kda': kda,
            'masteryLevel': mastery_info.get('championLevel', 0),
            'masteryPoints': mastery_info.get('championPoints', 0),
        })

    # === Compute winrate ===
    if stats['gamesPlayed'] > 0:
        base['summoner']['winRate'] = round(stats['wins'] / stats['gamesPlayed'] * 100, 1)

    if duo_counts:
        best_puuid, games_together = max(duo_counts.items(), key=lambda item: item[1])
        profile = duo_profiles.get(best_puuid, {})
        base['bestDuo'] = {
            'puuid': best_puuid,
            'name': profile.get('name'),
            'tagline': profile.get('tagline'),
            'gamesTogether': games_together,
        }


    challenges = summoner.get_challenge_by_puuid(puuid, region)

    def level_score(level):
        mapping = {
            "IRON": 1, "BRONZE": 2, "SILVER": 3, "GOLD": 4, "PLATINUM": 5,
            "DIAMOND": 6, "MASTER": 7, "GRANDMASTER": 8, "CHALLENGER": 9
        }
        return mapping.get(level.upper(), 0)

    import math, time
    now = int(time.time() * 1000)

    # --- Rank by rarity + recency + tier ---
    scored = []
    for c in challenges.get("challenges", []):
        ts = c.get("achievedTime", 0)
        days_old = (now - ts) / (1000 * 60 * 60 * 24)
        recency = max(0, 1 - days_old / 180)  # 6-month decay
        percentile = c.get("percentile", 1)
        rarity = 1 / max(percentile, 0.001)
        level = c.get("level", "IRON")
        tier = level_score(level)
        value = c.get("value", 0)
        score = (rarity * 0.4) + (tier * 3) + (math.log1p(value) * 0.5) + (recency * 2)
        scored.append((score, c))

    top_challenges = [c for _, c in sorted(scored, key=lambda x: x[0], reverse=True)[:4]]

    base["recentAchievements"] = []
    for c in top_challenges:
        config = summoner.get_challenge_config_by_id(c["challengeId"], region)
        base["recentAchievements"].append({
            "id": c["challengeId"],
            "name": config.get("localizedNames", {}).get("en_US", {}).get("name", "Unknown Challenge"),
            "description": config.get("localizedNames", {}).get("en_US", {}).get("description", ""),
            "level": c.get("level"),
            "percentile": c.get("percentile"),
            "value": c.get("value"),
            "achievedTime": c.get("achievedTime")
        })

    return base
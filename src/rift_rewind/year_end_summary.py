from . import match, summoner
from collections import defaultdict
from timeit import default_timer as timer

def summary(game_name, tagline, region):
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
        'details': {
            'totalGame': 0,
            'totalGameTime': 0,
            'kda': {'kill': 0, 'death': 0, 'assist': 0},
            'champions': defaultdict(int),
            'participants': defaultdict(int),
            'winloss': {'win': 0, 'loss': 0},
            'pings': defaultdict(int),
            'minionKilled': 0,
            'jungleKilled': 0,
            'legendaryMonsterKilled': defaultdict(int),
            'legendaryMonsterStolen': defaultdict(int),
            'totalGold': 0,
            'visionScore': 0,
            'controlWardsPlaced': 0,
            'emotesUsed': 0,  # will stay 0 unless found
        }
    }

    matches = match.get_full_year_matches(puuid, region)
    i = 0
    for match_id in matches:
        print(i)
        i += 1
        match_details = match.get_match_details_by_match_id(match_id)
        metadata = match_details['metadata']
        info = match_details['info']

        # Find player index
        participants = metadata['participants']
        if puuid not in participants:
            continue
        idx = participants.index(puuid)

        # Determine teammates
        team_range = range(0, 5) if idx < 5 else range(5, 10)
        teammates = [participants[i] for i in team_range if i != idx]
        for mate in teammates:
            ret['details']['participants'][mate] += 1

        # Extract participant info
        p = info['participants'][idx]
        ret['details']['totalGame'] += 1
        ret['details']['totalGameTime'] += info.get('gameDuration', 0)
        ret['details']['kda']['kill'] += p.get('kills', 0)
        ret['details']['kda']['death'] += p.get('deaths', 0)
        ret['details']['kda']['assist'] += p.get('assists', 0)
        ret['details']['champions'][p   .get('championName', 'Unknown')] += 1
        ret['details']['totalGold'] += p.get('goldEarned', 0)
        ret['details']['visionScore'] += p.get('visionScore', 0)
        ret['details']['controlWardsPlaced'] += p.get('controlWardsPlaced', 0)
        ret['details']['minionKilled'] += p.get('totalMinionsKilled', 0)
        ret['details']['jungleKilled'] += p.get('neutralMinionsKilled', 0)
        ret['details']['winloss']['win' if p.get('win', False) else 'loss'] += 1
        print(p.get('puuid')==puuid)
        
        # Ping details
        for ping_type in ['assistMePings', 'retreatPings', 'enemyMissingPings', 'allInPings']:
            ret['details']['pings'][ping_type] += p.get(ping_type, 0)

        # Damage
        for dmg_type in ['magicDamageDealt', 'physicalDamageDealt', 'trueDamageDealt']:
            ret['details'].setdefault('damageDealt', defaultdict(int))
            ret['details']['damageDealt'][dmg_type] += p.get(dmg_type, 0)

        for dmg_type in ['magicDamageTaken', 'physicalDamageTaken', 'trueDamageTaken']:
            ret['details'].setdefault('damageTaken', defaultdict(int))
            ret['details']['damageTaken'][dmg_type] += p.get(dmg_type, 0)

        # Legendary monsters
        for key in ['baronKills', 'dragonKills', 'riftHeraldTakedowns']:
            if p.get(key, 0) > 0:
                ret['details']['legendaryMonsterKilled'][key] += p.get(key, 0)
        
        # Potential emotes (not found in test.json)
        if 'emotesUsed' in p:
            ret['details']['emotesUsed'] += p['emotesUsed']

    sorted_friends = sorted(
        ret['details']['participants'].items(),
        key=lambda x: x[1],
        reverse=True
    )[:3]

    # Replace participants list with top 3
    ret['details']['participants'] = dict(sorted_friends)

    return ret
    
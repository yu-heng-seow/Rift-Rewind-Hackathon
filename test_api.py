import requests
import os
from dotenv import load_dotenv
load_dotenv()

RIOT_API_KEY = os.getenv("RIOT_API_KEY")
PUUID = os.getenv("PUUID")

res = requests.get(f"https://sg2.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/{PUUID}?api_key={RIOT_API_KEY}")

print(res.json())
import requests
import dotenv
import os
from .functionality import request_with_retry

dotenv.load_dotenv()
api_key = os.getenv("RIOT_API_KEY")


def get_account_details_by_name(summoner_name, tagline, region, api_key=api_key):
    ROUTING_TO_REGION = {
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
    "oce": "asia",   
    "sg2": "asia",
    "tw2": "asia",
    "vn2": "asia"
    }
    region = ROUTING_TO_REGION.get(region.lower())
    url = f"https://{region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{summoner_name}/{tagline}?api_key={api_key}"
    response = request_with_retry(url)
    return response.json()

def get_summoner_details_by_puuid(puuid, region, api_key=api_key):
    ROUTING = {
    "na": "na1",
    "br": "br1",
    "lan": "la1",
    "las": "la2",
    "kr": "kr",
    "jp": "jp1",
    "eune": "eun1",
    "euw": "euw1",
    "me1": "me1",
    "tr": "tr1",
    "ru": "ru",
    "oce": "oc1",
    "sg2": "sg2",
    "tw2": "tw2",
    "vn2": "vn2"
    }
    region = ROUTING.get(region.lower())
    url = f"https://{region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{puuid}?api_key={api_key}"
    response = request_with_retry(url)
    return response.json()
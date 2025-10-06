import time
import requests

def request_with_retry(url, max_retries=3):
    for attempt in range(max_retries):
        response = requests.get(url)
        if response.status_code == 429:
            retry_after = int(response.headers.get("Retry-After", 1))
            print(f"Rate limited. Waiting for {retry_after} seconds...")
            time.sleep(retry_after)
            continue
        return response
    response.raise_for_status()
    return response


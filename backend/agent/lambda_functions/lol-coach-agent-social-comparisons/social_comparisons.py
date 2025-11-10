# Import the main analysis function from your script
import numpy as np
from strengths_weaknesses import analyze_strengths_weaknesses
import json

ARCHETYPE_PRIORITY = [
    'aggression',
    'farming',
    'teamplay',
    'vision',
    'versatility',
    'consistency'
]

ARCHETYPE_MAP = {
    'farming': 'Carry/Farmer',
    'aggression': 'Aggressor/Slayer',
    'teamplay': 'Support/Team Player',
    'vision': 'Vision Setter/Support',
    'consistency': 'Consistent Rock',
    'versatility': 'Flexible/Jack-of-all-Trades'
}

def get_player_archetype(scores):
    """
    Determines a player's primary archetype based on their highest score,
    with a tie-breaking logic.
    
    Args:
        scores (dict): A dictionary of player scores (e.g., 'farming', 'vision').
        
    Returns:
        str: The player's archetype.
    """
    if not scores:
        return "Unknown"
        
    try:
        # Find the highest score value
        max_score = max(scores.values())
    except ValueError:
        return "Unknown" # Handle empty scores dict

    # Find all score names that are equal to the max score
    tied_scores = [score_name for score_name, value in scores.items() if value == max_score]
    
    # If there's no tie, just return the archetype
    if len(tied_scores) == 1:
        return ARCHETYPE_MAP.get(tied_scores[0], 'Unknown')
        
    # If there *is* a tie, iterate through our priority list
    for archetype_name in ARCHETYPE_PRIORITY:
        if archetype_name in tied_scores:
            # Return the first one from the priority list that is in the tied list
            return ARCHETYPE_MAP.get(archetype_name, 'Unknown')
            
    # Fallback in case tied_scores contains something not in priority list
    # (This shouldn't happen if scores.keys() and ARCHETYPE_MAP are aligned)
    return ARCHETYPE_MAP.get(tied_scores[0], 'Unknown')

def check_complementary_styles(archetype1, archetype2):
    """
    Checks if two player archetypes are complementary.
    
    Args:
        archetype1 (str): The first player's archetype.
        archetype2 (str): The second player's archetype.
        
    Returns:
        tuple: (bool: True if complementary, str: An explanatory message)
    """
    # Define pairs that work well together. Using frozenset to make order irrelevant.
    complementary_pairs = {
        frozenset({'Aggressor/Slayer', 'Support/Team Player'}),
        frozenset({'Aggressor/Slayer', 'Vision Setter/Support'}),
        frozenset({'Carry/Farmer', 'Support/Team Player'}),
        frozenset({'Carry/Farmer', 'Vision Setter/Support'}),
        frozenset({'Aggressor/Slayer', 'Consistent Rock'}),
        frozenset({'Carry/Farmer', 'Flexible/Jack-of-all-Trades'})
    }
    
    current_pair = frozenset({archetype1, archetype2})
        
    if current_pair in complementary_pairs:
        return True
    
    return False

def calculate_cosine_similarity(scores1, scores2):
    """
    Calculates the cosine similarity between two players' score vectors.
    
    Args:
        scores1 (dict): Player 1's score dictionary.
        scores2 (dict): Player 2's score dictionary.
        
    Returns:
        float: A similarity score between 0.0 and 100.0.
    """
    # Use the priority list to ensure vectors are in the same order
    ordered_keys = ARCHETYPE_PRIORITY
    
    # Create vectors, using 0 if a score is missing
    vec1 = np.array([scores1.get(key, 0) for key in ordered_keys])
    vec2 = np.array([scores2.get(key, 0) for key in ordered_keys])
    
    # Calculate norms (magnitudes)
    norm1 = np.linalg.norm(vec1)
    norm2 = np.linalg.norm(vec2)
    
    # Prevent division by zero if a player has all 0 scores
    if norm1 == 0 or norm2 == 0:
        return 0.0
        
    # Calculate cosine similarity
    similarity = np.dot(vec1, vec2) / (norm1 * norm2)
    
    # Convert to percentage and round
    return round(similarity * 100, 1)

def generate_social_comparison(player1_data, player2_data):
    """
    Generates a full comparison report for two players.
    
    Args:
        player1_data (dict): The full analysis dictionary for player 1.
        player2_data (dict): The full analysis dictionary for player 2.
        
    Returns:
        dict: A report containing side-by-side scores and synergy analysis.
    """
    
    # Handle cases where player data might have an error
    if "error" in player1_data or "error" in player2_data:
        return {"error": "Cannot compare players. One or both player analyses failed.",
                "player1_status": player1_data.get('error', 'OK'),
                "player2_status": player2_data.get('error', 'OK')}

    player1_scores = player1_data.get('scores', {})
    player2_scores = player2_data.get('scores', {})
    
    player1_name = player1_data.get('player', {}).get('gameName', 'Player 1')
    player2_name = player2_data.get('player', {}).get('gameName', 'Player 2')

    # 1. Side-by-side score comparison
    comparison = {}
    all_score_keys = set(player1_scores.keys()) | set(player2_scores.keys())
    
    for key in all_score_keys:
        comparison[key] = {
            player1_name: player1_scores.get(key, 'N/A'),
            player2_name: player2_scores.get(key, 'N/A')
        }
        
    # 2. Complementary Playstyle Analysis
    player1_archetype = get_player_archetype(player1_scores)
    player2_archetype = get_player_archetype(player2_scores)
    
    is_complementary = check_complementary_styles(player1_archetype, player2_archetype)
    
    synergy_report = {
        'player_archetypes': {
            player1_name: player1_archetype,
            player2_name: player2_archetype
        },
        'is_complementary': is_complementary
    }
    
    similarity_percent = calculate_cosine_similarity(player1_scores, player2_scores)
    
    return {
        'score_comparison': comparison,
        'playstyle_synergy': synergy_report,
        'playstyle_similarity_percent': similarity_percent
    }

if __name__ == "__main__":
    player1 = ("QuantumF1zz1cs", "1420", "sea")
    player2 = ("Watermelon", "x1gua", "sea")
    
    print(f"--- Analyzing {player1[0]} ---")
    player1_analysis = analyze_strengths_weaknesses(player1[0], player1[1], player1[2])
    print(json.dumps(player1_analysis.get('scores', {}), indent=2))

    print(f"\n--- Analyzing {player2[0]} ---")
    player2_analysis = analyze_strengths_weaknesses(player2[0], player2[1], player2[2])
    print(json.dumps(player2_analysis.get('scores', {}), indent=2))

    print(f"\n--- Generating Comparison for {player1[0]} and {player2[0]} ---")
    comparison_report = generate_social_comparison(player1_analysis, player2_analysis)
    
    print(json.dumps(comparison_report, indent=2))
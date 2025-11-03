# Import the main analysis function from your script
from strengths_weaknesses import analyze_strengths_weaknesses
import json

def get_player_archetype(scores):
    """
    Determines a player's primary archetype based on their highest score.
    
    Args:
        scores (dict): A dictionary of player scores (e.g., 'farming', 'vision').
        
    Returns:
        str: The player's archetype.
    """
    if not scores:
        return "Unknown"
        
    # Find the name of the highest score
    try:
        highest_score_name = max(scores, key=scores.get)
    except ValueError:
        return "Unknown"

    archetype_map = {
        'farming': 'Carry/Farmer',
        'aggression': 'Aggressor/Slayer',
        'teamplay': 'Support/Team Player',
        'vision': 'Vision Setter/Support',
        'consistency': 'Consistent Rock',
        'versatility': 'Flexible/Jack-of-all-Trades'
    }
    
    return archetype_map.get(highest_score_name, 'Unknown')

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
    
    if archetype1 == "Unknown" or archetype2 == "Unknown":
        return False, "Could not determine synergy due to incomplete player data."
        
    if current_pair in complementary_pairs:
        return True, f"Good Synergy: A {archetype1} and a {archetype2} complement each other well. One can focus on damage/farming while the other enables the team."
        
    if archetype1 == archetype2:
        return False, f"Similar Styles: You are both {archetype1}s. You'll understand each other's goals, but might compete for the same resources or roles."
        
    # Default message for non-complementary, non-identical pairs
    return False, f"Neutral Synergy: A {archetype1} and {archetype2} don't have a strong natural synergy, but any two good players can find a way to win!"

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
    
    is_complementary, synergy_message = check_complementary_styles(player1_archetype, player2_archetype)
    
    synergy_report = {
        'player_archetypes': {
            player1_name: player1_archetype,
            player2_name: player2_archetype
        },
        'is_complementary': is_complementary,
        'message': synergy_message
    }
    
    return {
        'score_comparison': comparison,
        'playstyle_synergy': synergy_report
    }

if __name__ == "__main__":
    # --- DEFINE PLAYERS TO COMPARE ---
    # (Using the mock functions from strengths_weaknesses.py, 
    # the data will be random, but the comparison logic will work)
    
    player1 = ("QuantumF1zz1cs", "1420", "sea")
    player2 = ("Watermelon", "x1gua", "sea") # Example friend
    
    print(f"--- Analyzing {player1[0]} ---")
    player1_analysis = analyze_strengths_weaknesses(player1[0], player1[1], player1[2])
    print(json.dumps(player1_analysis.get('scores', {}), indent=2))

    print(f"\n--- Analyzing {player2[0]} ---")
    player2_analysis = analyze_strengths_weaknesses(player2[0], player2[1], player2[2])
    print(json.dumps(player2_analysis.get('scores', {}), indent=2))

    print(f"\n--- Generating Comparison for {player1[0]} and {player2[0]} ---")
    comparison_report = generate_social_comparison(player1_analysis, player2_analysis)
    
    # Pretty print the final report
    print(json.dumps(comparison_report, indent=2))
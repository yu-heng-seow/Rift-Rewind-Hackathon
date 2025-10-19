import uuid
from agent import invoke_agent_helper

session_id:str = str(uuid.uuid1())
agent_id = 'UFSZYQKWFU'
alias_id = 'TSTALIASID'

query = "I want to retrieve the favorite champion for the player with the id '5130f179' and I want to know what items they normally carry."
response = invoke_agent_helper(query, session_id, agent_id, alias_id)
print(response)
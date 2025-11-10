import json
import boto3
import os
from datetime import datetime

# Initialize the Bedrock Agent Runtime client
# This client is used for invoking agents
bedrock_agent_runtime = boto3.client('bedrock-agent-runtime')

# Get your Agent's ID and Alias ID from environment variables
AGENT_ID = os.environ.get("AGENT_ID")
AGENT_ALIAS_ID = os.environ.get("AGENT_ALIAS_ID")

def lambda_handler(event, context):
    # 1. Parse the prompt from the API Gateway event
    # We assume the frontend sends a JSON body like: {"prompt": "Hello"}
    try:
        body = json.loads(event.get('body', '{}'))
        user_prompt = body.get('prompt')
        
        # You can create a new session ID for each invocation
        # or manage session state if you need conversation history.
        session_id = datetime.now().strftime("%Y%m%d%H%M%S%f") # Implement your session logic

        if not user_prompt:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*', 
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                },
                'body': json.dumps({'error': 'No prompt provided'})
            }

    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*', 
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({'error': 'Invalid JSON body'})
        }

    # 2. Invoke the Bedrock Agent
    try:
        response = bedrock_agent_runtime.invoke_agent(
            agentId=AGENT_ID,
            agentAliasId=AGENT_ALIAS_ID,
            sessionId=session_id,
            inputText=user_prompt
        )

        # 3. Process the streaming response
        # invoke_agent returns a stream. We need to assemble it.
        final_response = ""
        for event in response.get('completion', []):
            if 'chunk' in event:
                chunk = event['chunk']
                final_response += chunk['bytes'].decode('utf-8')

        # 4. Return the final, assembled response to the frontend
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*', 
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({'response': final_response})
        }

    except Exception as e:
        print(f"Error invoking agent: {e}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*', 
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({'error': str(e)})
        }
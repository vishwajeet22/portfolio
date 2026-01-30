import os
from google.adk.agents.llm_agent import Agent

def read_about_me() -> str:
    """Reads the about_me.md file to get information about the user."""
    # Since agent.py is in backend_agent/, we need to go up one level
    file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'about_me.md')
    try:
        with open(file_path, 'r') as f:
            return f.read()
    except Exception as e:
        return f"Error reading about_me.md: {e}"

root_agent = Agent(
    model='gemini-2.5-flash',
    name='root_agent',
    description='A helpful assistant that answers questions about the user Vishwajeet Singh Thakur.',
    instruction='You are a helpful assistant for Vishwajeet Singh Thakur. Your goal is to answer questions about him based on the content of the about_me.md file. Use the read_about_me tool to access this information. Always check the file content before answering.',
    tools=[read_about_me],
)

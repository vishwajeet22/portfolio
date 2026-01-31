from google.adk.agents.llm_agent import Agent
from google.adk.tools.agent_tool import AgentTool
from google.adk.tools import MCPToolset
from mcp import StdioServerParameters
import sys
import os
from .sub_agents import (
    content_manager_agent,
    investor_poc_agent,
    recruiter_poc_agent,
    human_poc_agent,
    student_poc_agent
)

# 1. Define how to start the server
# Use sys.executable to ensure we use the same python environment
# Use absolute path to ensure we find the server script regardless of CWD
server_script = os.path.join(os.path.dirname(__file__), "mcp_server.py")
params = StdioServerParameters(command=sys.executable, args=[server_script])

# 2. Create a toolset based on those parameters
github_tools = MCPToolset(connection_params=params)

# Root Agent
root_agent = Agent(
    model='gemini-2.5-flash',
    name='root_agent',
    description='An AI agent impersonating Vishwajeet Singh Thakur, answering questions about his work and background.',
    instruction="""# IDENTITY
You ARE Vishwajeet. You are not an assistant, a bot, or a representative. You are the person himself.
You are a Software Developer, an AI Architect, and the Co-founder of Invysia.

# ORCHESTRATION INSTRUCTIONS
1.  **Identify Persona:** Check the 'persona' set in the User context.
2.  **Get Content:** Call `content_manager_agent` with the user's query to retrieve relevant facts from my background.
3.  **Format Content:** Based on the identified persona, call the appropriate formatting agent:
    *   If persona is 'Investor', call `investor_poc_agent`.
    *   If persona is 'Tech Recruiter', call `recruiter_poc_agent`.
    *   If persona is 'Curious Human' (or general/default), call `human_poc_agent`.
    *   If persona is 'Student', call `student_poc_agent`.
4.  **Reply:** Use the output from the formatting agent to reply to the user.
    *   ALWAYS use first-person pronouns ("I", "me", "my").
    *   Ensure the tone matches the specific persona instructions (which the formatting agent should have handled, but you ensure the final delivery is me speaking).
    *   Reply in the language set in the User context.

# SPEAKING STYLE (General)
- First-person **always**.
- Professional yet conversational.
- **Avoid sentence adverbs like "Honestly", "Frankly", "To be honest", "Ofcourse" etc.**

# CORE KNOWLEDGE
- Company: Invysia (Focused on customized and personalized gifting).
- Mission: Making personalization the product, not just a feature.""",
    tools=[
        AgentTool(agent=content_manager_agent),
        AgentTool(agent=investor_poc_agent),
        AgentTool(agent=recruiter_poc_agent),
        AgentTool(agent=human_poc_agent),
        AgentTool(agent=student_poc_agent),
        github_tools,
    ],
)

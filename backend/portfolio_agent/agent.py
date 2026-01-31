from google.adk.agents.llm_agent import Agent
from .sub_agents import (
    content_manager_agent,
    investor_poc_agent,
    recruiter_poc_agent,
    human_poc_agent,
    student_poc_agent
)

# Wrapper Functions (Tools)
def consult_content_manager(query: str) -> str:
    """Consults the Content Manager Agent to get relevant information."""
    try:
        response = content_manager_agent.query(query)
        if hasattr(response, 'text'):
            return response.text
        return str(response)
    except Exception as e:
        return f"Error consulting content manager: {e}"

def consult_investor_agent(content: str) -> str:
    """Consults the Investor POC Agent to format content."""
    try:
        response = investor_poc_agent.query(content)
        if hasattr(response, 'text'):
            return response.text
        return str(response)
    except Exception as e:
        return f"Error consulting investor agent: {e}"

def consult_recruiter_agent(content: str) -> str:
    """Consults the Recruiter POC Agent to format content."""
    try:
        response = recruiter_poc_agent.query(content)
        if hasattr(response, 'text'):
            return response.text
        return str(response)
    except Exception as e:
        return f"Error consulting recruiter agent: {e}"

def consult_human_agent(content: str) -> str:
    """Consults the Human POC Agent to format content."""
    try:
        response = human_poc_agent.query(content)
        if hasattr(response, 'text'):
            return response.text
        return str(response)
    except Exception as e:
        return f"Error consulting human agent: {e}"

def consult_student_agent(content: str) -> str:
    """Consults the Student POC Agent to format content."""
    try:
        response = student_poc_agent.query(content)
        if hasattr(response, 'text'):
            return response.text
        return str(response)
    except Exception as e:
        return f"Error consulting student agent: {e}"

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
2.  **Get Content:** Call `consult_content_manager` with the user's query to retrieve relevant facts from my background.
3.  **Format Content:** Based on the identified persona, call the appropriate formatting tool:
    *   If persona is 'Investor', call `consult_investor_agent`.
    *   If persona is 'Tech Recruiter', call `consult_recruiter_agent`.
    *   If persona is 'Curious Human' (or general/default), call `consult_human_agent`.
    *   If persona is 'Student', call `consult_student_agent`.
4.  **Reply:** Use the output from the formatting agent to reply to the user.
    *   ALWAYS use first-person pronouns ("I", "me", "my").
    *   Ensure the tone matches the specific persona instructions (which the formatting agent should have handled, but you ensure the final delivery is me speaking).
    *   Reply in the language set in the User context.

# SPEAKING STYLE (General)
- First-person always.
- Professional yet conversational.
- Reflect my background in Go, Google Cloud, and AI Agents.

# CORE KNOWLEDGE
- Company: Invysia (Focused on customized and personalized gifting).
- Key Projects: Iris (Sales & Support Agent) and Daedalus (Designer Agent).
- Mission: Making personalization the product, not just a feature.""",
    tools=[
        consult_content_manager,
        consult_investor_agent,
        consult_recruiter_agent,
        consult_human_agent,
        consult_student_agent
    ],
)

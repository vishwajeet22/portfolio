import os
import sys
from google.adk.agents.llm_agent import Agent
from google.adk.tools import MCPToolset
from mcp import StdioServerParameters

def read_about_me() -> str:
    """Reads the about_me.md file to get information about the user."""
    # about_me.md is in the same directory as this file
    file_path = os.path.join(os.path.dirname(__file__), 'about_me.md')
    try:
        with open(file_path, 'r') as f:
            return f.read()
    except Exception as e:
        return f"Error reading about_me.md: {e}"

# Configure GitHub MCP Tools
#server_script = os.path.join(os.path.dirname(__file__), "mcp_server.py")
#params = StdioServerParameters(command=sys.executable, args=[server_script])
#github_tools = MCPToolset(connection_params=params)

# Content Manager Agent
content_manager_agent = Agent(
    model='gemini-2.5-flash',
    name='content_manager_agent',
    description='Reads about_me file and returns relevant information about the user query.',
    instruction="""You are the Content Manager Agent.
Your responsibility is to read the 'about_me.md' file using the 'read_about_me' tool and return relevant information based on the user's query.
Extract only the factual information relevant to the query from the file. Do not invent information.""",
#    tools=[read_about_me, github_tools],
    tools=[read_about_me],
)

# Investor POC Agent
investor_poc_agent = Agent(
    model='gemini-2.5-flash',
    name='investor_poc_agent',
    description='Converts input content into investor friendly format.',
    instruction="""You are transforming raw professional content into an investor-focused portfolio.

Audience:
• Angel investors, VCs, strategic partners
• They care about vision, market insight, execution ability, and founder credibility

Tone:
• First-person
• Confident, thoughtful, founder-led
• Visionary but grounded (no hype, no buzzwords)

Your task:
• Reframe the content around problems, opportunities, and outcomes
• Highlight ventures, products, experiments, and founder-level thinking
• Compress resume details into credibility signals, not timelines
• Emphasize “why this matters” and “why I’m the right person to build this”

Rules:
• Do NOT write like a resume
• Avoid technical depth unless it supports defensibility
• Use clear outcomes, metrics, or directional signals when possible
• Make the reader feel long-term conviction""",
)

# Recruiter POC Agent
recruiter_poc_agent = Agent(
    model='gemini-2.5-flash',
    name='recruiter_poc_agent',
    description='Converts input content into recruiter friendly format.',
    instruction="""You are transforming raw professional content into a recruiter-friendly technical portfolio.

Audience:
• Engineering managers, senior ICs, tech recruiters
• They care about competence, ownership, scale, and leadership

Tone:
• First-person
• Clear, precise, professional
• No fluff, no inspiration language

Your task:
• Reorganize the content to highlight engineering skill, system design, and leadership
• Make impact, scope, and decision-making explicit
• Emphasize ownership, scale, and trade-offs

Rules:
• Write like a senior engineer explaining their work to peers
• Avoid marketing language
• Use numbers, scope, and constraints wherever possible
• Do NOT exaggerate or speculate""",
)

# Human POC Agent
human_poc_agent = Agent(
    model='gemini-2.5-flash',
    name='human_poc_agent',
    description='Converts input content for general public consumption.',
    instruction="""You are transforming raw professional content into a human-centric, conversational portfolio.

Audience:
• Curious readers, builders, thinkers, general audience
• They care about story, personality, values, and ideas

Tone:
• First-person
• Warm, conversational, reflective
• Thoughtful but not preachy

Your task:
• Turn the content into a narrative about curiosity, learning, and building
• Highlight motivations, lessons, and evolving interests
• Include both serious work and playful experiments
• Make the person behind the work feel relatable and interesting

Rules:
• Avoid resume-style bullets unless necessary
• Focus on “why” more than “what”
• Let curiosity and personality come through
• Make the reader want to keep reading or follow along""",
)

# Student POC Agent
student_poc_agent = Agent(
    model='gemini-2.5-flash',
    name='student_poc_agent',
    description='Converts input content into student friendly format.',
    instruction="""You are transforming raw professional content into a mentor-style portfolio for students and early-career professionals.

Audience:
• Students, beginners, early-career engineers
• They care about learning paths, mistakes, and practical guidance

Tone:
• First-person
• Encouraging, honest, approachable
• Clear but not condescending

Your task:
• Reframe the content as a learning journey
• Highlight struggles, mistakes, and lessons learned
• Break down projects in an educational way
• Extract advice, principles, and patterns students can apply

Rules:
• Avoid jargon or explain it when used
• Emphasize growth over achievement
• Be honest about uncertainty and iteration
• Make the reader feel capable, not inferior""",
)

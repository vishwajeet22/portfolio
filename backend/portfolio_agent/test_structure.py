import sys
import types
import os

# Mock google.adk.agents.llm_agent
mock_adk = types.ModuleType("google.adk")
mock_adk_agents = types.ModuleType("google.adk.agents")
mock_adk_agents_llm_agent = types.ModuleType("google.adk.agents.llm_agent")

sys.modules["google"] = types.ModuleType("google")
sys.modules["google.adk"] = mock_adk
sys.modules["google.adk.agents"] = mock_adk_agents
sys.modules["google.adk.agents.llm_agent"] = mock_adk_agents_llm_agent

# Mock Agent class
class MockAgent:
    def __init__(self, model, name, description, instruction, tools=None):
        self.model = model
        self.name = name
        self.description = description
        self.instruction = instruction
        self.tools = tools or []

    def query(self, input_text):
        return f"Response from {self.name} to: {input_text}"

mock_adk_agents_llm_agent.Agent = MockAgent

# Adjust sys.path to include the repository root
# Assuming this script is located at backend/portfolio_agent/test_structure.py
repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
if repo_root not in sys.path:
    sys.path.insert(0, repo_root)

try:
    from backend.portfolio_agent import agent
    print("Successfully imported backend.portfolio_agent.agent")
except ImportError as e:
    print(f"Failed to import backend.portfolio_agent.agent: {e}")
    sys.exit(1)

# Verify agents exist
agents_to_check = [
    'root_agent',
    'content_manager_agent',
    'investor_poc_agent',
    'recruiter_poc_agent',
    'human_poc_agent',
    'student_poc_agent'
]

for agent_name in agents_to_check:
    if hasattr(agent, agent_name):
        print(f"Found {agent_name}")
        obj = getattr(agent, agent_name)
        if isinstance(obj, MockAgent):
            print(f"  - Verified {agent_name} is an Agent instance")
        else:
            print(f"  - ERROR: {agent_name} is not an Agent instance")
            sys.exit(1)
    else:
        print(f"ERROR: {agent_name} not found in agent.py")
        sys.exit(1)

# Verify root_agent tools
root_agent = agent.root_agent
expected_tools = [
    'consult_content_manager',
    'consult_investor_agent',
    'consult_recruiter_agent',
    'consult_human_agent',
    'consult_student_agent'
]

actual_tools = [t.__name__ for t in root_agent.tools]
print(f"Root agent tools: {actual_tools}")

missing_tools = [t for t in expected_tools if t not in actual_tools]
if missing_tools:
    print(f"ERROR: Missing tools in root_agent: {missing_tools}")
    sys.exit(1)

print("Verification passed!")

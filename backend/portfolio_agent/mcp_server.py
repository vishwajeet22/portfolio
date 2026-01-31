from mcp.server.fastmcp import FastMCP
from github import Github
import os

# Initialize FastMCP server
mcp = FastMCP("GitHub MCP Server")

def get_github_client():
    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        # For testing purposes or if not set, we might fail or return a dummy if allowed.
        # But generally we should raise error.
        # raise ValueError("GITHUB_TOKEN environment variable not set")
        print("GITHUB_TOKEN environment variable not set")
    return Github(token)

@mcp.tool()
def list_repos(limit: int = 10) -> list[str]:
    """List repositories for the authenticated user."""
    g = get_github_client()
    repos = g.get_user().get_repos()
    # Handle PaginatedList by iterating
    repo_names = []
    count = 0
    for repo in repos:
        if count >= limit:
            break
        repo_names.append(repo.full_name)
        count += 1
    return repo_names

@mcp.tool()
def get_file_content(owner: str, repo: str, path: str) -> str:
    """Get the content of a file in a repository."""
    g = get_github_client()
    repo_obj = g.get_repo(f"{owner}/{repo}")
    contents = repo_obj.get_contents(path)
    if isinstance(contents, list):
         raise ValueError(f"Path {path} is a directory")
    return contents.decoded_content.decode('utf-8')

@mcp.tool()
def create_issue(owner: str, repo: str, title: str, body: str) -> str:
    """Create an issue in a repository. Returns the issue URL."""
    g = get_github_client()
    repo_obj = g.get_repo(f"{owner}/{repo}")
    issue = repo_obj.create_issue(title=title, body=body)
    return issue.html_url

if __name__ == "__main__":
    mcp.run()

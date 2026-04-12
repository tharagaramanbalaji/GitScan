import requests
from datetime import datetime, timedelta
import urllib.parse
import re
import os

def get_headers():
    token = os.getenv("GITHUB_TOKEN")
    headers = {"Accept": "application/vnd.github.v3+json"}
    if token:
        # Support both 'token' (Classic) and 'Bearer' (Fine-grained)
        headers["Authorization"] = f"token {token}"
    return headers

def get_github_user(username: str):
    url = f"https://api.github.com/users/{username}"
    response = requests.get(url, headers=get_headers())
    if response.status_code == 200:
        return response.json()
    return None

def get_user_repos(username: str):
    url = f"https://api.github.com/users/{username}/repos"
    response = requests.get(url, headers=get_headers())
    if response.status_code == 200:
        return response.json()
    return []

def get_user_events(username: str):
    url = f"https://api.github.com/users/{username}/events/public?per_page=100"
    response = requests.get(url, headers=get_headers())
    if response.status_code == 200:
        return response.json()
    return []

def get_repo_commits(owner: str, repo: str, author: str = None, max_pages=3):
    commits = []
    base_url = f"https://api.github.com/repos/{owner}/{repo}/commits?per_page=100"
    if author:
        base_url += f"&author={author}"
        
    url = base_url
    for i in range(max_pages):
        try:
            response = requests.get(url, headers=get_headers(), timeout=10)
            if response.status_code == 200:
                page_commits = response.json()
                if not isinstance(page_commits, list): break
                commits.extend(page_commits)
                if len(page_commits) < 100:
                    break
                link = response.headers.get("Link")
                if not link or 'rel="next"' not in link:
                    break
                next_url_match = re.search(r'<([^>]+)>;\s*rel="next"', link)
                if next_url_match:
                    url = next_url_match.group(1)
                else: break
            else: break
        except: break
    return commits

def get_user_organizations(username: str):
    url = f"https://api.github.com/users/{username}/orgs"
    response = requests.get(url, headers=get_headers())
    if response.status_code == 200:
        return response.json()
    return []

def get_user_stats(username: str):
    """Fetch total PRs and Issues using Search API"""
    stats = {"total_prs": 0, "total_issues": 0}
    headers = get_headers()
    
    # PRs
    pr_url = f"https://api.github.com/search/issues?q=author:{username}+type:pr"
    pr_resp = requests.get(pr_url, headers=headers)
    if pr_resp.status_code == 200:
        stats["total_prs"] = pr_resp.json().get("total_count", 0)
        
    # Issues
    issue_url = f"https://api.github.com/search/issues?q=author:{username}+type:issue"
    issue_resp = requests.get(issue_url, headers=headers)
    if issue_resp.status_code == 200:
        stats["total_issues"] = issue_resp.json().get("total_count", 0)
        
    return stats

def get_pinned_repos(username: str):
    token = os.getenv("GITHUB_TOKEN")
    if not token:
        return []
    
    query = """
    query($login: String!) {
      user(login: $login) {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              stargazerCount
              primaryLanguage {
                name
              }
              url
            }
          }
        }
      }
    }
    """
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    try:
        response = requests.post(
            "https://api.github.com/graphql",
            json={"query": query, "variables": {"login": username}},
            headers=headers,
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            nodes = data.get("data", {}).get("user", {}).get("pinnedItems", {}).get("nodes", [])
            if not nodes:
                return []
            
            pinned = []
            for node in nodes:
                pinned.append({
                    "name": node.get("name"),
                    "description": node.get("description"),
                    "stargazers_count": node.get("stargazerCount", 0),
                    "language": node.get("primaryLanguage", {}).get("name") if node.get("primaryLanguage") else None,
                    "html_url": node.get("url")
                })
            return pinned
    except Exception as e:
        print("Failed to fetch pinned repos:", e)
    return []

def parse_usernames(raw_input: str):
    # Split by comma, whitespace, or newline
    entries = re.split(r'[,\s\n]+', raw_input)
    usernames = set()
    for entry in entries:
        entry = entry.strip()
        if not entry:
            continue
        # If it's a GitHub URL, extract the username
        if entry.startswith("https://github.com/"):
            path = urllib.parse.urlparse(entry).path
            username = path.strip("/").split("/")[0]
            if username:
                usernames.add(username)
        else:
            usernames.add(entry)
    return list(usernames)

def validate_username(username: str):
    """Validate GitHub username format"""
    # GitHub username rules: 1-39 chars, alphanumeric with single hyphens
    pattern = r'^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$'
    return bool(re.match(pattern, username))

def check_rate_limit():
    """Check GitHub API rate limit status"""
    response = requests.get('https://api.github.com/rate_limit', headers=get_headers())
    if response.status_code == 200:
        data = response.json()
        remaining = data['resources']['core']['remaining']
        reset_time = datetime.fromtimestamp(data['resources']['core']['reset'])
        return remaining, reset_time
    return None, None

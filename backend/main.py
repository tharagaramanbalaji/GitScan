from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from services.github_service import (
    get_github_user, 
    get_user_repos, 
    get_user_events, 
    get_user_organizations,
    get_user_stats,
    parse_usernames,
    check_rate_limit
)
from services.analysis_service import (
    extract_top_languages,
    extract_technical_interests_ml,
    validate_domain_consistency
)

app = FastAPI(title="GitHub Profile Extractor API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    usernames: str

@app.get("/")
async def root():
    return {"message": "GitHub Profile Extractor API is running"}

@app.get("/rate-limit")
async def rate_limit():
    remaining, reset_time = check_rate_limit()
    return {
        "remaining": remaining,
        "reset_time": reset_time.isoformat() if reset_time else None
    }

@app.post("/analyze")
async def analyze_profiles(request: AnalyzeRequest):
    username_list = parse_usernames(request.usernames)
    if not username_list:
        raise HTTPException(status_code=400, detail="No valid usernames provided")

    results = []
    errors = []
    save_dir = "github_data_exports"
    os.makedirs(save_dir, exist_ok=True)

    for username in username_list:
        user_data = get_github_user(username)
        if user_data:
            repos = get_user_repos(username)
            events = get_user_events(username)
            orgs = get_user_organizations(username)
            detailed_stats = get_user_stats(username)
            
            # Calculate total stars across ALL repositories
            total_stars = sum(repo.get('stargazers_count', 0) for repo in repos)
            detailed_stats["total_stars"] = total_stars
            
            top_languages = extract_top_languages(repos)
            ml_analysis = extract_technical_interests_ml(repos, user_data)
            consistency_report = validate_domain_consistency(user_data.get('bio', ''), repos, ml_analysis)
            
            top_repos_list = sorted(repos, key=lambda x: x.get('pushed_at', ''), reverse=True)[:3]
            
            from services.github_service import get_repo_commits
            deep_commits = []
            for tr in top_repos_list:
                deep_commits.extend(get_repo_commits(tr['owner']['login'], tr['name'], author=username))
            
            from services.analysis_service import calculate_deep_productivity_metrics
            productivity_metrics = calculate_deep_productivity_metrics(deep_commits, repos, detailed_stats)
            
            combined_data = {
                "user": user_data,
                "repos_count": len(repos),
                "organizations": orgs,
                "stats": detailed_stats,
                "top_repos": sorted(repos, key=lambda x: x.get('pushed_at', ''), reverse=True)[:4],
                "recent_events": events[:5],
                "top_technical_preferences": top_languages,
                "ml_technical_analysis": ml_analysis,
                "domain_consistency": consistency_report,
                "productivity_metrics": productivity_metrics
            }
            results.append(combined_data)

            # Save individual JSON (optional, but keeping it for compatibility)
            file_path = os.path.join(save_dir, f"{username}_github_data.json")
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(combined_data, f, indent=4)
        else:
            errors.append(username)

    return {
        "results": results,
        "errors": errors
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

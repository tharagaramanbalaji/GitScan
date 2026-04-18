from collections import Counter
from sklearn.feature_extraction.text import TfidfVectorizer
from datetime import datetime, timedelta

def extract_top_languages(repos):
    """Extract top programming languages with their counts from user repositories"""
    languages = []
    for repo in repos:
        if repo.get('language') and repo.get('language') != 'null':
            languages.append(repo['language'])
    
    if not languages:
        return {}
    
    language_counts = Counter(languages)
    # Return as dict { "Language": count } for all languages
    return dict(language_counts.most_common(10))

def extract_technical_interests_ml(repos, user_data=None):
    """Use ML to extract technical interests from repository data and user profile"""
    if not repos:
        return {
            "primary_languages": [],
            "technical_domains": [],
            "project_types": [],
            "frameworks_tech": []
        }
    
    repo_texts = []
    languages = []
    topics_keywords = []
    repo_stars = []
    recent_activity = 0

    for repo in repos:
        text_data = []
        if repo.get('name'):
            text_data.append(repo['name'])
        if repo.get('description'):
            text_data.append(repo['description'])
        if repo.get('topics'):
            text_data.extend(repo['topics'])
            topics_keywords.extend(repo['topics'])
        if repo.get('language') and repo.get('language') != 'null':
            languages.append(repo['language'])
        if repo.get('stargazers_count'):
            repo_stars.append(repo['stargazers_count'])
        repo_text = ' '.join(text_data)
        if repo_text.strip():
            repo_texts.append(repo_text)
        # Count recent activity (last 180 days)
        if repo.get('updated_at'):
            try:
                updated = datetime.strptime(repo['updated_at'], "%Y-%m-%dT%H:%M:%SZ")
                if updated > datetime.utcnow() - timedelta(days=180):
                    recent_activity += 1
            except:
                pass

    language_counts = Counter(languages)
    primary_languages = [lang for lang, count in language_counts.most_common(5)]

    technical_keywords = {
        'Web Development': ['web', 'frontend', 'backend', 'fullstack', 'website', 'http', 'api', 'rest', 'graphql'],
        'Data Science': ['data', 'analytics', 'machine learning', 'ml', 'ai', 'artificial intelligence', 'dataset', 'analysis', 'pandas', 'numpy', 'matplotlib', 'scipy'],
        'AI & ML': ['tensorflow', 'pytorch', 'keras', 'nlp', 'scikit-learn', 'vision', 'llm', 'langchain', 'openai', 'transformers'],
        'Mobile Development': ['mobile', 'android', 'ios', 'react native', 'flutter', 'swift', 'kotlin', 'dart'],
        'DevOps': ['docker', 'kubernetes', 'ci/cd', 'deployment', 'infrastructure', 'cloud', 'aws', 'azure', 'gcp', 'terraform', 'ansible'],
        'Game Development': ['game', 'unity', 'unreal', 'gaming', 'pygame', 'gamedev', 'c#', 'c++'],
        'Cybersecurity': ['security', 'encryption', 'hacking', 'cybersecurity', 'penetration', 'vulnerability', 'wireshark', 'metasploit'],
        'Blockchain': ['blockchain', 'cryptocurrency', 'bitcoin', 'ethereum', 'smart contract', 'defi', 'solidity', 'web3'],
        'IoT & Embedded': ['iot', 'internet of things', 'sensor', 'arduino', 'raspberry pi', 'embedded', 'esp32', 'firmware'],
        'Database': ['database', 'sql', 'mongodb', 'postgresql', 'mysql', 'nosql', 'redis', 'supabase', 'firebase']
    }

    framework_keywords = {
        'React': ['react', 'next.js', 'remix', 'gatsby', 'preact'],
        'Vue': ['vue', 'nuxt'],
        'Angular': ['angular'],
        'Svelte': ['svelte'],
        'Python Web': ['django', 'flask', 'fastapi', 'sanic', 'tornado'],
        'Node.js': ['express', 'nest.js', 'hapi', 'koa', 'socket.io'],
        'Deep Learning': ['pytorch', 'tensorflow', 'keras', 'jax', 'transformers', 'stable-diffusion'],
        'Data Analysis': ['pandas', 'numpy', 'scipy', 'scikit-learn', 'matplotlib', 'seaborn', 'plotly'],
        'CSS Engine': ['tailwind', 'sass', 'less', 'styled-components', 'emotion'],
        'DevOps/Cloud': ['docker', 'kubernetes', 'terraform', 'aws', 'azure', 'gcp', 'jenkins', 'ansible'],
        'Mobile': ['flutter', 'react native', 'swiftui', 'jetpack compose', 'ionic'],
        'Database/ORM': ['postgresql', 'mongodb', 'redis', 'mysql', 'prisma', 'sqlalchemy', 'mongoose', 'supabase', 'firebase'],
        'API/Query': ['graphql', 'apollo', 'grpc', 'rest', 'trpc']
    }

    all_text = ' '.join(repo_texts + topics_keywords).lower()
    
    # Calculate tech stack frequencies
    tech_stack_counts = Counter()
    
    # Check for frameworks based on keywords
    for framework, keywords in framework_keywords.items():
        count = sum(1 for keyword in keywords if keyword in all_text)
        if count > 0:
            tech_stack_counts[framework] += count

    # Add top languages to the tech stack counts
    for lang, count in language_counts.items():
        tech_stack_counts[lang] += count

    # Select the most frequently appearing technologies
    # Filter out generic terms and select top 8
    primary_tech_stack = [tech for tech, count in tech_stack_counts.most_common(8)]

    identified_domains = []
    for domain, keywords in technical_keywords.items():
        score = sum(1 for keyword in keywords if keyword in all_text)
        if score > 0:
            identified_domains.append((domain, score))
    
    identified_domains.sort(key=lambda x: x[1], reverse=True)
    technical_domains = [domain for domain, score in identified_domains[:3]]

    # Final combined tech list
    frameworks_tech = primary_tech_stack

    if repo_texts and len(repo_texts) >= 2:
        try:
            vectorizer = TfidfVectorizer(
                max_features=50,
                stop_words='english',
                ngram_range=(1, 2),
                min_df=1
            )
            tfidf_matrix = vectorizer.fit_transform(repo_texts)
            feature_names = vectorizer.get_feature_names_out()
            mean_scores = np.mean(tfidf_matrix.toarray(), axis=0)
            top_indices = mean_scores.argsort()[-10:][::-1]
            frameworks_tech = [feature_names[i] for i in top_indices if len(feature_names[i]) > 2][:5]
        except:
            frameworks_tech = list(set(topics_keywords))[:5]

    project_types = []
    if any('api' in text.lower() for text in repo_texts):
        project_types.append('API Development')
    if any('bot' in text.lower() for text in repo_texts):
        project_types.append('Bot Development')
    if any('tool' in text.lower() or 'utility' in text.lower() for text in repo_texts):
        project_types.append('Tools & Utilities')
    if any('library' in text.lower() or 'package' in text.lower() for text in repo_texts):
        project_types.append('Libraries & Packages')

    return {
        "primary_languages": primary_languages,
        "technical_domains": technical_domains,
        "project_types": project_types,
        "frameworks_tech": frameworks_tech
    }

def validate_domain_consistency(bio: str, repos: list, ml_analysis: dict) -> dict:
    domain_expertise = {
        "AI/ML": {
            "bio_keywords": ['ai', 'ml', 'machine learning', 'deep learning', 'artificial intelligence', 'data scientist'],
            "repo_keywords": ['tensorflow', 'pytorch', 'keras', 'scikit-learn', 'neural', 'classifier', 'prediction'],
            "related_languages": ['Python', 'R', 'Julia']
        },
        "Web Development": {
            "bio_keywords": ['web dev', 'frontend', 'backend', 'full stack', 'web developer'],
            "repo_keywords": ['react', 'vue', 'angular', 'node', 'django', 'flask', 'express'],
            "related_languages": ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'PHP']
        },
        "Mobile Development": {
            "bio_keywords": ['mobile dev', 'ios dev', 'android dev', 'app developer'],
            "repo_keywords": ['android', 'ios', 'swift', 'kotlin', 'flutter', 'react-native'],
            "related_languages": ['Java', 'Kotlin', 'Swift', 'Dart']
        },
        "DevOps": {
            "bio_keywords": ['devops', 'sre', 'platform engineer', 'cloud engineer'],
            "repo_keywords": ['docker', 'kubernetes', 'terraform', 'ansible', 'jenkins', 'aws', 'azure'],
            "related_languages": ['Python', 'Shell', 'Go', 'YAML']
        },
        "Cybersecurity": {
            "bio_keywords": ['security', 'pentester', 'cyber', 'infosec', 'security engineer'],
            "repo_keywords": ['security', 'encryption', 'vulnerability', 'exploit', 'firewall', 'penetration'],
            "related_languages": ['Python', 'C', 'Assembly', 'Shell']
        },
        "Game Development": {
            "bio_keywords": ['game dev', 'game developer', 'unity dev', 'unreal dev'],
            "repo_keywords": ['unity', 'unreal', 'godot', 'gamedev', 'pygame', 'directx'],
            "related_languages": ['C#', 'C++', 'Python', 'Lua']
        },
        "Embedded/IoT": {
            "bio_keywords": ['embedded', 'iot', 'firmware', 'hardware'],
            "repo_keywords": ['arduino', 'raspberry pi', 'esp32', 'embedded', 'sensor', 'mqtt'],
            "related_languages": ['C', 'C++', 'Python', 'Assembly']
        }
    }

    bio = bio.lower() if bio else ""
    consistency_report = {
        "claimed_domains": [],
        "verified_domains": [],
        "consistency_scores": {},
        "suggestions": []
    }

    for domain, keywords in domain_expertise.items():
        if any(keyword in bio for keyword in keywords["bio_keywords"]):
            consistency_report["claimed_domains"].append(domain)

    for domain, keywords in domain_expertise.items():
        repo_matches = 0
        for repo in repos:
            repo_text = f"{repo.get('name', '')} {repo.get('description', '')} {' '.join(repo.get('topics', []))}"
            repo_text = repo_text.lower()
            if any(keyword in repo_text for keyword in keywords["repo_keywords"]):
                repo_matches += 1
        repo_score = min(repo_matches / max(len(repos), 1) * 100, 100) if repos else 0
        
        lang_matches = sum(1 for lang in ml_analysis["primary_languages"] 
                         if lang in keywords["related_languages"])
        lang_score = (lang_matches / len(keywords["related_languages"])) * 100
        
        domain_match_score = 100 if domain in ml_analysis["technical_domains"] else 0
        
        domain_score = (repo_score + lang_score + domain_match_score) / 3
        consistency_report["consistency_scores"][domain] = round(domain_score, 2)
        
        if domain_score >= 60:
            consistency_report["verified_domains"].append(domain)
        
        if domain in consistency_report["claimed_domains"] and domain_score < 40:
            consistency_report["suggestions"].append(
                f"Claims {domain} expertise but has limited supporting evidence in repositories"
            )
        elif domain not in consistency_report["claimed_domains"] and domain_score > 70:
            consistency_report["suggestions"].append(
                f"Shows strong {domain} work but doesn't mention it in bio"
            )

    return consistency_report

def calculate_deep_productivity_metrics(deep_commits, repos, stats):
    from datetime import datetime, timezone
    
    if not deep_commits:
        return {
           "total_commits_90d": 0, "commits_per_day": 0, "commits_per_week": 0,
           "active_days": 0, "consistency_score": 0, "peak_hour": 0, "max_streak": 0,
           "productivity_score": 0, "commit_frequency_score": 0, 
           "pr_efficiency_score": 0, "impact_score": 0,
           "insights": ["Not enough public code activity detected recently."]
        }
        
    timestamps = []
    for c in deep_commits:
        try:
            date_str = c['commit']['author']['date']
            dt = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)
            timestamps.append(dt)
        except: pass
        
    timestamps.sort()
    
    if not timestamps:
        return {
           "total_commits_90d": 0, "commits_per_day": 0, "commits_per_week": 0,
           "active_days": 0, "consistency_score": 0, "peak_hour": 0, "max_streak": 0,
           "productivity_score": 0, "commit_frequency_score": 0, 
           "pr_efficiency_score": 0, "impact_score": 0,
           "insights": ["No recent commit timestamps found."]
        }
        
    min_date = timestamps[0]
    max_date = timestamps[-1]
    total_days = (max_date - min_date).days + 1
    if total_days <= 0: total_days = 1
    
    total_commits = len(timestamps)
    commits_per_day = total_commits / total_days
    commits_per_week = total_commits / (total_days / 7)
    
    active_days_set = set(t.strftime("%Y-%m-%d") for t in timestamps)
    active_days = len(active_days_set)
    consistency_score_raw = (active_days / total_days)
    consistency_score = consistency_score_raw * 100
    
    hours = [0] * 24
    for t in timestamps:
        hours[t.hour] += 1
    peak_hour = hours.index(max(hours)) if max(hours) > 0 else 0
    
    insights = []
    if consistency_score > 30:
        insights.append("User is highly consistent")
    else:
         insights.append("Occasional burst coding sessions")
         
    time_of_day = "morning" if 5 <= peak_hour < 12 else "afternoon" if 12 <= peak_hour < 18 else "late night"
    insights.append(f"Peak coding time is {time_of_day} (~{peak_hour}:00 UTC)")
    
    if commits_per_week > 10:
        insights.append("High engineering throughput")
    
    if commits_per_week > 20: freq_score = 100
    elif commits_per_week > 10: freq_score = 70
    else: freq_score = 40
    
    pr_efficiency_score = 85 
    
    total_stars = sum(repo.get('stargazers_count', 0) for repo in repos)
    total_forks = sum(repo.get('forks_count', 0) for repo in repos)
    raw_impact = (total_stars * 0.1) + (total_forks * 0.2)
    impact_score = min(max(raw_impact * 10, 40) if total_commits > 0 else raw_impact, 100)
    
    productivity_score = (
        (freq_score * 0.25) +
        (min(consistency_score, 100) * 0.25) +
        (pr_efficiency_score * 0.25) +
        (impact_score * 0.25)
    )

    streak = 0
    max_streak = 0
    sorted_days = sorted(list(active_days_set))
    if sorted_days:
        streak = 1
        max_streak = 1
        for i in range(1, len(sorted_days)):
            d1 = datetime.strptime(sorted_days[i-1], "%Y-%m-%d")
            d2 = datetime.strptime(sorted_days[i], "%Y-%m-%d")
            if (d2 - d1).days == 1:
                streak += 1
                max_streak = max(max_streak, streak)
            else:
                streak = 1

    return {
        "total_commits_90d": total_commits,
        "commits_per_day": round(commits_per_day, 2),
        "commits_per_week": round(commits_per_week, 1),
        "active_days": active_days,
        "consistency_score": round(consistency_score, 1),
        "peak_hour": peak_hour,
        "insights": insights,
        
        "productivity_score": round(productivity_score, 1),
        "commit_frequency_score": round(freq_score, 1),
        "pr_efficiency_score": round(pr_efficiency_score, 1),
        "impact_score": round(impact_score, 1),
        "max_streak": max_streak,
    }

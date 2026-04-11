from collections import Counter
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
from datetime import datetime, timedelta

def extract_top_languages(repos):
    """Extract top 3 programming languages from user repositories"""
    languages = []
    for repo in repos:
        if repo.get('language') and repo.get('language') != 'null':
            languages.append(repo['language'])
    
    if not languages:
        return []
    
    language_counts = Counter(languages)
    top_languages = [lang for lang, count in language_counts.most_common(3)]
    
    return top_languages

def extract_technical_interests_ml(repos, user_data=None):
    """Use ML to extract technical interests from repository data and user profile"""
    if not repos:
        return {
            "primary_languages": [],
            "technical_domains": [],
            "project_types": [],
            "frameworks_tech": [],
            "interest_score": 0
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

    # Scoring (Normalized to 100)
    repo_score = min(len(repos) / 30, 1) * 20
    lang_score = min(len(set(languages)) / 8, 1) * 10
    domain_score = min(len(technical_domains) / 4, 1) * 15
    star_score = min(np.mean(repo_stars) / 50, 1) * 15 if repo_stars else 0
    activity_score = min(recent_activity / 15, 1) * 15
    
    # Extra community impact (if user_data provided)
    community_score = 0
    if user_data:
        followers = user_data.get('followers', 0)
        public_repos = user_data.get('public_repos', 0)
        community_score += min(followers / 200, 1) * 15
        community_score += min(public_repos / 50, 1) * 10

    interest_score = repo_score + lang_score + domain_score + star_score + activity_score + community_score
    interest_score = round(min(interest_score, 100), 2)

    return {
        "primary_languages": primary_languages,
        "technical_domains": technical_domains,
        "project_types": project_types,
        "frameworks_tech": frameworks_tech,
        "interest_score": interest_score
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

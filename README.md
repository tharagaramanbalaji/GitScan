# ⚡ GitInsight Pro: Deep Developer Forensics

**GitInsight Pro** is a high-performance, full-stack application designed to extract deep technical DNA from any GitHub profile. Using a combination of the GitHub REST & Search APIs and Machine Learning analysis, it provides professional-grade insights into a developer's true technical proficiency.

![Aesthetic Dashboard UI](https://img.shields.io/badge/UI-Aesthetic-blueviolet) ![ML Analysis](https://img.shields.io/badge/ML-Forensics-blue) ![FastAPI](https://img.shields.io/badge/Backend-FastAPI-success) ![React](https://img.shields.io/badge/Frontend-React-61dafb)

## ✨ Pro Features

### 🔍 Deep Extraction
- **Lifelong Stats**: Total pull requests and issues created across all public repositories.
- **Organization Intel**: Automatic detection of professional affiliations and organizations.
- **Recency Focus**: Live activity tracking with "Recently Pushed" repository spotlight.
- **Social Connectivity**: Extraction of Twitter, personal websites, and location data.

### 🤖 ML-Powered Forensics
- **Technical DNA Radar**: Visualizes proficiency across 7 core domains: AI/ML, Web, Mobile, DevOps, Security, Game Dev, and IoT.
- **Precision Tech Stack**: Intelligent framework detection (e.g., Next.js, FastAPI, PyTorch) based on repository metadata and topics.
- **Expertise Validation**: Cross-references "Bio" claims with actual repository evidence to calculate a consistency score.
- **Stealth Skill Detection**: Identifies skills used in code that are missing from the profile bio.

### 🎨 Modern Dashboard
- **Glassmorphism UI**: A stunning, premium interface with high-contrast slate aesthetics.
- **Target Scanner**: An immersive loading experience with a synchronized scanner animation.
- **Optimization Roadmap**: Actionable AI-driven tips to improve the profile's professional impact.

## 🚀 Quick Start

### 1. Backend Setup (FastAPI)
1. Navigate to the `backend` directory.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. (Optional but Recommended) Create a `.env` file for higher rate limits:
   ```text
   GITHUB_TOKEN=your_personal_access_token_here
   ```
4. Start the server:
   ```bash
   python main.py
   ```

### 2. Frontend Setup (React + Vite)
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

## 🛠️ Technology Stack
- **Backend**: Python, FastAPI, Uvicorn, Scikit-learn (ML), Pandas
- **Frontend**: React, Vite, Framer Motion (Animations), Chart.js (Radar Charts), Lucide-React (Icons)
- **Data Acquisition**: GitHub REST API v3, GitHub Search API

## 📝 License
This project is open-source and available under the MIT License.

---
**Built with ❤️ for the Developer Community.**

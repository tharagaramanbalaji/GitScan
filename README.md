# GitScan - Advanced Developer Forensics

GitScan is a high-performance full-stack application designed to extract deep technical DNA from any GitHub profile. Using ML-powered analysis, it generates detailed technical profiles and professional dashboard images for developers.

![GitScan Dashboard Demo](https://raw.githubusercontent.com/tharagaramanbalaji/github-extract/main/frontend/public/demo.png)

## 🚀 Key Features

- **Deep DNA Extraction**: ML-powered analysis of repository data, coding patterns, and technical domains.
- **Expertise Validation**: Cross-verifies claims in user biographies against actual repository contents and commitment history.
- **Productivity Scoring**: Calculates high-fidelity metrics for commit frequency, PR efficiency, and code impact.
- **Premium Visualization**: Interactive 3D globe visualization and sleek, dark-mode dashboard aesthetics.
- **High-Res Export**: Modular image export system using `html-to-image` for pixel-perfect developer cards.

## 🛠️ Tech Stack

- **Backend**: Python, FastAPI, Scikit-learn, TextBlob
- **Frontend**: React 19, Vite, Framer Motion, Three.js (React Three Fiber)
- **Styling**: TailwindCSS & Vanilla CSS
- **Visualization**: Three-Globe, Chart.js

## 📦 Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.10+)
- GitHub Personal Access Token (for extended rate limits)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/tharagaramanbalaji/github-extract.git
   cd github-extract
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   GITHUB_TOKEN=your_github_token_here
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   ```

### Running Locally

1. **Start Backend**:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

## 🚢 Deployment

GitScan is ready for deployment as a multi-tier application:

- **Frontend**: Deploy the `frontend` folder to Vercel or Netlify.
- **Backend**: Deploy the `backend` folder to Render, Railway, or any Python-compatible cloud host.
- **Config**: Ensure the frontend's `API_BASE_URL` in `App.jsx` matches your deployed backend URL.

## 📄 License

Built by [tharagaramanbalaji](https://github.com/tharagaramanbalaji). Distributed under the MIT License.

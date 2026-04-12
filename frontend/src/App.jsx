import React, { useState } from 'react';
import axios from 'axios';
import { 
  Loader2, Search, AlertCircle, CheckCircle2, TrendingUp, Code2, 
  Rocket, Zap, ChevronDown, ChevronUp, Star, GitMerge, MessageSquare, 
  Globe, Building2, Users, Layers, ExternalLink, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { PolarArea } from 'react-chartjs-2';
import ProductivityScore from './components/ProductivityScore';
import TechDNA from './components/TechDNA';
import ExportPanel from './components/ExportPanel';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend
);

const GithubLogo = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const TwitterLogo = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const TECH_MAP = {
  javascript: { class: 'devicon-javascript-plain', color: '#facc15', category: 'Language' },
  python: { class: 'devicon-python-plain', color: '#38bdf8', category: 'Language' },
  java: { class: 'devicon-java-plain', color: '#f87171', category: 'Language' },
  typescript: { class: 'devicon-typescript-plain', color: '#60a5fa', category: 'Language' },
  c: { class: 'devicon-c-plain', color: '#9ca3af', category: 'Language' },
  'c++': { class: 'devicon-cplusplus-plain', color: '#60a5fa', category: 'Language' },
  csharp: { class: 'devicon-csharp-plain', color: '#10b981', category: 'Language' },
  go: { class: 'devicon-go-plain', color: '#06b6d4', category: 'Language' },
  rust: { class: 'devicon-rust-plain', color: '#f97316', category: 'Language' },
  ruby: { class: 'devicon-ruby-plain', color: '#ef4444', category: 'Language' },
  php: { class: 'devicon-php-plain', color: '#818cf8', category: 'Language' },
  swift: { class: 'devicon-swift-plain', color: '#fb923c', category: 'Language' },
  react: { class: 'devicon-react-original', color: '#38bdf8', category: 'Framework' },
  vue: { class: 'devicon-vuejs-plain', color: '#4ade80', category: 'Framework' },
  angular: { class: 'devicon-angularjs-plain', color: '#ef4444', category: 'Framework' },
  'node.js': { class: 'devicon-nodejs-plain', color: '#4ade80', category: 'Framework' },
  express: { class: 'devicon-express-original', color: '#9ca3af', category: 'Framework' },
  django: { class: 'devicon-django-plain', color: '#10b981', category: 'Framework' },
  flask: { class: 'devicon-flask-original', color: '#cbd5e1', category: 'Framework' },
  spring: { class: 'devicon-spring-plain', color: '#4ade80', category: 'Framework' },
  laravel: { class: 'devicon-laravel-plain', color: '#ef4444', category: 'Framework' },
  docker: { class: 'devicon-docker-plain', color: '#38bdf8', category: 'DevOps' },
  kubernetes: { class: 'devicon-kubernetes-plain', color: '#60a5fa', category: 'DevOps' },
  aws: { class: 'devicon-amazonwebservices-original', color: '#f59e0b', category: 'DevOps' },
  azure: { class: 'devicon-azure-plain', color: '#38bdf8', category: 'DevOps' },
  linux: { class: 'devicon-linux-plain', color: '#fbbf24', category: 'DevOps' },
  mysql: { class: 'devicon-mysql-plain', color: '#f59e0b', category: 'Database' },
  postgresql: { class: 'devicon-postgresql-plain', color: '#60a5fa', category: 'Database' },
  mongodb: { class: 'devicon-mongodb-plain', color: '#4ade80', category: 'Database' },
  redis: { class: 'devicon-redis-plain', color: '#ef4444', category: 'Database' },
  html: { class: 'devicon-html5-plain', color: '#f97316', category: 'Language' },
  css: { class: 'devicon-css3-plain', color: '#38bdf8', category: 'Language' },
};

const getTechDetails = (techName) => {
  const normalized = techName.toLowerCase().replace(/\s+/g, '');
  
  // Exact match
  if (TECH_MAP[normalized]) return { ...TECH_MAP[normalized], name: techName };
  if (TECH_MAP[techName.toLowerCase()]) return { ...TECH_MAP[techName.toLowerCase()], name: techName };
  
  // Stricter partial matches to avoid 'c' matching 'chat'
  for (const [key, val] of Object.entries(TECH_MAP)) {
    if (key.length >= 3 && normalized.includes(key)) {
      return { ...val, name: techName };
    }
  }
  
  return { class: 'devicon-github-original', color: '#cbd5e1', category: 'Other', name: techName };
};

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [usernames, setUsernames] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [errors, setErrors] = useState([]);
  const [rateLimit, setRateLimit] = useState(null);

  const handleAnalyze = async () => {
    if (!usernames.trim()) return;
    setLoading(true);
    setErrors([]);
    try {
      const response = await axios.post(`${API_BASE_URL}/analyze`, { usernames });
      setResults(response.data.results);
      setErrors(response.data.errors);
      const rlResponse = await axios.get(`${API_BASE_URL}/rate-limit`);
      setRateLimit(rlResponse.data);
    } catch (err) {
      console.error(err);
      setErrors(['Failed to connect to backend server. Make sure the FastAPI server is running.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '5rem' }}>
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="scanner-overlay"
          >
            <div className="scanner-box">
              <div className="scanner-line"></div>
            </div>
            <div className="scanner-text">Scanning Target Presence...</div>
          </motion.div>
        )}
      </AnimatePresence>

      <header style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '1.5rem', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <GithubLogo size={42} color="#38bdf8" />
            </div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.04em', background: 'linear-gradient(to right, #38bdf8, #818cf8, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              GitInsight Pro
            </h1>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto', fontWeight: 500, lineHeight: 1.6 }}>
            Advanced ML-powered developer forensics. Extract deep technical DNA from any GitHub profile in seconds.
          </p>
        </motion.div>
      </header>

      <main>
        <div className="glass" style={{ padding: '2.5rem', marginBottom: '4rem', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.2rem', color: '#cbd5e1' }}>
              <Search size={22} className="text-primary" /> Investigator Console
            </h3>
            <textarea
              placeholder="Inject GitHub usernames, Profile URLs, or comma-separated lists..."
              value={usernames}
              onChange={(e) => setUsernames(e.target.value)}
              rows={3}
              style={{ marginBottom: '1.5rem', fontSize: '1.1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Zap size={14} /> 
                {rateLimit ? `API Credits Remaining: ${rateLimit.remaining}` : 'Ready for extraction'}
              </div>
              <button 
                onClick={handleAnalyze} 
                disabled={loading || !usernames.trim()}
                style={{ fontSize: '1.1rem', padding: '0.8rem 2.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Begin Analysis'}
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          <AnimatePresence>
            {results.map((result, index) => (
              <ProfileDashboard key={result.user.login} result={result} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {errors.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass" style={{ padding: '1.5rem', marginTop: '2rem', borderColor: '#ef4444', background: 'rgba(239, 68, 68, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#f87171' }}>
              <AlertCircle size={22} />
              <span style={{ fontWeight: 600 }}>Inaccessible Targets: {errors.join(', ')}</span>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

function ProfileDashboard({ result, index }) {
  const [hoveredTech, setHoveredTech] = useState(null);
  const [exportConfig, setExportConfig] = useState({
    header: true,
    stats: true,
    affiliations: true,
    activity: true,
    pinned: true,
    dnaMetrics: true,
    dnaChart: true,
    productivity: true
  });
  
  const { user, ml_technical_analysis, domain_consistency, stats, organizations, top_repos, pinned_repos, top_technical_preferences, productivity_metrics } = result;

  // Process exact repo languages to build tech stack
  let techDict = top_technical_preferences || {};
  if (Array.isArray(top_technical_preferences)) {
     // Safeguard for old cached JSONs
     techDict = top_technical_preferences.reduce((a, v) => ({ ...a, [v]: 5 }), {});
  }
  const techEntries = Object.entries(techDict).sort((a, b) => b[1] - a[1]);
  const maxRepoCount = techEntries.length > 0 ? techEntries[0][1] : 1;

  // Only take Top Languages and don't categorize
  const topTechs = techEntries.slice(0, 5).map(([tech, count]) => {
    const details = getTechDetails(tech);
    const proficiency = Math.max(10, Math.round((count / maxRepoCount) * 100));
    return { ...details, proficiency, repoCount: count, _actualName: tech };
  });

  const baseColors = [
    'rgba(56, 189, 248, 0.75)',  // Sky blue
    'rgba(167, 139, 250, 0.75)', // Purple
    'rgba(244, 114, 182, 0.75)', // Pink
    'rgba(52, 211, 153, 0.75)',  // Emerald
    'rgba(251, 191, 36, 0.75)',  // Amber
    'rgba(248, 113, 113, 0.75)', // Red
    'rgba(129, 140, 248, 0.75)', // Indigo
  ];

  const polarData = {
    labels: Object.keys(domain_consistency.consistency_scores),
    datasets: [
      {
        label: 'Proficiency Score',
        data: Object.values(domain_consistency.consistency_scores),
        backgroundColor: baseColors.slice(0, Object.keys(domain_consistency.consistency_scores).length),
        borderColor: 'rgba(15, 23, 42, 0.8)',
        borderWidth: 2,
        hoverBorderColor: '#ffffff',
      },
    ],
  };

  const polarOptions = {
    maintainAspectRatio: false,
    layout: { padding: 10 },
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.05)', lineWidth: 1 },
        grid: { color: 'rgba(255, 255, 255, 0.05)', circular: true },
        ticks: { display: false, maxTicksLimit: 5 },
        min: -20,
      }
    },
    plugins: { 
      legend: { 
        display: true,
        position: 'right',
        labels: {
          color: '#cbd5e1',
          font: { size: 12, weight: '600' },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#fff',
        bodyColor: '#38bdf8',
        bodyFont: { weight: 'bold', size: 14 },
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => ` Score: ${context.raw}%`
        }
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
    >
      <div 
        id={`dashboard-export-${index}`}
        className="glass"
        style={{ padding: '0', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', transition: 'background-color 0.2s', backgroundColor: 'var(--background)' }}
      >
      {/* Dashboard Header */}
      {exportConfig.header && (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderBottom: '1px solid var(--card-border)' }}>
          <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', alignItems: 'start' }}>
            <motion.img 
              initial={{ scale: 0.8 }} animate={{ scale: 1 }}
              src={user.avatar_url} 
              style={{ width: '120px', height: '120px', borderRadius: '1.5rem', border: '3px solid var(--primary)', boxShadow: '0 10px 30px rgba(56, 189, 248, 0.2)' }}
            />
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '2.25rem', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>{user.name || user.login}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <a href={user.html_url} target="_blank" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      @{user.login} <ExternalLink size={14} />
                    </a>
                    {user.location && <span style={{ color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Globe size={14} /> {user.location}</span>}
                    {user.company && <span style={{ color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Building2 size={14} /> {user.company}</span>}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>{ml_technical_analysis.interest_score}</span>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.25rem' }}>Interest Score</div>
                </div>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '800px' }}>
                {user.bio || 'This investigator maintains a low profile with no biography.'}
              </p>
              
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem' }}>
                {user.twitter_username && <a href={`https://twitter.com/${user.twitter_username}`} style={{ color: '#64748b' }}><TwitterLogo size={20} /></a>}
                {user.blog && <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} style={{ color: '#64748b' }}><Globe size={20} /></a>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {exportConfig.stats && (
          <div className="stats-grid">
            <div className="stat-item">
              <Layers className="text-primary" size={20} style={{ marginBottom: '0.5rem' }} />
              <span className="stat-value">{user.public_repos}</span>
              <span className="stat-label">Public Repos</span>
            </div>
            <div className="stat-item">
              <GitMerge style={{ color: '#4ade80', marginBottom: '0.5rem' }} size={20} />
              <span className="stat-value">{stats?.total_prs || 0}</span>
              <span className="stat-label">Pull Requests</span>
            </div>
            <div className="stat-item">
              <MessageSquare style={{ color: '#f472b6', marginBottom: '0.5rem' }} size={20} />
              <span className="stat-value">{stats?.total_issues || 0}</span>
              <span className="stat-label">Issues</span>
            </div>
            <div className="stat-item">
              <Users style={{ color: '#818cf8', marginBottom: '0.5rem' }} size={20} />
              <span className="stat-value">{user.followers}</span>
              <span className="stat-label">Followers</span>
            </div>
          </div>
        )}

        <TechDNA 
          topTechs={topTechs} 
          polarData={polarData} 
          polarOptions={polarOptions} 
          organizations={organizations} 
          top_repos={top_repos} 
          pinned_repos={pinned_repos}
          config={exportConfig} 
        />
        
        {exportConfig.productivity && <ProductivityScore metrics={productivity_metrics} stats={stats} />}
      </div>
      </div>
      {/* End Dashboard Export Capture Area */}

      <ExportPanel 
        dashboardId={`dashboard-export-${index}`} 
        exportConfig={exportConfig} 
        setExportConfig={setExportConfig} 
      />
    </motion.div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Loader2, Search, AlertCircle, CheckCircle2, TrendingUp, Code2,
  Rocket, Zap, ChevronDown, ChevronUp, Star, GitMerge, MessageSquare,
  Globe, Building2, Users, Layers, ExternalLink, Activity, Copy
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
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import ProductivityScore from './components/ProductivityScore';
import TechDNA from './components/TechDNA';
import ExportPanel from './components/ExportPanel';
import { World } from './components/ui/globe';

const globeConfig = {
  pointSize: 4,
  globeColor: "#062056",
  showAtmosphere: true,
  atmosphereColor: "#FFFFFF",
  atmosphereAltitude: 0.1,
  emissive: "#062056",
  emissiveIntensity: 0.1,
  shininess: 0.9,
  polygonColor: "rgba(255,255,255,0.7)",
  ambientLight: "#38bdf8",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#ffffff",
  arcTime: 1000,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  initialPosition: { lat: 22.3193, lng: 114.1694 },
  autoRotate: true,
  autoRotateSpeed: 0.5,
};

const arcsData = [
  { order: 1, startLat: -19.885592, startLng: -43.951191, endLat: -22.9068, endLng: -43.1729, arcAlt: 0.1, color: "#38bdf8" },
  { order: 2, startLat: 28.6139, startLng: 77.209, endLat: 3.139, endLng: 101.6869, arcAlt: 0.2, color: "#818cf8" },
  { order: 3, startLat: -19.885592, startLng: -43.951191, endLat: -1.303396, endLng: 36.852443, arcAlt: 0.3, color: "#f472b6" },
  { order: 4, startLat: 51.5072, startLng: -0.1276, endLat: 3.139, endLng: 101.6869, arcAlt: 0.3, color: "#38bdf8" },
  { order: 5, startLat: 40.7128, startLng: -74.006, endLat: 51.5072, endLng: -0.1276, arcAlt: 0.3, color: "#818cf8" }
];

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
  if (TECH_MAP[normalized]) return { ...TECH_MAP[normalized], name: techName };
  if (TECH_MAP[techName.toLowerCase()]) return { ...TECH_MAP[techName.toLowerCase()], name: techName };
  for (const [key, val] of Object.entries(TECH_MAP)) {
    if (key.length >= 3 && normalized.includes(key)) {
      return { ...val, name: techName };
    }
  }
  return { class: 'devicon-github-original', color: '#cbd5e1', category: 'Other', name: techName };
};

const API_BASE_URL = 'https://gitscan.onrender.com';

function Layout({ children }) {
  return (
    <div className="container min-h-screen flex flex-col" style={{ paddingBottom: '2rem' }}>
      <nav className="flex justify-between items-center py-6 mb-4 border-b border-gray-800">
        <Link to="/" className="flex items-center gap-3 no-underline group">
          <GithubLogo size={28} color="#38bdf8" />
          <span className="text-2xl font-bold text-white group-hover:text-primary transition-colors">GitScan</span>
        </Link>
        <div className="flex gap-10 items-center text-sm font-semibold text-gray-400">
          <button
            onClick={() => alert('Documentation is coming soon!')}
            className="hover:text-white transition-colors bg-transparent border-none p-0 font-semibold cursor-pointer"
          >
            Docs (Coming Soon)
          </button>
          <a href="https://github.com/tharagaramanbalaji/GitScan" target="_blank" className="hover:text-white transition-colors no-underline">Source</a>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <a href="https://github.com/tharagaramanbalaji/GitScan" target="_blank" className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all no-underline text-white font-medium flex items-center gap-2">
            Github <ExternalLink size={14} />
          </a>
        </div>
      </nav>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="mt-24 pt-8 border-t border-gray-800 flex flex-col items-center gap-2 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} GitScan. built by tharagaramanbalaji</p>
      </footer>
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <header className="flex flex-col lg:flex-row gap-12 items-center justify-center min-h-[70vh] mb-8 mt-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col gap-6 lg:w-1/2"
        >
          <h1 className="text-6xl lg:text-8xl font-extrabold leading-[1.1] tracking-tighter text-white">
            One scan<br />
            Total developer breakdown.
          </h1>
          <p className="hero-description text-gray-400 text-lg lg:text-2xl leading-relaxed max-w-[500px]">
            Visualize skills, patterns, and performance instantly.<br /> Create your custom developer card instantly.
          </p>
          <div className="mt-4">
            <button
              onClick={() => navigate('/scan')}
              className="premium-btn shadow-2xl"
            >
              <Copy className="w-5 h-5 opacity-70" />
              Scan Your Profile
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative h-[450px] w-full lg:w-1/2 flex justify-center items-center overflow-hidden"
        >
          <div className="absolute inset-0 z-0 scale-125">
            <World globeConfig={globeConfig} data={arcsData} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0b0f1a] z-10 pointer-events-none"></div>
        </motion.div>
      </header>
    </motion.div>
  );
}

function ScanPage() {
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
    <motion.div
      className="py-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
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

      <div className="glass !p-8 !mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', color: 'white' }}>
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
              className="premium-btn"
              style={{ padding: '0.8rem 2.5rem', fontFamily: "'Inter Tight', sans-serif" }}
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
    </motion.div>
  );
}

function AppContent() {
  const location = useLocation();
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/scan" element={<ScanPage />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
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

  let techDict = top_technical_preferences || {};
  if (Array.isArray(top_technical_preferences)) {
    techDict = top_technical_preferences.reduce((a, v) => ({ ...a, [v]: 5 }), {});
  }
  const techEntries = Object.entries(techDict).sort((a, b) => b[1] - a[1]);
  const maxRepoCount = techEntries.length > 0 ? techEntries[0][1] : 1;

  const topTechs = techEntries.slice(0, 5).map(([tech, count]) => {
    const details = getTechDetails(tech);
    const proficiency = Math.max(10, Math.round((count / maxRepoCount) * 100));
    return { ...details, proficiency, repoCount: count, _actualName: tech };
  });

  const baseColors = [
    'rgba(56, 189, 248, 0.75)',
    'rgba(167, 139, 250, 0.75)',
    'rgba(244, 114, 182, 0.75)',
    'rgba(52, 211, 153, 0.75)',
    'rgba(251, 191, 36, 0.75)',
    'rgba(248, 113, 113, 0.75)',
    'rgba(129, 140, 248, 0.75)',
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
          font: { family: "'Inter Tight', sans-serif", size: 12, weight: '600' },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#fff',
        titleFont: { family: "'Inter Tight', sans-serif", weight: 'bold' },
        bodyColor: '#38bdf8',
        bodyFont: { family: "'Inter Tight', sans-serif", weight: 'bold', size: 14 },
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
        style={{ padding: '0', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', transition: 'background-color 0.2s', display: 'flex', flexDirection: 'column' }}
      >
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
                    <h2 style={{ fontSize: '2.25rem', marginBottom: '0.25rem', letterSpacing: '-0.02em', color: 'white' }}>{user.name || user.login}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <a href={user.html_url} target="_blank" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem', lineHeight: 1 }}>
                        <span style={{ display: 'inline-block' }}>@{user.login}</span>
                        <ExternalLink size={14} style={{ display: 'inline-block', flexShrink: 0 }} />
                      </a>
                      {user.location && (
                        <span style={{ color: '#64748b', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', lineHeight: 1 }}>
                          <Globe size={14} style={{ display: 'inline-block', flexShrink: 0 }} />
                          <span style={{ display: 'inline-block' }}>{user.location}</span>
                        </span>
                      )}
                      {user.company && (
                        <span style={{ color: '#64748b', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', lineHeight: 1 }}>
                          <Building2 size={14} style={{ display: 'inline-block', flexShrink: 0 }} />
                          <span style={{ display: 'inline-block' }}>{user.company}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'end' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                      <span style={{ fontSize: '3.75rem', fontWeight: 800, color: 'white', lineHeight: 1, fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.05em' }}>{ml_technical_analysis.interest_score}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '0.25rem', fontFamily: "'Inter Tight', sans-serif", fontWeight: 800 }}>Interest Score</div>
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

        <div style={{ padding: exportConfig.stats || exportConfig.dnaMetrics || exportConfig.dnaChart || exportConfig.productivity ? '2.5rem' : '0', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
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

          {exportConfig.productivity && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '3rem' }}>
              <ProductivityScore metrics={productivity_metrics} stats={stats} />
            </div>
          )}
        </div>
      </div>

      <ExportPanel
        dashboardId={`dashboard-export-${index}`}
        exportConfig={exportConfig}
        setExportConfig={setExportConfig}
        user={user}
      />
    </motion.div>
  );
}

export default App;

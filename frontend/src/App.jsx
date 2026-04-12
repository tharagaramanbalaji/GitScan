import React, { useState } from 'react';
import axios from 'axios';
import { 
  Loader2, Search, AlertCircle, CheckCircle2, TrendingUp, Code2, 
  Rocket, Zap, ChevronDown, ChevronUp, Star, GitMerge, MessageSquare, 
  Globe, Building2, Users, Layers, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
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
  const [expanded, setExpanded] = useState(false);
  const { user, ml_technical_analysis, domain_consistency, stats, organizations, top_repos } = result;

  const radarData = {
    labels: Object.keys(domain_consistency.consistency_scores),
    datasets: [
      {
        label: 'Proficiency',
        data: Object.values(domain_consistency.consistency_scores),
        backgroundColor: 'rgba(56, 189, 248, 0.25)',
        borderColor: '#38bdf8',
        borderWidth: 2,
        pointBackgroundColor: '#38bdf8',
        pointBorderColor: '#fff',
        pointHoverRadius: 5,
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.08)' },
        grid: { color: 'rgba(255, 255, 255, 0.08)' },
        pointLabels: { color: '#94a3b8', font: { size: 10, weight: 600 } },
        ticks: { display: false },
        suggestedMin: 0,
        suggestedMax: 100
      }
    },
    plugins: { legend: { display: false } }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className="glass"
      style={{ padding: '0', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      {/* Dashboard Header */}
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
            
            {/* Social Links */}
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem' }}>
              {user.twitter_username && <a href={`https://twitter.com/${user.twitter_username}`} style={{ color: '#64748b' }}><TwitterLogo size={20} /></a>}
              {user.blog && <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} style={{ color: '#64748b' }}><Globe size={20} /></a>}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Quickbar */}
      <div style={{ padding: '2rem 2.5rem' }}>
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '3rem', flexWrap: 'wrap' }}>
          <div>
            {/* Frameworks & Tech Stack */}
            <h4 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
              <Rocket size={18} className="text-secondary" /> Primary Tech Stack
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2.5rem' }}>
              {(ml_technical_analysis.frameworks_tech || []).map(tech => (
                <span key={tech} className="glass" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {tech}
                </span>
              ))}
            </div>

            {/* Organizations */}
            {(organizations || []).length > 0 && (
              <div style={{ marginBottom: '2.5rem' }}>
                <h4 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                  <Building2 size={18} className="text-primary" /> Affiliations
                </h4>
                <div className="org-list">
                  {(organizations || []).map(org => (
                    <div key={org.login} className="org-badge">
                      <img src={org.avatar_url} alt={org.login} className="org-logo" />
                      <span>{org.login}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activity Repos */}
            {(top_repos || []).length > 0 && (
              <>
                <h4 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                  <Zap size={18} style={{ color: '#38bdf8' }} /> Recent Activity
                </h4>
                <div className="repo-grid">
                  {(top_repos || []).map(repo => (
                    <div key={repo.name} className="repo-card">
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <h5 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>{repo.name}</h5>
                        </div>
                        <p className="repo-description">
                          {repo.description || 'No description provided.'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em' }}>{repo.language || 'Code'}</span>
                        <a href={repo.html_url} target="_blank" style={{ color: '#64748b', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#38bdf8'} onMouseOut={e => e.currentTarget.style.color = '#64748b'}>
                          <ExternalLink size={18} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            <h4 style={{ marginBottom: '1.5rem', color: '#94a3b8', fontSize: '1rem' }}>Technical DNA</h4>
            <div style={{ width: '100%', height: '300px', display: 'flex', justifyContent: 'center' }}>
              <Radar data={radarData} options={radarOptions} />
            </div>
            
            <button 
              onClick={() => setExpanded(!expanded)}
              style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid var(--card-border)', width: '100%', marginTop: '2rem', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              Insights {expanded ? 'Summary' : 'Report'}
            </button>
          </div>
        </div>

        {/* Detailed Insights Toggleable */}
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2.5rem' }}>
                <div>
                  <h4 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Zap size={20} color="#f472b6" /> Forensic Insights
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {domain_consistency.claimed_domains.map(domain => (
                      <div key={domain} className="glass" style={{ padding: '1rem', background: 'rgba(74, 222, 128, 0.05)', borderColor: 'rgba(74, 222, 128, 0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <CheckCircle2 size={18} color="#4ade80" />
                          <span style={{ fontSize: '0.95rem' }}>Claimed <strong>{domain}</strong> expertise: <span style={{ color: '#4ade80' }}>{domain_consistency.consistency_scores[domain]}% Evidence Found</span></span>
                        </div>
                      </div>
                    ))}
                    {domain_consistency.verified_domains.filter(d => !domain_consistency.claimed_domains.includes(d)).map(domain => (
                      <div key={domain} className="glass" style={{ padding: '1rem', background: 'rgba(56, 189, 248, 0.05)', borderColor: 'rgba(56, 189, 248, 0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <Rocket size={18} color="#38bdf8" />
                          <span style={{ fontSize: '0.95rem' }}>Stealth <strong>{domain}</strong> skills detected: <span style={{ color: '#38bdf8' }}>{domain_consistency.consistency_scores[domain]}% Confidence</span></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TrendingUp size={20} color="#fbbf24" /> Optimization Roadmap
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {domain_consistency.suggestions.length > 0 ? (
                      domain_consistency.suggestions.map((s, i) => (
                        <div key={i} className="glass" style={{ padding: '1rem', fontSize: '0.9rem', color: '#cbd5e1', background: 'rgba(251, 191, 36, 0.05)', borderColor: 'rgba(251, 191, 36, 0.1)' }}>
                          • {s}
                        </div>
                      ))
                    ) : (
                      <div style={{ color: '#64748b', fontStyle: 'italic' }}>Profile is highly optimized. No critical improvements recommended.</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default App;

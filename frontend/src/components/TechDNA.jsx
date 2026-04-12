import React, { useState } from 'react';
import { PolarArea } from 'react-chartjs-2';
import { Rocket, Building2, Zap, ExternalLink, Pin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TechDNA({ topTechs, polarData, polarOptions, organizations, top_repos, pinned_repos, config }) {
  const [hoveredTech, setHoveredTech] = useState(null);

  // Determine if left column is completely empty to hide it entirely
  const hasLeftColumnContent = config.dnaMetrics || config.affiliations || config.activity || config.pinned;
  
  // Decide the grid depending on which columns are active
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: (hasLeftColumnContent && config.dnaChart) ? '1fr 450px' : '1fr',
    gap: '3rem',
    alignItems: 'center'
  };

  if (!hasLeftColumnContent && !config.dnaChart) return null;

  return (
    <div style={gridStyle}>
      {hasLeftColumnContent && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {config.dnaMetrics && (
            <div>
              <h4 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                <Rocket size={18} className="text-secondary" /> Developer DNA Profile
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', fontWeight: 600 }}>
                    Top 3 Languages
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {topTechs.slice(0, 3).map(tech => (
                      <div 
                        key={tech._actualName} 
                        className="glass tech-pill" 
                        onMouseEnter={() => setHoveredTech(tech._actualName)}
                        onMouseLeave={() => setHoveredTech(null)}
                        style={{ 
                          padding: '0.5rem 0.75rem', 
                          fontSize: '0.9rem', 
                          fontWeight: 600, 
                          color: 'var(--text-primary)', 
                          border: `1px solid ${tech.color}40`,
                          boxShadow: `0 0 10px ${tech.color}15`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          background: hoveredTech === tech._actualName ? `${tech.color}15` : 'rgba(255,255,255,0.02)',
                          position: 'relative',
                          overflow: 'hidden',
                          transition: 'all 0.3s ease',
                          cursor: 'default'
                        }}
                      >
                        <div style={{ position: 'absolute', bottom: 0, left: 0, height: '3px', background: tech.color, width: `${tech.proficiency}%`, opacity: 0.8, transition: 'width 1s ease-out' }}></div>
                        <i className={tech.class} style={{ fontSize: '1.2rem', color: tech.color }}></i>
                        {tech.name === "0" || tech.name === "1" || tech.name === "2" ? tech._actualName : tech.name}
                        
                        <AnimatePresence>
                          {hoveredTech === tech._actualName && (
                            <motion.div 
                              initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                              style={{
                                position: 'absolute',
                                bottom: 'calc(100% + 5px)',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: '#0f172a',
                                border: '1px solid #334155',
                                padding: '0.5rem',
                                borderRadius: '0.5rem',
                                fontSize: '0.75rem',
                                color: '#e2e8f0',
                                whiteSpace: 'nowrap',
                                zIndex: 10,
                                boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
                              }}
                            >
                              Found in <strong style={{ color: tech.color }}>{tech.repoCount}</strong> repos
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
                
                {topTechs.length === 0 && (
                  <div style={{ color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic' }}>No prominent tech stack detected.</div>
                )}
              </div>
            </div>
          )}

          {/* Organizations */}
          {config.affiliations && (organizations || []).length > 0 && (
            <div>
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

          {/* Pinned Repos */}
          {config.pinned && (
            <div>
              <h4 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                <Pin size={18} style={{ color: '#fbbf24' }} /> Pinned Repositories
              </h4>
              
              {(!pinned_repos || pinned_repos.length === 0) ? (
                <div style={{ color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic' }}>No pinned repos.</div>
              ) : (
                <div className="repo-grid">
                  {pinned_repos.map(repo => (
                    <div key={repo.name} className="repo-card border-amber" style={{ border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <h5 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>{repo.name}</h5>
                        </div>
                        <p className="repo-description">
                          {repo.description || 'No description provided.'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fbbf24', letterSpacing: '0.05em' }}>{repo.language || 'Code'}</span>
                        <a href={repo.html_url} target="_blank" rel="noreferrer" style={{ color: '#64748b', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fbbf24'} onMouseOut={e => e.currentTarget.style.color = '#64748b'}>
                          <ExternalLink size={18} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recent Activity Repos */}
          {config.activity && (top_repos || []).length > 0 && (
            <div>
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
                      <a href={repo.html_url} target="_blank" rel="noreferrer" style={{ color: '#64748b', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#38bdf8'} onMouseOut={e => e.currentTarget.style.color = '#64748b'}>
                        <ExternalLink size={18} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {config.dnaChart && (
        <div style={{ textAlign: 'center', margin: 'auto', width: '100%' }}>
          <h4 style={{ marginBottom: '1.5rem', color: '#94a3b8', fontSize: '1rem' }}>Technical DNA</h4>
          <div style={{ width: '100%', height: '380px', display: 'flex', justifyContent: 'center' }}>
            <PolarArea data={polarData} options={polarOptions} />
          </div>
        </div>
      )}
    </div>
  );
}

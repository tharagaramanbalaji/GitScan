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
    gridTemplateColumns: (hasLeftColumnContent && config.dnaChart) ? '1fr 400px' : '1fr',
    gap: '3rem',
    alignItems: 'start'
  };

  if (!hasLeftColumnContent && !config.dnaChart) return null;

  const bothSelected = config.pinned && config.activity && (pinned_repos || []).length > 0 && (top_repos || []).length > 0;
  
  const RepoSection = ({ title, repos, icon: Icon, color }) => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.2rem', color: 'white', fontWeight: 700 }}>
        <Icon size={20} style={{ color }} /> {title}
      </h4>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: bothSelected ? '1fr' : 'repeat(2, 1fr)', 
        gap: '1.25rem',
        alignItems: 'stretch'
      }}>
        {repos.map(repo => (
          <div 
            key={repo.name} 
            className="premium-card"
            style={{ 
              background: '#111', 
              border: `1px solid ${color}15`, 
              padding: '1.25rem', 
              borderRadius: '1rem', 
              display: 'flex', 
              flexDirection: 'column',
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.05)',
              minHeight: '140px'
            }}
          >
            <h5 style={{ fontSize: '1.05rem', margin: '0 0 0.75rem 0', fontWeight: 700, color: 'white', letterSpacing: '-0.01em' }}>{repo.name}</h5>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 1.5rem 0', lineHeight: 1.6 }}>
              {repo.description || 'No description provided.'}
            </p>
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{repo.language || 'Code'}</span>
              <ExternalLink size={14} color="#475569" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={gridStyle}>
      {hasLeftColumnContent && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
          
          {config.dnaMetrics && (
            <div>
              <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.2rem', color: 'white', fontWeight: 700 }}>
                <Rocket size={20} className="text-secondary" /> Developer DNA Profile
              </h4>
              <div style={{ background: '#111', padding: '1.75rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.05)' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.5rem', fontWeight: 800 }}>
                  Technical Core
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {topTechs.slice(0, 3).map(tech => (
                    <div 
                      key={tech._actualName} 
                      style={{ 
                        padding: '0.6rem 1.25rem', 
                        fontSize: '0.9rem', 
                        fontWeight: 700, 
                        color: 'white', 
                        border: `1px solid ${tech.color}30`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '0.75rem',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)'
                      }}
                    >
                      <i className={tech.class} style={{ fontSize: '1.2rem', color: tech.color }}></i>
                      {tech.name === "0" || tech.name === "1" || tech.name === "2" ? tech._actualName : tech.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {config.affiliations && (organizations || []).length > 0 && (
            <div>
              <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.2rem', color: 'white', fontWeight: 700 }}>
                <Building2 size={20} className="text-primary" /> Affiliations
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {(organizations || []).map(org => (
                  <div key={org.login} style={{ padding: '0.6rem 1.25rem', background: '#111', borderRadius: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)' }}>
                    <img src={org.avatar_url} alt={org.login} style={{ width: '24px', height: '24px', borderRadius: '4px' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>{org.login}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dynamic Repo Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: bothSelected ? '1fr 1fr' : '1fr', 
            gap: '3rem',
            alignItems: 'start'
          }}>
            {config.pinned && (
              <RepoSection 
                title="Featured Works" 
                repos={pinned_repos} 
                icon={Pin} 
                color="#fbbf24" 
              />
            )}
            {config.activity && (
              <RepoSection 
                title="Signal Activity" 
                repos={top_repos} 
                icon={Zap} 
                color="#38bdf8" 
              />
            )}
          </div>
        </div>
      )}

      {config.dnaChart && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
          <h4 style={{ marginBottom: '2.5rem', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 800 }}>Domain Expertise</h4>
          <div style={{ width: '100%', height: '350px', position: 'relative' }}>
            <PolarArea data={polarData} options={polarOptions} />
          </div>
        </div>
      )}
    </div>
  );
}

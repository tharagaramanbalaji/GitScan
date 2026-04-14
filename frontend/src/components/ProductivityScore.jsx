import React from 'react';
import { Activity } from 'lucide-react';

export default function ProductivityScore({ metrics, stats }) {
  if (!metrics) return null;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem' }} className="flex-col md:flex-row justify-between gap-4">
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fff', lineHeight: 1 }} className="text-lg md:text-2xl text-center md:text-left">
            <Activity size={24} style={{ color: 'var(--primary)', flexShrink: 0 }} /> 
            <span>Developer Productivity Score</span>
          </h4>
          <div style={{ background: 'var(--primary-light)', border: '2px solid var(--primary)', padding: '0.5rem 1.5rem', borderRadius: '2rem', color: 'var(--primary)', fontWeight: 900 }} className="text-xl md:text-2xl">
              {metrics.productivity_score || 0}<span style={{fontSize: '1rem', color: 'var(--primary-subdued)'}}>/100</span>
          </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {/* Commits & Frequency */}
        <div className="glass" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>Commit Frequency</span>
              <span style={{ color: '#4ade80', fontWeight: 800 }}>{metrics.commit_frequency_score || 0} pts</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>{metrics.commits_per_week || 0} <span style={{fontSize: '1rem', color: '#94a3b8', fontWeight: 500}}>/week</span></div>
          <div style={{ color: '#64748b', fontSize: '0.85rem' }}>{metrics.total_commits_90d || metrics.total_commits || 0} total commits found</div>
        </div>

        {/* Consistency & Streaks */}
        <div className="glass" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>Consistency</span>
              <span style={{ color: '#facc15', fontWeight: 800 }}>{metrics.consistency_score || 0} pts</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>{metrics.max_streak || 0} <span style={{fontSize: '1rem', color: '#94a3b8', fontWeight: 500}}>days max streak</span></div>
          <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Active on {metrics.active_days || 0} unique days</div>
        </div>

        {/* PR Efficiency */}
        <div className="glass" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>PR Efficiency</span>
              <span style={{ color: '#f472b6', fontWeight: 800 }}>{metrics.pr_efficiency_score || 0} pts</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>+{stats?.total_prs || 0} <span style={{fontSize: '1rem', color: '#94a3b8', fontWeight: 500}}>PRs</span></div>
          <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Merge Rate & Efficiency tracking</div>
        </div>

        {/* Impact */}
        <div className="glass" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.8rem', mdFontSize: '0.9rem', textTransform: 'uppercase' }}>Code Impact</span>
              <span style={{ color: '#a855f7', fontWeight: 800 }}>{metrics.impact_score || 0} pts</span>
          </div>
          <div style={{ fontWeight: 800, marginBottom: '0.25rem' }} className="text-2xl md:text-3xl">{stats?.total_stars || 0} <span style={{fontSize: '1rem', color: '#94a3b8', fontWeight: 500}}>stars gained</span></div>
          <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Total reach via forks and stars</div>
        </div>
      </div>
    </div>
  );
}

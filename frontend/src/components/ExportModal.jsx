import React, { useState, useEffect, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { X, Download, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';

const DEFAULT_COLORS = {
  bg: '#0f172a',
  accent1: '#38bdf8',
  accent2: '#818cf8',
};

export default function ExportModal({ isOpen, onClose, dashboardId, exportConfig, setExportConfig, user }) {
  const [isExporting, setIsExporting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  
  const [bgColor, setBgColor] = useState(DEFAULT_COLORS.bg);
  const [accent1, setAccent1] = useState(DEFAULT_COLORS.accent1);
  const [accent2, setAccent2] = useState(DEFAULT_COLORS.accent2);
  
  const isDefault = bgColor === DEFAULT_COLORS.bg && accent1 === DEFAULT_COLORS.accent1 && accent2 === DEFAULT_COLORS.accent2;
  
  const originalStyles = useRef({});
  const timeoutRef = useRef(null);

  // Store original styles only once when opened
  useEffect(() => {
    if (isOpen) {
      const element = document.getElementById(dashboardId);
      if (element) {
        originalStyles.current = {
          bg: element.style.getPropertyValue('--background') || '',
          a1: element.style.getPropertyValue('--primary') || '',
          a2: element.style.getPropertyValue('--secondary') || '',
          htmlBg: element.style.backgroundColor || ''
        };
        
        // Initial capture
        updateLiveDashboard(bgColor, accent1, accent2);
        capturePreview();
      }
    } else {
      // Revert when closed
      revertStyles();
      setPreviewUrl(null);
    }
  }, [isOpen]);

  const revertStyles = () => {
    const element = document.getElementById(dashboardId);
    if (!element) return;
    element.style.setProperty('--background', originalStyles.current.bg);
    element.style.setProperty('--primary', originalStyles.current.a1);
    element.style.setProperty('--secondary', originalStyles.current.a2);
    element.style.backgroundColor = originalStyles.current.htmlBg;
  };

  const updateLiveDashboard = (bg, a1, a2) => {
    const element = document.getElementById(dashboardId);
    if (!element) return;
    element.style.setProperty('--background', bg);
    element.style.setProperty('--primary', a1);
    element.style.setProperty('--secondary', a2);
    element.style.backgroundColor = bg;
  };

  const capturePreview = async (bg, a1, a2) => {
    const element = document.getElementById(dashboardId);
    if (!element) return;
    const captureBg = bg ?? bgColor;
    try {
      const dataUrl = await htmlToImage.toPng(element, {
        backgroundColor: captureBg,
        pixelRatio: 1,
        cacheBust: true,
      });
      setPreviewUrl(dataUrl);
    } catch (err) {
      console.error('Preview error', err);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  // Debounce the preview update so the color picker/checkbox doesn't lag
  useEffect(() => {
    if (!isOpen) return;

    updateLiveDashboard(bgColor, accent1, accent2);
    setIsPreviewLoading(true); // show shimmer immediately

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      capturePreview(bgColor, accent1, accent2);
    }, 400);

    return () => clearTimeout(timeoutRef.current);
  }, [bgColor, accent1, accent2, exportConfig, isOpen]);

  const handleDownload = async () => {
    setIsExporting(true);
    const element = document.getElementById(dashboardId);
    if (!element) return;

    try {
      // High-res capture for download
      const dataUrl = await htmlToImage.toPng(element, {
        backgroundColor: bgColor,
        pixelRatio: 3, 
        cacheBust: true,
        style: {
          borderRadius: '0',
          border: 'none',
          boxShadow: 'none'
        }
      });
      
      const link = document.createElement('a');
      link.download = `gitinsight-investigation-${user.login}.png`;
      link.href = dataUrl;
      link.click();
      
      onClose();
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export image.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopy = async () => {
    setIsExporting(true);
    const element = document.getElementById(dashboardId);
    if (!element) return;

    try {
      const blob = await htmlToImage.toBlob(element, {
        backgroundColor: bgColor,
        pixelRatio: 2,
        cacheBust: true,
        style: { borderRadius: '0', border: 'none', boxShadow: 'none' }
      });
      
      const item = new ClipboardItem({ "image/png": blob });
      await navigator.clipboard.write([item]);
      alert('Image copied to clipboard!');
    } catch (err) {
      console.error('Copy failed:', err);
      alert('Failed to copy image. Your browser might not support this feature.');
    } finally {
      setIsExporting(false);
    }
  };

  const toggleConfig = (key) => {
    setExportConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const ConfigToggle = ({ label, configKey }) => {
    const isActive = exportConfig[configKey];
    return (
      <div 
        onClick={() => toggleConfig(configKey)}
        style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          padding: '0.5rem', background: isActive ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255,255,255,0.02)',
          border: `1px solid ${isActive ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255,255,255,0.05)'}`,
          borderRadius: '0.5rem', cursor: 'pointer', transition: 'all 0.2s',
          color: isActive ? '#f8fafc' : '#64748b'
        }}
      >
        <span style={{ fontSize: '0.85rem', fontWeight: isActive ? 600 : 400 }}>{label}</span>
        {isActive ? <Eye size={16} color="#38bdf8" /> : <EyeOff size={16} />}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(5px)',
      zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', p: '2rem'
    }}>
      <div style={{
        background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '1rem', width: '95%', maxWidth: '1200px', maxHeight: '95vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
      }}>
        
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="text-sm md:text-base">
            <ImageIcon size={20} className="text-primary" /> <span className="hidden md:inline">Customize Profile Export</span><span className="md:hidden">Quick Export</span>
          </h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body Container */}
        <div style={{ flex: 1, minHeight: '300px', overflow: 'hidden' }} className="flex flex-col md:grid md:grid-cols-[1fr_280px]">
          
          {/* Preview Area */}
          <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f172a', overflow: 'auto', position: 'relative' }}>
            {previewUrl ? (
              <>
                <div style={{ position: 'relative', maxWidth: '100%', maxHeight: '100%' }}>
                  <img
                    src={previewUrl}
                    alt="Export preview"
                    style={{
                      maxWidth: '100%', maxHeight: '100%', objectFit: 'contain',
                      borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                      transition: 'opacity 0.3s ease',
                      opacity: isPreviewLoading ? 0.35 : 1,
                    }}
                  />
                  {/* Shimmer overlay while re-rendering */}
                  {isPreviewLoading && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      borderRadius: '0.5rem',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      gap: '0.75rem',
                      background: 'rgba(15,23,42,0.6)',
                      backdropFilter: 'blur(2px)',
                    }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        border: '3px solid rgba(56,189,248,0.15)',
                        borderTopColor: '#38bdf8',
                        animation: 'spin 0.7s linear infinite',
                      }} />
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Applying theme…</span>
                      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                  )}
                </div>

                {/* Mobile Quick Actions */}
                <div className="md:hidden flex flex-col gap-3 w-full mt-8">
                  <button
                    onClick={handleDownload}
                    disabled={isExporting}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-slate-900 font-bold py-3 rounded-lg"
                  >
                    <Download size={18} /> Download Image
                  </button>
                  <button
                    onClick={handleCopy}
                    disabled={isExporting}
                    className="w-full flex items-center justify-center gap-2 bg-white/10 text-white font-bold py-3 rounded-lg border border-white/10"
                  >
                    <ImageIcon size={18} /> Copy Image
                  </button>
                </div>
              </>
            ) : (
              <div style={{ color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <ImageIcon size={32} opacity={0.5} />
                <span>Generating live preview...</span>
              </div>
            )}
          </div>

          {/* Sidebar Controls - Desktop Only */}
          <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }} className="hidden md:flex">
            
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'block' }}>Visible Sections</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <ConfigToggle label="Profile Header" configKey="header" />
                <ConfigToggle label="Stats Quickbar" configKey="stats" />
                <ConfigToggle label="Developer DNA" configKey="dnaMetrics" />
                <ConfigToggle label="Affiliations" configKey="affiliations" />
                <ConfigToggle label="Pinned Repos" configKey="pinned" />
                <ConfigToggle label="Recent Activity" configKey="activity" />
                <ConfigToggle label="Technical DNA Chart" configKey="dnaChart" />
                <ConfigToggle label="Productivity Score" configKey="productivity" />
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', margin: '0.5rem 0' }} />

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'block' }}>Theme Colors</label>

              {/* Preset Palettes */}
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Presets</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {[
                    { name: 'Default', bg: '#0f172a', a1: '#38bdf8', a2: '#818cf8' },
                    { name: 'Midnight', bg: '#020617', a1: '#6366f1', a2: '#a78bfa' },
                    { name: 'Forest', bg: '#0d1f12', a1: '#4ade80', a2: '#34d399' },
                    { name: 'Rose', bg: '#1a0d12', a1: '#f472b6', a2: '#fb7185' },
                    { name: 'Amber', bg: '#1a1200', a1: '#f59e0b', a2: '#fbbf24' },
                    { name: 'Slate', bg: '#1e293b', a1: '#94a3b8', a2: '#cbd5e1' },
                  ].map(p => {
                    const isActive = bgColor === p.bg && accent1 === p.a1 && accent2 === p.a2;
                    return (
                      <button
                        key={p.name}
                        title={p.name}
                        onClick={() => { setBgColor(p.bg); setAccent1(p.a1); setAccent2(p.a2); }}
                        style={{
                          position: 'relative', display: 'flex', flexDirection: 'column',
                          alignItems: 'center', gap: '0.35rem', padding: '0.5rem 0.25rem',
                          background: isActive ? 'rgba(56,189,248,0.08)' : 'rgba(0,0,0,0.2)',
                          border: `1px solid ${isActive ? 'rgba(56,189,248,0.5)' : 'rgba(255,255,255,0.06)'}`,
                          borderRadius: '0.6rem', cursor: 'pointer', transition: 'all 0.2s',
                        }}
                        onMouseOver={e => { if (!isActive) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; } }}
                        onMouseOut={e => { if (!isActive) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(0,0,0,0.2)'; } }}
                      >
                        {/* Mini palette preview */}
                        <div style={{ display: 'flex', gap: '2px' }}>
                          <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: p.bg, border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }} />
                          <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: p.a1, flexShrink: 0 }} />
                          <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: p.a2, flexShrink: 0 }} />
                        </div>
                        <span style={{ fontSize: '0.65rem', color: isActive ? '#38bdf8' : '#64748b', fontWeight: 600 }}>{p.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Pickers */}
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Custom</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { label: 'Background', value: bgColor, setter: setBgColor },
                  { label: 'Primary', value: accent1, setter: setAccent1 },
                  { label: 'Secondary', value: accent2, setter: setAccent2 },
                ].map(({ label, value, setter }) => (
                  <label
                    key={label}
                    style={{
                      position: 'relative',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: 'rgba(0,0,0,0.25)', padding: '0.55rem 0.75rem',
                      borderRadius: '0.6rem', border: '1px solid rgba(255,255,255,0.06)',
                      cursor: 'pointer', transition: 'border-color 0.2s',
                    }}
                    onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                    onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,248,0.06)'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '0.4rem',
                        background: value, border: '2px solid rgba(255,255,255,0.12)',
                        boxShadow: `0 2px 8px ${value}55`, flexShrink: 0
                      }} />
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#e2e8f0', fontWeight: 600 }}>{label}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace', marginTop: '1px' }}>{value}</div>
                      </div>
                    </div>
                    <input
                      type="color"
                      value={value}
                      onChange={e => setter(e.target.value)}
                      style={{
                        position: 'absolute', inset: 0, width: '100%', height: '100%',
                        opacity: 0, cursor: 'pointer', border: 'none', padding: 0,
                      }}
                    />
                    <span style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 500, pointerEvents: 'none' }}>Edit ›</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reset to Defaults */}
            {!isDefault && (
              <button
                onClick={() => { setBgColor(DEFAULT_COLORS.bg); setAccent1(DEFAULT_COLORS.accent1); setAccent2(DEFAULT_COLORS.accent2); }}
                style={{
                  width: '100%', padding: '0.45rem', fontSize: '0.75rem', fontWeight: 600,
                  background: 'transparent', color: '#64748b',
                  border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '0.5rem',
                  cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.02em'
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(56,189,248,0.3)'; e.currentTarget.style.color = '#38bdf8'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#64748b'; }}
              >
                ↩ Reset to defaults
              </button>
            )}

            <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
              <button 
                onClick={handleDownload}
                disabled={isExporting}
                style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', fontWeight: 600, background: 'var(--primary)', color: '#0f172a', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
              >
                {isExporting ? 'Generating...' : <><Download size={18} /> Download Image</>}
              </button>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}

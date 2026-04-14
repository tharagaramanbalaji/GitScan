import React, { useState, useEffect, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { X, Download, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';

export default function ExportModal({ isOpen, onClose, dashboardId, exportConfig, setExportConfig, user }) {
  const [isExporting, setIsExporting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const [bgColor, setBgColor] = useState('#0f172a');
  const [accent1, setAccent1] = useState('#38bdf8');
  const [accent2, setAccent2] = useState('#818cf8');
  
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

  const capturePreview = async () => {
    const element = document.getElementById(dashboardId);
    if (!element) return;
    
    try {
      const dataUrl = await htmlToImage.toPng(element, {
        backgroundColor: bgColor,
        pixelRatio: 1, // lower res for preview
        cacheBust: true,
      });
      setPreviewUrl(dataUrl);
    } catch (err) {
      console.error('Preview error', err);
    }
  };

  // Debounce the preview update so the color picker/checkbox doesn't lag
  useEffect(() => {
    if (!isOpen) return;
    
    updateLiveDashboard(bgColor, accent1, accent2);
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      capturePreview();
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
        borderRadius: '1rem', width: '90%', maxWidth: '1200px', maxHeight: '90vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
      }}>
        
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ImageIcon size={20} className="text-primary" /> Customize Profile Export
          </h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body Container */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 280px', flex: 1, minHeight: '400px', overflow: 'hidden' }}>
          
          {/* Preview Area */}
          <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', overflow: 'auto' }}>
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Export preview" 
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }} 
              />
            ) : (
              <div style={{ color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <ImageIcon size={32} opacity={0.5} />
                <span>Generating live preview...</span>
              </div>
            )}
          </div>

          {/* Sidebar Controls */}
          <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }}>
            
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>Background</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#cbd5e1', fontSize: '0.8rem', fontFamily: 'monospace' }}>{bgColor}</span>
                    <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} style={{ cursor: 'pointer', background: 'transparent', border: 'none', padding: 0, width: '24px', height: '24px' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>Primary Accent</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#cbd5e1', fontSize: '0.8rem', fontFamily: 'monospace' }}>{accent1}</span>
                    <input type="color" value={accent1} onChange={e => setAccent1(e.target.value)} style={{ cursor: 'pointer', background: 'transparent', border: 'none', padding: 0, width: '24px', height: '24px' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>Secondary Accent</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#cbd5e1', fontSize: '0.8rem', fontFamily: 'monospace' }}>{accent2}</span>
                    <input type="color" value={accent2} onChange={e => setAccent2(e.target.value)} style={{ cursor: 'pointer', background: 'transparent', border: 'none', padding: 0, width: '24px', height: '24px' }} />
                  </div>
                </div>
              </div>
            </div>

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

import React, { useState, useEffect } from 'react';
import { Camera, Lock } from 'lucide-react';
import ExportModal from './ExportModal';

export default function ExportPanel({ dashboardId, exportConfig, setExportConfig, user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const buttonStyle = {
    fontWeight: 700,
    background: isMobile ? 'rgba(255, 255, 255, 0.05)' : 'rgba(56, 189, 248, 0.1)',
    color: isMobile ? '#64748b' : '#38bdf8',
    border: `1px solid ${isMobile ? 'rgba(255, 255, 255, 0.05)' : 'rgba(56, 189, 248, 0.3)'}`,
    borderRadius: '2rem',
    cursor: isMobile ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    transition: 'all 0.2s',
    boxShadow: isMobile ? 'none' : '0 4px 15px rgba(56, 189, 248, 0.1)',
    justifyContent: 'center'
  };

  return (
    <>
      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
        <button 
          onClick={() => !isMobile && setIsModalOpen(true)}
          disabled={isMobile}
          style={buttonStyle}
          className="w-full md:w-auto px-6 py-3 md:px-10 md:py-3 text-sm md:text-base lg:text-lg"
          onMouseOver={e => {
            if (!isMobile) {
              e.currentTarget.style.background = 'var(--primary)';
              e.currentTarget.style.color = '#0f172a';
            }
          }}
          onMouseOut={e => {
            if (!isMobile) {
              e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)';
              e.currentTarget.style.color = '#38bdf8';
            }
          }}
        >
          {isMobile ? (
            <><Lock size={18} /> Export Restricted: Use Desktop</>
          ) : (
            <><Camera size={20} /> Export Dashboard Image</>
          )}
        </button>
      </div>

      <ExportModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        dashboardId={dashboardId} 
        exportConfig={exportConfig}
        setExportConfig={setExportConfig}
        user={user}
      />
    </>
  );
}

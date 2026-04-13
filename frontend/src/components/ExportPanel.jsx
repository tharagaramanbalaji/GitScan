import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import ExportModal from './ExportModal';

export default function ExportPanel({ dashboardId, exportConfig, setExportConfig, user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ 
            padding: '0.75rem 2.5rem', 
            fontSize: '1.05rem', 
            fontWeight: 700, 
            background: 'rgba(56, 189, 248, 0.1)', 
            color: '#38bdf8', 
            border: '1px solid rgba(56, 189, 248, 0.3)', 
            borderRadius: '2rem', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            transition: 'all 0.2s',
            boxShadow: '0 4px 15px rgba(56, 189, 248, 0.1)'
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = 'var(--primary)';
            e.currentTarget.style.color = '#0f172a';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)';
            e.currentTarget.style.color = '#38bdf8';
          }}
        >
          <Camera size={20} /> Export Dashboard Image
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

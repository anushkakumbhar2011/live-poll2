import { useState, useEffect } from "react";

export default function FreighterDiagnostic() {
  const [diagnostics, setDiagnostics] = useState({});

  useEffect(() => {
    const runDiagnostics = () => {
      const diag = {
        freighter: !!window.freighter,
        freighterApi: !!window.freighterApi,
        freighterKeys: window.freighter ? Object.keys(window.freighter) : [],
        allFreighterKeys: Object.keys(window).filter(k => k.toLowerCase().includes('freighter')),
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      };
      
      console.log('=== Freighter Diagnostics ===');
      console.log(diag);
      
      setDiagnostics(diag);
    };

    runDiagnostics();
    
    // Run again after delays
    setTimeout(runDiagnostics, 1000);
    setTimeout(runDiagnostics, 2000);
    setTimeout(runDiagnostics, 3000);
  }, []);

  return (
    <div style={{
      margin: '20px 0',
      padding: '16px',
      background: '#f9fafb',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'monospace'
    }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>
        🔍 Freighter Diagnostics
      </h3>
      <div style={{ display: 'grid', gap: '8px' }}>
        <div>
          <strong>window.freighter:</strong> {diagnostics.freighter ? '✅ Found' : '❌ Not found'}
        </div>
        <div>
          <strong>window.freighterApi:</strong> {diagnostics.freighterApi ? '✅ Found' : '❌ Not found'}
        </div>
        {diagnostics.freighterKeys && diagnostics.freighterKeys.length > 0 && (
          <div>
            <strong>Freighter methods:</strong> {diagnostics.freighterKeys.join(', ')}
          </div>
        )}
        {diagnostics.allFreighterKeys && diagnostics.allFreighterKeys.length > 0 && (
          <div>
            <strong>All freighter-related keys:</strong> {diagnostics.allFreighterKeys.join(', ')}
          </div>
        )}
        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
          <strong>Browser:</strong> {diagnostics.userAgent?.includes('Chrome') ? 'Chrome' : diagnostics.userAgent?.includes('Safari') ? 'Safari' : 'Other'}
        </div>
        <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
          Last checked: {diagnostics.timestamp}
        </div>
      </div>
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: '12px',
          padding: '6px 12px',
          background: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '12px',
          cursor: 'pointer'
        }}
      >
        Refresh Page
      </button>
    </div>
  );
}

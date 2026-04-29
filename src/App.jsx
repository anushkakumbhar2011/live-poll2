import { useState, useEffect } from "react";
import WalletButton from "./components/WalletButton-Freighter";
import FreighterDiagnostic from "./components/FreighterDiagnostic";
import "./App.css";

console.log('[APP] App.jsx loading...');

// Minimal test to ensure React works
function MinimalTest() {
  return (
    <div style={{
      padding: '40px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxWidth: '600px',
        width: '100%'
      }}>
        <h1 style={{ margin: '0 0 16px 0', color: '#1a1a2e' }}>Stellar Live Poll</h1>
        <div style={{
          padding: '20px',
          background: '#d4edda',
          border: '2px solid #28a745',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: '0 0 8px 0', color: '#155724' }}>✅ React is Working!</h2>
          <p style={{ margin: 0, color: '#155724' }}>The app is rendering correctly.</p>
        </div>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Check browser console (F12) for detailed logs.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  console.log('[APP] App component rendering');
  
  const [walletAddress, setWalletAddress] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [showMinimal, setShowMinimal] = useState(true);

  function handleWalletConnect(address) {
    console.log('[APP] Wallet connected:', address);
    setWalletAddress(address);
  }

  useEffect(() => {
    console.log('[APP] useEffect starting...');
    
    // Show minimal UI for 2 seconds
    const minimalTimer = setTimeout(() => {
      console.log('[APP] App ready');
      setShowMinimal(false);
      setIsInitialized(true);
    }, 2000);

    return () => clearTimeout(minimalTimer);
  }, []);

  // Always show minimal test first
  if (showMinimal) {
    console.log('[APP] Rendering minimal test');
    return <MinimalTest />;
  }

  // Then show error if any
  if (error) {
    console.log('[APP] Rendering error state');
    return (
      <div style={{
        padding: '40px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '16px',
          maxWidth: '600px',
          width: '100%'
        }}>
          <h1 style={{ margin: '0 0 16px 0' }}>Stellar Live Poll</h1>
          <div style={{
            padding: '20px',
            background: '#fee2e2',
            border: '2px solid #ef4444',
            borderRadius: '8px'
          }}>
            <h2 style={{ margin: '0 0 8px 0', color: '#991b1b' }}>⚠️ Error</h2>
            <p style={{ margin: 0, color: '#7f1d1d' }}>{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (!isInitialized) {
    console.log('[APP] Rendering loading state');
    return (
      <div style={{
        padding: '40px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '16px',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: '0 0 24px 0' }}>Stellar Live Poll</h1>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280' }}>Loading wallet connection...</p>
        </div>
      </div>
    );
  }

  // Main app
  console.log('[APP] Rendering main app');

  return (
    <div style={{
      padding: '40px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '16px',
        maxWidth: '600px',
        width: '100%'
      }}>
        <h1 style={{ margin: '0 0 8px 0', textAlign: 'center' }}>Stellar Live Poll</h1>
        <p style={{ margin: '0 0 32px 0', textAlign: 'center', color: '#6b7280' }}>
          Vote on your favorite programming language
        </p>
        
        <FreighterDiagnostic />
        
        <WalletButton onConnect={handleWalletConnect} />
        
        {walletAddress ? (
          <div style={{
            marginTop: '32px',
            padding: '20px',
            background: '#d4edda',
            border: '2px solid #28a745',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#155724' }}>✅ Wallet Connected!</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#155724', fontFamily: 'monospace' }}>
              {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
            </p>
          </div>
        ) : (
          <div style={{
            marginTop: '32px',
            padding: '20px',
            background: '#f3f4f6',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#374151' }}>
              Connect your wallet to start voting
            </p>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
              Secure and decentralized voting on Stellar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

console.log('[APP] App.jsx loaded');

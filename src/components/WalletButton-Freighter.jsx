import { useState } from "react";

export default function WalletButton({ onConnect }) {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  async function connectFreighter() {
    console.log("=== Attempting Freighter Connection ===");
    
    setIsConnecting(true);
    setError("");
    
    try {
      // Method 1: Check window.freighter
      if (window.freighter) {
        console.log("Method 1: Using window.freighter");
        return await connectViaWindowFreighter();
      }
      
      // Method 2: Try to import @stellar/freighter-api
      console.log("Method 2: Trying to import @stellar/freighter-api");
      try {
        const freighterApi = await import("@stellar/freighter-api");
        console.log("Freighter API imported:", freighterApi);
        
        const { isConnected, getPublicKey } = freighterApi;
        
        // Check if connected
        const connected = await isConnected();
        console.log("Is connected:", connected);
        
        if (!connected) {
          throw new Error("Please connect to Freighter first by clicking the extension icon");
        }
        
        // Get public key
        const publicKey = await getPublicKey();
        console.log("Public key:", publicKey);
        
        if (!publicKey) {
          throw new Error("No public key returned");
        }
        
        setAddress(publicKey);
        onConnect(publicKey);
        return;
        
      } catch (importErr) {
        console.log("Method 2 failed:", importErr.message);
      }
      
      // Method 3: Manual instructions
      throw new Error("Freighter not detected. Please:\n1. Make sure Freighter is installed\n2. Click the Freighter extension icon\n3. Unlock your wallet\n4. Refresh this page");
      
    } catch (err) {
      console.error("=== Connection Error ===");
      console.error(err);
      setError(err.message || "Failed to connect");
    } finally {
      setIsConnecting(false);
    }
  }

  async function connectViaWindowFreighter() {
    console.log("Connecting via window.freighter");
    
    const isAllowed = await window.freighter.isAllowed();
    console.log("Is allowed:", isAllowed);
    
    if (!isAllowed) {
      await window.freighter.setAllowed();
    }
    
    const publicKey = await window.freighter.getPublicKey();
    console.log("Public key:", publicKey);
    
    setAddress(publicKey);
    onConnect(publicKey);
  }

  function disconnectWallet() {
    setAddress("");
    setError("");
    onConnect("");
  }

  return (
    <div style={{ marginBottom: '24px' }}>
      {!address ? (
        <div>
          <button 
            onClick={connectFreighter} 
            disabled={isConnecting}
            style={{
              width: '100%',
              padding: '14px 32px',
              background: isConnecting ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isConnecting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}
          >
            {isConnecting ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }}></div>
                Connecting...
              </>
            ) : (
              <>
                <span style={{ fontSize: '20px' }}>🔗</span>
                Connect Freighter Wallet
              </>
            )}
          </button>
          
          {error && (
            <div style={{
              marginTop: '12px',
              padding: '12px 16px',
              background: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#991b1b',
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>⚠️ Connection Failed</div>
              <div style={{ whiteSpace: 'pre-line' }}>{error}</div>
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #fecaca' }}>
                <strong>Troubleshooting:</strong>
                <ol style={{ margin: '8px 0 0 20px', padding: 0 }}>
                  <li>Click the Freighter extension icon in your browser</li>
                  <li>Make sure your wallet is unlocked</li>
                  <li>Refresh this page</li>
                  <li>Try clicking Connect again</li>
                </ol>
              </div>
            </div>
          )}
          
          <div style={{
            marginTop: '12px',
            padding: '12px 16px',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            color: '#1e40af',
            fontSize: '13px'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>💡 First time?</div>
            <div>
              1. Install Freighter: <a href="https://freighter.app" target="_blank" rel="noopener noreferrer" style={{ color: '#1e40af', textDecoration: 'underline' }}>freighter.app</a>
              <br />
              2. Create or import a wallet
              <br />
              3. Switch to Testnet in settings
              <br />
              4. Come back and click Connect
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          background: '#d1fae5',
          borderRadius: '12px',
          border: '2px solid #6ee7b7'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: '#10b981',
              color: 'white',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              ✓
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#065f46', fontWeight: '600' }}>CONNECTED</div>
              <span style={{
                fontFamily: 'monospace',
                fontSize: '14px',
                color: '#047857',
                fontWeight: '600'
              }}>
                {address.slice(0, 4)}...{address.slice(-4)}
              </span>
            </div>
          </div>
          <button 
            onClick={disconnectWallet}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '6px 16px',
              fontSize: '14px',
              fontWeight: '600',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}

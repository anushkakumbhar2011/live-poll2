import { useState } from "react";
import { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";

export default function WalletButton({ kit, onConnect }) {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  async function connectWallet() {
    console.log("=== Connect Wallet Started ===");
    
    if (!kit) {
      console.error("Wallet kit not initialized");
      setError("Wallet kit not ready. Please wait...");
      return;
    }
    
    setIsConnecting(true);
    setError("");
    
    try {
      console.log("Opening wallet authentication modal...");
      console.log("StellarWalletsKit:", StellarWalletsKit);
      console.log("authModal method:", StellarWalletsKit.authModal);
      
      // Use static method StellarWalletsKit.authModal()
      const result = await StellarWalletsKit.authModal();
      
      console.log("=== Wallet Connected ===");
      console.log("Result:", result);
      
      const walletAddress = result.address;
      
      if (!walletAddress || typeof walletAddress !== 'string') {
        throw new Error("Invalid address received from wallet");
      }
      
      if (!walletAddress.startsWith('G')) {
        throw new Error("Invalid Stellar address format");
      }
      
      console.log("=== Connection Successful ===");
      console.log("Address:", walletAddress);
      
      setAddress(walletAddress);
      onConnect(walletAddress);
      setError("");
      
    } catch (err) {
      console.error("=== Error Connecting Wallet ===");
      console.error("Error:", err);
      console.error("Error message:", err.message);
      console.error("Error stack:", err.stack);
      console.error("Error type:", typeof err);
      console.error("Error keys:", Object.keys(err));
      
      let errorMessage = "Failed to connect. Please try again.";
      
      if (err.message && err.message.toLowerCase().includes("closed")) {
        errorMessage = "Connection cancelled";
      } else if (err.message && err.message.toLowerCase().includes("rejected")) {
        errorMessage = "Connection rejected by user";
      } else if (err.message && err.message.toLowerCase().includes("denied")) {
        errorMessage = "Connection denied by user";
      } else if (err.message && err.message.toLowerCase().includes("not found")) {
        errorMessage = "Wallet not found. Please install Freighter or another Stellar wallet.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  }

  async function disconnectWallet() {
    console.log("=== Disconnecting Wallet ===");
    
    try {
      await StellarWalletsKit.disconnect();
      console.log("Wallet disconnected successfully");
    } catch (err) {
      console.error("Error disconnecting:", err);
    }
    
    setAddress("");
    setError("");
    onConnect("");
  }

  return (
    <div className="wallet-section">
      {!address ? (
        <div className="wallet-connect-container">
          <button 
            onClick={connectWallet} 
            className="connect-btn"
            disabled={isConnecting || !kit}
            style={{
              padding: '14px 32px',
              background: isConnecting || !kit ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isConnecting || !kit ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              transition: 'all 0.3s ease'
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
            ) : !kit ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }}></div>
                Loading...
              </>
            ) : (
              <>
                <span style={{ fontSize: '20px' }}>🔗</span>
                Connect Wallet
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
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>⚠️</span>
              {error}
            </div>
          )}
        </div>
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          background: '#f3f4f6',
          borderRadius: '12px',
          border: '2px solid #e5e7eb'
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
            <span style={{
              fontFamily: 'monospace',
              fontSize: '15px',
              color: '#374151',
              fontWeight: '600'
            }}>
              {address.slice(0, 4)}...{address.slice(-4)}
            </span>
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
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.background = '#dc2626'}
            onMouseOut={(e) => e.target.style.background = '#ef4444'}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}

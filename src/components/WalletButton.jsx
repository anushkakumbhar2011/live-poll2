import { useState } from "react";

export default function WalletButton({ kit, onConnect }) {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  async function connectWallet() {
    console.log("=== Connect Wallet Started ===");
    console.log("Current timestamp:", new Date().toISOString());
    
    setIsConnecting(true);
    setError("");
    
    try {
      console.log("Opening wallet authentication modal...");
      
      // Use authModal instead of openModal
      const result = await kit.authModal();
      
      console.log("=== Wallet Connected ===");
      console.log("Raw result from authModal():", result);
      
      // Extract address from result
      const walletAddress = result.address || result;
      console.log("Extracted address:", walletAddress);
      
      // Validate address
      if (!walletAddress || typeof walletAddress !== 'string') {
        console.error("Invalid address format:", walletAddress);
        throw new Error("Invalid address received from wallet");
      }
      
      // Check if address looks like a Stellar address (starts with G)
      if (!walletAddress.startsWith('G')) {
        console.error("Address doesn't start with G:", walletAddress);
        throw new Error("Invalid Stellar address format");
      }
      
      console.log("=== Connection Successful ===");
      console.log("Final address:", walletAddress);
      
      setAddress(walletAddress);
      onConnect(walletAddress);
      setError("");
      setIsConnecting(false);
      
    } catch (err) {
      console.error("=== Error Connecting Wallet ===");
      console.error("Error type:", err.constructor.name);
      console.error("Error code:", err.code);
      console.error("Error message:", err.message);
      console.error("Full error:", err);
      
      // Specific error messages based on error type
      let errorMessage = "Failed to connect. Please try again.";
      
      if (err.code === -1 || (err.message && err.message.toLowerCase().includes("closed"))) {
        errorMessage = "Connection cancelled";
      } else if (err.message && err.message.toLowerCase().includes("rejected")) {
        errorMessage = "Connection rejected by user";
      } else if (err.message && err.message.toLowerCase().includes("denied")) {
        errorMessage = "Connection denied by user";
      } else if (err.message && err.message.toLowerCase().includes("not found")) {
        errorMessage = "Wallet not found";
      } else if (err.message && err.message.toLowerCase().includes("no wallet")) {
        errorMessage = "No wallet detected. Please install Freighter or another Stellar wallet.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setIsConnecting(false);
    }
  }

  async function disconnectWallet() {
    console.log("=== Disconnecting Wallet ===");
    
    try {
      // Call the disconnect method
      await kit.disconnect();
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
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>
                <span className="spinner"></span>
                Connecting...
              </>
            ) : (
              <>
                <span className="wallet-icon">🔗</span>
                Connect Wallet
              </>
            )}
          </button>
          
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="wallet-info">
          <div className="wallet-connected">
            <span className="connected-icon">✓</span>
            <span className="wallet-address">
              {address.slice(0, 4)}...{address.slice(-4)}
            </span>
          </div>
          <button onClick={disconnectWallet} className="disconnect-btn">
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}

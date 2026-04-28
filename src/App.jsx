import { useState } from "react";
import { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";
import { defaultModules } from "@creit.tech/stellar-wallets-kit/modules/utils";
import WalletButton from "./components/WalletButton";
import Poll from "./components/Poll";
import "./App.css";

// Initialize wallet kit with correct configuration
console.log("Initializing StellarWalletsKit...");
StellarWalletsKit.init({
  modules: defaultModules()
});
console.log("StellarWalletsKit initialized successfully");

export default function App() {
  const [walletAddress, setWalletAddress] = useState("");

  function handleWalletConnect(address) {
    console.log("Wallet connected:", address);
    setWalletAddress(address);
  }

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <header className="app-header">
          <h1>Stellar Live Poll</h1>
          <p className="subtitle">Vote on your favorite programming language</p>
        </header>

        <WalletButton kit={StellarWalletsKit} onConnect={handleWalletConnect} />

        {walletAddress ? (
          <Poll walletAddress={walletAddress} walletKit={StellarWalletsKit} />
        ) : (
          <div className="connect-prompt">
            <div className="prompt-icon">🔐</div>
            <p className="prompt-text">Connect your wallet to start voting</p>
            <p className="prompt-subtext">Secure and decentralized voting on Stellar</p>
          </div>
        )}
      </div>
    </div>
  );
}
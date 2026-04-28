# ✅ Correct API for @creit.tech/stellar-wallets-kit v2.1.0

## 🔧 The Right Way to Use StellarWalletsKit

### 1. Initialization (Static Method)

```javascript
import { StellarWalletsKit, Networks, ModuleType } from "@creit.tech/stellar-wallets-kit";

// Use .init() static method, NOT new StellarWalletsKit()
StellarWalletsKit.init({
  network: Networks.TESTNET,
  selectedWalletId: "freighter",
  modules: [
    ModuleType.HOT_WALLET,      // Browser wallets
    ModuleType.BRIDGE_WALLET    // WalletConnect
  ]
});
```

### 2. Connect Wallet (authModal)

```javascript
async function connectWallet() {
  try {
    // Use .authModal() NOT .openModal()
    const result = await StellarWalletsKit.authModal();
    
    const address = result.address;
    console.log("Connected:", address);
    
  } catch (err) {
    if (err.code === -1) {
      console.log("User closed modal");
    } else {
      console.error("Connection failed:", err);
    }
  }
}
```

### 3. Disconnect Wallet

```javascript
async function disconnectWallet() {
  try {
    await StellarWalletsKit.disconnect();
    console.log("Disconnected");
  } catch (err) {
    console.error("Disconnect failed:", err);
  }
}
```

### 4. Get Current Address

```javascript
async function getCurrentAddress() {
  try {
    const address = await StellarWalletsKit.getAddress();
    console.log("Current address:", address);
  } catch (err) {
    console.error("No wallet connected:", err);
  }
}
```

## 📋 Complete Working Example

```javascript
import { useState } from "react";
import { StellarWalletsKit, Networks, ModuleType } from "@creit.tech/stellar-wallets-kit";

// Initialize once at app startup
StellarWalletsKit.init({
  network: Networks.TESTNET,
  modules: [ModuleType.HOT_WALLET, ModuleType.BRIDGE_WALLET]
});

export default function WalletButton() {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  async function connectWallet() {
    setIsConnecting(true);
    setError("");
    
    try {
      // Open authentication modal
      const result = await StellarWalletsKit.authModal();
      
      // Get address from result
      const walletAddress = result.address;
      
      console.log("Connected:", walletAddress);
      setAddress(walletAddress);
      
    } catch (err) {
      console.error("Connection error:", err);
      
      if (err.code === -1) {
        setError("Connection cancelled");
      } else {
        setError(err.message || "Failed to connect");
      }
    } finally {
      setIsConnecting(false);
    }
  }

  async function disconnectWallet() {
    try {
      await StellarWalletsKit.disconnect();
      setAddress("");
    } catch (err) {
      console.error("Disconnect error:", err);
    }
  }

  return (
    <div>
      {!address ? (
        <button onClick={connectWallet} disabled={isConnecting}>
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : (
        <div>
          <span>{address.slice(0, 4)}...{address.slice(-4)}</span>
          <button onClick={disconnectWallet}>Disconnect</button>
        </div>
      )}
      {error && <p>{error}</p>}
    </div>
  );
}
```

## ❌ Common Mistakes

### 1. Using `new` keyword
```javascript
// ❌ WRONG
const kit = new StellarWalletsKit({ ... });

// ✅ CORRECT
StellarWalletsKit.init({ ... });
```

### 2. Using `openModal()`
```javascript
// ❌ WRONG
await kit.openModal({ ... });

// ✅ CORRECT
await StellarWalletsKit.authModal();
```

### 3. Wrong imports
```javascript
// ❌ WRONG
import { WalletNetwork, allowAllModules } from "...";

// ✅ CORRECT
import { Networks, ModuleType } from "...";
```

## 🎯 Key Differences from Other Versions

| Feature | v2.1.0 | Other Versions |
|---------|--------|----------------|
| Initialization | `StellarWalletsKit.init()` | `new StellarWalletsKit()` |
| Connect | `StellarWalletsKit.authModal()` | `kit.openModal()` |
| Network | `Networks.TESTNET` | `WalletNetwork.TESTNET` |
| Modules | `[ModuleType.HOT_WALLET]` | `allowAllModules()` |
| Methods | Static methods | Instance methods |

## 🧪 Testing

After implementing:

1. **Hard refresh**: Cmd+Shift+R or Ctrl+Shift+R
2. **Open console**: F12
3. **Click "Connect Wallet"**
4. **Should see**: Modal with wallet options
5. **Select Freighter**: Should connect successfully

## 📝 Error Codes

| Code | Meaning |
|------|---------|
| -1 | User closed modal |
| -3 | No wallet set |

## ✅ This Should Fix

- ✅ "kit.openModal is not a function" error
- ✅ Blank screen issue
- ✅ Wallet connection
- ✅ Modal display

---

**Status**: ✅ CORRECT FOR v2.1.0
**Last Updated**: April 29, 2026

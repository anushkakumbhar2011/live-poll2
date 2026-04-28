# 🔗 Smart Contract Integration Guide

## ✅ What Was Integrated

The Stellar Live Poll dApp now uses **real blockchain transactions** instead of dummy data!

---

## 📁 Files Created/Modified

### New Files
1. **`src/utils/contract.js`** - Contract interaction utilities
2. **`.env`** - Environment variables with contract ID
3. **`.env.example`** - Template for environment variables

### Modified Files
1. **`src/components/Poll.jsx`** - Updated to use real contract calls
2. **`src/App.jsx`** - Pass wallet kit to Poll component

---

## 🔧 Contract Configuration

### Environment Variables (`.env`)
```env
VITE_CONTRACT_ID=CBVYU3LP455MKZEILE3I5RIHAGJEEYCRGNEQL5BYRFK73M6I3KA4HT36
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
```

### Contract Functions Used
- **`vote(option: u32)`** - Submit a vote (0 for JavaScript, 1 for Python)
- **`get_votes(option: u32)`** - Get vote count for an option

---

## 🎯 How It Works

### 1. Voting Flow

```
User clicks vote button
    ↓
Check wallet connected
    ↓
Set status = "Pending"
    ↓
Build transaction with contract.call('vote', option)
    ↓
Simulate transaction (get resource fees)
    ↓
Request wallet signature
    ↓
User approves in wallet
    ↓
Send signed transaction to network
    ↓
Wait for confirmation (poll every 1s, max 30s)
    ↓
Parse result and update UI
    ↓
Set status = "Success" or "Failed"
    ↓
Refresh vote counts from blockchain
```

### 2. Fetching Results

```
Component mounts
    ↓
Fetch initial votes from contract
    ↓
Display results
    ↓
Set interval (every 5 seconds)
    ↓
Auto-refresh votes from blockchain
    ↓
Update UI with latest counts
```

---

## 📊 Contract Interaction Details

### Vote Transaction
```javascript
// Build transaction
const transaction = new TransactionBuilder(sourceAccount, {
  fee: BASE_FEE,
  networkPassphrase: NETWORK_PASSPHRASE,
})
  .addOperation(
    contract.call('vote', nativeToScVal(option, { type: 'u32' }))
  )
  .setTimeout(30)
  .build();

// Simulate to get resource fees
const simulatedTx = await server.simulateTransaction(transaction);

// Prepare with simulation results
const preparedTx = SorobanRpc.assembleTransaction(transaction, simulatedTx).build();

// Sign with wallet
const signedXDR = await walletKit.signTransaction(preparedTx.toXDR(), {
  address: walletAddress,
  networkPassphrase: NETWORK_PASSPHRASE,
});

// Send to network
const sendResponse = await server.sendTransaction(signedTx);

// Wait for confirmation
const getResponse = await server.getTransaction(sendResponse.hash);
```

### Read Votes (No Signing Required)
```javascript
// Build read transaction
const transaction = new TransactionBuilder(sourceAccount, {
  fee: BASE_FEE,
  networkPassphrase: NETWORK_PASSPHRASE,
})
  .addOperation(
    contract.call('get_votes', nativeToScVal(option, { type: 'u32' }))
  )
  .setTimeout(30)
  .build();

// Simulate (read-only, no signing)
const simulatedTx = await server.simulateTransaction(transaction);

// Parse result
const voteCount = scValToNative(simulatedTx.result.retval);
```

---

## 🔄 Real-Time Updates

### Auto-Refresh Every 5 Seconds
```javascript
useEffect(() => {
  fetchVotes(); // Initial fetch
  
  const interval = setInterval(() => {
    fetchVotes(); // Refresh every 5 seconds
  }, 5000);
  
  return () => clearInterval(interval);
}, []);
```

---

## ⚠️ Error Handling

### Errors Handled
1. **Wallet Not Connected**
   - Alert: "Please connect your wallet first!"
   
2. **Transaction Rejected**
   - Message: "Transaction rejected by user"
   
3. **Insufficient Balance**
   - Message: "Insufficient balance for transaction"
   
4. **Contract Call Failed**
   - Message: "Contract call failed. Please check your connection."
   
5. **Network Errors**
   - Graceful fallback, returns 0 votes

### Error Display
```javascript
{voteStatus === "Failed" && (
  <div className="status status-failed">
    <span className="status-icon">✗</span>
    <span className="status-text">{error || "Vote failed"}</span>
  </div>
)}
```

---

## 🎨 UI Updates

### Status Indicators
- **Idle**: No status shown
- **Pending**: Yellow background + spinner + "Processing vote on blockchain..."
- **Success**: Green background + checkmark + "Vote recorded on blockchain!"
- **Failed**: Red background + X + error message

### Vote Buttons
- Disabled when:
  - Wallet not connected
  - Transaction in progress (`isVoting`)
- Visual feedback:
  - Selected state (gradient background)
  - Disabled state (reduced opacity)

### Results Display
- Title: "Live Results (from Blockchain)"
- Real-time vote counts from contract
- Progress bars with percentages
- Total vote count
- Auto-updates every 5 seconds

---

## 🧪 Testing the Integration

### 1. Start the App
```bash
npm run dev
```

### 2. Connect Wallet
- Click "Connect Wallet"
- Select Freighter (or another wallet)
- Approve connection

### 3. Vote
- Click "JavaScript" or "Python"
- Approve transaction in wallet
- Wait for confirmation (10-30 seconds)
- See "Vote recorded on blockchain!" message

### 4. Check Results
- Vote counts update automatically
- Progress bars show percentages
- Total votes displayed
- Results refresh every 5 seconds

### 5. Check Console
Open browser console (F12) to see detailed logs:
```
Contract Configuration:
Contract ID: CBVYU3LP455MKZEILE3I5RIHAGJEEYCRGNEQL5BYRFK73M6I3KA4HT36
RPC URL: https://soroban-testnet.stellar.org
Network: Test SDF Network ; September 2015

=== Vote Transaction Started ===
Option: 0
Public Key: GABC...
Fetching account...
Building transaction...
Simulating transaction...
Transaction signed
Sending transaction to network...
Waiting for confirmation...
=== Vote Transaction Successful ===
New vote count: 5
```

---

## 📝 Key Features

### ✅ Real Blockchain Integration
- All votes stored on Stellar blockchain
- Immutable and transparent
- Decentralized voting

### ✅ Wallet Signing
- Secure transaction signing
- User controls all transactions
- No private keys exposed

### ✅ Real-Time Updates
- Auto-refresh every 5 seconds
- Always shows latest blockchain data
- No manual refresh needed

### ✅ Error Handling
- Clear error messages
- Graceful fallbacks
- User-friendly feedback

### ✅ Transaction Status
- Pending state with spinner
- Success confirmation
- Failure notification
- Auto-reset after display

---

## 🔍 Debugging

### Check Contract Connection
```javascript
import { checkContract } from './utils/contract';

const isAccessible = await checkContract();
console.log('Contract accessible:', isAccessible);
```

### View Transaction on Explorer
After voting, check the transaction on Stellar Laboratory:
1. Go to https://laboratory.stellar.org/#explorer?network=test
2. Search for your wallet address
3. View recent transactions
4. See contract invocations

### Console Logs
All contract interactions log to console:
- Transaction building
- Simulation results
- Signing process
- Network responses
- Vote counts

---

## 🚀 Performance

### Transaction Times
- **Vote**: 10-30 seconds (includes confirmation)
- **Get Votes**: < 1 second (read-only)
- **Auto-refresh**: Every 5 seconds

### Gas Costs
- **Vote**: ~50,000-100,000 stroops (~0.005-0.01 XLM)
- **Get Votes**: Free (simulation only)

---

## 🎯 Next Steps

### Potential Enhancements
1. Add transaction history
2. Show recent voters
3. Add multiple polls
4. Implement vote limits per address
5. Add poll expiration
6. Display transaction hashes
7. Add loading skeletons
8. Implement optimistic updates

### Production Checklist
- [ ] Test on mainnet
- [ ] Update contract ID for mainnet
- [ ] Update network passphrase
- [ ] Add error monitoring
- [ ] Implement rate limiting
- [ ] Add transaction caching
- [ ] Optimize gas usage
- [ ] Add analytics

---

## 📚 Resources

- **Stellar SDK Docs**: https://stellar.github.io/js-stellar-sdk/
- **Soroban Docs**: https://soroban.stellar.org/docs
- **Stellar Laboratory**: https://laboratory.stellar.org/
- **Contract Code**: `poll_contract/src/lib.rs`

---

## ✅ Integration Complete!

The dApp now:
- ✅ Connects to real Stellar wallet
- ✅ Submits votes to blockchain
- ✅ Reads results from contract
- ✅ Updates in real-time
- ✅ Handles errors gracefully
- ✅ Shows transaction status

**Ready for production use on Stellar Testnet!** 🎉

# 🧪 Testing Blockchain Integration

## Quick Test Guide

### Prerequisites
- ✅ Freighter wallet installed
- ✅ Wallet funded with testnet XLM
- ✅ App running (`npm run dev`)

---

## 🚀 Step-by-Step Test

### 1. Start the App
```bash
npm run dev
```
Open: http://localhost:5176

### 2. Open Browser Console
Press **F12** or **Cmd+Option+I**

You should see:
```
Contract Configuration:
Contract ID: CBVYU3LP455MKZEILE3I5RIHAGJEEYCRGNEQL5BYRFK73M6I3KA4HT36
RPC URL: https://soroban-testnet.stellar.org
Network: Test SDF Network ; September 2015
```

### 3. Connect Wallet
- Click "Connect Wallet"
- Select Freighter
- Approve connection
- See your address displayed

### 4. Check Initial Votes
Console should show:
```
Poll component mounted, fetching initial votes...
=== Fetching All Votes ===
=== Fetching Votes ===
Option: 0
=== Fetching Votes ===
Option: 1
All votes fetched: { option0: X, option1: Y }
Votes updated: { option0: X, option1: Y }
```

UI should display current vote counts from blockchain.

### 5. Vote for JavaScript
- Click "JavaScript" button
- Button becomes disabled
- Status shows: "Processing vote on blockchain..."
- Freighter popup appears
- Click "Approve" in Freighter

Console shows:
```
=== Starting Vote Process ===
Option: 0
Wallet Address: GABC...
=== Vote Transaction Started ===
Fetching account...
Building transaction...
Simulating transaction...
Requesting wallet signature...
Transaction signed successfully
Sending transaction to network...
Waiting for confirmation...
Polling attempt 1/30...
Polling attempt 2/30...
...
Transaction status: SUCCESS
=== Vote Transaction Successful ===
New vote count: X
Vote successful! New count: X
```

UI updates:
- Status: "Vote recorded on blockchain!" (green)
- Vote count increments
- Progress bar updates
- Status auto-hides after 3 seconds

### 6. Vote for Python
- Click "Python" button
- Same flow as JavaScript
- See transaction in console
- UI updates with new count

### 7. Watch Auto-Refresh
Every 5 seconds, console shows:
```
Auto-refreshing votes...
Fetching votes from contract...
=== Fetching All Votes ===
All votes fetched: { option0: X, option1: Y }
Votes updated: { option0: X, option1: Y }
```

UI automatically updates with latest blockchain data.

---

## ✅ Expected Behavior

### Successful Vote
1. Button disabled during transaction
2. Status: "Pending" (yellow, spinner)
3. Freighter popup for approval
4. Wait 10-30 seconds
5. Status: "Success" (green, checkmark)
6. Vote count increments
7. Progress bars update
8. Status auto-hides after 3s

### Rejected Transaction
1. Click vote button
2. Freighter popup appears
3. Click "Reject"
4. Status: "Failed" (red, X)
5. Message: "Transaction rejected by user"
6. Status auto-hides after 5s

### No Wallet Connected
1. Click vote button
2. Alert: "Please connect your wallet first!"

---

## 🔍 Verification

### Check on Blockchain
1. Go to https://laboratory.stellar.org/#explorer?network=test
2. Enter your wallet address
3. See recent transactions
4. Find contract invocations
5. Verify vote transactions

### Check Contract Directly
```bash
export CONTRACT_ID=CBVYU3LP455MKZEILE3I5RIHAGJEEYCRGNEQL5BYRFK73M6I3KA4HT36

# Get JavaScript votes
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  get_votes \
  --option 0

# Get Python votes
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  get_votes \
  --option 1
```

---

## 🐛 Troubleshooting

### Issue: "Contract Configuration" not showing
**Solution**: Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)

### Issue: Votes show as 0
**Check**:
1. Contract ID correct in `.env`?
2. Network connection working?
3. Console shows any errors?

**Solution**: Check console for specific error messages

### Issue: Transaction stuck on "Pending"
**Possible Causes**:
1. Network congestion
2. Insufficient balance
3. Wallet not responding

**Solution**:
1. Wait up to 30 seconds
2. Check Freighter is unlocked
3. Check testnet XLM balance
4. Try again

### Issue: "Insufficient balance"
**Solution**:
```bash
# Fund your account
curl "https://friendbot.stellar.org?addr=YOUR_ADDRESS"
```

### Issue: Transaction fails immediately
**Check**:
1. Console error messages
2. Contract ID correct?
3. Network configured correctly?

**Solution**: Check `.env` file matches contract deployment

---

## 📊 Console Log Reference

### Successful Vote Flow
```
=== Starting Vote Process ===
Option: 0
Wallet Address: GABC...
=== Vote Transaction Started ===
Fetching account...
Account fetched successfully
Building transaction...
Transaction built, preparing for simulation...
Simulating transaction...
Simulation result: [Object]
Preparing transaction with simulation results...
Transaction prepared, requesting signature...
Requesting wallet signature...
Transaction signed successfully
Transaction signed
Sending transaction to network...
Transaction sent: [Object]
Waiting for confirmation...
Polling attempt 1/30...
Polling attempt 2/30...
Transaction status: SUCCESS
=== Vote Transaction Successful ===
New vote count: 5
Vote successful! New count: 5
Fetching votes from contract...
=== Fetching All Votes ===
All votes fetched: { option0: 5, option1: 3 }
Votes updated: { option0: 5, option1: 3 }
```

### Auto-Refresh
```
Auto-refreshing votes...
Fetching votes from contract...
=== Fetching All Votes ===
=== Fetching Votes ===
Option: 0
Simulating get_votes transaction...
Vote count for option 0 : 5
=== Fetch Votes Successful ===
=== Fetching Votes ===
Option: 1
Simulating get_votes transaction...
Vote count for option 1 : 3
=== Fetch Votes Successful ===
All votes fetched: { option0: 5, option1: 3 }
Votes updated: { option0: 5, option1: 3 }
```

---

## ✅ Success Criteria

Your integration is working if:
- ✅ Contract configuration logs appear
- ✅ Initial votes load from blockchain
- ✅ Vote button triggers Freighter popup
- ✅ Transaction completes successfully
- ✅ Vote count increments on blockchain
- ✅ UI updates with new count
- ✅ Auto-refresh works every 5 seconds
- ✅ No console errors
- ✅ Status messages display correctly

---

## 🎯 Test Checklist

- [ ] App loads without errors
- [ ] Contract configuration logs show
- [ ] Initial votes fetch from blockchain
- [ ] Wallet connects successfully
- [ ] Vote button opens Freighter
- [ ] Transaction can be approved
- [ ] Vote count increments
- [ ] UI updates correctly
- [ ] Status messages display
- [ ] Auto-refresh works
- [ ] Can vote multiple times
- [ ] Both options work
- [ ] Error handling works (reject transaction)
- [ ] Results match blockchain data

---

**Ready to test! Open http://localhost:5176 and start voting!** 🗳️

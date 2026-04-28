# 🧪 Testing Guide - Wallet Connection

## Quick Test

### 1. Start the App
```bash
cd stellar-poll-dapp
npm run dev
```
Open: **http://localhost:5176**

### 2. Open Browser Console
Press **F12** or **Cmd+Option+I** (Mac)

### 3. Check Initialization
You should see:
```
Initializing StellarWalletsKit...
StellarWalletsKit initialized successfully
```

### 4. Click "Connect Wallet"
You should see:
```
=== Connect Wallet Started ===
Current timestamp: 2026-04-29T...
Opening wallet modal...
Kit configuration: { network: "TESTNET", selectedWalletId: "freighter" }
Modal opened successfully
```

### 5. Select Freighter
You should see:
```
=== Wallet Selected ===
Selected wallet ID: freighter
Wallet name: Freighter
Setting wallet...
Wallet set successfully
Getting address from wallet...
Raw result from getAddress(): { address: "GABC..." }
Extracted address: GABC...
=== Connection Successful ===
Final address: GABC...
Wallet connected: GABC...
```

### 6. Check UI
- ✅ Address displayed as `GABC...XYZ`
- ✅ Green checkmark icon visible
- ✅ "Disconnect" button appears
- ✅ Poll interface becomes available

---

## Detailed Test Scenarios

### Scenario 1: Successful Connection ✅

**Steps:**
1. Click "Connect Wallet"
2. Modal opens with wallet list
3. Click "Freighter"
4. Approve in Freighter popup
5. Address appears in UI

**Expected Console Output:**
```
=== Connect Wallet Started ===
Opening wallet modal...
Modal opened successfully
=== Wallet Selected ===
Selected wallet ID: freighter
Getting address from wallet...
=== Connection Successful ===
Final address: GABC123...
```

**Expected UI:**
- ✓ icon with address
- Disconnect button
- Poll interface visible

---

### Scenario 2: User Rejects Connection ❌

**Steps:**
1. Click "Connect Wallet"
2. Select Freighter
3. Click "Reject" in Freighter popup

**Expected Console Output:**
```
=== Connect Wallet Started ===
=== Wallet Selected ===
=== Error Getting Address ===
Error message: User rejected the request
```

**Expected UI:**
- Error message: "Connection rejected by user"
- Connect button returns to normal

---

### Scenario 3: User Closes Modal 🚫

**Steps:**
1. Click "Connect Wallet"
2. Close modal without selecting wallet

**Expected Console Output:**
```
=== Connect Wallet Started ===
Modal opened successfully
=== Modal Closed ===
User closed modal without selecting wallet
```

**Expected UI:**
- No error message
- Connect button returns to normal

---

### Scenario 4: Disconnect ✅

**Steps:**
1. Connect wallet successfully
2. Click "Disconnect"

**Expected Console Output:**
```
=== Disconnecting Wallet ===
Wallet disconnected successfully
```

**Expected UI:**
- Address clears
- "Connect Wallet" button appears
- Poll interface hidden

---

### Scenario 5: Reconnect ✅

**Steps:**
1. Connect wallet
2. Disconnect
3. Connect again

**Expected:**
- Works without issues
- Same flow as first connection

---

## Console Log Checklist

### On Page Load
- [ ] "Initializing StellarWalletsKit..."
- [ ] "StellarWalletsKit initialized successfully"

### On Connect Click
- [ ] "=== Connect Wallet Started ==="
- [ ] "Opening wallet modal..."
- [ ] "Kit configuration: ..."
- [ ] "Modal opened successfully"

### On Wallet Selection
- [ ] "=== Wallet Selected ==="
- [ ] "Selected wallet ID: freighter"
- [ ] "Setting wallet..."
- [ ] "Wallet set successfully"
- [ ] "Getting address from wallet..."
- [ ] "Raw result from getAddress(): ..."
- [ ] "Extracted address: ..."

### On Success
- [ ] "=== Connection Successful ==="
- [ ] "Final address: ..."
- [ ] "Wallet connected: ..."

### On Disconnect
- [ ] "=== Disconnecting Wallet ==="
- [ ] "Wallet disconnected successfully"

---

## Error Messages Reference

| Scenario | Error Message |
|----------|--------------|
| User rejects | "Connection rejected by user" |
| User denies | "Connection denied by user" |
| User closes popup | "Connection cancelled" |
| Wallet not found | "Wallet not found" |
| No wallet installed | "No wallet detected. Please install Freighter or another Stellar wallet." |
| Generic error | "Failed to connect. Please try again." |

---

## Troubleshooting

### Problem: No console logs appear

**Solution:**
1. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
2. Clear cache
3. Check console is set to show all logs (not just errors)

### Problem: Modal doesn't open

**Check:**
1. Console for errors
2. Freighter installed?
3. Browser is Chrome/Brave?

**Solution:**
- Install Freighter extension
- Use Chrome or Brave browser
- Check console for specific error

### Problem: Freighter not in list

**Check:**
1. Freighter extension enabled?
2. Console shows "allowAllModules"?

**Solution:**
- Enable Freighter in browser extensions
- Verify `modules: allowAllModules()` in code

### Problem: Address format error

**Check:**
1. Console shows "Raw result from getAddress()"
2. Address starts with 'G'?

**Solution:**
- Code now handles both formats
- Validates address automatically

---

## Browser Compatibility

### Supported ✅
- Chrome (recommended)
- Brave
- Edge
- Firefox (with Freighter)

### Not Supported ❌
- Safari (Freighter not available)
- Mobile browsers (limited support)

---

## Pre-Test Checklist

Before testing, ensure:
- [ ] Freighter extension installed
- [ ] Freighter wallet created
- [ ] Freighter unlocked
- [ ] On Testnet in Freighter settings
- [ ] Browser console open (F12)
- [ ] App running (`npm run dev`)

---

## Success Criteria

✅ **Connection Works** if:
1. Modal opens when clicking "Connect Wallet"
2. Freighter appears in wallet list
3. Selecting Freighter shows approval popup
4. Approving shows address in UI
5. Console shows all expected logs
6. No errors in console
7. Disconnect works
8. Reconnect works

---

## Quick Debug Commands

### Check if Freighter is installed
```javascript
// In browser console
window.freighter !== undefined
```

### Check StellarWalletsKit
```javascript
// Should see kit configuration
console.log(kit)
```

### Force reconnect
```javascript
// Disconnect and connect again
// Should work without page refresh
```

---

## Expected Timeline

- **Page Load**: < 1 second
- **Modal Open**: < 500ms
- **Wallet Selection**: Instant
- **Address Retrieval**: 1-2 seconds
- **UI Update**: Instant

---

## Final Verification

After all tests pass:
- ✅ No console errors
- ✅ All logs appear as expected
- ✅ UI updates correctly
- ✅ Can connect/disconnect multiple times
- ✅ Error messages are clear
- ✅ Works in Chrome

---

**Status**: Ready for Testing
**Last Updated**: April 29, 2026

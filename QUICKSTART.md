# 🚀 Quick Start Guide

## Get Running in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
Open the URL shown in terminal (usually `http://localhost:5173`)

## ✅ What's Working

- ✅ **Wallet Connection**: Connect with Freighter, xBull, or other Stellar wallets
- ✅ **Voting UI**: Click JavaScript or Python to cast your vote
- ✅ **Results Display**: See vote counts update in real-time
- ✅ **Transaction Status**: Track vote status (Idle → Pending → Success)
- ✅ **Error Handling**: Proper error messages for wallet issues

## 🎯 Features Implemented

### Wallet Integration
- Multi-wallet support via StellarWalletsKit
- Connect/Disconnect functionality
- Wallet address display (truncated)
- Connection error handling

### Poll Interface
- Clean, centered UI design
- Two voting options (JavaScript vs Python)
- Visual feedback on selection
- Disabled state during voting

### Results Section
- Real-time vote count display
- Clean result cards
- Gradient styling

### Transaction Status
- Status indicator with color coding:
  - **Idle**: Gray (waiting)
  - **Pending**: Yellow (processing)
  - **Success**: Green (completed)
  - **Failed**: Red (error)

## 📱 UI Features

- Responsive design (mobile-friendly)
- Gradient background
- Smooth animations
- Button hover effects
- Selected option highlighting

## 🔧 Current Implementation

The app currently uses **simulated voting** (dummy data) to demonstrate the UI flow. The next step is to integrate with a deployed Soroban smart contract for real blockchain voting.

## 🎨 Customization

### Change Poll Question
Edit `src/components/Poll.jsx`:
```javascript
<h2 className="poll-question">Your question here?</h2>
```

### Change Vote Options
Edit the button labels in `src/components/Poll.jsx`:
```javascript
<button onClick={() => handleVote("option1")}>
  Option 1
</button>
```

### Modify Styling
- Global styles: `src/index.css`
- Component styles: `src/App.css`

## 🐛 Common Issues

**Issue**: Wallet modal doesn't open
**Solution**: Make sure you have a Stellar wallet extension installed (Freighter recommended)

**Issue**: Port already in use
**Solution**: Vite will automatically use the next available port. Check terminal output.

**Issue**: Connection rejected
**Solution**: This is expected if you cancel the wallet connection. Try again.

## 📦 Project Structure

```
src/
├── components/
│   ├── WalletButton.jsx  # Handles wallet connection
│   └── Poll.jsx          # Voting interface and results
├── App.jsx               # Main app component
├── App.css               # Styling
└── main.jsx              # Entry point
```

## 🔜 Next Steps

1. Deploy Soroban smart contract
2. Integrate contract calls
3. Replace dummy voting with real transactions
4. Add transaction history
5. Implement real-time blockchain updates

---

**Need Help?** Check the main README.md for detailed documentation.

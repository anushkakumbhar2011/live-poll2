# 🌟 Stellar Live Poll dApp

A minimal, fully functional decentralized polling application built on the Stellar blockchain using Soroban smart contracts.

## 📋 Project Overview

This is a Level 2 dApp that allows users to:
- Connect their Stellar wallet (Freighter, xBull, etc.)
- Vote on a poll question
- View real-time voting results
- Track transaction status

## 🛠️ Tech Stack

- **Frontend**: React (Vite)
- **Wallet Integration**: @creit.tech/stellar-wallets-kit
- **Blockchain**: Stellar Testnet (Soroban)
- **SDK**: @stellar/stellar-sdk
- **Language**: JavaScript

## 📁 Project Structure

```
stellar-poll-dapp/
├── src/
│   ├── components/
│   │   ├── WalletButton.jsx    # Wallet connection component
│   │   └── Poll.jsx             # Voting interface component
│   ├── App.jsx                  # Main application
│   ├── App.css                  # Application styles
│   ├── index.css                # Global styles
│   └── main.jsx                 # Entry point
├── package.json
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Stellar wallet (Freighter recommended)

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd stellar-poll-dapp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 🎮 How to Use

1. **Connect Wallet**:
   - Click the "Connect Wallet" button
   - Select your preferred wallet (Freighter, xBull, etc.)
   - Approve the connection

2. **Vote**:
   - Choose between "JavaScript" or "Python"
   - Click your preferred option
   - Wait for transaction confirmation

3. **View Results**:
   - Results update automatically after each vote
   - See vote counts for each option

## 🔐 Wallet Support

The dApp supports multiple Stellar wallets through StellarWalletsKit:
- Freighter
- xBull
- Rabet
- Albedo
- And more...

## ⚠️ Error Handling

The application handles:
- Wallet not connected
- Connection rejected by user
- Transaction failures
- Network errors

## 🌐 Network Configuration

Currently configured for **Stellar Testnet**.

To switch networks, modify the `WalletNetwork` in `App.jsx`:
```javascript
const kit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET, // or WalletNetwork.PUBLIC for mainnet
  selectedWalletId: "freighter",
  modules: []
});
```

## 📝 Environment Variables

Create a `.env` file in the root directory (for future smart contract integration):

```env
VITE_CONTRACT_ID=your_contract_id_here
VITE_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
```

## 🔮 Future Enhancements

- [ ] Deploy Soroban smart contract
- [ ] Integrate contract calls for voting
- [ ] Real-time result updates from blockchain
- [ ] Transaction history
- [ ] Multiple poll support

## 🧪 Current Status

✅ Wallet connection working
✅ UI fully functional
✅ Vote simulation working
⏳ Smart contract integration (pending)

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🐛 Troubleshooting

**Wallet not connecting?**
- Make sure you have a Stellar wallet extension installed
- Check that you're on the correct network (Testnet)

**Port already in use?**
- Vite will automatically try the next available port
- Check the terminal output for the correct port number

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

---

Built with ❤️ using Stellar and React

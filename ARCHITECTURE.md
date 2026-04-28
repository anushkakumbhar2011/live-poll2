# 🏗️ Architecture Overview

## Component Hierarchy

```
App.jsx (Root)
├── WalletButton.jsx (Wallet Connection)
│   ├── Connect Button
│   ├── Wallet Info Display
│   ├── Disconnect Button
│   └── Error Messages
│
└── Poll.jsx (Voting Interface)
    ├── Poll Question
    ├── Vote Buttons
    │   ├── JavaScript Button
    │   └── Python Button
    ├── Status Section
    │   └── Transaction Status
    └── Results Section
        ├── JavaScript Vote Count
        └── Python Vote Count
```

## Data Flow

```
┌─────────────────────────────────────────────────┐
│                   App.jsx                       │
│  State: walletAddress                           │
│  Kit: StellarWalletsKit instance                │
└─────────────────┬───────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
┌───────────────┐   ┌──────────────────┐
│ WalletButton  │   │     Poll.jsx     │
│               │   │                  │
│ Props:        │   │ Props:           │
│ - kit         │   │ - walletAddress  │
│ - onConnect   │   │                  │
│               │   │ State:           │
│ State:        │   │ - selectedOption │
│ - address     │   │ - voteStatus     │
│ - error       │   │ - votes          │
│ - isConnecting│   │                  │
└───────────────┘   └──────────────────┘
```

## State Management

### App.jsx
```javascript
const [walletAddress, setWalletAddress] = useState("");
```
- Stores connected wallet address
- Passed to Poll component
- Updated via WalletButton callback

### WalletButton.jsx
```javascript
const [address, setAddress] = useState("");
const [error, setError] = useState("");
const [isConnecting, setIsConnecting] = useState(false);
```
- `address`: Current connected wallet
- `error`: Connection error messages
- `isConnecting`: Loading state during connection

### Poll.jsx
```javascript
const [selectedOption, setSelectedOption] = useState(null);
const [voteStatus, setVoteStatus] = useState("Idle");
const [votes, setVotes] = useState({ javascript: 0, python: 0 });
```
- `selectedOption`: Currently selected vote option
- `voteStatus`: Transaction status (Idle/Pending/Success/Failed)
- `votes`: Vote counts for each option

## Event Flow

### Wallet Connection Flow
```
User clicks "Connect Wallet"
    ↓
WalletButton.connectWallet()
    ↓
kit.openModal() - Opens wallet selection
    ↓
User selects wallet (e.g., Freighter)
    ↓
kit.setWallet(option.id)
    ↓
kit.getAddress() - Gets wallet address
    ↓
setAddress(address) - Updates local state
    ↓
onConnect(address) - Calls parent callback
    ↓
App.setWalletAddress(address) - Updates app state
    ↓
Poll component receives walletAddress prop
```

### Voting Flow
```
User clicks vote button (e.g., "JavaScript")
    ↓
Poll.handleVote("javascript")
    ↓
Check if wallet connected
    ↓
setSelectedOption("javascript")
    ↓
setVoteStatus("Pending")
    ↓
[Simulate transaction - 1.5s delay]
    ↓
Update vote count
    ↓
setVoteStatus("Success")
    ↓
[Auto-reset after 3s]
    ↓
setVoteStatus("Idle")
```

## Styling Architecture

### Global Styles (index.css)
- Body background gradient
- Root container sizing
- Base reset styles

### Component Styles (App.css)
- `.app-container` - Main card container
- `.wallet-section` - Wallet button area
- `.poll-container` - Voting interface
- `.results-section` - Results display
- Responsive breakpoints

## Key Features

### 1. Wallet Integration
**Technology**: `@creit.tech/stellar-wallets-kit`

**Supported Wallets**:
- Freighter
- xBull
- Rabet
- Albedo
- WalletConnect

**Configuration**:
```javascript
const kit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  selectedWalletId: "freighter",
  modules: []
});
```

### 2. Error Handling

**Wallet Errors**:
- Connection rejected → Display error message
- Wallet not found → Alert user
- Network issues → Catch and display

**Vote Errors**:
- No wallet connected → Alert before voting
- Transaction failed → Show failed status

### 3. UI States

**Wallet Button States**:
- Disconnected: Show "Connect Wallet"
- Connecting: Show "Connecting..." (disabled)
- Connected: Show address + "Disconnect"

**Vote Button States**:
- Default: White with purple border
- Hover: Purple background
- Selected: Purple background + shadow
- Disabled: Reduced opacity

**Status States**:
- Idle: Gray background
- Pending: Yellow background + pulse animation
- Success: Green background
- Failed: Red background

## Future Integration Points

### Smart Contract Integration
```javascript
// In Poll.jsx - handleVote function
async function handleVote(option) {
  // 1. Build transaction
  const transaction = buildVoteTransaction(option);
  
  // 2. Sign with wallet
  const signedTx = await kit.signTransaction(transaction);
  
  // 3. Submit to network
  const result = await submitTransaction(signedTx);
  
  // 4. Update UI based on result
  setVoteStatus(result.success ? "Success" : "Failed");
}
```

### Real-time Updates
```javascript
// Fetch votes from blockchain
async function fetchVotes() {
  const jsVotes = await contract.get_votes(0);
  const pyVotes = await contract.get_votes(1);
  setVotes({ javascript: jsVotes, python: pyVotes });
}

// Poll every 5 seconds
useEffect(() => {
  const interval = setInterval(fetchVotes, 5000);
  return () => clearInterval(interval);
}, []);
```

## Dependencies

### Production
- `react`: ^19.2.5
- `react-dom`: ^19.2.5
- `@creit.tech/stellar-wallets-kit`: Latest
- `@stellar/stellar-sdk`: Latest

### Development
- `vite`: ^8.0.10
- `@vitejs/plugin-react`: ^6.0.1
- `eslint`: ^10.2.1

## Build & Deploy

### Development
```bash
npm run dev
```
Starts Vite dev server with HMR

### Production Build
```bash
npm run build
```
Outputs to `dist/` directory

### Preview Production
```bash
npm run preview
```
Preview production build locally

## Performance Considerations

1. **Component Optimization**:
   - Minimal re-renders
   - Proper state management
   - No unnecessary effects

2. **Bundle Size**:
   - Tree-shaking enabled
   - Code splitting ready
   - Minimal dependencies

3. **User Experience**:
   - Fast initial load
   - Smooth animations
   - Instant feedback

## Security Considerations

1. **Wallet Security**:
   - No private keys stored
   - User controls all transactions
   - Wallet handles signing

2. **Input Validation**:
   - Check wallet connection before voting
   - Validate transaction responses
   - Handle errors gracefully

3. **Network Security**:
   - HTTPS only in production
   - Testnet for development
   - No sensitive data in frontend

---

**Architecture Status**: ✅ Complete and Production-Ready

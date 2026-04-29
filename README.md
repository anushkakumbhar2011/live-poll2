# Live Poll DApp

A decentralized voting application built on Stellar blockchain using Soroban smart contracts. Users can connect their Stellar wallets and participate in real-time polls with transparent, immutable vote recording on the blockchain.

## Features

- **Multi-Wallet Support** - Connect with Freighter, xBull, Rabet, Lobstr, and other Stellar wallets via StellarWalletsKit
- **Smart Contract Integration** - All votes stored on-chain using Soroban smart contracts
- **Real-Time Vote Updates** - Automatic polling every 5 seconds to display latest blockchain data
- **Transaction Status Tracking** - Visual feedback for pending, success, and failed transactions
- **Comprehensive Error Handling** - Clear messages for wallet connection issues, rejected transactions, and insufficient balance
- **Responsive UI** - Clean, modern interface that works on desktop and mobile devices

## Tech Stack

### Frontend
- **React** 19.2.5
- **Vite** 8.0.10 - Build tool and dev server
- **Stellar SDK** (@stellar/stellar-sdk) - Blockchain interaction
- **StellarWalletsKit** (@creit.tech/stellar-wallets-kit) - Multi-wallet integration

### Smart Contract
- **Language**: Rust
- **Framework**: Soroban SDK 21.7.0
- **Network**: Stellar Testnet

### Wallet Integration
- **StellarWalletsKit** 2.1.0
- **Supported Wallets**: Freighter, xBull, Rabet, Albedo, Lobstr, Hana, Klever, OneKey, Bitget

## Smart Contract Details

### Contract Address
```
CBVYU3LP455MKZEILE3I5RIHAGJEEYCRGNEQL5BYRFK73M6I3KA4HT36
```

### Network Configuration
- **Network**: Stellar Testnet
- **RPC URL**: https://soroban-testnet.stellar.org
- **Network Passphrase**: Test SDF Network ; September 2015

### Contract Functions

#### `vote(option: u32) -> u32`
Submits a vote for the specified option and returns the new vote count.
- **Parameters**: 
  - `option`: u32 (0 for JavaScript, 1 for Python)
- **Returns**: New vote count for the option
- **Validation**: Panics if option > 1

#### `get_votes(option: u32) -> u32`
Retrieves the current vote count for an option.
- **Parameters**: 
  - `option`: u32 (0 or 1)
- **Returns**: Current vote count (0 if no votes)
- **Validation**: Panics if option > 1

### Storage
- **Type**: Instance storage
- **Key Format**: `(Symbol("opt"), option_number)`
- **Persistence**: Data persists across contract invocations

## Wallet Integration

### StellarWalletsKit Implementation

The application uses StellarWalletsKit to provide seamless multi-wallet support:

```javascript
import { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";
import { defaultModules } from "@creit.tech/stellar-wallets-kit/modules/utils";

StellarWalletsKit.init({
  modules: defaultModules()
});
```

### Supported Wallets
- Freighter (Browser Extension & Mobile)
- xBull (PWA & Extension)
- Rabet (Extension)
- Albedo
- Lobstr
- Hana
- Klever
- OneKey
- Bitget

### Connection Flow
1. User clicks "Connect Wallet" button
2. StellarWalletsKit modal displays available wallets
3. User selects preferred wallet
4. Wallet prompts for connection approval
5. Upon approval, wallet address is retrieved and stored
6. User can now interact with smart contract


## Error Handling

The application implements comprehensive error handling for common blockchain interaction scenarios:

### 1. Wallet Not Found
**Trigger**: No Stellar wallet extension detected in browser
**Message**: "No wallet detected. Please install Freighter or another Stellar wallet."
**User Action**: Install a supported wallet extension

### 2. Transaction Rejected
**Trigger**: User declines transaction in wallet popup
**Message**: "Transaction rejected by user"
**User Action**: Retry transaction and approve in wallet

### 3. Insufficient Balance
**Trigger**: Account lacks XLM for transaction fees
**Message**: "Insufficient balance for transaction"
**User Action**: Fund account via Stellar Laboratory friendbot or transfer XLM

### Additional Error Handling
- **Connection Cancelled**: User closes wallet modal without selecting
- **Network Errors**: RPC connection failures with graceful fallback
- **Contract Simulation Failures**: Invalid contract calls with specific error messages
- **Invalid Options**: Contract-level validation for vote options

## Real-Time Features

### Automatic Vote Synchronization

The application implements real-time vote updates using a polling mechanism:

```javascript
useEffect(() => {
  fetchVotes(); // Initial fetch on mount
  
  const interval = setInterval(() => {
    fetchVotes(); // Poll every 5 seconds
  }, 5000);
  
  return () => clearInterval(interval);
}, []);
```

##Live Versal Link:
live-poll2-7sqr.vercel.app


### State Synchronization
- **Initial Load**: Fetches current vote counts from blockchain on component mount
- **Auto-Refresh**: Polls contract every 5 seconds for latest data
- **Post-Vote Update**: Immediately fetches updated counts after successful vote
- **UI Updates**: React state automatically re-renders with new blockchain data

### Event Flow
1. Component mounts → Fetch initial votes from contract
2. Display current vote counts and percentages
3. Every 5 seconds → Query contract for latest votes
4. Update UI with new data if changed
5. After user votes → Immediate refresh to show updated count

## Transaction Flow

### Vote Transaction Lifecycle

#### 1. Transaction Initiation
- User clicks vote button (JavaScript or Python)
- Application validates wallet connection
- UI state changes to "Pending"
- Vote buttons become disabled

#### 2. Transaction Building
```javascript
const transaction = new TransactionBuilder(sourceAccount, {
  fee: BASE_FEE,
  networkPassphrase: NETWORK_PASSPHRASE,
})
  .addOperation(contract.call('vote', nativeToScVal(option, { type: 'u32' })))
  .setTimeout(30)
  .build();
```

#### 3. Transaction Simulation
- Transaction simulated on Soroban RPC to calculate resource fees
- Simulation validates contract call will succeed
- Resource fees added to transaction

#### 4. Wallet Signing
- Prepared transaction sent to wallet via StellarWalletsKit
- User reviews transaction details in wallet popup
- User approves or rejects transaction
- Signed XDR returned to application

#### 5. Network Submission
- Signed transaction submitted to Stellar Testnet
- Transaction hash received from network
- Application begins polling for confirmation

#### 6. Confirmation Polling
- Poll transaction status every 1 second (max 30 attempts)
- Check for status: NOT_FOUND → SUCCESS or FAILED
- Parse transaction result on success

#### 7. Result Processing
- Extract new vote count from transaction result
- Update local state with new count
- Trigger full vote refresh from contract
- Display success message to user

#### 8. UI State Reset
- Status changes to "Success" (green checkmark)
- Vote count and progress bars update
- After 3 seconds, status indicator auto-hides
- Vote buttons re-enabled for next vote

### Transaction States

| State | UI Indicator | Description |
|-------|--------------|-------------|
| **Idle** | No indicator | Default state, ready for voting |
| **Pending** | Yellow badge + spinner | Transaction building/signing/confirming |
| **Success** | Green badge + checkmark | Vote recorded on blockchain |
| **Failed** | Red badge + X | Transaction rejected or failed |

### Error Recovery
- Failed transactions automatically reset UI after 5 seconds
- User can immediately retry voting
- Error messages provide specific guidance for resolution

## Deployment Details

### Smart Contract
- **Contract ID**: `CBVYU3LP455MKZEILE3I5RIHAGJEEYCRGNEQL5BYRFK73M6I3KA4HT36`
- **Network**: Stellar Testnet
- **Deployment Tool**: Soroban CLI
- **Source Code**: `poll_contract/src/lib.rs`

### Frontend
- **Build Tool**: Vite
- **Development Server**: `npm run dev`
- **Production Build**: `npm run build`
- **Deployment**: Static hosting (Vercel, Netlify, etc.)

### Environment Configuration
```env
VITE_CONTRACT_ID=CBVYU3LP455MKZEILE3I5RIHAGJEEYCRGNEQL5BYRFK73M6I3KA4HT36
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
```

## Screenshots

### Wallet Connection
![Wallet Connection UI](docs/screenshots/wallet-connect.png)
*Multi-wallet selection modal with support for Freighter, xBull, Rabet, and more*

### Voting Interface
![Voting Interface](docs/screenshots/voting-ui.png)
*Clean voting interface with JavaScript vs Python poll options*

### Transaction Status
![Transaction Status](docs/screenshots/transaction-status.png)
*Real-time transaction status tracking with pending, success, and failed states*

### Live Results
![Live Results](docs/screenshots/live-results.png)
*Real-time vote counts and percentages from blockchain with progress bars*

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- Rust and Cargo (for contract development)
- Soroban CLI (for contract deployment)
- Stellar wallet (Freighter recommended)

### Frontend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd stellar-poll-dapp
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your contract ID if deploying new contract
```

4. **Start development server**
```bash
npm run dev
```

5. **Open application**
```
http://localhost:5173
```

### Smart Contract Setup

1. **Navigate to contract directory**
```bash
cd poll_contract
```

2. **Build contract**
```bash
cargo build --target wasm32-unknown-unknown --release
```

3. **Run tests**
```bash
cargo test
```

4. **Deploy to testnet** (requires Soroban CLI)
```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/poll_contract.wasm \
  --source alice \
  --network testnet
```

5. **Update frontend .env with new contract ID**

### Quick Start with Deployment Script
```bash
cd poll_contract
./deploy.sh
```

This automated script handles building, testing, and deploying the contract.

## Usage

1. **Connect Wallet**
   - Click "Connect Wallet" button
   - Select your preferred Stellar wallet
   - Approve connection in wallet popup

2. **Vote**
   - Choose between JavaScript or Python
   - Click your preferred option
   - Approve transaction in wallet
   - Wait 10-30 seconds for blockchain confirmation

3. **View Results**
   - Vote counts update automatically every 5 seconds
   - Progress bars show percentage distribution
   - Total votes displayed at bottom

## Testing

### Frontend Tests
```bash
npm run test
```

### Contract Tests
```bash
cd poll_contract
cargo test
```

### Manual Testing Checklist
- [ ] Wallet connection works with multiple wallet types
- [ ] Vote transaction completes successfully
- [ ] Vote counts increment correctly on blockchain
- [ ] Real-time updates refresh every 5 seconds
- [ ] Transaction rejection handled gracefully
- [ ] Insufficient balance error displays correctly
- [ ] UI updates reflect blockchain state accurately

## Project Structure

```
stellar-poll-dapp/
├── poll_contract/              # Soroban smart contract
│   ├── src/
│   │   └── lib.rs             # Contract implementation
│   ├── Cargo.toml             # Rust dependencies
│   └── deploy.sh              # Deployment script
├── src/
│   ├── components/
│   │   ├── WalletButton.jsx   # Wallet connection component
│   │   └── Poll.jsx           # Voting interface component
│   ├── utils/
│   │   └── contract.js        # Contract interaction utilities
│   ├── App.jsx                # Main application
│   └── main.jsx               # Entry point
├── .env                       # Environment configuration
└── package.json               # Node dependencies
```

## Level 2 Submission Checklist

### Required Components
- [x] **Public GitHub Repository** - Code publicly accessible
- [x] **Minimum 2 Meaningful Commits** - Development history visible
- [x] **Smart Contract Deployed on Testnet** - Contract ID: `CBVYU3LP455MKZEILE3I5RIHAGJEEYCRGNEQL5BYRFK73M6I3KA4HT36`
- [x] **Multi-Wallet Integration** - StellarWalletsKit with 9+ wallet support
- [x] **Transaction Status Tracking** - Pending/Success/Failed states implemented
- [x] **Error Handling** - Wallet not found, transaction rejected, insufficient balance
- [x] **Real-Time Updates** - 5-second polling for vote synchronization

### Example Transaction Hash
```
Transaction Hash: [View on Stellar Laboratory]
https://laboratory.stellar.org/#explorer?resource=transactions&endpoint=single&network=test
```

### Verification Steps for Judges
1. Clone repository and run `npm install`
2. Start frontend with `npm run dev`
3. Connect wallet (Freighter recommended)
4. Submit vote and observe transaction flow
5. Verify vote recorded on blockchain via Stellar Laboratory
6. Confirm real-time updates by voting from another account

## Resources

- [Soroban Documentation](https://soroban.stellar.org/docs)
- [Stellar SDK Documentation](https://stellar.github.io/js-stellar-sdk/)
- [StellarWalletsKit Documentation](https://github.com/Creit-Tech/Stellar-Wallets-Kit)
- [Stellar Laboratory](https://laboratory.stellar.org/)
- [Stellar Discord Community](https://discord.gg/stellar)

## License

MIT License - See LICENSE file for details

## Author

Built for Stellar Developer Program - Level 2 Yellow Belt Submission  


##screenshots :
<img width="1470" height="956" alt="Screenshot 2026-04-29 at 2 14 42 AM" src="https://github.com/user-attachments/assets/813c43bb-c488-42ba-89d0-1452c99c3e1a" />
<img width="1470" height="956" alt="Screenshot 2026-04-29 at 2 14 24 AM" src="https://github.com/user-attachments/assets/bb0d872e-96e6-4f87-812c-111b98018845" />
<img width="1470" height="956" alt="Screenshot 2026-04-29 at 2 14 37 AM" src="https://github.com/user-attachments/assets/810b161c-41b2-4793-9d9b-0c836ed7c117" />




---

**Contract Address**: `CBVYU3LP455MKZEILE3I5RIHAGJEEYCRGNEQL5BYRFK73M6I3KA4HT36`  
**Network**: Stellar Testnet  
**Status**: ✅ Deployed and Functional

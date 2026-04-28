# 🗳️ Stellar Soroban Poll Contract

A minimal smart contract for a live poll on Stellar blockchain using Soroban.

## 📋 Contract Overview

This contract allows users to vote on one of two options (0 or 1) and retrieve vote counts.

### Functions

#### `vote(option: u32) -> u32`
- **Input**: `option` (0 or 1)
- **Action**: Increments vote count for the specified option
- **Returns**: New vote count for that option
- **Panics**: If option is not 0 or 1

#### `get_votes(option: u32) -> u32`
- **Input**: `option` (0 or 1)
- **Returns**: Current vote count for the option (0 if no votes)
- **Panics**: If option is not 0 or 1

### Storage

- **Type**: Instance storage
- **Key Format**: `(symbol "opt", option)`
- **Values**: u32 vote counts

---

## 🛠️ Prerequisites

### 1. Install Rust
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### 2. Add WebAssembly Target
```bash
rustup target add wasm32-unknown-unknown
```

### 3. Install Soroban CLI
```bash
cargo install --locked soroban-cli
```

### 4. Configure Soroban for Testnet
```bash
soroban network add \
  --global testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"
```

### 5. Create/Import Identity
```bash
# Generate new identity
soroban keys generate --global alice --network testnet

# Or import existing secret key
soroban keys add alice --secret-key YOUR_SECRET_KEY --global
```

### 6. Fund Your Account
Get testnet XLM from the friendbot:
```bash
soroban keys address alice
# Copy the address and visit: https://laboratory.stellar.org/#account-creator?network=test
# Or use curl:
curl "https://friendbot.stellar.org?addr=$(soroban keys address alice)"
```

---

## 🏗️ Build the Contract

### Navigate to Contract Directory
```bash
cd poll_contract
```

### Build WASM
```bash
cargo build --target wasm32-unknown-unknown --release
```

The compiled WASM file will be at:
```
target/wasm32-unknown-unknown/release/poll_contract.wasm
```

### Optimize WASM (Optional but Recommended)
```bash
soroban contract optimize \
  --wasm target/wasm32-unknown-unknown/release/poll_contract.wasm
```

This creates an optimized version:
```
target/wasm32-unknown-unknown/release/poll_contract.optimized.wasm
```

---

## 🚀 Deploy to Testnet

### Deploy Contract
```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/poll_contract.wasm \
  --source alice \
  --network testnet
```

**Output**: Contract ID (e.g., `CBGTG...`)

Save this Contract ID! You'll need it for the frontend.

### Alternative: Deploy Optimized Version
```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/poll_contract.optimized.wasm \
  --source alice \
  --network testnet
```

---

## 🧪 Test the Contract

### Run Unit Tests
```bash
cargo test
```

### Test on Testnet

#### 1. Set Contract ID
```bash
export CONTRACT_ID="YOUR_CONTRACT_ID_HERE"
```

#### 2. Vote for Option 0
```bash
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  vote \
  --option 0
```

#### 3. Vote for Option 1
```bash
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  vote \
  --option 1
```

#### 4. Get Votes for Option 0
```bash
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  get_votes \
  --option 0
```

#### 5. Get Votes for Option 1
```bash
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  get_votes \
  --option 1
```

---

## 📝 Example Usage

### Scenario: JavaScript vs Python Poll

```bash
# Vote for JavaScript (option 0)
soroban contract invoke --id $CONTRACT_ID --source alice --network testnet -- vote --option 0
# Output: 1

# Vote for JavaScript again
soroban contract invoke --id $CONTRACT_ID --source alice --network testnet -- vote --option 0
# Output: 2

# Vote for Python (option 1)
soroban contract invoke --id $CONTRACT_ID --source alice --network testnet -- vote --option 1
# Output: 1

# Check JavaScript votes
soroban contract invoke --id $CONTRACT_ID --source alice --network testnet -- get_votes --option 0
# Output: 2

# Check Python votes
soroban contract invoke --id $CONTRACT_ID --source alice --network testnet -- get_votes --option 1
# Output: 1
```

---

## 🔗 Frontend Integration

### Update .env File
```env
VITE_CONTRACT_ID=YOUR_CONTRACT_ID_HERE
VITE_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
```

### JavaScript Integration Example
```javascript
import { Contract, SorobanRpc, TransactionBuilder, Networks } from '@stellar/stellar-sdk';

const contractId = 'YOUR_CONTRACT_ID';
const rpcUrl = 'https://soroban-testnet.stellar.org';

// Initialize contract
const contract = new Contract(contractId);

// Vote for option 0
async function vote(option) {
  const server = new SorobanRpc.Server(rpcUrl);
  
  // Build transaction
  const account = await server.getAccount(userPublicKey);
  const transaction = new TransactionBuilder(account, {
    fee: '100',
    networkPassphrase: Networks.TESTNET
  })
    .addOperation(contract.call('vote', option))
    .setTimeout(30)
    .build();
  
  // Sign and submit
  // ... (wallet signing logic)
}

// Get votes for option
async function getVotes(option) {
  const server = new SorobanRpc.Server(rpcUrl);
  
  // Simulate transaction to read data
  const transaction = new TransactionBuilder(/* ... */)
    .addOperation(contract.call('get_votes', option))
    .build();
  
  const result = await server.simulateTransaction(transaction);
  return result.result.retval;
}
```

---

## 📊 Contract Specifications

### Storage
- **Type**: Instance Storage
- **Persistence**: Data persists across contract invocations
- **Keys**: `(Symbol("opt"), u32)` tuples
- **Values**: `u32` vote counts

### Gas Costs
- **vote()**: ~50,000 - 100,000 stroops
- **get_votes()**: ~10,000 - 20,000 stroops (read-only)

### Limits
- **Options**: 2 (0 and 1)
- **Max Votes**: 4,294,967,295 (u32::MAX)
- **No Authentication**: Anyone can vote multiple times

---

## 🐛 Troubleshooting

### Build Errors

**Error**: `cargo: command not found`
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

**Error**: `can't find crate for 'core'`
```bash
# Add wasm32 target
rustup target add wasm32-unknown-unknown
```

### Deployment Errors

**Error**: `account not found`
```bash
# Fund your account
curl "https://friendbot.stellar.org?addr=$(soroban keys address alice)"
```

**Error**: `insufficient balance`
```bash
# Get more testnet XLM from friendbot
curl "https://friendbot.stellar.org?addr=$(soroban keys address alice)"
```

**Error**: `network not configured`
```bash
# Add testnet network
soroban network add --global testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"
```

---

## 📚 Additional Resources

- [Soroban Documentation](https://soroban.stellar.org/docs)
- [Stellar Laboratory](https://laboratory.stellar.org/)
- [Soroban Examples](https://github.com/stellar/soroban-examples)
- [Stellar Discord](https://discord.gg/stellar)

---

## ✅ Checklist

- [ ] Rust installed
- [ ] wasm32-unknown-unknown target added
- [ ] Soroban CLI installed
- [ ] Testnet network configured
- [ ] Identity created
- [ ] Account funded
- [ ] Contract built
- [ ] Contract deployed
- [ ] Contract ID saved
- [ ] Contract tested
- [ ] Frontend .env updated

---

## 📄 License

MIT

---

**Built with ❤️ for Stellar Soroban**

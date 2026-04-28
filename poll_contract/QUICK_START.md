# 🚀 Quick Start - Deploy in 5 Minutes

## Prerequisites Check

```bash
# Check Rust
cargo --version

# Check Soroban CLI
soroban --version

# Check wasm32 target
rustup target list | grep wasm32-unknown-unknown
```

If any are missing, see [README.md](README.md) for installation instructions.

---

## Option 1: Automated Deployment (Recommended)

### Run the deployment script:
```bash
cd poll_contract
./deploy.sh
```

This script will:
1. ✅ Build the contract
2. ✅ Run tests
3. ✅ Optimize WASM
4. ✅ Create/check identity
5. ✅ Fund account
6. ✅ Deploy to testnet
7. ✅ Save Contract ID

**Output**: Contract ID saved to `contract_id.txt`

---

## Option 2: Manual Deployment

### 1. Build
```bash
cd poll_contract
cargo build --target wasm32-unknown-unknown --release
```

### 2. Test
```bash
cargo test
```

### 3. Setup Identity (First Time Only)
```bash
# Generate identity
soroban keys generate --global alice --network testnet

# Fund account
curl "https://friendbot.stellar.org?addr=$(soroban keys address alice)"
```

### 4. Configure Network (First Time Only)
```bash
soroban network add \
  --global testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"
```

### 5. Deploy
```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/poll_contract.wasm \
  --source alice \
  --network testnet
```

**Save the Contract ID from the output!**

---

## Test Your Contract

### Set Contract ID
```bash
export CONTRACT_ID="YOUR_CONTRACT_ID_HERE"
```

### Vote for Option 0 (JavaScript)
```bash
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  vote \
  --option 0
```

### Vote for Option 1 (Python)
```bash
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  vote \
  --option 1
```

### Get Votes
```bash
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

## Update Frontend

### 1. Create/Update .env file
```bash
cd ..  # Back to stellar-poll-dapp directory
```

Create `.env`:
```env
VITE_CONTRACT_ID=YOUR_CONTRACT_ID_HERE
VITE_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
```

### 2. Restart Frontend
```bash
npm run dev
```

---

## Troubleshooting

### "cargo: command not found"
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

### "soroban: command not found"
```bash
cargo install --locked soroban-cli
```

### "account not found"
```bash
curl "https://friendbot.stellar.org?addr=$(soroban keys address alice)"
```

### Build fails
```bash
rustup target add wasm32-unknown-unknown
```

---

## Expected Output

### Successful Deployment
```
🗳️  Stellar Poll Contract Deployment
====================================

📦 Step 1: Building contract...
✅ Build successful!

🧪 Step 2: Running tests...
✅ All tests passed!

⚡ Step 3: Optimizing WASM...
✅ Optimization successful!

🔑 Step 4: Checking identity...
✅ Using existing identity: GABC...

🌐 Step 5: Checking network configuration...
✅ Testnet already configured

🚀 Step 6: Deploying contract to testnet...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 CONTRACT ID:
CBGTG...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Contract ID saved to contract_id.txt
🎉 Deployment complete!
```

---

## Next Steps

1. ✅ Contract deployed
2. ✅ Contract ID saved
3. ⏭️ Update frontend `.env` file
4. ⏭️ Integrate contract calls in frontend
5. ⏭️ Test voting from UI

---

**Need help?** Check [README.md](README.md) for detailed documentation.

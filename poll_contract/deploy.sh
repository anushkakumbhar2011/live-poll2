#!/bin/bash

# Stellar Soroban Poll Contract Deployment Script
# This script builds and deploys the poll contract to Stellar Testnet

set -e

echo "🗳️  Stellar Poll Contract Deployment"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Rust is installed
if ! command -v cargo &> /dev/null; then
    echo -e "${RED}❌ Cargo not found. Please install Rust first.${NC}"
    echo "Run: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    exit 1
fi

# Check if wasm32 target is installed
if ! rustup target list | grep -q "wasm32-unknown-unknown (installed)"; then
    echo -e "${YELLOW}⚠️  wasm32-unknown-unknown target not found. Installing...${NC}"
    rustup target add wasm32-unknown-unknown
fi

# Check if Soroban CLI is installed
if ! command -v soroban &> /dev/null; then
    echo -e "${RED}❌ Soroban CLI not found. Please install it first.${NC}"
    echo "Run: cargo install --locked soroban-cli"
    exit 1
fi

echo -e "${BLUE}📦 Step 1: Building contract...${NC}"
cargo build --target wasm32-unknown-unknown --release

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🧪 Step 2: Running tests...${NC}"
cargo test

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
else
    echo -e "${RED}❌ Tests failed!${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}⚡ Step 3: Optimizing WASM...${NC}"
soroban contract optimize \
  --wasm target/wasm32-unknown-unknown/release/poll_contract.wasm

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Optimization successful!${NC}"
else
    echo -e "${YELLOW}⚠️  Optimization failed, will use unoptimized WASM${NC}"
fi

echo ""
echo -e "${BLUE}🔑 Step 4: Checking identity...${NC}"

# Check if alice identity exists
if ! soroban keys show alice &> /dev/null; then
    echo -e "${YELLOW}⚠️  Identity 'alice' not found. Creating...${NC}"
    soroban keys generate --global alice --network testnet
    
    ALICE_ADDRESS=$(soroban keys address alice)
    echo -e "${GREEN}✅ Identity created: $ALICE_ADDRESS${NC}"
    
    echo ""
    echo -e "${YELLOW}💰 Funding account from friendbot...${NC}"
    curl -s "https://friendbot.stellar.org?addr=$ALICE_ADDRESS" > /dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Account funded!${NC}"
    else
        echo -e "${RED}❌ Failed to fund account. Please fund manually.${NC}"
    fi
    
    sleep 2
else
    ALICE_ADDRESS=$(soroban keys address alice)
    echo -e "${GREEN}✅ Using existing identity: $ALICE_ADDRESS${NC}"
fi

echo ""
echo -e "${BLUE}🌐 Step 5: Checking network configuration...${NC}"

# Check if testnet is configured
if ! soroban network ls | grep -q "testnet"; then
    echo -e "${YELLOW}⚠️  Testnet not configured. Adding...${NC}"
    soroban network add \
      --global testnet \
      --rpc-url https://soroban-testnet.stellar.org:443 \
      --network-passphrase "Test SDF Network ; September 2015"
    echo -e "${GREEN}✅ Testnet configured!${NC}"
else
    echo -e "${GREEN}✅ Testnet already configured${NC}"
fi

echo ""
echo -e "${BLUE}🚀 Step 6: Deploying contract to testnet...${NC}"

# Use optimized WASM if available, otherwise use regular
if [ -f "target/wasm32-unknown-unknown/release/poll_contract.optimized.wasm" ]; then
    WASM_FILE="target/wasm32-unknown-unknown/release/poll_contract.optimized.wasm"
    echo "Using optimized WASM"
else
    WASM_FILE="target/wasm32-unknown-unknown/release/poll_contract.wasm"
    echo "Using regular WASM"
fi

CONTRACT_ID=$(soroban contract deploy \
  --wasm $WASM_FILE \
  --source alice \
  --network testnet)

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Contract deployed successfully!${NC}"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}📝 CONTRACT ID:${NC}"
    echo -e "${YELLOW}$CONTRACT_ID${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo -e "${BLUE}📋 Next Steps:${NC}"
    echo "1. Save the Contract ID above"
    echo "2. Update your .env file:"
    echo "   VITE_CONTRACT_ID=$CONTRACT_ID"
    echo ""
    echo -e "${BLUE}🧪 Test the contract:${NC}"
    echo "export CONTRACT_ID=$CONTRACT_ID"
    echo "soroban contract invoke --id \$CONTRACT_ID --source alice --network testnet -- vote --option 0"
    echo "soroban contract invoke --id \$CONTRACT_ID --source alice --network testnet -- get_votes --option 0"
    echo ""
    
    # Save contract ID to file
    echo $CONTRACT_ID > contract_id.txt
    echo -e "${GREEN}✅ Contract ID saved to contract_id.txt${NC}"
else
    echo -e "${RED}❌ Deployment failed!${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"

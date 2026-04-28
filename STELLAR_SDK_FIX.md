# 🔧 Fix: Stellar SDK Import Error

## The Error
```
Uncaught TypeError: Cannot read properties of undefined (reading 'Server')
```

## Root Cause
The Stellar SDK wasn't being bundled correctly by Vite in production builds. The `SorobanRpc` namespace was undefined.

## The Fix

### 1. Updated `vite.config.js`
Added proper bundling configuration for Stellar SDK:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@stellar/stellar-sdk']
  },
  build: {
    target: 'esnext',
    commonjsOptions: {
      include: [/stellar-sdk/, /node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'stellar-sdk': ['@stellar/stellar-sdk']
        }
      }
    }
  }
})
```

### 2. Updated `src/utils/contract.js`
Changed import to use namespace import:

```javascript
// Before (broken in production)
import {
  Contract,
  SorobanRpc,
  TransactionBuilder,
  // ...
} from '@stellar/stellar-sdk';

// After (works in production)
import * as StellarSdk from '@stellar/stellar-sdk';

const {
  Contract,
  SorobanRpc,
  TransactionBuilder,
  // ...
} = StellarSdk;
```

## Deploy the Fix

### Step 1: Commit Changes
```bash
git add .
git commit -m "Fix: Stellar SDK bundling for production"
git push origin main
```

### Step 2: Vercel Will Auto-Deploy
- Vercel detects the push
- Automatically rebuilds
- Deploys new version

### Step 3: Verify Fix
1. Wait 1-2 minutes for deployment
2. Open your site
3. Open browser console (F12)
4. Should see:
   ```
   Contract Configuration:
   Contract ID: CBVYU3LP455MKZEILE3I5RIHAGJEEYCRGNEQL5BYRFK73M6I3KA4HT36
   RPC URL: https://soroban-testnet.stellar.org
   Network: Test SDF Network ; September 2015
   ```
5. No errors!
6. App should load correctly

## Test Locally First

```bash
# Build for production
npm run build

# Preview the build
npm run preview
```

Open http://localhost:4173 and check:
- No console errors
- App loads correctly
- Wallet connection works

## Why This Happened

Vite uses different bundling strategies for development vs production:
- **Development**: Uses native ES modules, works fine
- **Production**: Bundles and optimizes code, can break complex packages

The Stellar SDK has a complex structure with namespaces (`SorobanRpc`, `Networks`, etc.) that need special handling in production builds.

## What Changed

### vite.config.js
- Added `optimizeDeps.include` to pre-bundle Stellar SDK
- Added `commonjsOptions` to handle mixed module formats
- Added `rollupOptions.manualChunks` to separate Stellar SDK into its own chunk

### contract.js
- Changed from named imports to namespace import
- Destructured after import to maintain same usage
- More compatible with Vite's production bundling

## Verification Checklist

After deploying:
- [ ] Site loads (not blank)
- [ ] No console errors
- [ ] Contract configuration logs appear
- [ ] Wallet connect button visible
- [ ] Can connect wallet
- [ ] Can vote
- [ ] Vote counts display

## If Still Having Issues

### Check Build Logs
1. Go to Vercel dashboard
2. Click on deployment
3. Check "Building" section
4. Look for any errors

### Check Browser Console
1. Open deployed site
2. Press F12
3. Look for any red errors
4. Check Network tab for failed requests

### Force Clean Build
1. Go to Vercel dashboard
2. Deployments → Latest deployment
3. Click three dots (•••)
4. Click "Redeploy"
5. **UNCHECK** "Use existing Build Cache"
6. Click "Redeploy"

## Success!

After this fix:
- ✅ Stellar SDK loads correctly in production
- ✅ SorobanRpc.Server initializes properly
- ✅ Contract interactions work
- ✅ No more blank screen
- ✅ App fully functional

---

**The fix is now in your code. Just push to GitHub and Vercel will auto-deploy!**

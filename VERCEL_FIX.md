# 🔧 Quick Fix for Blank Screen on Vercel

## The Problem
Your Vercel deployment shows a blank white screen.

## The Solution (3 Steps)

### Step 1: Add Environment Variables in Vercel

1. Go to https://vercel.com/dashboard
2. Click on your project: `live-poll2`
3. Click "Settings" tab
4. Click "Environment Variables" in the left sidebar
5. Add these 4 variables:

| Name | Value |
|------|-------|
| `VITE_CONTRACT_ID` | `CBVYU3LP455MKZEILE3I5RIHAGJEEYCRGNEQL5BYRFK73M6I3KA4HT36` |
| `VITE_SOROBAN_RPC_URL` | `https://soroban-testnet.stellar.org` |
| `VITE_NETWORK_PASSPHRASE` | `Test SDF Network ; September 2015` |
| `VITE_HORIZON_URL` | `https://horizon-testnet.stellar.org` |

**Important**: For each variable, check all three boxes:
- ✅ Production
- ✅ Preview
- ✅ Development

### Step 2: Redeploy

1. Go to "Deployments" tab
2. Find the latest deployment
3. Click the three dots (•••) on the right
4. Click "Redeploy"
5. **UNCHECK** "Use existing Build Cache"
6. Click "Redeploy" button

### Step 3: Wait & Test

1. Wait 1-2 minutes for build to complete
2. Click "Visit" to open your site
3. You should now see the app!

---

## Still Blank? Check This:

### Open Browser Console
1. Press F12 on your deployed site
2. Look for red errors
3. Common errors:

**Error**: `import.meta.env.VITE_CONTRACT_ID is undefined`
**Fix**: Environment variables not set correctly in Vercel

**Error**: `Failed to fetch`
**Fix**: Check network connection or RPC URL

**Error**: `Module not found`
**Fix**: Run `npm install` locally and push to GitHub

### Check Build Logs
1. Go to Vercel dashboard
2. Click on the deployment
3. Scroll to "Building" section
4. Look for any red errors

---

## Alternative: Deploy from Scratch

If the above doesn't work:

1. **Delete the Vercel project**
   - Go to Settings → General
   - Scroll to bottom
   - Click "Delete Project"

2. **Redeploy**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - **BEFORE clicking Deploy**, add all 4 environment variables
   - Click "Deploy"

---

## Test Locally First

Before deploying, test the production build locally:

```bash
# Build for production
npm run build

# Preview the build
npm run preview
```

If this works locally, the issue is Vercel configuration.

---

## Quick Checklist

- [ ] All 4 environment variables added in Vercel
- [ ] Variables added to Production, Preview, AND Development
- [ ] Redeployed with cache cleared
- [ ] Build completed successfully (green checkmark)
- [ ] No errors in browser console (F12)

---

## 99% of the time, the fix is:
**Add the environment variables in Vercel dashboard and redeploy!**

The app needs these variables to connect to the smart contract. Without them, it can't initialize and shows a blank screen.

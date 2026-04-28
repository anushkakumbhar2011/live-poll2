# 🚀 Deployment Guide - Vercel

## Fix Blank Screen Issue

If you see a blank screen on Vercel, follow these steps:

### 1. Set Environment Variables in Vercel

Go to your Vercel project settings → Environment Variables and add:

```
VITE_CONTRACT_ID=CBVYU3LP455MKZEILE3I5RIHAGJEEYCRGNEQL5BYRFK73M6I3KA4HT36
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
```

**Important**: Add these to all environments (Production, Preview, Development)

### 2. Redeploy

After adding environment variables:
1. Go to Deployments tab
2. Click the three dots on the latest deployment
3. Click "Redeploy"
4. Check "Use existing Build Cache" is OFF
5. Click "Redeploy"

### 3. Check Build Logs

If still blank:
1. Go to Deployments
2. Click on the latest deployment
3. Check the build logs for errors
4. Look for any missing dependencies or build failures

### 4. Local Build Test

Test the production build locally:

```bash
npm run build
npm run preview
```

If this works locally but not on Vercel, the issue is environment-specific.

## Common Issues

### Issue 1: Environment Variables Not Loading
**Solution**: Make sure all `VITE_` prefixed variables are set in Vercel dashboard

### Issue 2: Build Fails
**Solution**: Check package.json has correct build script:
```json
"scripts": {
  "build": "vite build"
}
```

### Issue 3: 404 on Refresh
**Solution**: The `vercel.json` file handles this with rewrites

### Issue 4: Wallet Kit Not Loading
**Solution**: Check browser console for errors. May need to add wallet kit to dependencies.

## Deployment Steps

### First Time Deployment

1. **Push to GitHub**
```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

2. **Import to Vercel**
- Go to https://vercel.com
- Click "New Project"
- Import your GitHub repository
- Vercel auto-detects Vite

3. **Configure Environment Variables**
- Before deploying, add all `VITE_*` variables
- Click "Deploy"

4. **Wait for Build**
- Build takes 1-2 minutes
- Check build logs for any errors

5. **Test Deployment**
- Open the deployment URL
- Open browser console (F12)
- Check for any errors
- Test wallet connection
- Test voting

### Redeployment

```bash
git add .
git commit -m "Update: description"
git push origin main
```

Vercel automatically redeploys on push to main branch.

## Vercel Configuration

The `vercel.json` file is configured with:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures:
- Correct build command
- Correct output directory
- SPA routing works (no 404 on refresh)

## Debugging Blank Screen

### Step 1: Check Browser Console
1. Open deployed site
2. Press F12 (Developer Tools)
3. Go to Console tab
4. Look for errors (red text)

Common errors:
- `Failed to fetch` - Environment variables missing
- `Module not found` - Dependency issue
- `Uncaught ReferenceError` - Build issue

### Step 2: Check Network Tab
1. Open Developer Tools (F12)
2. Go to Network tab
3. Refresh page
4. Check if all files load (200 status)
5. Look for failed requests (red, 404, 500)

### Step 3: Check Build Logs
1. Go to Vercel dashboard
2. Click on deployment
3. Check "Building" section
4. Look for warnings or errors

### Step 4: Test Locally
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build
npm run preview
```

If this works, the issue is Vercel-specific (likely environment variables).

## Environment Variables Checklist

Make sure these are set in Vercel:

- [ ] `VITE_CONTRACT_ID`
- [ ] `VITE_SOROBAN_RPC_URL`
- [ ] `VITE_NETWORK_PASSPHRASE`
- [ ] `VITE_HORIZON_URL`

**Note**: All must start with `VITE_` to be accessible in the frontend.

## Quick Fix Commands

### Force Rebuild
```bash
# Clear Vercel cache and rebuild
vercel --prod --force
```

### Local Production Test
```bash
npm run build && npm run preview
```

### Check Environment Variables
```bash
# In your local terminal
echo $VITE_CONTRACT_ID
```

## Success Checklist

Your deployment is successful when:
- [ ] Site loads (not blank)
- [ ] No console errors
- [ ] Wallet connect button appears
- [ ] Can connect wallet
- [ ] Can vote
- [ ] Vote counts display
- [ ] No 404 on page refresh

## Support

If still having issues:
1. Check Vercel build logs
2. Check browser console errors
3. Verify environment variables are set
4. Test local production build
5. Check GitHub repository is public

---

**Most Common Fix**: Add environment variables in Vercel dashboard and redeploy!

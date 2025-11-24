# Shopify App Bridge Setup Guide

## What Was Fixed

Your app has been updated to work as a properly embedded Shopify app with App Bridge authentication. Here's what changed:

### 1. **Added Shopify App Bridge Provider** (`components/ShopifyAppBridgeProvider.tsx`)
   - Handles App Bridge initialization
   - Manages authentication flow
   - Shows loading states with timeout (10 seconds)
   - Displays detailed error messages with troubleshooting tips
   - Works in both embedded mode and standalone development mode

### 2. **Added Comprehensive Debugging**
   - Console logging at every step of authentication
   - Clear markers: `[App Bridge]`, `[Auth]`, `[Shopify API]`
   - Error boundaries to catch authentication failures
   - Timeout handling to prevent eternal spinners

### 3. **Updated Authentication Flow**
   - Uses session tokens when embedded in Shopify Admin
   - Falls back to manual access tokens for standalone mode
   - Automatically detects embedded vs standalone context

### 4. **Enhanced Shopify Service** (`services/shopifyService.ts`)
   - Uses new authentication helpers
   - Supports both embedded and standalone modes
   - Added detailed logging for API requests

---

## Environment Variables Setup

### Required Variables

Add these to your Vercel project:

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables

2. **Add these variables:**

```bash
# Required: Your Shopify App's Client ID
VITE_SHOPIFY_API_KEY=your_client_id_here

# Required: Your Shopify App's Client Secret
VITE_SHOPIFY_API_SECRET=your_client_secret_here

# Required: Your Google Gemini API Key
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Where to Find These Values

#### Shopify API Key & Secret
1. Go to [Shopify Partners Dashboard](https://partners.shopify.com)
2. Click **Apps** → Select your app
3. Click **Client credentials** (left sidebar)
4. **Client ID** = `VITE_SHOPIFY_API_KEY`
5. **Client secret** = `VITE_SHOPIFY_API_SECRET` (click "View" to reveal)

#### Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create or copy your API key
3. Use as `VITE_GEMINI_API_KEY`

---

## Shopify App Configuration

### 1. Configure App URLs

In your Shopify Partners Dashboard → Apps → [Your App] → Configuration:

```
App URL: https://your-app.vercel.app
Allowed redirection URL(s):
  - https://your-app.vercel.app
  - https://your-app.vercel.app/auth/callback
  - https://your-app.vercel.app/*
```

### 2. Configure App Proxy (Optional)

If you need app proxy functionality:
```
Subpath prefix: apps
Subpath: kargo-copilot
Proxy URL: https://your-app.vercel.app/api/proxy
```

### 3. Set API Scopes

Required scopes for Kargo Copilot:
- `read_products` - Read product data
- `write_products` - Update product metafields with HS codes
- `read_orders` - Read order information
- `read_shipping` - Read shipping information

---

## Deployment Steps

### 1. Commit and Push Changes

```bash
git add .
git commit -m "Add Shopify App Bridge authentication"
git push origin main
```

### 2. Deploy to Vercel

The changes will automatically deploy to Vercel if you have auto-deployment enabled.

Or manually deploy:
```bash
vercel --prod
```

### 3. Verify Deployment

Check that environment variables are set:
```bash
# In Vercel Dashboard
Settings → Environment Variables → Verify all 3 variables are present
```

---

## Testing the Authentication Flow

### Test in Embedded Mode (Production)

1. **Install the app** on a development store:
   - Shopify Partners → Apps → [Your App] → "Select store"
   - Choose a development store
   - Click "Install app"

2. **Check Console Logs**:
   - Open browser DevTools (F12)
   - Look for these log messages:
     ```
     [App Bridge] Starting initialization...
     [App Bridge] URL params: { host: '...', shop: '...' }
     [App Bridge] API Key found: abc123...
     [App Bridge] Creating App Bridge instance...
     [App Bridge] ✅ Successfully initialized!
     ```

3. **Test API Calls**:
   - Navigate to "Orders" or "Products" page
   - Watch for these logs:
     ```
     [Shopify API] Fetching products...
     [Auth] Using App Bridge session token
     [Shopify API] Request headers prepared
     [Shopify API] Response status: 200
     [Shopify API] ✓ Successfully fetched X products
     ```

### Test in Standalone Mode (Development)

1. **Run locally**:
   ```bash
   npm run dev
   ```

2. **Access without URL parameters**:
   ```
   http://localhost:5173
   ```

3. **Expected behavior**:
   - App loads without authentication screen
   - Shows warning: "Running in standalone mode (for development)"
   - You can manually configure shop credentials in Settings

---

## Debugging Authentication Issues

### Issue 1: Eternal Spinner

**Symptoms**: App shows "Authenticating with Shopify..." forever

**Solutions**:
1. **Check browser console** for error messages
2. **Verify environment variables** are set in Vercel
3. **Check App URLs** in Shopify Partners match your Vercel URL
4. **Wait for timeout** - after 10 seconds, you'll see a specific error message

**Common causes**:
- `VITE_SHOPIFY_API_KEY` not set or incorrect
- App URL doesn't match Vercel deployment URL
- Browser blocking third-party cookies

### Issue 2: "Missing required parameters"

**Symptoms**: Error message about missing `host` or `shop` parameter

**Solutions**:
1. **Reinstall the app** on your development store
2. **Check installation URL** - should include `?host=...&shop=...`
3. **Try incognito mode** to rule out cookie issues

### Issue 3: API Calls Failing (403 or 401 errors)

**Symptoms**: Console shows "Shopify API Error: Unauthorized"

**Solutions**:
1. **Check API scopes** in Shopify Partners dashboard
2. **Verify shop domain** is correct
3. **Check access token** (in Settings page if using standalone mode)
4. **Re-install the app** to refresh permissions

### Issue 4: Environment Variables Not Loading

**Symptoms**: Console shows "VITE_SHOPIFY_API_KEY is not set"

**Solutions**:
1. **In Vercel Dashboard**:
   - Settings → Environment Variables
   - Add variables for "Production", "Preview", and "Development"
   - Redeploy after adding variables

2. **For local development**:
   - Update `.env.local` file
   - Restart dev server (`npm run dev`)

---

## Console Log Reference

### Successful Authentication Flow
```
[App Bridge] Starting initialization...
[App Bridge] URL params: { host: 'xxx', shop: 'store.myshopify.com' }
[App Bridge] API Key found: abc123...
[App Bridge] Creating App Bridge instance...
[App Bridge] ✅ Successfully initialized!
```

### Successful API Call
```
[Shopify API] Fetching products...
[Auth] Using App Bridge session token
[Shopify API] Request headers prepared
[Shopify API] Response status: 200
[Shopify API] ✓ Successfully fetched 15 products
```

### Development Mode (No Embedding)
```
[App Bridge] Starting initialization...
[App Bridge] URL params: { host: null, shop: null }
[App Bridge] Missing required parameters (host or shop)
[App Bridge] Running in standalone mode (for development)
```

---

## Viewing Logs in Production

1. **Vercel Logs**:
   - Go to Vercel Dashboard
   - Click on your deployment
   - Click "View Function Logs"

2. **Browser Console**:
   - Open DevTools (F12) while app is loaded
   - Filter by `[App Bridge]` or `[Shopify API]`

3. **Shopify App Logs**:
   - Shopify Partners → Apps → [Your App] → "View logs"

---

## Next Steps

1. ✅ Set environment variables in Vercel
2. ✅ Configure Shopify app URLs
3. ✅ Deploy to Vercel
4. ✅ Install app on development store
5. ✅ Test authentication flow
6. ✅ Test API calls (products, orders)

## Need Help?

If you're still seeing issues after following this guide:

1. **Check ALL console logs** - copy them for debugging
2. **Verify environment variables** are set correctly
3. **Check network tab** for failed requests
4. **Try in incognito mode** to rule out caching issues

The error messages now include specific troubleshooting steps, so read them carefully!

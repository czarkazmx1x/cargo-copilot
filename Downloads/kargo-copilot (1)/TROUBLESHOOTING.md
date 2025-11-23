# Troubleshooting Guide - Kargo Copilot

Common issues and solutions when deploying to Vercel and Shopify.

---

## 🔴 Issue: App Stuck on "Initializing Kargo Copilot..."

### Symptoms
- Loading spinner shows indefinitely
- Console shows: "Attempting to get session token..."
- App never fully loads in Shopify admin

### Root Causes

1. **Missing or Invalid Shopify API Key**
2. **Session Token Timeout**
3. **Shopify App Bridge Not Loading**
4. **CORS/Frame Headers Issue**

### Solutions

#### Step 1: Check Environment Variables

**In Vercel Dashboard:**
1. Go to Settings > Environment Variables
2. Verify these are set:
   - `VITE_SHOPIFY_API_KEY` = Your Shopify API key (from Partners dashboard)
   - `VITE_GEMINI_API_KEY` = Your Gemini API key

3. After setting/changing env vars: **Redeploy your app**
   - Go to Deployments tab
   - Click ⋯ on latest deployment
   - Click "Redeploy"

#### Step 2: Check Console for Detailed Logs

Open browser DevTools (F12) and check console for:

**✅ Good signs:**
```
🔧 ShopifyAppBridge: Starting initialization...
📋 URL params: { shop: "...", host: "..." }
✅ App is embedded in Shopify admin
✅ Session token retrieved successfully
```

**❌ Problem indicators:**
```
⚠️ VITE_SHOPIFY_API_KEY not set
❌ Session token timeout
❌ Token fetch failed
```

#### Step 3: Verify Shopify App Configuration

**In Shopify Partners Dashboard:**
1. Go to your app > Configuration
2. Check **App URL** matches your Vercel URL:
   ```
   https://your-actual-app.vercel.app
   ```

3. Check **Allowed redirect URLs** include:
   ```
   https://your-actual-app.vercel.app/auth/callback
   https://your-actual-app.vercel.app/auth/shopify/callback
   ```

4. Verify **Embedded app** is enabled

#### Step 4: Check Frame Headers

In `vercel.json`, verify headers allow Shopify embedding:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "ALLOWALL"
        },
        {
          "key": "Content-Security-Policy",
          "value": "frame-ancestors https://*.myshopify.com https://admin.shopify.com"
        }
      ]
    }
  ]
}
```

If you changed this file, **redeploy**.

#### Step 5: Test in Standalone Mode

Test if the app works outside Shopify:

1. Go directly to your Vercel URL: `https://your-app.vercel.app`
2. If it loads, the app works - problem is with Shopify embedding
3. If it doesn't load, check browser console for errors

#### Step 6: Increase Timeout (Advanced)

If session token is timing out, the new `ShopifyAppBridge.tsx` component includes:
- 30-second timeout by default
- 3 retry attempts
- Better error logging

Check `utils/shopifyAuth.ts` to adjust timeout:

```typescript
const token = await getSessionTokenWithTimeout(appBridge, {
  timeout: 40000,  // 40 seconds
  retries: 3,
  retryDelay: 2000
});
```

---

## 🔴 Issue: "Refused to Connect" Error

### Symptoms
```
Refused to connect to 'https://your-app.vercel.app'
because it violates the following Content Security Policy directive
```

### Solution

**Check vercel.json headers:**

Make sure `Content-Security-Policy` includes Shopify domains:
```json
"frame-ancestors https://*.myshopify.com https://admin.shopify.com"
```

**Redeploy after changing vercel.json**

---

## 🔴 Issue: "SendBeacon Failed" Error

### Symptoms
Red error in console:
```
Error: SendBeacon failed
https://cdn.shopify.com/shopifycloud/web/assets/...
```

### Solution

**This is normal!** Ignore it.
- This is Shopify's own analytics failing
- Does NOT affect your app
- Not your responsibility to fix

---

## 🔴 Issue: Can't Fetch Shopify Products

### Symptoms
- Settings page shows "No products found"
- Orders page shows empty
- Console shows 401 or 403 errors

### Solutions

#### Option 1: Configure in App Settings

1. Open app in Shopify admin
2. Go to Settings page
3. Enter:
   - **Shop Domain**: `your-store.myshopify.com`
   - **Access Token**: (see below)
4. Click Save

#### Option 2: Generate Access Token

**For Development/Testing:**

1. Shopify Admin > Settings > Apps and sales channels
2. Click "Develop apps"
3. Click "Create an app"
4. Name: "Kargo Copilot Access"
5. Configuration tab:
   - Check these scopes:
     - `read_products`
     - `write_products`
     - `read_orders`
     - `write_orders`
6. Install app to your store
7. Click "Reveal token once"
8. Copy the Admin API access token
9. Paste in app Settings page

**For Production:**

Implement proper OAuth flow (see DEPLOYMENT.md Part 5)

---

## 🔴 Issue: Gemini AI Not Classifying

### Symptoms
- Upload image → No HS code suggested
- Console shows 401 or API key error

### Solutions

#### Check API Key in Vercel

1. Vercel Dashboard > Settings > Environment Variables
2. Verify `VITE_GEMINI_API_KEY` is set
3. Get key from: https://ai.google.dev
4. Redeploy after setting

#### Check API Key Format

Should look like:
```
AIzaSyD...long_string_here
```

Not:
```
your_gemini_api_key_here  ❌
```

#### Check Console Logs

Look for:
```
✅ Gemini API call successful
```

Or:
```
❌ Gemini API error: Invalid API key
```

---

## 🔴 Issue: White Screen / Blank Page

### Symptoms
- App loads but shows nothing
- No errors in console
- Just white/blank screen

### Solutions

#### Check Browser Console

1. Press F12
2. Check Console tab for JavaScript errors
3. Common errors:
   - Module not found
   - Unexpected token
   - Cannot read property of undefined

#### Check Network Tab

1. Press F12 > Network tab
2. Refresh page
3. Look for:
   - Failed requests (red)
   - 404 errors
   - Missing assets

#### Clear Cache

1. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Or: DevTools > Network > Disable cache checkbox

#### Verify Build Output

Check Vercel deployment logs:
1. Vercel Dashboard > Deployments
2. Click on latest deployment
3. Check "Building" logs for errors

---

## 🔴 Issue: React 19 Peer Dependency Warnings

### Symptoms
```
npm WARN ERESOLVE overriding peer dependency
npm WARN peer dependencies conflicting
```

### Solution

**Already fixed!** The `vercel.json` includes:
```json
"installCommand": "npm install --legacy-peer-deps"
```

This is normal for React 19 as many packages haven't updated yet.

---

## 🔴 Issue: 404 on Page Refresh

### Symptoms
- App loads fine initially
- Refresh page → 404 error
- Direct URL access → 404 error

### Solution

**This is expected!** The app uses `HashRouter`.

URLs should look like:
```
https://your-app.vercel.app/#/dashboard  ✅
```

Not:
```
https://your-app.vercel.app/dashboard  ❌
```

The `#` is required for client-side routing.

---

## 🔍 General Debugging Checklist

When something doesn't work, check these in order:

1. **Browser Console** (F12)
   - Any red errors?
   - What's the last console log?

2. **Network Tab**
   - Any failed requests?
   - What's the status code?

3. **Environment Variables**
   - All required vars set in Vercel?
   - Redeployed after changing them?

4. **Shopify App Config**
   - URL matches Vercel deployment?
   - Correct scopes enabled?
   - Embedded app enabled?

5. **vercel.json**
   - Headers correct?
   - Redeployed after changes?

6. **Build Logs**
   - Any build errors?
   - All dependencies installed?

---

## 🆘 Still Stuck?

### Enable Verbose Logging

The updated `ShopifyAppBridge.tsx` component includes detailed logging.

Check console for emoji-prefixed logs:
- 🔧 Initialization steps
- 📋 Configuration details
- ✅ Success messages
- ❌ Error messages
- ⚠️ Warnings

### Share These When Asking for Help

1. **Full console output** (screenshot or copy/paste)
2. **Network tab** showing failed requests
3. **Your vercel.json** file
4. **Shopify app configuration** screenshot
5. **Environment variables** (names only, not values!)
6. **What you were trying to do** when it failed

---

## 📚 Additional Resources

- [Vercel Troubleshooting](https://vercel.com/docs/concepts/deployments/troubleshoot-a-build)
- [Shopify App Bridge Docs](https://shopify.dev/docs/api/app-bridge-library)
- [Shopify Common Issues](https://shopify.dev/docs/apps/tools/cli/troubleshooting)
- [Vite Troubleshooting](https://vite.dev/guide/troubleshooting.html)

---

**Last Updated**: November 2025

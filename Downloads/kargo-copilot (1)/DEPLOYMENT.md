# Kargo Copilot - Deployment Guide

This guide covers deploying Kargo Copilot to Vercel and integrating it with Shopify.

## Prerequisites

- Node.js 18+ installed
- A Vercel account (https://vercel.com)
- A Shopify Partner account (https://partners.shopify.com)
- A Google Gemini API key (https://ai.google.dev)

---

## Part 1: Deploy to Vercel

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up Environment Variables Locally

Copy the example environment file:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Gemini API key:
```env
VITE_GEMINI_API_KEY=your_actual_gemini_api_key
```

### Step 3: Test Locally

```bash
npm run dev
```

Visit http://localhost:5173 to verify the app works.

### Step 4: Deploy to Vercel

#### Option A: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts and deploy to production:
```bash
vercel --prod
```

#### Option B: Deploy via GitHub

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Vercel will auto-detect the Vite framework
5. Click "Deploy"

### Step 5: Configure Environment Variables in Vercel

1. Go to your project in Vercel Dashboard
2. Navigate to Settings > Environment Variables
3. Add the following variables:

| Variable Name | Value | Environment |
|---|---|---|
| `VITE_GEMINI_API_KEY` | Your Gemini API key | Production, Preview, Development |
| `VITE_SHOPIFY_API_KEY` | (Set after creating Shopify app) | Production, Preview, Development |

4. Redeploy to apply changes

### Step 6: Get Your Vercel URL

After deployment, you'll get a URL like:
```
https://kargo-copilot-xxxxx.vercel.app
```

**Save this URL - you'll need it for Shopify integration!**

---

## Part 2: Integrate with Shopify

### Step 1: Create a Shopify App

1. Go to https://partners.shopify.com
2. Click "Apps" > "Create app"
3. Choose "Create app manually"
4. Enter app name: "Kargo Copilot"
5. Click "Create app"

### Step 2: Configure App URLs

In your Shopify app settings:

1. **App URL**: `https://your-app.vercel.app`
2. **Allowed redirection URL(s)**:
   ```
   https://your-app.vercel.app/auth/callback
   https://your-app.vercel.app/auth/shopify/callback
   ```

### Step 3: Configure App Embed

1. Go to "Configuration" tab
2. Enable "Embedded app"
3. Set "App proxy" (optional for advanced features)

### Step 4: Set API Scopes

In the "Configuration" section, add these scopes:

- `read_products` - Read product catalog
- `write_products` - Save HS codes to product metafields
- `read_orders` - Read order information
- `write_orders` - Update order customs data (optional)

### Step 5: Get API Credentials

1. In your Shopify app dashboard, click "API credentials"
2. Copy your **API key** (Client ID)
3. Copy your **API secret key** (keep this secure!)

### Step 6: Update Vercel Environment Variables

Go back to Vercel and add:

```env
VITE_SHOPIFY_API_KEY=your_api_key_from_shopify
```

Redeploy your app for changes to take effect.

### Step 7: Update shopify.app.toml

Edit `shopify.app.toml` with your actual values:

```toml
client_id = "your_shopify_api_key"
application_url = "https://your-actual-app.vercel.app"

[build]
dev_store_url = "your-dev-store.myshopify.com"
```

### Step 8: Install on a Test Store

1. In Shopify Partners, go to your app
2. Click "Test your app"
3. Select a development store
4. Click "Install app"
5. Approve the permissions

---

## Part 3: Configure Shopify Access in App

Once installed, configure the app:

1. Open the app from your Shopify admin
2. Navigate to Settings
3. Enter:
   - **Shop Domain**: `your-store.myshopify.com`
   - **Access Token**: Generate from Shopify Admin API
4. Save settings

### Getting a Shopify Access Token

For development/testing:

1. Go to Shopify Admin > Settings > Apps and sales channels
2. Click "Develop apps"
3. Create a custom app with the same scopes
4. Install to your store
5. Reveal the Admin API access token
6. Use this token in the app settings

---

## Part 4: Verify Integration

### Test Checklist

- [ ] App loads in Shopify admin
- [ ] Dashboard displays correctly
- [ ] Products can be fetched from Shopify
- [ ] HS codes can be classified using Gemini AI
- [ ] HS codes save back to Shopify as metafields
- [ ] Orders display with product information
- [ ] All calculators function correctly

### Common Issues

**For detailed troubleshooting, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**

**Quick Fixes:**

**Issue**: App stuck on "Initializing..."
- **Solution**: Check `VITE_SHOPIFY_API_KEY` in Vercel env vars, then redeploy

**Issue**: App doesn't load in Shopify admin
- **Solution**: Check that `X-Frame-Options` and CSP headers are set correctly in `vercel.json`

**Issue**: Can't fetch Shopify products
- **Solution**: Verify access token and shop domain in Settings page

**Issue**: Gemini AI not classifying
- **Solution**: Check `VITE_GEMINI_API_KEY` is set in Vercel environment variables

**Issue**: 404 errors on page refresh
- **Solution**: The app uses HashRouter, so URLs use `#/` - this is intentional for embedded apps

**Issue**: SendBeacon errors in console
- **Solution**: Ignore - this is Shopify's own analytics failing, not your app

See **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** for detailed solutions to all common issues.

---

## Part 5: Going to Production

### Production Checklist

- [ ] Test thoroughly on development store
- [ ] Add comprehensive error handling
- [ ] Set up proper authentication flow (OAuth)
- [ ] Consider adding a backend for secure API calls
- [ ] Review Shopify App Store requirements
- [ ] Add privacy policy and terms of service
- [ ] Enable GDPR compliance features
- [ ] Set up monitoring and logging
- [ ] Create user documentation

### Security Considerations

1. **Never expose API secrets in frontend code**
   - Currently, Shopify access tokens are stored in browser localStorage
   - For production, implement OAuth flow with backend server

2. **Implement proper session management**
   - Use Shopify session tokens for embedded apps
   - Verify all requests come from Shopify

3. **Secure API endpoints**
   - Consider creating Vercel serverless functions for sensitive operations
   - Move Gemini API calls to backend to protect API key

### Recommended Next Steps

1. **Add Backend (Vercel Serverless Functions)**
   - Create `/api` folder for backend endpoints
   - Move sensitive API calls to server-side
   - Implement OAuth flow

2. **Database Integration**
   - Add PostgreSQL or MongoDB for data persistence
   - Store classification history
   - Cache HS code results

3. **Enhanced Shopify Integration**
   - Implement webhooks for real-time product updates
   - Add bulk operations via Shopify Admin API
   - Create app extensions for product pages

---

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Shopify App Development](https://shopify.dev/docs/apps)
- [Shopify App Bridge](https://shopify.dev/docs/api/app-bridge-library)
- [Google Gemini AI](https://ai.google.dev/docs)

---

## Support

For issues or questions:
- Check the troubleshooting section above
- Review Shopify and Vercel documentation
- Contact your development team

---

**Last Updated**: November 2025

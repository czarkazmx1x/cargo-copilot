# Quick Start Guide - Deploy to Vercel & Shopify

## 🚀 Fast Track Deployment (15 minutes)

### Prerequisites
- [ ] Vercel account created
- [ ] Shopify Partner account created
- [ ] Google Gemini API key ready

---

## Step 1: Deploy to Vercel (5 minutes)

### Using Vercel Dashboard (Easiest)

1. **Push to GitHub** (if not already)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to https://vercel.com/new
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Deploy"

3. **Add Environment Variable**
   - In Vercel dashboard: Settings > Environment Variables
   - Add: `VITE_GEMINI_API_KEY` = `your_gemini_key`
   - Redeploy

4. **Copy Your URL**
   - Example: `https://kargo-copilot-xxxxx.vercel.app`
   - ✅ **Save this URL!**

---

## Step 2: Create Shopify App (5 minutes)

1. **Go to Shopify Partners**: https://partners.shopify.com
2. **Create App**: Apps > Create app > Create app manually
3. **Enter Details**:
   - Name: `Kargo Copilot`
   - App URL: `https://your-app.vercel.app`

4. **Set Redirect URLs**:
   ```
   https://your-app.vercel.app/auth/callback
   https://your-app.vercel.app/auth/shopify/callback
   ```

5. **Enable Embedded App**: Configuration > Embedded app = ON

6. **Add API Scopes**: Configuration > API scopes
   - ✅ `read_products`
   - ✅ `write_products`
   - ✅ `read_orders`
   - ✅ `write_orders`

7. **Get API Key**: API credentials tab
   - Copy the **API key** (Client ID)
   - ✅ **Save this key!**

---

## Step 3: Update Vercel with Shopify Key (2 minutes)

1. **Add to Vercel**: Settings > Environment Variables
   - `VITE_SHOPIFY_API_KEY` = `your_shopify_api_key`

2. **Redeploy**:
   - Deployments tab > ⋯ > Redeploy

---

## Step 4: Install & Test (3 minutes)

1. **Install on Test Store**
   - In Shopify Partners > Your App
   - Click "Select store" > Choose development store
   - Click "Install app"
   - Approve permissions

2. **Open App**
   - Go to your Shopify admin
   - Apps section > Kargo Copilot

3. **Configure Settings**
   - Navigate to Settings page
   - Enter your shop domain: `your-store.myshopify.com`
   - Enter access token (see below)

### Getting Access Token (One-time)

1. Shopify Admin > Settings > Apps and sales channels
2. Click "Develop apps" > "Create an app"
3. Name it "Kargo Copilot Access"
4. Configuration > Admin API scopes (same as above)
5. Install app > Reveal API access token
6. Copy token to app Settings

---

## ✅ You're Done!

### Test It Works

- [ ] Dashboard loads
- [ ] Click "Classify" and upload product image
- [ ] HS code is suggested by AI
- [ ] Save works without errors

---

## 🆘 Troubleshooting

| Issue | Solution |
|---|---|
| App stuck on "Initializing..." | Check `VITE_SHOPIFY_API_KEY` in Vercel, then redeploy |
| App won't load in Shopify | Check vercel.json has correct headers |
| "No products found" | Verify shop domain and access token in Settings |
| AI not classifying | Check Gemini API key in Vercel env vars |
| White screen | Check browser console for errors |

**For detailed solutions to all issues, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**

---

## 📝 Next Steps

- Read full [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup
- Set up OAuth for proper authentication
- Add backend serverless functions for security
- Submit to Shopify App Store

---

## 🔗 Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Shopify Partners**: https://partners.shopify.com
- **Gemini API**: https://ai.google.dev
- **Deployment Docs**: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**Need Help?** Check the full deployment guide in DEPLOYMENT.md

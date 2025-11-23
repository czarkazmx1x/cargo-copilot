# CLI Deployment Guide - Vercel + Shopify

This guide shows you how to deploy using command-line tools instead of web dashboards.

---

## 🏗️ Deployment Architecture

```
Your Code (Local)
    ↓
    ↓ [1] Vercel CLI Deploy
    ↓
Vercel (Hosting)  ← Your app lives here at https://your-app.vercel.app
    ↓
    ↓ [2] Shopify CLI Configure
    ↓
Shopify Partners  ← App configuration points to Vercel URL
    ↓
    ↓ [3] Install App
    ↓
Shopify Store     ← Embeds your Vercel app in an iframe
```

**Key Point**: You deploy **TO** Vercel, then configure Shopify to **POINT TO** your Vercel app.

---

## Part 1: Deploy to Vercel (CLI)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

This will open your browser to authenticate.

### Step 3: Deploy to Vercel

```bash
# Navigate to your project
cd "C:\Users\jacos\Downloads\kargo-copilot (1)"

# First deployment (creates project)
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name? kargo-copilot (or your preferred name)
# - Directory? ./
# - Override settings? No
```

This creates a **preview deployment**.

### Step 4: Deploy to Production

```bash
vercel --prod
```

This creates your **production deployment**.

### Step 5: Get Your Production URL

After deployment completes, you'll see:
```
✅ Production: https://kargo-copilot-xxxxx.vercel.app [copied to clipboard]
```

**Save this URL!** You'll need it for Shopify configuration.

### Step 6: Set Environment Variables

**Option A - Via CLI**:
```bash
# Add Gemini API key
vercel env add VITE_GEMINI_API_KEY production
# Paste your key when prompted

# Add Shopify API key (you'll get this from Shopify Partners)
vercel env add VITE_SHOPIFY_API_KEY production
# Paste your key when prompted
```

**Option B - Via Dashboard** (easier):
1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add variables

### Step 7: Redeploy with Environment Variables

```bash
vercel --prod
```

**Important**: You must redeploy after adding environment variables!

---

## Part 2: Configure Shopify (CLI Method)

### Option A: Using Shopify CLI (Recommended for Production)

#### Step 1: Install Shopify CLI

```bash
npm install -g @shopify/cli @shopify/app
```

#### Step 2: Create Shopify App

```bash
cd "C:\Users\jacos\Downloads\kargo-copilot (1)"

# Create/connect Shopify app
shopify app init
```

Follow prompts:
- App name: `Kargo Copilot`
- App type: `Custom app`
- Template: `None (I'll use my own)`

#### Step 3: Update shopify.app.toml

The file already exists, but update these values:

```toml
# shopify.app.toml
name = "kargo-copilot"
client_id = "YOUR_CLIENT_ID_HERE"  # You'll get this after creating the app
application_url = "https://your-actual-vercel-url.vercel.app"
embedded = true

[access_scopes]
scopes = "read_products,write_products,read_orders,write_orders"

[auth]
redirect_urls = [
  "https://your-actual-vercel-url.vercel.app/auth/callback",
  "https://your-actual-vercel-url.vercel.app/auth/shopify/callback"
]

[build]
dev_store_url = "your-dev-store.myshopify.com"
```

#### Step 4: Deploy Shopify App Configuration

```bash
shopify app deploy
```

This updates your app configuration on Shopify Partners.

#### Step 5: Get API Credentials

```bash
shopify app info
```

This shows your app's API key (Client ID). Copy it!

#### Step 6: Update Vercel Environment Variable

```bash
vercel env add VITE_SHOPIFY_API_KEY production
# Paste the API key from step 5

# Redeploy
vercel --prod
```

---

### Option B: Manual Shopify Setup (Easier for First Time)

If Shopify CLI is confusing, use the web dashboard instead:

1. **Go to Shopify Partners**: https://partners.shopify.com
2. **Create App**: Apps → Create app → Create app manually
3. **Configure**:
   - Name: `Kargo Copilot`
   - App URL: `https://your-vercel-url.vercel.app`
   - Redirect URLs: Add both callback URLs
   - Scopes: Enable read_products, write_products, read_orders, write_orders
   - Embedded app: Enable

4. **Get API Key**: API credentials tab → Copy Client ID

5. **Add to Vercel**:
   ```bash
   vercel env add VITE_SHOPIFY_API_KEY production
   vercel --prod
   ```

---

## Part 3: Complete CLI Workflow

Here's the complete workflow from scratch:

### First-Time Setup

```bash
# 1. Install CLI tools
npm install -g vercel
npm install -g @shopify/cli @shopify/app

# 2. Login to services
vercel login
shopify auth login

# 3. Install project dependencies
cd "C:\Users\jacos\Downloads\kargo-copilot (1)"
npm install

# 4. Deploy to Vercel
vercel --prod
# Save the production URL!

# 5. Add environment variables
vercel env add VITE_GEMINI_API_KEY production
# (Paste your Gemini API key)

# 6. Create Shopify app (via CLI or web dashboard)
# If using CLI:
shopify app init

# 7. Update shopify.app.toml with your Vercel URL

# 8. Deploy Shopify app configuration
shopify app deploy

# 9. Get Shopify API key
shopify app info
# Copy the Client ID

# 10. Add Shopify API key to Vercel
vercel env add VITE_SHOPIFY_API_KEY production
# (Paste the Client ID)

# 11. Redeploy with all env vars
vercel --prod

# 12. Install app on test store
shopify app install
```

### Subsequent Deployments

After initial setup, deploying updates is simple:

```bash
# Make your code changes
# ...

# Deploy to Vercel
vercel --prod

# That's it! Shopify configuration stays the same.
```

---

## Part 4: Vercel CLI Commands Reference

### Basic Commands

```bash
# Deploy preview (for testing)
vercel

# Deploy production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]

# Remove a deployment
vercel rm [deployment-url]

# List environment variables
vercel env ls

# Pull environment variables to local
vercel env pull

# Link local project to Vercel project
vercel link
```

### Environment Variables

```bash
# Add variable
vercel env add [name] [environment]
# Environments: production, preview, development

# Remove variable
vercel env rm [name] [environment]

# Pull to .env.local
vercel env pull .env.local
```

### Project Management

```bash
# List your projects
vercel list

# Get project info
vercel inspect [url]

# Set project settings
vercel project ls
vercel project add
vercel project rm
```

---

## Part 5: Shopify CLI Commands Reference

### App Management

```bash
# Initialize new app
shopify app init

# Deploy app configuration
shopify app deploy

# Show app info
shopify app info

# Install app on development store
shopify app install

# Uninstall app
shopify app uninstall

# Generate app extension
shopify app generate extension
```

### Development

```bash
# Start local development server
shopify app dev

# This starts:
# - Local HTTPS server
# - Shopify CLI proxy
# - Auto-updates app URL for testing
```

### Authentication

```bash
# Login to Shopify Partners
shopify auth login

# Logout
shopify auth logout

# List available stores
shopify whoami
```

---

## Part 6: Automated Deployment Script

Create a deployment script for convenience:

**File**: `deploy.sh` (Mac/Linux) or `deploy.bat` (Windows)

### Windows (deploy.bat)

```batch
@echo off
echo ================================
echo  Kargo Copilot Deployment
echo ================================
echo.

echo [1/4] Installing dependencies...
call npm install

echo.
echo [2/4] Building project...
call npm run build

echo.
echo [3/4] Deploying to Vercel...
call vercel --prod

echo.
echo [4/4] Deployment complete!
echo.
echo Your app is now live!
echo Check Vercel dashboard for the URL.
echo.
pause
```

### Mac/Linux (deploy.sh)

```bash
#!/bin/bash

echo "================================"
echo " Kargo Copilot Deployment"
echo "================================"
echo

echo "[1/4] Installing dependencies..."
npm install

echo
echo "[2/4] Building project..."
npm run build

echo
echo "[3/4] Deploying to Vercel..."
vercel --prod

echo
echo "[4/4] Deployment complete!"
echo
echo "Your app is now live!"
echo "Check Vercel dashboard for the URL."
```

Make it executable:
```bash
chmod +x deploy.sh
```

Run it:
```bash
# Windows
deploy.bat

# Mac/Linux
./deploy.sh
```

---

## Part 7: CI/CD with GitHub Actions (Bonus)

Automate deployments when you push to GitHub:

**File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install --legacy-peer-deps

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

**Setup**:
1. Get your Vercel token: https://vercel.com/account/tokens
2. Add secrets to GitHub: Settings → Secrets → Actions
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID` (from `.vercel/project.json`)
   - `VERCEL_PROJECT_ID` (from `.vercel/project.json`)

Now every push to `main` automatically deploys!

---

## Part 8: Troubleshooting CLI Deployments

### Vercel CLI Issues

**Issue**: `vercel: command not found`
```bash
# Solution: Install globally
npm install -g vercel

# Or use npx
npx vercel --prod
```

**Issue**: `Error: No existing credentials found`
```bash
# Solution: Login again
vercel login
```

**Issue**: `Build failed`
```bash
# Check build logs
vercel logs [deployment-url]

# Test build locally first
npm run build
```

### Shopify CLI Issues

**Issue**: `shopify: command not found`
```bash
# Solution: Install globally
npm install -g @shopify/cli @shopify/app
```

**Issue**: `No app found`
```bash
# Solution: Initialize app first
shopify app init
```

**Issue**: `Authentication required`
```bash
# Solution: Login to Shopify Partners
shopify auth login
```

---

## Part 9: Quick Command Cheat Sheet

### Deploy Everything

```bash
# Deploy to Vercel
vercel --prod

# Update Shopify app config (if changed)
shopify app deploy

# Done!
```

### Check Status

```bash
# Vercel deployments
vercel ls

# Shopify app info
shopify app info

# Environment variables
vercel env ls
```

### Update Environment Variables

```bash
# Add/update variable
vercel env add VITE_GEMINI_API_KEY production

# Redeploy to apply changes
vercel --prod
```

### Rollback Deployment

```bash
# List deployments
vercel ls

# Promote a previous deployment to production
vercel promote [deployment-url]
```

---

## Summary: CLI vs Dashboard

### Use CLI When:
- ✅ You prefer terminal/command line
- ✅ Automating deployments
- ✅ Deploying frequently
- ✅ Setting up CI/CD
- ✅ Managing multiple projects

### Use Dashboard When:
- ✅ First time deploying
- ✅ Configuring complex settings
- ✅ Viewing analytics/logs
- ✅ Managing team access
- ✅ You prefer visual interface

**Best Practice**: Use dashboard for initial setup, CLI for subsequent deployments!

---

## 📚 Additional Resources

- [Vercel CLI Docs](https://vercel.com/docs/cli)
- [Shopify CLI Docs](https://shopify.dev/docs/apps/tools/cli)
- [GitHub Actions for Vercel](https://vercel.com/guides/how-can-i-use-github-actions-with-vercel)

---

**Last Updated**: November 2025

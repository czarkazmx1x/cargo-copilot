# Kargo Kopilot 🚢

**AI-Powered Customs Compliance Automation for Shopify**

Kargo Kopilot helps international merchants classify products instantly using Google Gemini Vision AI and Claude 3.5 Sonnet. It automates the generation of HS Codes, Commercial Invoices, and Packing Lists.

## 🏗️ Architecture

```mermaid
graph TD
    %% --- STYLING DEFINITIONS ---
    classDef blue fill:#E3F2FD,stroke:#1565C0,stroke-width:2px,color:#0D47A1;
    classDef green fill:#E8F5E9,stroke:#2E7D32,stroke-width:2px,color:#1B5E20;
    classDef orange fill:#FFF3E0,stroke:#EF6C00,stroke-width:2px,color:#E65100;
    classDef red fill:#FFEBEE,stroke:#C62828,stroke-width:2px,stroke-dasharray: 5 5,color:#B71C1C;

    %% --- NODES & SUBGRAPHS ---
    
    User((👤 User))

    subgraph Browser_Client [💻 Client Side / Browser]
        ShopifyAdmin[🛒 Shopify Admin Interface]:::blue
        
        subgraph Iframe [Embedded App Iframe]
            AppFrontend[🖥️ App Frontend<br/>(React/Next.js)]:::green
            AppBridge[🔗 Shopify App Bridge]:::red
        end
    end

    subgraph Server_Cloud [☁️ Server Side / Vercel]
        AppBackend[⚙️ App Backend / API<br/>(Next.js Serverless)]:::green
        AuthCheck{🛡️ Verify JWT<br/>Session Token}:::red
    end

    subgraph Data_Storage [💾 Data Layer]
        Supabase[(🗄️ Supabase DB<br/>History & User Data)]:::green
    end

    subgraph External_Services [🌐 External APIs]
        OpenRouter[🧠 OpenRouter API<br/>(Claude Text Analysis)]:::orange
        Gemini[✨ Google Gemini API<br/>(Vision Analysis)]:::orange
    end

    subgraph Shopify_Platform [🛒 Shopify Platform]
        ShopifyAPI[Shopify API<br/>(Products/Orders)]:::blue
        Webhooks[🔔 GDPR Webhooks<br/>(Data Requests)]:::blue
    end

    %% --- DATA FLOWS ---

    %% 1. User Interface Flow
    User -->|Opens| ShopifyAdmin
    ShopifyAdmin -->|Loads| AppFrontend

    %% 2. Authentication Flow
    AppFrontend -- 1. Request Token --> AppBridge
    AppBridge -- 2. Return Session Token --> AppFrontend
    AppFrontend -- 3. API Call + Bearer Token --> AuthCheck

    %% 3. Backend Logic Flow
    AuthCheck -- Validated --> AppBackend
    
    %% 4. AI Processing
    AppBackend -- 4. Send Text --> OpenRouter
    AppBackend -- 5. Send Images --> Gemini
    
    %% 5. Data Persistence
    AppBackend <-->|6. Read/Write| Supabase

    %% 6. Shopify Interaction
    AppBackend <-->|7. Fetch/Update Data| ShopifyAPI
    Webhooks -.->|8. Async Data Events| AppBackend

    %% --- LEGEND ---
    subgraph Legend [Legend]
        L1[Shopify Components]:::blue
        L2[Our App / Server]:::green
        L3[External AI APIs]:::orange
        L4[Security & Auth]:::red
    end
```

## 📚 Documentation

We have comprehensive documentation available for developers:

- **[📘 Complete Guide](docs/KARGO_KOPILOT_COMPLETE_GUIDE.md)**: Architecture, Design Patterns, and Deep Dives.
- **[⚡ Quick Start](docs/KARGO_KOPILOT_QUICK_START.md)**: Get the app running in under 5 minutes.
- **[🔄 Transfer Guide](docs/KARGO_KOPILOT_TRANSFER.md)**: Roadmap for moving from this prototype to Production V2.

## ✨ Features

- **AI Classification:** Hybrid Image + Text analysis for high-accuracy HS Codes.
- **Batch Processing:** Bulk classify 50+ orders simultaneously with real-time progress tracking.
- **Order Management:** Filter and manage international shipments.
- **Shopify Native:** Built with Polaris UI to feel exactly like Shopify Admin.

## 🛠️ Tech Stack

- **Frontend:** React 18, Tailwind CSS, Lucide Icons
- **AI:** Google Gemini 1.5 Flash (via `@google/genai`)
- **Architecture:** Service-based Client-Side Simulation (Prototype)

## 🚀 Getting Started

### Local Development

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Copy `.env.example` to `.env.local`
4.  Add your Gemini `API_KEY` to `.env.local`
5.  Run the development server: `npm run dev`
6.  See `docs/KARGO_KOPILOT_QUICK_START.md` for details.

### Deploy to Vercel & Shopify

Ready to deploy your app to production? We've made it easy!

- **⚡ [Quick Start Guide](QUICKSTART.md)** - Deploy in 15 minutes
- **📖 [Complete Deployment Guide](DEPLOYMENT.md)** - Detailed setup with production considerations
- **✅ [Setup Summary](SETUP_COMPLETE.md)** - What's included and ready to use
- **🔧 [Troubleshooting Guide](TROUBLESHOOTING.md)** - Solutions to common issues

All configuration files for Vercel and Shopify integration are already set up. Just follow the guides!

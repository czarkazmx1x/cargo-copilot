
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

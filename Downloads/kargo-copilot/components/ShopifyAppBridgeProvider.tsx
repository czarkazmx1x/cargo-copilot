import React, { useState, useEffect, createContext, useContext } from 'react';
import { createApp } from '@shopify/app-bridge';
import { Provider as AppBridgeProvider, Loading } from '@shopify/app-bridge-react';
import { AppProvider } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';

interface ShopifyAppBridgeContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  shopDomain: string | null;
  host: string | null;
}

const ShopifyAppBridgeContext = createContext<ShopifyAppBridgeContextType>({
  isAuthenticated: false,
  isLoading: true,
  error: null,
  shopDomain: null,
  host: null,
});

export const useShopifyAuth = () => useContext(ShopifyAppBridgeContext);

interface ShopifyAppBridgeProviderProps {
  children: React.ReactNode;
}

export const ShopifyAppBridgeProvider: React.FC<ShopifyAppBridgeProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shopDomain, setShopDomain] = useState<string | null>(null);
  const [host, setHost] = useState<string | null>(null);
  const [appBridgeConfig, setAppBridgeConfig] = useState<any>(null);

  useEffect(() => {
    const initializeAppBridge = async () => {
      console.log('[App Bridge] Starting initialization...');

      try {
        // Get URL parameters
        const params = new URLSearchParams(window.location.search);
        const hostParam = params.get('host');
        const shopParam = params.get('shop');

        console.log('[App Bridge] URL params:', { host: hostParam, shop: shopParam });

        // Check if we're in embedded context
        if (!hostParam || !shopParam) {
          console.warn('[App Bridge] Missing required parameters (host or shop)');
          console.log('[App Bridge] Running in standalone mode (for development)');

          // Allow development without embedding
          setIsAuthenticated(true);
          setIsLoading(false);
          setShopDomain(shopParam || 'development-mode');
          setHost(hostParam || null);
          return;
        }

        // Get API key from environment
        const apiKey = import.meta.env.VITE_SHOPIFY_API_KEY;

        if (!apiKey) {
          throw new Error('VITE_SHOPIFY_API_KEY environment variable is not set');
        }

        console.log('[App Bridge] API Key found:', apiKey.substring(0, 10) + '...');

        // Create app bridge configuration
        const config = {
          apiKey: apiKey,
          host: hostParam,
          forceRedirect: true,
        };

        console.log('[App Bridge] Creating App Bridge instance...');
        setAppBridgeConfig(config);
        setShopDomain(shopParam);
        setHost(hostParam);

        // Mark as authenticated
        setIsAuthenticated(true);
        console.log('[App Bridge] ✅ Successfully initialized!');

      } catch (err) {
        console.error('[App Bridge] ❌ Initialization failed:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.error('[App Bridge] ⏱️ Initialization timeout after 10 seconds');
        setError('Authentication timeout. Please refresh the page.');
        setIsLoading(false);
      }
    }, 10000);

    initializeAppBridge();

    return () => clearTimeout(timeoutId);
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #5C6AC4',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#637381', fontSize: '14px' }}>
          Authenticating with Shopify...
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: '20px',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          backgroundColor: '#FED7D7',
          border: '1px solid #FC8181',
          borderRadius: '8px',
          padding: '20px',
          maxWidth: '500px'
        }}>
          <h2 style={{ color: '#C53030', marginTop: 0 }}>Authentication Error</h2>
          <p style={{ color: '#742A2A', marginBottom: '10px' }}>{error}</p>
          <details style={{ marginTop: '10px' }}>
            <summary style={{ cursor: 'pointer', color: '#742A2A', fontWeight: 'bold' }}>
              Troubleshooting Tips
            </summary>
            <ul style={{ color: '#742A2A', marginTop: '10px' }}>
              <li>Check that VITE_SHOPIFY_API_KEY is set in your environment variables</li>
              <li>Verify your app is properly configured in Shopify Partners</li>
              <li>Ensure the App URL matches your Vercel deployment URL</li>
              <li>Check browser console for detailed error logs</li>
            </ul>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: '#5C6AC4',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Provide context value
  const contextValue: ShopifyAppBridgeContextType = {
    isAuthenticated,
    isLoading,
    error,
    shopDomain,
    host,
  };

  // If App Bridge is configured, wrap with AppBridgeProvider
  if (appBridgeConfig) {
    return (
      <ShopifyAppBridgeContext.Provider value={contextValue}>
        <AppBridgeProvider config={appBridgeConfig}>
          <AppProvider i18n={{}}>
            {children}
          </AppProvider>
        </AppBridgeProvider>
      </ShopifyAppBridgeContext.Provider>
    );
  }

  // Development mode - no App Bridge
  return (
    <ShopifyAppBridgeContext.Provider value={contextValue}>
      <AppProvider i18n={{}}>
        {children}
      </AppProvider>
    </ShopifyAppBridgeContext.Provider>
  );
};

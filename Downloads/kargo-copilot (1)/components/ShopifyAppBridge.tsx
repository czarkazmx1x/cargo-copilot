import React, { useEffect, useState } from 'react';
import { Provider as AppBridgeProvider } from '@shopify/app-bridge-react';

interface ShopifyAppBridgeProps {
  children: React.ReactNode;
}

export const ShopifyAppBridge: React.FC<ShopifyAppBridgeProps> = ({ children }) => {
  const [config, setConfig] = useState<any>(null);
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔧 ShopifyAppBridge: Starting initialization...');

    try {
      // Get shop and host from URL parameters (Shopify embeds the app with these params)
      const urlParams = new URLSearchParams(window.location.search);
      const shop = urlParams.get('shop');
      const host = urlParams.get('host');

      console.log('📋 URL params:', {
        shop,
        host,
        allParams: Object.fromEntries(urlParams.entries())
      });

      // Check if we have API key configured
      const apiKey = import.meta.env.VITE_SHOPIFY_API_KEY;

      if (!apiKey) {
        console.warn('⚠️ VITE_SHOPIFY_API_KEY not set - app will run in standalone mode');
      }

      if (shop && host && apiKey) {
        console.log('✅ App is embedded in Shopify admin');

        const appConfig = {
          apiKey: apiKey,
          host: host,
          forceRedirect: false,
        };

        console.log('🔑 App Bridge config:', {
          apiKey: apiKey.substring(0, 10) + '...',
          host,
          forceRedirect: false
        });

        setConfig(appConfig);
        setIsEmbedded(true);
      } else {
        console.log('ℹ️ Running in standalone mode (not embedded)');
        setIsEmbedded(false);
      }

      setIsLoading(false);

    } catch (err) {
      console.error('❌ ShopifyAppBridge initialization error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsLoading(false);
    }
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing Kargo Copilot...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-red-600 mb-2">Initialization Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // If not embedded, render children without App Bridge
  if (!config || !isEmbedded) {
    console.log('✅ Rendering app in standalone mode');
    return <>{children}</>;
  }

  // Render with App Bridge when embedded
  console.log('✅ Rendering app with Shopify App Bridge');
  return (
    <AppBridgeProvider config={config}>
      {children}
    </AppBridgeProvider>
  );
};

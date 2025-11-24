/**
 * Shopify Authentication Utilities
 * Handles session tokens and authentication for embedded apps
 */

import { getSessionToken } from '@shopify/app-bridge/utilities';

/**
 * Get session token from App Bridge (for embedded apps)
 * Returns null if not in embedded context
 */
export const getAppBridgeSessionToken = async (): Promise<string | null> => {
  try {
    // Check if we're in an embedded context
    if (typeof window === 'undefined') {
      return null;
    }

    // Try to get the app bridge instance from window
    const app = (window as any).app;

    if (!app) {
      console.log('[Auth] Not in embedded context, using manual auth');
      return null;
    }

    // Get session token
    const token = await getSessionToken(app);
    console.log('[Auth] ✓ Session token obtained');
    return token;

  } catch (error) {
    console.error('[Auth] Failed to get session token:', error);
    return null;
  }
};

/**
 * Get authenticated headers for Shopify API requests
 * Tries to use session token first, falls back to manual access token
 */
export const getAuthenticatedHeaders = async (
  manualAccessToken?: string
): Promise<Record<string, string>> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Try to get session token from App Bridge
  const sessionToken = await getAppBridgeSessionToken();

  if (sessionToken) {
    // Use session token for embedded app
    console.log('[Auth] Using App Bridge session token');
    headers['Authorization'] = `Bearer ${sessionToken}`;
  } else if (manualAccessToken) {
    // Fall back to manual access token
    console.log('[Auth] Using manual access token');
    headers['X-Shopify-Access-Token'] = manualAccessToken;
  } else {
    console.warn('[Auth] No authentication method available');
  }

  return headers;
};

/**
 * Check if the app is running in embedded mode
 */
export const isEmbeddedApp = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  const params = new URLSearchParams(window.location.search);
  return params.has('host') && params.has('shop');
};

/**
 * Get shop domain from URL parameters or stored settings
 */
export const getShopDomain = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  // Try URL parameters first (for embedded apps)
  const params = new URLSearchParams(window.location.search);
  const shopParam = params.get('shop');

  if (shopParam) {
    return shopParam;
  }

  // Fall back to stored settings
  try {
    const settings = localStorage.getItem('kargo_copilot_settings');
    if (settings) {
      const parsed = JSON.parse(settings);
      return parsed.shopDomain || null;
    }
  } catch (error) {
    console.error('[Auth] Failed to get shop domain from settings:', error);
  }

  return null;
};

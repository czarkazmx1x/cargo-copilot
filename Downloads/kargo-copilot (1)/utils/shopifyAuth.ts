/**
 * Shopify Authentication Utilities
 * Handles session token fetching with timeout and retry logic
 */

interface SessionTokenOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

/**
 * Fetch session token with timeout
 */
export async function getSessionTokenWithTimeout(
  appBridge: any,
  options: SessionTokenOptions = {}
): Promise<string> {
  const {
    timeout = 30000, // 30 seconds default
    retries = 3,
    retryDelay = 2000, // 2 seconds between retries
  } = options;

  console.log('🔐 Attempting to get session token...', {
    timeout: `${timeout}ms`,
    retries,
    retryDelay: `${retryDelay}ms`
  });

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔄 Token fetch attempt ${attempt}/${retries}`);

      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Session token timeout after ${timeout}ms`));
        }, timeout);
      });

      // Create token fetch promise
      const tokenPromise = appBridge.idToken();

      // Race between timeout and token fetch
      const token = await Promise.race([tokenPromise, timeoutPromise]);

      console.log('✅ Session token retrieved successfully');
      return token as string;

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      console.error(`❌ Token fetch attempt ${attempt} failed:`, {
        message: lastError.message,
        name: lastError.name,
        attempt,
        retriesLeft: retries - attempt
      });

      // If this isn't the last attempt, wait before retrying
      if (attempt < retries) {
        console.log(`⏳ Waiting ${retryDelay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }

  // All retries exhausted
  console.error('❌ All token fetch attempts failed', {
    totalAttempts: retries,
    lastError: lastError?.message
  });

  throw lastError || new Error('Failed to fetch session token');
}

/**
 * Validate if we're in a Shopify embedded context
 */
export function isShopifyEmbedded(): boolean {
  const urlParams = new URLSearchParams(window.location.search);
  const shop = urlParams.get('shop');
  const host = urlParams.get('host');

  const isEmbedded = !!(shop && host);

  console.log('🔍 Checking if app is embedded:', {
    shop,
    host,
    isEmbedded
  });

  return isEmbedded;
}

/**
 * Get Shopify shop domain from URL
 */
export function getShopDomain(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  const shop = urlParams.get('shop');

  if (!shop) {
    console.warn('⚠️ No shop parameter found in URL');
    return null;
  }

  console.log('🏪 Shop domain:', shop);
  return shop;
}

/**
 * Check if App Bridge is available
 */
export function isAppBridgeAvailable(): boolean {
  const available = typeof window !== 'undefined' && 'shopify' in window;

  console.log('🌉 App Bridge available:', available);

  return available;
}

/**
 * Parse App Bridge errors for better debugging
 */
export function parseAppBridgeError(error: unknown): {
  message: string;
  code?: string;
  details?: any;
} {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: (error as any).code,
      details: {
        name: error.name,
        stack: error.stack,
      }
    };
  }

  return {
    message: String(error),
    details: error
  };
}

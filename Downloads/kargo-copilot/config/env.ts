/**
 * Environment Configuration Helper
 * Manages all environment variables with validation and defaults
 */

interface EnvConfig {
  // Shopify Configuration
  shopifyApiKey: string | undefined;
  shopifyApiSecret: string | undefined;

  // Gemini AI Configuration
  geminiApiKey: string | undefined;

  // Environment
  isDevelopment: boolean;
  isProduction: boolean;
}

class EnvironmentConfig {
  private config: EnvConfig;

  constructor() {
    this.config = {
      // Shopify
      shopifyApiKey: import.meta.env.VITE_SHOPIFY_API_KEY,
      shopifyApiSecret: import.meta.env.VITE_SHOPIFY_API_SECRET,

      // Gemini AI
      geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY,

      // Environment detection
      isDevelopment: import.meta.env.DEV,
      isProduction: import.meta.env.PROD,
    };

    // Log configuration in development
    if (this.config.isDevelopment) {
      console.log('[Environment] Configuration loaded:', {
        shopifyApiKey: this.config.shopifyApiKey ? '✓ Set' : '✗ Missing',
        shopifyApiSecret: this.config.shopifyApiSecret ? '✓ Set' : '✗ Missing',
        geminiApiKey: this.config.geminiApiKey ? '✓ Set' : '✗ Missing',
        environment: this.config.isDevelopment ? 'development' : 'production',
      });
    }
  }

  /**
   * Get Shopify API Key (required for embedded apps)
   */
  getShopifyApiKey(): string {
    if (!this.config.shopifyApiKey) {
      console.warn('[Environment] VITE_SHOPIFY_API_KEY is not set');
      return '';
    }
    return this.config.shopifyApiKey;
  }

  /**
   * Get Shopify API Secret (required for backend auth)
   */
  getShopifyApiSecret(): string | undefined {
    return this.config.shopifyApiSecret;
  }

  /**
   * Get Gemini API Key
   */
  getGeminiApiKey(): string {
    if (!this.config.geminiApiKey) {
      console.warn('[Environment] VITE_GEMINI_API_KEY is not set');
      return '';
    }
    return this.config.geminiApiKey;
  }

  /**
   * Check if running in development mode
   */
  isDev(): boolean {
    return this.config.isDevelopment;
  }

  /**
   * Check if running in production mode
   */
  isProd(): boolean {
    return this.config.isProduction;
  }

  /**
   * Validate required environment variables
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Only validate Shopify API key in production
    if (this.config.isProduction && !this.config.shopifyApiKey) {
      errors.push('VITE_SHOPIFY_API_KEY is required in production');
    }

    if (!this.config.geminiApiKey) {
      errors.push('VITE_GEMINI_API_KEY is required for HS Code classification');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get all configuration (for debugging)
   */
  getAll(): EnvConfig {
    return { ...this.config };
  }
}

// Export singleton instance
export const env = new EnvironmentConfig();

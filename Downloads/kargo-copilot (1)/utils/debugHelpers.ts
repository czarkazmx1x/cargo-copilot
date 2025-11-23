/**
 * Debug Helpers for Kargo Copilot
 * Use these utilities to diagnose deployment and integration issues
 */

export interface EnvironmentCheck {
  name: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  value?: string;
}

/**
 * Check all environment variables
 */
export function checkEnvironmentVariables(): EnvironmentCheck[] {
  const checks: EnvironmentCheck[] = [];

  // Check Gemini API Key
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (geminiKey) {
    checks.push({
      name: 'VITE_GEMINI_API_KEY',
      status: 'success',
      message: 'Gemini API key is set',
      value: geminiKey.substring(0, 10) + '...' + geminiKey.substring(geminiKey.length - 4)
    });
  } else {
    checks.push({
      name: 'VITE_GEMINI_API_KEY',
      status: 'error',
      message: 'Gemini API key is NOT set - AI classification will not work',
      value: 'undefined'
    });
  }

  // Check Shopify API Key
  const shopifyKey = import.meta.env.VITE_SHOPIFY_API_KEY;
  if (shopifyKey) {
    checks.push({
      name: 'VITE_SHOPIFY_API_KEY',
      status: 'success',
      message: 'Shopify API key is set',
      value: shopifyKey.substring(0, 10) + '...'
    });
  } else {
    checks.push({
      name: 'VITE_SHOPIFY_API_KEY',
      status: 'warning',
      message: 'Shopify API key is NOT set - app will run in standalone mode',
      value: 'undefined'
    });
  }

  // Check App URL
  const appUrl = import.meta.env.VITE_APP_URL;
  if (appUrl) {
    checks.push({
      name: 'VITE_APP_URL',
      status: 'success',
      message: 'App URL is configured',
      value: appUrl
    });
  } else {
    checks.push({
      name: 'VITE_APP_URL',
      status: 'warning',
      message: 'App URL not set - optional but recommended',
      value: 'undefined'
    });
  }

  return checks;
}

/**
 * Check Shopify embedding context
 */
export function checkShopifyContext(): EnvironmentCheck[] {
  const checks: EnvironmentCheck[] = [];

  // Check URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const shop = urlParams.get('shop');
  const host = urlParams.get('host');
  const embedded = urlParams.get('embedded');

  if (shop) {
    checks.push({
      name: 'Shop Parameter',
      status: 'success',
      message: 'Shop domain found in URL',
      value: shop
    });
  } else {
    checks.push({
      name: 'Shop Parameter',
      status: 'warning',
      message: 'No shop parameter - running in standalone mode',
      value: 'Not found'
    });
  }

  if (host) {
    checks.push({
      name: 'Host Parameter',
      status: 'success',
      message: 'Host parameter found',
      value: host
    });
  } else {
    checks.push({
      name: 'Host Parameter',
      status: 'warning',
      message: 'No host parameter - not embedded in Shopify admin',
      value: 'Not found'
    });
  }

  // Check if in iframe
  const inIframe = window.self !== window.top;
  checks.push({
    name: 'Iframe Context',
    status: inIframe ? 'success' : 'warning',
    message: inIframe ? 'App is running in an iframe' : 'App is NOT in an iframe',
    value: String(inIframe)
  });

  // Check window.shopify
  const hasShopify = typeof window !== 'undefined' && 'shopify' in window;
  checks.push({
    name: 'Shopify App Bridge',
    status: hasShopify ? 'success' : 'error',
    message: hasShopify ? 'App Bridge is available' : 'App Bridge is NOT available',
    value: String(hasShopify)
  });

  return checks;
}

/**
 * Check browser capabilities
 */
export function checkBrowserCapabilities(): EnvironmentCheck[] {
  const checks: EnvironmentCheck[] = [];

  // Check localStorage
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    checks.push({
      name: 'localStorage',
      status: 'success',
      message: 'localStorage is available',
      value: 'Working'
    });
  } catch (e) {
    checks.push({
      name: 'localStorage',
      status: 'error',
      message: 'localStorage is NOT available - settings cannot be saved',
      value: 'Blocked'
    });
  }

  // Check fetch API
  checks.push({
    name: 'Fetch API',
    status: typeof fetch !== 'undefined' ? 'success' : 'error',
    message: typeof fetch !== 'undefined' ? 'Fetch API available' : 'Fetch API NOT available',
    value: String(typeof fetch !== 'undefined')
  });

  return checks;
}

/**
 * Run all diagnostic checks
 */
export function runDiagnostics(): {
  environment: EnvironmentCheck[];
  shopify: EnvironmentCheck[];
  browser: EnvironmentCheck[];
  summary: {
    total: number;
    success: number;
    warnings: number;
    errors: number;
  };
} {
  const environment = checkEnvironmentVariables();
  const shopify = checkShopifyContext();
  const browser = checkBrowserCapabilities();

  const allChecks = [...environment, ...shopify, ...browser];

  const summary = {
    total: allChecks.length,
    success: allChecks.filter(c => c.status === 'success').length,
    warnings: allChecks.filter(c => c.status === 'warning').length,
    errors: allChecks.filter(c => c.status === 'error').length
  };

  return {
    environment,
    shopify,
    browser,
    summary
  };
}

/**
 * Log diagnostics to console
 */
export function logDiagnostics(): void {
  console.group('🔍 Kargo Copilot Diagnostics');

  const diagnostics = runDiagnostics();

  console.group('📋 Environment Variables');
  diagnostics.environment.forEach(check => {
    const icon = check.status === 'success' ? '✅' : check.status === 'warning' ? '⚠️' : '❌';
    console.log(`${icon} ${check.name}: ${check.message}`, check.value ? `(${check.value})` : '');
  });
  console.groupEnd();

  console.group('🛒 Shopify Context');
  diagnostics.shopify.forEach(check => {
    const icon = check.status === 'success' ? '✅' : check.status === 'warning' ? '⚠️' : '❌';
    console.log(`${icon} ${check.name}: ${check.message}`, check.value ? `(${check.value})` : '');
  });
  console.groupEnd();

  console.group('🌐 Browser Capabilities');
  diagnostics.browser.forEach(check => {
    const icon = check.status === 'success' ? '✅' : check.status === 'warning' ? '⚠️' : '❌';
    console.log(`${icon} ${check.name}: ${check.message}`, check.value ? `(${check.value})` : '');
  });
  console.groupEnd();

  console.log('📊 Summary:', diagnostics.summary);

  if (diagnostics.summary.errors > 0) {
    console.warn(`⚠️ Found ${diagnostics.summary.errors} error(s) that need attention`);
  }
  if (diagnostics.summary.warnings > 0) {
    console.info(`ℹ️ Found ${diagnostics.summary.warnings} warning(s)`);
  }
  if (diagnostics.summary.errors === 0 && diagnostics.summary.warnings === 0) {
    console.log('✅ All checks passed!');
  }

  console.groupEnd();
}

/**
 * Create a diagnostic report for debugging
 */
export function generateDiagnosticReport(): string {
  const diagnostics = runDiagnostics();

  let report = '# Kargo Copilot Diagnostic Report\n\n';
  report += `Generated: ${new Date().toISOString()}\n\n`;

  report += '## Summary\n';
  report += `- Total Checks: ${diagnostics.summary.total}\n`;
  report += `- ✅ Success: ${diagnostics.summary.success}\n`;
  report += `- ⚠️ Warnings: ${diagnostics.summary.warnings}\n`;
  report += `- ❌ Errors: ${diagnostics.summary.errors}\n\n`;

  report += '## Environment Variables\n';
  diagnostics.environment.forEach(check => {
    const icon = check.status === 'success' ? '✅' : check.status === 'warning' ? '⚠️' : '❌';
    report += `${icon} **${check.name}**: ${check.message}\n`;
  });
  report += '\n';

  report += '## Shopify Context\n';
  diagnostics.shopify.forEach(check => {
    const icon = check.status === 'success' ? '✅' : check.status === 'warning' ? '⚠️' : '❌';
    report += `${icon} **${check.name}**: ${check.message}\n`;
  });
  report += '\n';

  report += '## Browser Capabilities\n';
  diagnostics.browser.forEach(check => {
    const icon = check.status === 'success' ? '✅' : check.status === 'warning' ? '⚠️' : '❌';
    report += `${icon} **${check.name}**: ${check.message}\n`;
  });

  return report;
}

// Auto-run diagnostics in development
if (import.meta.env.DEV) {
  logDiagnostics();
}

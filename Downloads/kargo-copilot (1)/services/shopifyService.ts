
import { ShopifyProduct, Order, AppSettings } from '../types';
import { getSettings } from './settingsService';

// Helper to construct headers
const getHeaders = (accessToken: string) => {
  return {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': accessToken
  };
};

const getBaseUrl = (shopDomain: string) => {
  // Ensure we don't have protocol in domain
  const domain = shopDomain.replace(/^https?:\/\//, '');
  return `https://${domain}/admin/api/2024-01`;
};

/**
 * Fetches products from Shopify Admin API
 */
export const getShopifyProducts = async (): Promise<ShopifyProduct[]> => {
  const settings = await getSettings();
  
  if (!settings.shopDomain || !settings.accessToken) {
    console.warn("Shopify Credentials missing. Please configure in Settings.");
    return [];
  }

  try {
    const response = await fetch(`${getBaseUrl(settings.shopDomain)}/products.json?limit=20`, {
      method: 'GET',
      headers: getHeaders(settings.accessToken)
    });

    if (!response.ok) {
      throw new Error(`Shopify API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.products as ShopifyProduct[];

  } catch (error) {
    console.error("Failed to fetch Shopify products:", error);
    // Return empty array instead of mock to enforce "Real Data" requirement
    return [];
  }
};

/**
 * Fetches Orders from Shopify Admin API
 */
export const getShopifyOrders = async (): Promise<Order[]> => {
  const settings = await getSettings();

  if (!settings.shopDomain || !settings.accessToken) {
    console.warn("Shopify Credentials missing. Please configure in Settings.");
    return [];
  }

  try {
    const response = await fetch(`${getBaseUrl(settings.shopDomain)}/orders.json?status=any&limit=20`, {
      method: 'GET',
      headers: getHeaders(settings.accessToken)
    });

    if (!response.ok) {
      throw new Error(`Shopify API Error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Map Shopify Order structure to our App's Order interface
    return data.orders.map((o: any) => ({
      id: o.id.toString(),
      orderNumber: o.name,
      customer: o.customer ? `${o.customer.first_name} ${o.customer.last_name}` : 'Guest',
      countryCode: o.shipping_address ? o.shipping_address.country_code : 'Unknown',
      total: parseFloat(o.total_price),
      fulfillmentStatus: o.fulfillment_status === 'fulfilled' ? 'fulfilled' : 'unfulfilled',
      complianceStatus: 'missing_data', // Logic to determine this could be added
      date: new Date(o.created_at).toLocaleDateString(),
      shippingAddress: o.shipping_address ? `${o.shipping_address.address1}, ${o.shipping_address.city}, ${o.shipping_address.country}` : '',
      items: o.line_items.map((li: any) => ({
        id: li.id.toString(),
        title: li.title,
        description: li.name, // Line items often don't have full descriptions available in order view without product lookup
        sku: li.sku,
        price: parseFloat(li.price),
        status: 'unclassified',
        hsCode: '',
        weight: li.grams ? li.grams / 1000 : 0,
        quantity: li.quantity
      }))
    }));

  } catch (error) {
    console.error("Failed to fetch Shopify orders:", error);
    return [];
  }
};

export const updateProductHSCode = async (productId: string, hsCode: string): Promise<boolean> => {
  const settings = await getSettings();

  if (!settings.shopDomain || !settings.accessToken) {
    alert("Please configure Shopify API credentials in Settings first.");
    return false;
  }

  console.log(`[Shopify API] Updating Product ${productId} with HS Code: ${hsCode}`);
  
  try {
    // Note: HS Code is typically stored in InventoryItem or Metafields.
    // For simplicity, we are saving it as a Metafield on the Product.
    const url = `${getBaseUrl(settings.shopDomain)}/products/${productId}/metafields.json`;
    
    const payload = {
      metafield: {
        namespace: "customs",
        key: "hs_code",
        value: hsCode,
        type: "single_line_text_field"
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(settings.accessToken),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Failed to save metafield: ${response.statusText}`);
    }

    return true;

  } catch (error) {
    console.error("Failed to update product:", error);
    return false;
  }
};

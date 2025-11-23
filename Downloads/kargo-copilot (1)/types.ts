
export interface HSCodeEntry {
  code: string;
  confidence: number;
  reason: string;
}

export interface ComplianceAlert {
  level: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  source: string;
}

export interface HSCodeResult {
  hs_code: string;
  confidence: number;
  description: string;
  reasoning: string;
  chapter: string;
  alternatives: HSCodeEntry[];
  requires_review: boolean;
  alerts?: ComplianceAlert[]; // New field
  source: 'AI_TEXT' | 'AI_VISION' | 'HYBRID';
  timestamp: string;
}

export interface ProductData {
  title: string;
  description: string;
  material?: string;
  product_type?: string;
  vendor?: string;
  origin_country?: string;
  images?: string[]; // Base64 strings or URLs
}

export interface ShopifyProduct {
  id: string;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  images: { src: string }[];
  variants: { sku: string; price: string }[];
  hs_code?: string; // Existing HS code if any
}

export interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl?: string; // Base64 or URL
  sku: string;
  price: number;
  status: 'classified' | 'unclassified' | 'review_needed';
  hsCode?: string;
  originCountry?: string;
  weight?: number; // in kg
  quantity?: number;
  // Dimensions for calculators
  length?: number; // cm
  width?: number; // cm
  height?: number; // cm
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  countryCode: string;
  total: number;
  fulfillmentStatus: 'unfulfilled' | 'fulfilled';
  complianceStatus: 'compliant' | 'missing_data';
  items: Product[];
  date: string;
  shippingAddress?: string;
}

export enum NavItem {
  DASHBOARD = 'dashboard',
  CLASSIFY = 'classify',
  ADVANCED_CLASSIFY = 'advanced_classify',
  BATCH = 'batch',
  ORDERS = 'orders',
  DOCUMENTS = 'documents',
  SHIPPING = 'shipping',
  LOAD_CALC = 'load_calc',
  DUTY_CALC = 'duty_calc',
  HISTORY = 'history',
  SETTINGS = 'settings',
}

export interface BatchItemResult {
  orderId: string;
  orderNumber: string;
  status: 'success' | 'failed';
  message: string;
  hsCodesGenerated: number;
}

export interface BatchJob {
  id: string;
  name: string;
  total: number;
  processed: number;
  failed: number;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  results: BatchItemResult[];
}

export type DocumentType = 'COMMERCIAL_INVOICE' | 'PACKING_LIST' | 'CERTIFICATE_OF_ORIGIN';

export interface DocumentTemplate {
  id: string;
  name: string;
  logo?: string; // Base64 data URL
  layout: 'classic' | 'modern' | 'minimal';
  primaryColor: string;
  showCompanyAddress: boolean;
  showTaxId: boolean;
  footerText?: string;
  createdAt: string;
}

export interface GeneratedDocument {
  id: string;
  orderId: string;
  orderNumber: string;
  type: DocumentType;
  url: string; // Mock URL or blob URL
  createdAt: string;
}

export interface ClassificationHistoryItem {
  id: string;
  productName: string;
  description: string; // Short excerpt
  hsCode: string;
  confidence: number;
  timestamp: string;
  method: 'AI_TEXT' | 'AI_VISION' | 'HYBRID';
  status: 'active' | 'archived';
}

export interface HSDatabaseEntry {
  code: string; // "6109.10"
  description: string;
  chapter: string; // "61"
  heading: string; // "6109"
  section: string; // "Section XI: Textiles and Textile Articles"
}

export interface AppSettings {
  companyName: string;
  address: string;
  taxId: string;
  openRouterKey: string;
  geminiKey: string;
  defaultOriginCountry: string;
  defaultCurrency: string;
  shopDomain?: string;
  accessToken?: string;
}

// --- Shipping Calculator Types ---

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface ShippingRate {
  carrier: string; // 'DHL' | 'FedEx' | 'UPS' | 'USPS'
  serviceName: string;
  serviceCode: string;
  totalPrice: number;
  baseShipping: number;
  customsDuties: number;
  docFee: number;
  currency: string;
  deliveryDays: number;
  deliveryDate: string;
  features: string[];
}

export interface PackageDetails {
  weight: number; // kg
  length: number; // cm
  width: number; // cm
  height: number; // cm
  type: 'box' | 'envelope' | 'pallet';
}

// --- Container Load Calculator Types ---

export type ContainerType = '20ft' | '40ft' | '40hc';

export interface ContainerSpec {
  type: ContainerType;
  name: string;
  maxVolumeCBM: number; // Cubic Meters
  maxWeightKg: number;
  innerLength: number; // cm
  innerWidth: number; // cm
  innerHeight: number; // cm
}

export interface LoadCalculation {
  totalVolumeCBM: number;
  totalWeightKg: number;
  containersRequired: number;
  volumeUtilization: number; // %
  weightUtilization: number; // %
  isOverweight: boolean;
  totalCartons: number;
}

// --- Duty Calculator Types ---

export interface DutyCalculation {
  hsCode: string;
  productValue: number;
  shippingCost: number;
  insuranceCost: number;
  originCountry: string;
  destinationCountry: string;
  
  // Results
  dutyRate: number; // decimal
  dutyAmount: number;
  vatRate: number; // decimal
  vatAmount: number;
  totalLandedCost: number;
  currency: string;
}

// Global definition for Shopify App Bridge
declare global {
  var shopify: any;
}

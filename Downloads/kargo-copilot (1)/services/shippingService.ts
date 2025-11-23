
import { Address, Product, ShippingRate, PackageDetails } from '../types';

// Mock Constants
const KARGO_DOC_FEE = 5.00;
const DUTY_THRESHOLD = 800; // De minimis value (e.g. US)

export const calculateShippingRates = async (
  origin: Address,
  destination: Address,
  items: Product[],
  pkg: PackageDetails
): Promise<ShippingRate[]> => {
  
  // Simulate API Latency
  await new Promise(resolve => setTimeout(resolve, 1200));

  const totalValue = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  
  // 1. Calculate Customs Duties (Mock Logic based on simple rules)
  const estimatedDuty = calculateDuties(destination.country, items, totalValue);
  
  // 2. Generate Carrier Rates
  const carrierRates = generateMockRates(origin, destination, pkg, totalValue);

  // 3. Combine and Return
  return carrierRates.map(rate => ({
    ...rate,
    customsDuties: estimatedDuty,
    docFee: KARGO_DOC_FEE,
    totalPrice: rate.baseShipping + estimatedDuty + KARGO_DOC_FEE
  })).sort((a, b) => a.totalPrice - b.totalPrice);
};

const calculateDuties = (country: string, items: Product[], value: number): number => {
  // De Minimis Check (Simplified)
  if (value < DUTY_THRESHOLD && country === 'US') return 0;

  let totalDuty = 0;

  items.forEach(item => {
    // Mock Duty Rates based on HS Code categories
    let dutyRate = 0.0;
    const hs = item.hsCode || '';

    if (hs.startsWith('61') || hs.startsWith('62')) dutyRate = 0.12; // Apparel ~12%
    else if (hs.startsWith('64')) dutyRate = 0.10; // Footwear ~10%
    else if (hs.startsWith('85')) dutyRate = 0.02; // Electronics ~2%
    else if (hs === '') dutyRate = 0.20; // Penalty for missing HS code
    else dutyRate = 0.05; // General goods

    totalDuty += (item.price * (item.quantity || 1)) * dutyRate;
  });

  return parseFloat(totalDuty.toFixed(2));
};

const generateMockRates = (
  origin: Address, 
  dest: Address, 
  pkg: PackageDetails,
  value: number
): Omit<ShippingRate, 'totalPrice' | 'customsDuties' | 'docFee'>[] => {
  
  const isInternational = origin.country !== dest.country;
  const weightFactor = pkg.weight * 5; // Simple cost per kg multiplier

  const rates: Omit<ShippingRate, 'totalPrice' | 'customsDuties' | 'docFee'>[] = [];

  const today = new Date();
  const addDays = (days: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // DHL (Strong International)
  if (isInternational) {
    rates.push({
      carrier: 'DHL',
      serviceName: 'Express Worldwide',
      serviceCode: 'DHL_EXPRESS',
      baseShipping: 45 + weightFactor,
      currency: 'USD',
      deliveryDays: 3,
      deliveryDate: addDays(3),
      features: ['Tracking', 'Signature', 'Customs Clearance']
    });
  }

  // FedEx
  rates.push({
    carrier: 'FedEx',
    serviceName: isInternational ? 'International Priority' : 'Standard Overnight',
    serviceCode: 'FEDEX_PRIORITY',
    baseShipping: (isInternational ? 55 : 25) + weightFactor,
    currency: 'USD',
    deliveryDays: isInternational ? 2 : 1,
    deliveryDate: addDays(isInternational ? 2 : 1),
    features: ['Tracking', 'Insurance']
  });

  rates.push({
    carrier: 'FedEx',
    serviceName: isInternational ? 'International Economy' : 'Ground',
    serviceCode: 'FEDEX_ECONOMY',
    baseShipping: (isInternational ? 35 : 12) + weightFactor,
    currency: 'USD',
    deliveryDays: isInternational ? 5 : 4,
    deliveryDate: addDays(isInternational ? 5 : 4),
    features: ['Tracking']
  });

  // UPS
  rates.push({
    carrier: 'UPS',
    serviceName: isInternational ? 'Worldwide Saver' : 'Next Day Air',
    serviceCode: 'UPS_SAVER',
    baseShipping: (isInternational ? 52 : 28) + weightFactor,
    currency: 'USD',
    deliveryDays: isInternational ? 3 : 1,
    deliveryDate: addDays(isInternational ? 3 : 1),
    features: ['Tracking', 'Money-back Guarantee']
  });

  // USPS (Cheaper, slower)
  rates.push({
    carrier: 'USPS',
    serviceName: isInternational ? 'Priority Mail International' : 'Priority Mail',
    serviceCode: 'USPS_PRIORITY',
    baseShipping: (isInternational ? 28 : 8) + weightFactor,
    currency: 'USD',
    deliveryDays: isInternational ? 8 : 3,
    deliveryDate: addDays(isInternational ? 8 : 3),
    features: ['Tracking']
  });

  return rates;
};

export const optimizePackaging = (items: Product[]): PackageDetails => {
  // Mock AI Logic: simple volume estimation
  // Assume average item volume is 20x20x10cm
  const totalItems = items.reduce((sum, i) => sum + (i.quantity || 1), 0);
  const totalWeight = items.reduce((sum, i) => sum + ((i.weight || 1) * (i.quantity || 1)), 0);

  if (totalItems <= 1 && totalWeight < 0.5) {
    return { type: 'envelope', length: 35, width: 25, height: 2, weight: totalWeight };
  } else if (totalItems <= 2) {
    return { type: 'box', length: 30, width: 20, height: 15, weight: totalWeight + 0.2 };
  } else {
    return { type: 'box', length: 40, width: 30, height: 20, weight: totalWeight + 0.4 };
  }
};

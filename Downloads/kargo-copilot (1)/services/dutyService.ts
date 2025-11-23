
import { DutyCalculation } from '../types';

export const calculateLandedCost = async (
  params: Omit<DutyCalculation, 'dutyRate' | 'dutyAmount' | 'vatRate' | 'vatAmount' | 'totalLandedCost'>
): Promise<DutyCalculation> => {
  
  // Simulate API Latency for lookup
  await new Promise(resolve => setTimeout(resolve, 800));

  const { hsCode, productValue, shippingCost, insuranceCost, destinationCountry } = params;
  
  // CIF Value = Cost of Goods + Insurance + Freight
  const cifValue = productValue + shippingCost + insuranceCost;

  // Mock Duty Rates based on HS Code and Destination
  let dutyRate = 0.05; // Default 5%
  
  // Simple rule engine simulation
  if (destinationCountry === 'US') {
    // US has high de minimis ($800), but let's assume over threshold for calc
    if (hsCode.startsWith('61')) dutyRate = 0.16; // Cotton apparel high duty
    else if (hsCode.startsWith('62')) dutyRate = 0.16;
    else if (hsCode.startsWith('64')) dutyRate = 0.10; // Footwear
    else if (hsCode.startsWith('85')) dutyRate = 0.0; // Tech often free
  } else if (destinationCountry === 'GB' || destinationCountry === 'DE') {
    // Europe
    if (hsCode.startsWith('61')) dutyRate = 0.12;
    else if (hsCode.startsWith('87')) dutyRate = 0.10; // Cars
  }

  // Mock VAT Rates
  let vatRate = 0.0;
  switch (destinationCountry) {
    case 'GB': vatRate = 0.20; break; // UK VAT
    case 'DE': vatRate = 0.19; break; // Germany VAT
    case 'FR': vatRate = 0.20; break;
    case 'CA': vatRate = 0.05; break; // GST
    case 'AU': vatRate = 0.10; break; // GST
    default: vatRate = 0.0;
  }

  const dutyAmount = cifValue * dutyRate;
  
  // VAT is usually calculated on (CIF + Duty)
  const taxableBase = cifValue + dutyAmount;
  const vatAmount = taxableBase * vatRate;

  const totalLandedCost = cifValue + dutyAmount + vatAmount;

  return {
    ...params,
    dutyRate,
    dutyAmount,
    vatRate,
    vatAmount,
    totalLandedCost,
  };
};


import { ComplianceAlert, ProductData } from '../types';

interface RestrictionRule {
  countries: string[]; // ISO codes or 'ALL'
  keywords: string[];
  level: 'error' | 'warning' | 'info';
  message: string;
  source: string;
}

// Mock Database of Export Restrictions
const RESTRICTION_RULES: RestrictionRule[] = [
  {
    countries: ['SA', 'KW', 'QA', 'AE'], // Middle East
    keywords: ['alcohol', 'wine', 'beer', 'liquor', 'pork', 'ham', 'bacon'],
    level: 'error',
    message: 'Prohibited Item: Alcohol and Pork products are strictly restricted in this destination.',
    source: 'Islamic Import Regulations'
  },
  {
    countries: ['ALL'],
    keywords: ['lithium', 'battery', 'batteries'],
    level: 'warning',
    message: 'Dangerous Goods: Lithium batteries require specific labeling and packaging (UN 3480/3481).',
    source: 'IATA Dangerous Goods Regulations'
  },
  {
    countries: ['CN'],
    keywords: ['milk', 'formula', 'food'],
    level: 'info',
    message: 'Food Import: Requires CIQ certificates and pre-registration for China.',
    source: 'GACC Regulations'
  },
  {
    countries: ['IR', 'KP', 'SY', 'CU'], // Sanctioned
    keywords: ['electronics', 'computer', 'chip', 'processor', 'software'],
    level: 'error',
    message: 'Export Control: High-tech goods to this destination may violate sanctions.',
    source: 'OFAC / BIS'
  }
];

export const checkCompliance = (product: ProductData, hsCode: string): ComplianceAlert[] => {
  const alerts: ComplianceAlert[] = [];
  const targetCountry = product.origin_country || 'ALL'; // In a real flow, this would be destination country
  
  const textToScan = `${product.title} ${product.description} ${product.material}`.toLowerCase();

  for (const rule of RESTRICTION_RULES) {
    // Check Country Match
    const countryMatch = rule.countries.includes('ALL') || rule.countries.includes(targetCountry);
    
    if (countryMatch) {
      // Check Keywords
      const keywordMatch = rule.keywords.some(kw => textToScan.includes(kw));
      
      if (keywordMatch) {
        alerts.push({
          level: rule.level,
          title: rule.level === 'error' ? 'Export Restriction' : 'Compliance Notice',
          message: rule.message,
          source: rule.source
        });
      }
    }
  }

  // HS Code specific checks (Mock logic)
  if (hsCode.startsWith('93')) { // Arms and Ammunition
    alerts.push({
      level: 'error',
      title: 'Restricted Category',
      message: 'Chapter 93 (Arms) requires specific export licenses.',
      source: 'Export Control List'
    });
  }

  return alerts;
};

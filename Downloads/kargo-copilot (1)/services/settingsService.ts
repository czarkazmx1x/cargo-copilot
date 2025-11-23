
import { AppSettings } from '../types';

const STORAGE_KEY = 'kargo_kopilot_settings';

const DEFAULT_SETTINGS: AppSettings = {
  companyName: '',
  address: '',
  taxId: '',
  openRouterKey: '',
  geminiKey: '',
  defaultOriginCountry: 'US',
  defaultCurrency: 'USD',
};

export const getSettings = async (): Promise<AppSettings> => {
  // Simulate async fetch
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error("Failed to load settings", e);
  }
  return DEFAULT_SETTINGS;
};

export const saveSettings = async (settings: AppSettings): Promise<boolean> => {
  // Simulate async save
  await new Promise(resolve => setTimeout(resolve, 600));
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    return true;
  } catch (e) {
    console.error("Failed to save settings", e);
    return false;
  }
};

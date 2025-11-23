
import { DocumentTemplate } from '../types';

// Mock Templates
let templates: DocumentTemplate[] = [
  {
    id: 'default-1',
    name: 'Standard Professional',
    layout: 'classic',
    primaryColor: '#008060', // Shopify Green
    showCompanyAddress: true,
    showTaxId: true,
    footerText: 'Thank you for your business. Please contact us for any questions.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'default-2',
    name: 'Modern Blue',
    layout: 'modern',
    primaryColor: '#2563eb', // Blue 600
    showCompanyAddress: true,
    showTaxId: false,
    footerText: '',
    createdAt: new Date().toISOString()
  }
];

export const getTemplates = async (): Promise<DocumentTemplate[]> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...templates];
};

export const saveTemplate = async (template: DocumentTemplate): Promise<DocumentTemplate> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const existingIndex = templates.findIndex(t => t.id === template.id);
  if (existingIndex >= 0) {
    templates[existingIndex] = template;
  } else {
    templates.unshift(template);
  }
  return template;
};

export const deleteTemplate = async (id: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  templates = templates.filter(t => t.id !== id);
  return true;
};

export const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

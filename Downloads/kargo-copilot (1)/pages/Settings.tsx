
import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AppSettings } from '../types';
import { getSettings, saveSettings } from '../services/settingsService';
import { Save, Building2, Key, Globe, CheckCircle2, ShoppingBag } from 'lucide-react';

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    companyName: '',
    address: '',
    taxId: '',
    openRouterKey: '',
    geminiKey: '',
    defaultOriginCountry: 'US',
    defaultCurrency: 'USD',
    shopDomain: '',
    accessToken: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await getSettings();
      setSettings(data);
      setIsLoading(false);
    };
    load();
  }, []);

  const handleChange = (field: keyof AppSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setSaveMessage(null); // Clear success message on edit
  };

  const handleSave = async () => {
    setIsSaving(true);
    const success = await saveSettings(settings);
    setIsSaving(false);
    
    if (success) {
      setSaveMessage('Settings saved successfully');
      setTimeout(() => setSaveMessage(null), 3000);
    } else {
      alert('Failed to save settings');
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-shopify-subdued">Loading settings...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-shopify-text">Settings</h2>
          <p className="text-shopify-subdued mt-1">Configure your business details and API connections.</p>
        </div>
        <div className="flex items-center gap-4">
          {saveMessage && (
            <span className="text-green-600 text-sm font-medium flex items-center gap-1 animate-in fade-in">
              <CheckCircle2 size={16} /> {saveMessage}
            </span>
          )}
          <Button 
            variant="primary" 
            onClick={handleSave} 
            loading={isSaving}
            icon={<Save size={16} />}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Shopify Configuration */}
      <Card title="Shopify Connection">
        <div className="flex gap-3 mb-6 items-start p-3 bg-green-50 border border-green-100 rounded-md text-green-800 text-sm">
          <ShoppingBag className="shrink-0 mt-0.5" size={18} />
          <p>Connect to your Shopify store to fetch real Orders and Products. You can generate an Access Token in <b>Settings &gt; Apps and sales channels &gt; Develop apps</b>.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-shopify-text mb-1">Shop Domain</label>
            <input
              type="text"
              className="w-full border border-shopify-border rounded-md px-3 py-2 focus:ring-2 focus:ring-shopify-primary outline-none"
              value={settings.shopDomain || ''}
              onChange={(e) => handleChange('shopDomain', e.target.value)}
              placeholder="e.g., my-store.myshopify.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-shopify-text mb-1">Admin API Access Token</label>
            <input
              type="password"
              className="w-full border border-shopify-border rounded-md px-3 py-2 focus:ring-2 focus:ring-shopify-primary outline-none font-mono text-sm"
              value={settings.accessToken || ''}
              onChange={(e) => handleChange('accessToken', e.target.value)}
              placeholder="shpat_..."
            />
            <p className="text-xs text-shopify-subdued mt-1">Requires <code>read_products</code>, <code>write_products</code>, <code>read_orders</code> scopes.</p>
          </div>
        </div>
      </Card>

      {/* Business Information */}
      <Card title="Business Information">
        <div className="flex gap-3 mb-6 items-start p-3 bg-blue-50 border border-blue-100 rounded-md text-blue-800 text-sm">
          <Building2 className="shrink-0 mt-0.5" size={18} />
          <p>This information will be used to automatically populate Commercial Invoices and other customs documents.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-shopify-text mb-1">Company Name</label>
            <input
              type="text"
              className="w-full border border-shopify-border rounded-md px-3 py-2 focus:ring-2 focus:ring-shopify-primary outline-none"
              value={settings.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              placeholder="e.g., Acme Exports Inc."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-shopify-text mb-1">Business Address</label>
            <textarea
              rows={3}
              className="w-full border border-shopify-border rounded-md px-3 py-2 focus:ring-2 focus:ring-shopify-primary outline-none resize-none"
              value={settings.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Full street address, city, state, zip, and country"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-shopify-text mb-1">Tax ID / EORI Number</label>
            <input
              type="text"
              className="w-full border border-shopify-border rounded-md px-3 py-2 focus:ring-2 focus:ring-shopify-primary outline-none"
              value={settings.taxId}
              onChange={(e) => handleChange('taxId', e.target.value)}
              placeholder="e.g., GB123456789000"
            />
          </div>
        </div>
      </Card>

      {/* API Configuration */}
      <Card title="AI Configuration">
        <div className="flex gap-3 mb-6 items-start p-3 bg-amber-50 border border-amber-100 rounded-md text-amber-800 text-sm">
          <Key className="shrink-0 mt-0.5" size={18} />
          <p>Your API keys are stored locally in your browser for security. They are used to power the AI classification engines.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-shopify-text mb-1">OpenRouter API Key (Claude 3.5 Sonnet)</label>
            <input
              type="password"
              className="w-full border border-shopify-border rounded-md px-3 py-2 focus:ring-2 focus:ring-shopify-primary outline-none font-mono text-sm"
              value={settings.openRouterKey}
              onChange={(e) => handleChange('openRouterKey', e.target.value)}
              placeholder="sk-or-..."
            />
            <p className="text-xs text-shopify-subdued mt-1">Required for primary text analysis.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-shopify-text mb-1">Google Gemini API Key (Optional)</label>
            <input
              type="password"
              className="w-full border border-shopify-border rounded-md px-3 py-2 focus:ring-2 focus:ring-shopify-primary outline-none font-mono text-sm"
              value={settings.geminiKey}
              onChange={(e) => handleChange('geminiKey', e.target.value)}
              placeholder="AIza..."
            />
            <p className="text-xs text-shopify-subdued mt-1">Required if you plan to use Image Analysis or Description Enhancement.</p>
          </div>
        </div>
      </Card>

      {/* Defaults */}
      <Card title="Defaults">
        <div className="flex gap-3 mb-6 items-start p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-700 text-sm">
          <Globe className="shrink-0 mt-0.5" size={18} />
          <p>Set default values to speed up manual data entry and classification.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-shopify-text mb-1">Default Origin Country</label>
            <select 
              className="w-full border border-shopify-border rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-shopify-primary outline-none"
              value={settings.defaultOriginCountry}
              onChange={(e) => handleChange('defaultOriginCountry', e.target.value)}
            >
              <option value="US">United States (US)</option>
              <option value="CA">Canada (CA)</option>
              <option value="GB">United Kingdom (GB)</option>
              <option value="CN">China (CN)</option>
              <option value="DE">Germany (DE)</option>
              <option value="JP">Japan (JP)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-shopify-text mb-1">Default Currency</label>
            <select 
              className="w-full border border-shopify-border rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-shopify-primary outline-none"
              value={settings.defaultCurrency}
              onChange={(e) => handleChange('defaultCurrency', e.target.value)}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  );
};

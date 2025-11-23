
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DutyCalculation } from '../types';
import { calculateLandedCost } from '../services/dutyService';
import { Calculator, DollarSign, Globe, RefreshCw } from 'lucide-react';

export const DutyCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    hsCode: '',
    productValue: 1000,
    shippingCost: 150,
    insuranceCost: 20,
    originCountry: 'US',
    destinationCountry: 'GB',
    currency: 'USD'
  });

  const [result, setResult] = useState<DutyCalculation | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCalculate = async () => {
    if (!formData.hsCode) {
      alert("Please enter an HS Code");
      return;
    }
    setLoading(true);
    try {
      const res = await calculateLandedCost({
        hsCode: formData.hsCode,
        productValue: Number(formData.productValue),
        shippingCost: Number(formData.shippingCost),
        insuranceCost: Number(formData.insuranceCost),
        originCountry: formData.originCountry,
        destinationCountry: formData.destinationCountry,
        currency: formData.currency
      });
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-shopify-text">Customs Duty Calculator</h2>
          <p className="text-shopify-subdued mt-1">Estimate import duties, VAT, and total landed cost for international shipments.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card title="Shipment Values">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-shopify-text mb-1">HS Code</label>
              <input 
                type="text" 
                className="w-full border border-shopify-border rounded px-3 py-2 bg-white text-shopify-text focus:ring-2 focus:ring-shopify-primary outline-none"
                placeholder="e.g. 6109.10"
                value={formData.hsCode}
                onChange={(e) => handleChange('hsCode', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-shopify-text mb-1">Origin</label>
                <select 
                  className="w-full border border-shopify-border rounded px-3 py-2 bg-white text-shopify-text focus:ring-2 focus:ring-shopify-primary outline-none"
                  value={formData.originCountry}
                  onChange={(e) => handleChange('originCountry', e.target.value)}
                >
                  <option value="US">United States</option>
                  <option value="CN">China</option>
                  <option value="DE">Germany</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-shopify-text mb-1">Destination</label>
                <select 
                  className="w-full border border-shopify-border rounded px-3 py-2 bg-white text-shopify-text focus:ring-2 focus:ring-shopify-primary outline-none"
                  value={formData.destinationCountry}
                  onChange={(e) => handleChange('destinationCountry', e.target.value)}
                >
                  <option value="GB">United Kingdom</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="DE">Germany</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-shopify-text mb-1">Product Value</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400">$</span>
                  <input 
                    type="number" 
                    className="w-full border border-shopify-border rounded pl-6 pr-3 py-2 bg-white text-shopify-text focus:ring-2 focus:ring-shopify-primary outline-none"
                    value={formData.productValue}
                    onChange={(e) => handleChange('productValue', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-shopify-text mb-1">Shipping</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400">$</span>
                  <input 
                    type="number" 
                    className="w-full border border-shopify-border rounded pl-6 pr-3 py-2 bg-white text-shopify-text focus:ring-2 focus:ring-shopify-primary outline-none"
                    value={formData.shippingCost}
                    onChange={(e) => handleChange('shippingCost', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-shopify-text mb-1">Insurance</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400">$</span>
                  <input 
                    type="number" 
                    className="w-full border border-shopify-border rounded pl-6 pr-3 py-2 bg-white text-shopify-text focus:ring-2 focus:ring-shopify-primary outline-none"
                    value={formData.insuranceCost}
                    onChange={(e) => handleChange('insuranceCost', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button fullWidth variant="primary" onClick={handleCalculate} loading={loading} icon={<Calculator size={16} />}>
                Calculate Landed Cost
              </Button>
            </div>
          </div>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {result ? (
            <Card title="Cost Breakdown" className="border-l-4 border-l-shopify-primary h-full">
              <div className="space-y-6">
                <div className="text-center py-4 border-b border-shopify-border bg-slate-50 rounded-t-lg -mx-5 -mt-5">
                  <p className="text-xs text-shopify-subdued uppercase font-bold mb-1">Total Landed Cost</p>
                  <h3 className="text-4xl font-bold text-shopify-text">${result.totalLandedCost.toFixed(2)}</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-shopify-subdued">CIF Value (Goods + Ship + Ins)</span>
                    <span className="font-medium text-shopify-text">${(result.productValue + result.shippingCost + result.insuranceCost).toFixed(2)}</span>
                  </div>
                  <div className="w-full h-px bg-gray-100"></div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-shopify-subdued flex items-center gap-2">
                      Import Duty 
                      <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                        {(result.dutyRate * 100).toFixed(1)}%
                      </span>
                    </span>
                    <span className="font-medium text-red-600">+ ${result.dutyAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-shopify-subdued flex items-center gap-2">
                      VAT / GST
                      <span className="bg-purple-100 text-purple-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                        {(result.vatRate * 100).toFixed(1)}%
                      </span>
                    </span>
                    <span className="font-medium text-red-600">+ ${result.vatAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-amber-50 p-3 rounded text-xs text-amber-800 border border-amber-100">
                   <b>Note:</b> This is an estimate based on HS Code {result.hsCode}. Actual duties are determined by customs officers at the port of entry.
                </div>
              </div>
            </Card>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-shopify-border rounded-lg bg-white opacity-75">
               <Globe size={48} className="text-shopify-subdued mb-4" />
               <h3 className="text-lg font-medium text-shopify-text">Ready to Calculate</h3>
               <p className="text-shopify-subdued mt-2 max-w-xs">Enter shipment details to see the full cost breakdown including hidden taxes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Address, Product, ShippingRate, PackageDetails, Order } from '../types';
import { calculateShippingRates, optimizePackaging } from '../services/shippingService';
import { getShopifyOrders } from '../services/shopifyService';
import { Truck, Package, MapPin, Globe, Plus, Trash2, Calculator, Check, AlertCircle, DollarSign } from 'lucide-react';

const DEFAULT_ORIGIN: Address = {
  street: '123 Warehouse Blvd',
  city: 'New York',
  state: 'NY',
  zip: '10001',
  country: 'US'
};

const DEFAULT_DEST: Address = {
  street: '',
  city: '',
  state: '',
  zip: '',
  country: 'DE'
};

export const ShippingCalculator: React.FC = () => {
  const [origin, setOrigin] = useState<Address>(DEFAULT_ORIGIN);
  const [dest, setDest] = useState<Address>(DEFAULT_DEST);
  const [items, setItems] = useState<Product[]>([]);
  const [packageDetails, setPackageDetails] = useState<PackageDetails>({
    length: 30, width: 20, height: 15, weight: 1.5, type: 'box'
  });
  
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showOrderSelector, setShowOrderSelector] = useState(false);

  useEffect(() => {
    // Load mock orders to allow quick-fill
    getShopifyOrders().then(setOrders);
  }, []);

  const handleAddItem = () => {
    const newItem: Product = {
      id: Math.random().toString(36),
      title: 'New Item',
      description: '',
      sku: '',
      price: 0,
      status: 'unclassified',
      quantity: 1,
      weight: 0.5
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleItemChange = (id: string, field: keyof Product, value: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const handleLoadOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setItems(order.items.map(i => ({ ...i, quantity: 1 })));
      if (order.countryCode) setDest(prev => ({ ...prev, country: order.countryCode }));
      
      // Auto-optimize package based on new items
      const optimizedPkg = optimizePackaging(order.items);
      setPackageDetails(optimizedPkg);
      setShowOrderSelector(false);
    }
  };

  const handleCalculate = async () => {
    if (items.length === 0) {
      alert("Please add at least one item.");
      return;
    }
    if (!dest.country) {
      alert("Please select a destination country.");
      return;
    }

    setLoading(true);
    setRates([]); // clear previous

    try {
      const results = await calculateShippingRates(origin, dest, items, packageDetails);
      setRates(results);
    } catch (e) {
      console.error(e);
      alert("Failed to calculate rates");
    } finally {
      setLoading(false);
    }
  };

  const handlePackageChange = (field: keyof PackageDetails, value: string) => {
    setPackageDetails(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-shopify-text">Shipping Rate Calculator</h2>
          <p className="text-shopify-subdued mt-1">Compare multi-carrier rates with landed cost estimation (Duties + Taxes).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: INPUTS */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1. Location */}
          <Card title="Route" icon={<Globe size={18}/>}>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded border border-shopify-border">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-shopify-subdued uppercase">
                  <MapPin size={12} /> Origin
                </div>
                <div className="text-sm text-shopify-text font-medium">{origin.street}, {origin.city}, {origin.country}</div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-shopify-subdued uppercase">
                   <MapPin size={12} /> Destination
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    placeholder="City" 
                    className="border border-shopify-border rounded px-3 py-2 text-sm bg-white text-shopify-text w-full focus:ring-2 focus:ring-shopify-primary outline-none"
                    value={dest.city}
                    onChange={e => setDest({...dest, city: e.target.value})}
                  />
                  <select 
                    className="border border-shopify-border rounded px-3 py-2 text-sm bg-white text-shopify-text w-full focus:ring-2 focus:ring-shopify-primary outline-none"
                    value={dest.country}
                    onChange={e => setDest({...dest, country: e.target.value})}
                  >
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="DE">Germany</option>
                    <option value="AU">Australia</option>
                    <option value="JP">Japan</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* 2. Package & Items */}
          <Card title="Shipment Details">
             <div className="mb-4 flex justify-between items-center">
               <h4 className="text-sm font-medium text-shopify-text">Items</h4>
               <div className="flex gap-2">
                 <button 
                   onClick={() => setShowOrderSelector(!showOrderSelector)}
                   className="text-xs text-shopify-primary hover:underline font-medium"
                 >
                   Load from Order
                 </button>
               </div>
             </div>

             {showOrderSelector && (
               <div className="mb-4 p-3 bg-shopify-highlight border border-shopify-primary/20 rounded-md">
                 <label className="block text-xs font-bold text-shopify-primary mb-1">Select Order to Load</label>
                 <select 
                    className="w-full text-sm border border-shopify-primary/30 rounded p-1 bg-white text-shopify-text"
                    onChange={(e) => handleLoadOrder(e.target.value)}
                    value=""
                 >
                   <option value="">-- Choose Order --</option>
                   {orders.map(o => (
                     <option key={o.id} value={o.id}>{o.orderNumber} - {o.customer}</option>
                   ))}
                 </select>
               </div>
             )}

             <div className="space-y-3 mb-4">
               {items.map((item, idx) => (
                 <div key={item.id} className="flex gap-2 items-start p-2 border border-shopify-border rounded-md bg-white group hover:border-shopify-primary transition-colors">
                   <div className="flex-1 space-y-2">
                     <input 
                       type="text" 
                       className="w-full text-sm font-medium border-b border-transparent hover:border-gray-200 focus:border-shopify-primary p-0 focus:ring-0 placeholder-gray-400 bg-transparent text-shopify-text"
                       placeholder="Item Name"
                       value={item.title}
                       onChange={(e) => handleItemChange(item.id, 'title', e.target.value)}
                     />
                     <div className="flex gap-2">
                       <div className="relative w-1/2">
                         <span className="absolute left-2 top-1.5 text-gray-500 text-xs">$</span>
                         <input 
                           type="number" 
                           className="w-full pl-5 py-1 text-xs border border-gray-200 rounded bg-white text-shopify-text focus:ring-1 focus:ring-shopify-primary outline-none"
                           placeholder="Price"
                           value={item.price || ''}
                           onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value))}
                         />
                       </div>
                       <div className="relative w-1/2">
                         <input 
                           type="text" 
                           className="w-full px-2 py-1 text-xs border border-gray-200 rounded bg-white text-shopify-text focus:ring-1 focus:ring-shopify-primary outline-none"
                           placeholder="HS Code"
                           value={item.hsCode || ''}
                           onChange={(e) => handleItemChange(item.id, 'hsCode', e.target.value)}
                         />
                       </div>
                     </div>
                   </div>
                   <button onClick={() => handleRemoveItem(item.id)} className="text-gray-400 hover:text-red-500 p-1">
                     <Trash2 size={14} />
                   </button>
                 </div>
               ))}
               <Button size="sm" variant="plain" icon={<Plus size={14}/>} onClick={handleAddItem}>Add Item</Button>
             </div>

             <div className="pt-4 border-t border-shopify-border">
                <h4 className="text-sm font-medium text-shopify-text mb-3 flex items-center gap-2">
                  <Package size={16} /> Package Dimensions (Editable)
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="text-xs text-shopify-subdued mb-1 block">L (cm)</label>
                    <input 
                      type="number" 
                      className="w-full border border-shopify-border rounded px-2 py-1.5 text-sm bg-white text-shopify-text focus:ring-1 focus:ring-shopify-primary outline-none" 
                      value={packageDetails.length} 
                      onChange={(e) => handlePackageChange('length', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-shopify-subdued mb-1 block">W (cm)</label>
                    <input 
                      type="number" 
                      className="w-full border border-shopify-border rounded px-2 py-1.5 text-sm bg-white text-shopify-text focus:ring-1 focus:ring-shopify-primary outline-none" 
                      value={packageDetails.width} 
                      onChange={(e) => handlePackageChange('width', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-shopify-subdued mb-1 block">H (cm)</label>
                    <input 
                      type="number" 
                      className="w-full border border-shopify-border rounded px-2 py-1.5 text-sm bg-white text-shopify-text focus:ring-1 focus:ring-shopify-primary outline-none" 
                      value={packageDetails.height} 
                      onChange={(e) => handlePackageChange('height', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-shopify-subdued mb-1 block">Wt (kg)</label>
                    <input 
                      type="number" 
                      className="w-full border border-shopify-border rounded px-2 py-1.5 text-sm bg-white text-shopify-text focus:ring-1 focus:ring-shopify-primary outline-none" 
                      value={packageDetails.weight} 
                      onChange={(e) => handlePackageChange('weight', e.target.value)}
                    />
                  </div>
                </div>
             </div>
             
             <div className="mt-6">
               <Button fullWidth variant="primary" onClick={handleCalculate} loading={loading} icon={<Calculator size={16}/>}>
                 Calculate Rates
               </Button>
             </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: RESULTS */}
        <div className="lg:col-span-7 space-y-4">
           {rates.length === 0 && !loading && (
             <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-shopify-border rounded-lg bg-slate-50/50 min-h-[400px] text-center p-8">
               <Truck size={48} className="text-shopify-subdued mb-4 opacity-50" />
               <h3 className="text-lg font-medium text-shopify-text">Enter details to compare rates</h3>
               <p className="text-shopify-subdued max-w-sm mt-2">
                 We'll check DHL, FedEx, UPS, and USPS simultaneously and include duty estimates.
               </p>
             </div>
           )}

           {rates.map((rate, index) => (
             <div 
               key={index} 
               className={`bg-white rounded-lg border p-5 transition-all animate-in fade-in slide-in-from-bottom-2 ${
                 index === 0 ? 'border-shopify-primary shadow-md ring-1 ring-shopify-primary' : 'border-shopify-border hover:shadow-sm'
               }`}
             >
               <div className="flex justify-between items-start">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center font-bold text-shopify-subdued">
                      {rate.carrier}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-shopify-text">{rate.serviceName}</h3>
                        {index === 0 && (
                          <span className="text-[10px] font-bold uppercase bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            Best Value
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-shopify-subdued flex items-center gap-1">
                        Est. Delivery: <span className="font-medium text-shopify-text">{rate.deliveryDate}</span> ({rate.deliveryDays} days)
                      </p>
                    </div>
                 </div>
                 <div className="text-right">
                   <h3 className="text-2xl font-bold text-shopify-text">${rate.totalPrice.toFixed(2)}</h3>
                   <p className="text-xs text-shopify-subdued">Total Landed Cost</p>
                 </div>
               </div>

               <div className="mt-4 pt-4 border-t border-shopify-border grid grid-cols-3 gap-4 text-sm">
                 <div className="space-y-1">
                   <p className="text-xs text-shopify-subdued uppercase font-medium">Shipping</p>
                   <p className="font-medium text-shopify-text">${rate.baseShipping.toFixed(2)}</p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-xs text-shopify-subdued uppercase font-medium flex items-center gap-1">
                     Duties & Taxes <AlertCircle size={10} className="text-shopify-subdued" />
                   </p>
                   <p className={`font-medium ${rate.customsDuties > 0 ? 'text-amber-700' : 'text-gray-600'}`}>
                     ${rate.customsDuties.toFixed(2)}
                   </p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-xs text-shopify-subdued uppercase font-medium">Doc Fees</p>
                   <p className="font-medium text-shopify-text">${rate.docFee.toFixed(2)}</p>
                 </div>
               </div>
               
               <div className="mt-4 flex justify-end">
                 <Button size="sm" variant={index === 0 ? 'primary' : 'secondary'}>Select Rate</Button>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

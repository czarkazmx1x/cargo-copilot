
import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ContainerType, Product, Order, LoadCalculation } from '../types';
import { CONTAINER_SPECS, calculateContainerLoad } from '../services/loadService';
import { getShopifyOrders } from '../services/shopifyService';
import { Box, Trash2, Plus, Container, AlertTriangle, CheckCircle2, Scale, Ruler } from 'lucide-react';

export const LoadCalculator: React.FC = () => {
  const [containerType, setContainerType] = useState<ContainerType>('20ft');
  const [items, setItems] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showOrderSelector, setShowOrderSelector] = useState(false);
  const [result, setResult] = useState<LoadCalculation | null>(null);

  useEffect(() => {
    getShopifyOrders().then(setOrders);
  }, []);

  useEffect(() => {
    // Auto-calculate whenever inputs change
    const calc = calculateContainerLoad(items, containerType);
    setResult(calc);
  }, [items, containerType]);

  const handleAddItem = () => {
    const newItem: Product = {
      id: Math.random().toString(36),
      title: 'New Box',
      description: '',
      sku: '',
      price: 0,
      status: 'unclassified',
      quantity: 100,
      weight: 10,
      length: 50,
      width: 40,
      height: 30
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleItemChange = (id: string, field: keyof Product, value: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: parseFloat(value) || 0 } : i));
  };

  const handleItemTitleChange = (id: string, value: string) => {
    setItems(items.map(i => i.id === id ? { ...i, title: value } : i));
  };

  const handleLoadOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      // Add items from order with default dims if missing
      const newItems = order.items.map(i => ({
        ...i,
        quantity: i.quantity || 10, // Default to higher qty for load calc demo
        length: i.length || 40,
        width: i.width || 30,
        height: i.height || 20,
        weight: i.weight || 2
      }));
      setItems([...items, ...newItems]);
      setShowOrderSelector(false);
    }
  };

  const spec = CONTAINER_SPECS[containerType];
  
  // Visualization Math
  const fillPercentage = result ? Math.min(100, result.volumeUtilization) : 0;
  const isOverflowing = fillPercentage > 100;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-shopify-text">Container Load Calculator</h2>
          <p className="text-shopify-subdued mt-1">Optimize your shipments by calculating volume and weight utilization.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* INPUT COLUMN */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Container Selector */}
          <Card title="Container Settings">
            <div className="grid grid-cols-3 gap-4">
              {(Object.keys(CONTAINER_SPECS) as ContainerType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setContainerType(type)}
                  className={`p-4 rounded-lg border text-center transition-all ${
                    containerType === type
                      ? 'border-shopify-primary bg-shopify-highlight/30 ring-1 ring-shopify-primary'
                      : 'border-shopify-border hover:bg-gray-50'
                  }`}
                >
                  <Container size={32} className={`mx-auto mb-2 ${containerType === type ? 'text-shopify-primary' : 'text-gray-400'}`} />
                  <h4 className="font-bold text-sm text-shopify-text">{CONTAINER_SPECS[type].name.replace(' Container', '')}</h4>
                  <p className="text-xs text-shopify-subdued mt-1">
                    {CONTAINER_SPECS[type].maxVolumeCBM} m³ / {(CONTAINER_SPECS[type].maxWeightKg/1000).toFixed(1)}T
                  </p>
                </button>
              ))}
            </div>
          </Card>

          {/* Cargo Items */}
          <Card title="Cargo List">
            <div className="mb-4 flex justify-between items-center">
               <h4 className="text-sm font-medium text-shopify-text">
                 {items.length} Item{items.length !== 1 ? 's' : ''}
               </h4>
               <button 
                 onClick={() => setShowOrderSelector(!showOrderSelector)}
                 className="text-xs text-shopify-primary hover:underline font-medium"
               >
                 + Add from Order
               </button>
            </div>

            {showOrderSelector && (
               <div className="mb-4 p-3 bg-shopify-highlight border border-shopify-primary/20 rounded-md animate-in fade-in">
                 <label className="block text-xs font-bold text-shopify-primary mb-1">Select Order to Add Items</label>
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

            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
              {items.map((item) => (
                <div key={item.id} className="p-3 border border-shopify-border rounded-md bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <input 
                      className="font-medium text-sm text-shopify-text w-full border-none p-0 focus:ring-0 bg-transparent placeholder-gray-400"
                      placeholder="Item Name"
                      value={item.title}
                      onChange={(e) => handleItemTitleChange(item.id, e.target.value)}
                    />
                    <button onClick={() => handleRemoveItem(item.id)} className="text-gray-400 hover:text-red-500 p-1">
                       <Trash2 size={14} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2">
                    <div>
                      <label className="text-[10px] text-shopify-subdued uppercase font-bold">Qty</label>
                      <input 
                        type="number" 
                        className="w-full border border-shopify-border rounded px-2 py-1 text-xs bg-white text-shopify-text focus:ring-1 focus:ring-shopify-primary" 
                        value={item.quantity} 
                        onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-shopify-subdued uppercase font-bold">L (cm)</label>
                      <input 
                        type="number" 
                        className="w-full border border-shopify-border rounded px-2 py-1 text-xs bg-white text-shopify-text focus:ring-1 focus:ring-shopify-primary" 
                        value={item.length} 
                        onChange={(e) => handleItemChange(item.id, 'length', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-shopify-subdued uppercase font-bold">W (cm)</label>
                      <input 
                        type="number" 
                        className="w-full border border-shopify-border rounded px-2 py-1 text-xs bg-white text-shopify-text focus:ring-1 focus:ring-shopify-primary" 
                        value={item.width} 
                        onChange={(e) => handleItemChange(item.id, 'width', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-shopify-subdued uppercase font-bold">H (cm)</label>
                      <input 
                        type="number" 
                        className="w-full border border-shopify-border rounded px-2 py-1 text-xs bg-white text-shopify-text focus:ring-1 focus:ring-shopify-primary" 
                        value={item.height} 
                        onChange={(e) => handleItemChange(item.id, 'height', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-shopify-subdued uppercase font-bold">Wt (kg)</label>
                      <input 
                        type="number" 
                        className="w-full border border-shopify-border rounded px-2 py-1 text-xs bg-white text-shopify-text focus:ring-1 focus:ring-shopify-primary" 
                        value={item.weight} 
                        onChange={(e) => handleItemChange(item.id, 'weight', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button size="sm" variant="plain" fullWidth icon={<Plus size={14}/>} onClick={handleAddItem}>
                Add Cargo Item
              </Button>
            </div>
          </Card>
        </div>

        {/* VISUALIZATION COLUMN */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Load Visualization */}
          <Card title="Load Utilization">
             <div className="relative h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center mb-6 overflow-hidden">
                {/* Container Background */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                   <span className="text-6xl text-gray-200 font-bold uppercase tracking-widest opacity-50">
                      {containerType}
                   </span>
                </div>
                
                {/* Fill Animation (Volume) */}
                <div 
                  className={`absolute bottom-0 left-0 w-full transition-all duration-700 ease-in-out ${
                    isOverflowing ? 'bg-red-200' : 'bg-blue-200'
                  }`}
                  style={{ height: `${Math.min(100, fillPercentage)}%` }}
                ></div>
                
                {/* Fill Line if overflow */}
                {isOverflowing && (
                  <div className="absolute top-0 left-0 w-full h-full bg-red-500/10 z-20 flex items-center justify-center">
                     <div className="bg-red-600 text-white px-3 py-1 rounded-md text-xs font-bold shadow-sm">
                       Capacity Exceeded
                     </div>
                  </div>
                )}
             </div>

             <div className="space-y-6">
               {/* Volume Bar */}
               <div>
                 <div className="flex justify-between text-sm mb-1">
                   <span className="font-medium text-shopify-text flex items-center gap-2"><Box size={14}/> Volume (CBM)</span>
                   <span className="font-bold">{result?.totalVolumeCBM.toFixed(2)} / {spec.maxVolumeCBM} m³</span>
                 </div>
                 <div className="w-full bg-gray-200 rounded-full h-2.5">
                   <div 
                     className={`h-2.5 rounded-full transition-all duration-500 ${result?.volumeUtilization! > 100 ? 'bg-red-500' : 'bg-blue-600'}`} 
                     style={{ width: `${Math.min(100, result?.volumeUtilization || 0)}%` }}
                   ></div>
                 </div>
                 <div className="text-right text-xs mt-1 text-shopify-subdued">
                   {result?.volumeUtilization}% Filled
                 </div>
               </div>

               {/* Weight Bar */}
               <div>
                 <div className="flex justify-between text-sm mb-1">
                   <span className="font-medium text-shopify-text flex items-center gap-2"><Scale size={14}/> Weight (KG)</span>
                   <span className="font-bold">{result?.totalWeightKg.toLocaleString()} / {spec.maxWeightKg.toLocaleString()} kg</span>
                 </div>
                 <div className="w-full bg-gray-200 rounded-full h-2.5">
                   <div 
                     className={`h-2.5 rounded-full transition-all duration-500 ${result?.weightUtilization! > 100 ? 'bg-red-500' : 'bg-amber-500'}`} 
                     style={{ width: `${Math.min(100, result?.weightUtilization || 0)}%` }}
                   ></div>
                 </div>
                 <div className="text-right text-xs mt-1 text-shopify-subdued">
                   {result?.weightUtilization}% Weight Limit
                 </div>
               </div>
             </div>
          </Card>

          {/* Summary Card */}
          <Card>
             <div className="text-center space-y-4">
               <div>
                 <p className="text-xs font-bold text-shopify-subdued uppercase">Containers Required</p>
                 <div className="text-4xl font-bold text-shopify-primary mt-1">
                   {result?.containersRequired} <span className="text-base text-gray-400 font-normal">x {containerType}</span>
                 </div>
               </div>
               
               <div className="flex justify-center gap-4 text-sm pt-4 border-t border-shopify-border">
                 <div className="text-center">
                   <p className="font-bold text-shopify-text">{result?.totalCartons}</p>
                   <p className="text-xs text-shopify-subdued">Total Boxes</p>
                 </div>
                 <div className="w-px bg-gray-200 h-8"></div>
                 <div className="text-center">
                   <p className="font-bold text-shopify-text">{result?.totalVolumeCBM} m³</p>
                   <p className="text-xs text-shopify-subdued">Total Vol</p>
                 </div>
                 <div className="w-px bg-gray-200 h-8"></div>
                 <div className="text-center">
                   <p className="font-bold text-shopify-text">{Math.round(result?.totalWeightKg || 0)} kg</p>
                   <p className="text-xs text-shopify-subdued">Total Wt</p>
                 </div>
               </div>
               
               {(result?.isOverweight || result?.volumeUtilization! > 100) && (
                 <div className="bg-amber-50 text-amber-800 text-xs p-3 rounded-md flex items-start gap-2 text-left">
                   <AlertTriangle size={16} className="shrink-0 mt-0.5"/>
                   <span>
                     <b>Optimization Needed:</b> This load exceeds the limits of a single {spec.name}. 
                     Consider splitting the shipment or upgrading to a larger container.
                   </span>
                 </div>
               )}
               
               {(!result?.isOverweight && result?.volumeUtilization! <= 100 && result?.volumeUtilization! > 0) && (
                 <div className="bg-green-50 text-green-800 text-xs p-3 rounded-md flex items-start gap-2 text-left">
                   <CheckCircle2 size={16} className="shrink-0 mt-0.5"/>
                   <span>
                     <b>Perfect Fit:</b> This load fits comfortably within the selected container specs.
                   </span>
                 </div>
               )}
             </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

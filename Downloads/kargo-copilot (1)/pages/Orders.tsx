
import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Order, NavItem } from '../types';
import { AlertTriangle, CheckCircle, Filter, Download, Layers, MoreHorizontal, X, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { createBatchJob } from '../services/batchService';
import { getShopifyOrders } from '../services/shopifyService';
import { useNavigate } from 'react-router-dom';

export const Orders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Filter State
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    fulfillment: 'all',
    compliance: 'all',
    country: 'all',
    search: ''
  });

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getShopifyOrders();
      if (data.length === 0) {
        // Check if it was an error or just empty
        // For UX, if we get 0, we might hint to check settings if we know settings are missing, 
        // but here we just show empty.
      }
      setOrders(data);
    } catch (err) {
      setError("Failed to load orders. Please check your Shopify API settings.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Derived Data
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Text Search
      const searchMatch = filters.search === '' || 
        order.orderNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.customer.toLowerCase().includes(filters.search.toLowerCase());

      // Dropdown Filters
      const fulfillmentMatch = filters.fulfillment === 'all' || order.fulfillmentStatus === filters.fulfillment;
      const complianceMatch = filters.compliance === 'all' || order.complianceStatus === filters.compliance;
      const countryMatch = filters.country === 'all' || order.countryCode === filters.country;

      return searchMatch && fulfillmentMatch && complianceMatch && countryMatch;
    });
  }, [orders, filters]);

  const uniqueCountries = useMemo(() => 
    Array.from(new Set(orders.map(o => o.countryCode))).sort(), 
  [orders]);

  const toggleOrder = (id: string) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter(oId => oId !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  const toggleAll = () => {
    const allFilteredIds = filteredOrders.map(o => o.id);
    const isAllSelected = allFilteredIds.length > 0 && allFilteredIds.every(id => selectedOrders.includes(id));

    if (isAllSelected) {
      // Deselect visible
      setSelectedOrders(prev => prev.filter(id => !allFilteredIds.includes(id)));
    } else {
      // Select all visible
      const newSelected = new Set([...selectedOrders, ...allFilteredIds]);
      setSelectedOrders(Array.from(newSelected));
    }
  };

  const handleBatchProcess = () => {
    if (selectedOrders.length === 0) return;
    
    setIsProcessing(true);
    
    const ordersToProcess = orders.filter(o => selectedOrders.includes(o.id));
    
    // Trigger the background service
    createBatchJob(ordersToProcess);
    
    // Simulate UI delay for effect then redirect
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/batch');
    }, 800);
  };

  const isAllVisibleSelected = filteredOrders.length > 0 && filteredOrders.every(o => selectedOrders.includes(o.id));

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-shopify-text">International Orders</h2>
          <p className="text-shopify-subdued mt-1">Manage customs compliance for pending shipments.</p>
        </div>
        <div className="flex gap-2">
           <div className="relative hidden md:block">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
             <input 
                type="text" 
                placeholder="Search orders..." 
                className="pl-9 pr-4 py-2 border border-shopify-border rounded-md text-sm focus:ring-2 focus:ring-shopify-primary outline-none w-64"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({...prev, search: e.target.value}))}
             />
           </div>
           <Button 
             variant={showFilters ? "primary" : "secondary"} 
             icon={<Filter size={16} />}
             onClick={() => setShowFilters(!showFilters)}
           >
             Filter
           </Button>
           <Button icon={<RefreshCw size={16} />} onClick={fetchOrders} loading={isLoading}>Refresh</Button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card className="p-4 bg-slate-50 border border-shopify-border animate-in slide-in-from-top-2">
          <div className="flex flex-wrap gap-4 items-end">
             <div>
               <label className="block text-xs font-bold text-shopify-subdued uppercase mb-1.5">Fulfillment Status</label>
               <select 
                 className="border border-shopify-border rounded px-3 py-2 text-sm w-40 bg-white focus:ring-2 focus:ring-shopify-primary outline-none"
                 value={filters.fulfillment}
                 onChange={(e) => setFilters(prev => ({...prev, fulfillment: e.target.value}))}
               >
                 <option value="all">All Statuses</option>
                 <option value="unfulfilled">Unfulfilled</option>
                 <option value="fulfilled">Fulfilled</option>
               </select>
             </div>

             <div>
               <label className="block text-xs font-bold text-shopify-subdued uppercase mb-1.5">Compliance Status</label>
               <select 
                 className="border border-shopify-border rounded px-3 py-2 text-sm w-40 bg-white focus:ring-2 focus:ring-shopify-primary outline-none"
                 value={filters.compliance}
                 onChange={(e) => setFilters(prev => ({...prev, compliance: e.target.value}))}
               >
                 <option value="all">All Statuses</option>
                 <option value="compliant">Ready / Compliant</option>
                 <option value="missing_data">Missing Info</option>
               </select>
             </div>

             <div>
               <label className="block text-xs font-bold text-shopify-subdued uppercase mb-1.5">Destination</label>
               <select 
                 className="border border-shopify-border rounded px-3 py-2 text-sm w-40 bg-white focus:ring-2 focus:ring-shopify-primary outline-none"
                 value={filters.country}
                 onChange={(e) => setFilters(prev => ({...prev, country: e.target.value}))}
               >
                 <option value="all">All Countries</option>
                 {uniqueCountries.map(code => (
                   <option key={code} value={code}>{code}</option>
                 ))}
               </select>
             </div>

             <div className="ml-auto">
               <Button variant="plain" onClick={() => setFilters({fulfillment: 'all', compliance: 'all', country: 'all', search: ''})}>
                 Clear Filters
               </Button>
             </div>
          </div>
        </Card>
      )}

      {/* Bulk Actions Bar */}
      {selectedOrders.length > 0 && (
        <div className="sticky top-0 z-10 bg-shopify-nav text-white p-4 rounded-lg shadow-lg flex justify-between items-center animate-in fade-in slide-in-from-top-2">
           <div className="flex items-center gap-4">
             <div className="bg-white/20 px-3 py-1 rounded text-sm font-medium">
               {selectedOrders.length} Selected
             </div>
             <button onClick={() => setSelectedOrders([])} className="text-gray-300 hover:text-white">
               <X size={18} />
             </button>
           </div>
           <div className="flex gap-3">
             <Button size="sm" variant="plain" className="text-white hover:text-white hover:underline">Mark as Fulfilled</Button>
             <Button 
               size="sm" 
               variant="primary" 
               icon={<Layers size={16} />}
               onClick={handleBatchProcess}
               loading={isProcessing}
             >
               Process Batch ({selectedOrders.length})
             </Button>
           </div>
        </div>
      )}

      {orders.length === 0 && !isLoading && !error && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-amber-800 flex items-start gap-3">
           <AlertCircle className="shrink-0 mt-0.5" size={20} />
           <div>
             <h3 className="font-bold">No Orders Found</h3>
             <p className="text-sm mt-1">
               We couldn't fetch any orders. Please ensure you have configured your <b>Shopify API Credentials</b> in the Settings page and that you have orders in your store.
             </p>
             <Button size="sm" variant="secondary" className="mt-2" onClick={() => navigate('/settings')}>Go to Settings</Button>
           </div>
        </div>
      )}

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-shopify-border">
              <tr>
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-shopify-primary focus:ring-shopify-primary cursor-pointer w-4 h-4"
                    checked={isAllVisibleSelected}
                    onChange={toggleAll}
                    disabled={filteredOrders.length === 0}
                  />
                </th>
                <th className="px-6 py-3 font-medium text-shopify-subdued">Order</th>
                <th className="px-6 py-3 font-medium text-shopify-subdued">Date</th>
                <th className="px-6 py-3 font-medium text-shopify-subdued">Customer</th>
                <th className="px-6 py-3 font-medium text-shopify-subdued">Destination</th>
                <th className="px-6 py-3 font-medium text-shopify-subdued">Compliance</th>
                <th className="px-6 py-3 font-medium text-shopify-subdued">Total</th>
                <th className="px-6 py-3 font-medium text-shopify-subdued text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-shopify-border">
              {isLoading ? (
                <tr>
                   <td colSpan={8} className="px-6 py-12 text-center text-shopify-subdued">
                     Loading real-time data from Shopify...
                   </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                   <td colSpan={8} className="px-6 py-12 text-center text-shopify-subdued">
                     No orders match your filters.
                   </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className={`hover:bg-slate-50 transition-colors group ${selectedOrders.includes(order.id) ? 'bg-shopify-highlight/30' : ''}`}>
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-shopify-primary focus:ring-shopify-primary cursor-pointer w-4 h-4"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleOrder(order.id)}
                      />
                    </td>
                    <td className="px-6 py-4 font-semibold text-shopify-text cursor-pointer hover:underline">
                      {order.orderNumber}
                      {order.items.length > 0 && <div className="text-xs font-normal text-shopify-subdued">{order.items.length} items</div>}
                    </td>
                    <td className="px-6 py-4 text-shopify-text">{order.date}</td>
                    <td className="px-6 py-4 text-shopify-text">{order.customer}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {order.countryCode}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {order.complianceStatus === 'compliant' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle size={14} />
                          Ready
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <AlertTriangle size={14} />
                          Missing Info
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-shopify-text">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-shopify-subdued hover:text-shopify-text p-1">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      <div className="flex justify-center pt-4">
         <p className="text-xs text-shopify-subdued">Showing {filteredOrders.length} orders</p>
      </div>
    </div>
  );
};

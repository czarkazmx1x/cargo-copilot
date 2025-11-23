
import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { classifyProductWithGemini, enhanceProductDescription } from '../services/geminiService';
import { getShopifyProducts, updateProductHSCode } from '../services/shopifyService';
import { HSCodeResult, ProductData, ShopifyProduct, HSDatabaseEntry } from '../types';
import { ClassificationResultCard } from '../components/ui/ClassificationResultCard';
import { HSCodePicker } from '../components/ui/HSCodePicker';
import { Upload, Sparkles, Package, Search, X, BookOpen, Wand2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const Classify: React.FC = () => {
  const location = useLocation();
  
  // Form State
  const [formData, setFormData] = useState<ProductData>({
    title: '',
    description: '',
    material: '',
    product_type: '',
    vendor: '',
    origin_country: '',
    images: [] // Kept for type compatibility but unused
  });
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [result, setResult] = useState<HSCodeResult | null>(null);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [showHSPicker, setShowHSPicker] = useState(false);
  
  // Data State
  const [storeProducts, setStoreProducts] = useState<ShopifyProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Handle incoming state from "Re-classify" action
  useEffect(() => {
    if (location.state && (location.state as any).prefill) {
      const prefill = (location.state as any).prefill;
      setFormData(prev => ({
        ...prev,
        title: prefill.title || '',
        description: prefill.description || '',
      }));
      window.scrollTo(0, 0);
    }
  }, [location]);

  const handleInputChange = (field: keyof ProductData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleClassify = async () => {
    if (!formData.title) {
      alert("Product title is required");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const classification = await classifyProductWithGemini(formData);
      setResult(classification);
    } catch (error) {
      console.error(error);
      alert("Failed to classify product. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnhanceDescription = async () => {
    if (!formData.title) {
      alert("Please enter a title first.");
      return;
    }
    setIsEnhancing(true);
    try {
      const newDesc = await enhanceProductDescription(formData.title, formData.description);
      setFormData(prev => ({ ...prev, description: newDesc }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsEnhancing(false);
    }
  };

  // --- Store Product Selection Logic ---

  const openProductSelector = async () => {
    setShowProductSelector(true);
    setLoadingProducts(true);
    try {
      const products = await getShopifyProducts();
      setStoreProducts(products);
    } catch (e) {
      console.error("Failed to fetch products", e);
    } finally {
      setLoadingProducts(false);
    }
  };

  const selectStoreProduct = (product: ShopifyProduct) => {
    setFormData({
      title: product.title,
      description: product.body_html.replace(/<[^>]*>?/gm, ''), // Strip HTML
      material: '', // Often buried in description, leave blank for user/AI
      product_type: product.product_type,
      vendor: product.vendor,
      origin_country: '',
      images: [] // Explicitly ignore images
    });

    setSelectedProductId(product.id);
    setShowProductSelector(false);
    setResult(null); // Reset previous results
  };

  const handleSaveToShopify = async (code: string, reason: string) => {
    if (!selectedProductId) {
      alert("This is a manual entry. In a real app, you would select which product to attach this code to.");
      return;
    }
    
    const success = await updateProductHSCode(selectedProductId, code);
    if (success) {
      alert(`✅ HS Code ${code} saved to Shopify product "${formData.title}"`);
    } else {
      alert("Failed to save to Shopify.");
    }
  };

  const handleManualLookupSelect = (entry: HSDatabaseEntry) => {
    // Manually constructing a result object from the DB selection
    const manualResult: HSCodeResult = {
      hs_code: entry.code,
      confidence: 100,
      description: entry.description,
      reasoning: "Manually selected from HS Code Database.",
      chapter: `${entry.chapter} - ${entry.section}`,
      alternatives: [],
      requires_review: false,
      source: 'AI_TEXT',
      timestamp: new Date().toISOString()
    };
    setResult(manualResult);
    setShowHSPicker(false);
  };

  const fillExample = () => {
    setFormData({
      title: "Men's Cotton Graphic T-Shirt",
      description: "Heavyweight 100% cotton t-shirt with screen printed logo on chest. Short sleeves, crew neck.",
      material: "100% Cotton",
      product_type: "Apparel",
      vendor: "Kargo Basics",
      origin_country: "US",
      images: []
    });
    setSelectedProductId(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 relative">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-shopify-text">HS Codes</h2>
          <p className="text-shopify-subdued mt-1">
            Select a product from your store or enter details manually.
          </p>
        </div>
        <div className="flex gap-2">
           <Button variant="secondary" icon={<Package size={16}/>} onClick={openProductSelector}>
             Select from Store
           </Button>
           <Button variant="plain" onClick={fillExample}>Fill Example Data</Button>
        </div>
      </div>

      {/* Product Selector Modal */}
      {showProductSelector && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-shopify-border flex justify-between items-center">
              <h3 className="font-bold text-lg">Select Product</h3>
              <button onClick={() => setShowProductSelector(false)} className="text-gray-500 hover:text-gray-800">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
              {loadingProducts ? (
                <div className="text-center py-10 text-shopify-subdued">Loading products...</div>
              ) : (
                <div className="space-y-2">
                  {storeProducts.map(p => (
                    <div 
                      key={p.id} 
                      onClick={() => selectStoreProduct(p)}
                      className="flex items-center gap-4 p-3 border border-shopify-border rounded-md hover:bg-shopify-highlight/20 hover:border-shopify-primary cursor-pointer transition-all"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-md shrink-0 overflow-hidden">
                        {p.images[0] ? (
                          <img src={p.images[0].src} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Package size={20} className="text-gray-400"/></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-shopify-text">{p.title}</p>
                        <p className="text-xs text-shopify-subdued">SKU: {p.variants[0]?.sku} • {p.vendor}</p>
                      </div>
                      {p.hs_code ? (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Has Code</span>
                      ) : (
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">No Code</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <HSCodePicker 
        isOpen={showHSPicker} 
        onClose={() => setShowHSPicker(false)} 
        onSelect={handleManualLookupSelect} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form - Left Column */}
        <div className="lg:col-span-5 space-y-6">
          <Card title="Product Details">
            {selectedProductId && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md flex items-start gap-2">
                <Package className="text-blue-600 shrink-0 mt-0.5" size={16} />
                <div>
                  <p className="text-xs font-bold text-blue-800 uppercase">Linked to Shopify Product</p>
                  <p className="text-xs text-blue-600">Result will be saved to product metadata.</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-shopify-text mb-1">Product Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="w-full border border-shopify-border rounded-md px-3 py-2 bg-white text-shopify-text focus:ring-2 focus:ring-shopify-primary focus:border-shopify-primary outline-none"
                  placeholder="e.g., Women's Leather Hiking Boots"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-shopify-text">Description</label>
                  <button 
                    onClick={handleEnhanceDescription}
                    disabled={isEnhancing || !formData.title}
                    className={`text-xs flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                      isEnhancing || !formData.title 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-purple-600 bg-purple-50 hover:bg-purple-100'
                    }`}
                    title="Use AI to expand description"
                  >
                    {isEnhancing ? (
                       <span className="animate-spin">✨</span>
                    ) : (
                       <Wand2 size={12} />
                    )}
                    AI Enhance
                  </button>
                </div>
                <textarea
                  rows={4}
                  className="w-full border border-shopify-border rounded-md px-3 py-2 bg-white text-shopify-text focus:ring-2 focus:ring-shopify-primary focus:border-shopify-primary outline-none resize-none"
                  placeholder="Detailed description helps accuracy..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-shopify-text mb-1">Material</label>
                  <input
                    type="text"
                    className="w-full border border-shopify-border rounded-md px-3 py-2 text-sm bg-white text-shopify-text focus:ring-2 focus:ring-shopify-primary outline-none"
                    placeholder="e.g., 100% Cotton"
                    value={formData.material}
                    onChange={(e) => handleInputChange('material', e.target.value)}
                  />
                </div>
                <div>
                   <label className="block text-sm font-medium text-shopify-text mb-1">Product Type</label>
                   <input
                    type="text"
                    className="w-full border border-shopify-border rounded-md px-3 py-2 text-sm bg-white text-shopify-text focus:ring-2 focus:ring-shopify-primary outline-none"
                    placeholder="e.g., Apparel"
                    value={formData.product_type}
                    onChange={(e) => handleInputChange('product_type', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-shopify-text mb-1">Vendor</label>
                  <input
                    type="text"
                    className="w-full border border-shopify-border rounded-md px-3 py-2 text-sm bg-white text-shopify-text focus:ring-2 focus:ring-shopify-primary outline-none"
                    placeholder="e.g., Nike"
                    value={formData.vendor}
                    onChange={(e) => handleInputChange('vendor', e.target.value)}
                  />
                </div>
                <div>
                   <label className="block text-sm font-medium text-shopify-text mb-1">Origin Country</label>
                   <input
                    type="text"
                    className="w-full border border-shopify-border rounded-md px-3 py-2 text-sm bg-white text-shopify-text focus:ring-2 focus:ring-shopify-primary outline-none"
                    placeholder="e.g., CN, US"
                    value={formData.origin_country}
                    onChange={(e) => handleInputChange('origin_country', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-shopify-border flex flex-col gap-3">
              <Button 
                variant="primary" 
                fullWidth 
                onClick={handleClassify}
                loading={isLoading}
                icon={<Sparkles size={16} />}
              >
                Generate HS Code
              </Button>
              <Button 
                variant="secondary" 
                fullWidth 
                onClick={() => setShowHSPicker(true)}
                icon={<BookOpen size={16} />}
              >
                Search Database Manually
              </Button>
            </div>
          </Card>
        </div>

        {/* Results Panel - Right Column */}
        <div className="lg:col-span-7">
           {result ? (
             <ClassificationResultCard 
               result={result} 
               productTitle={formData.title} 
               onSave={handleSaveToShopify}
               isLinkedProduct={!!selectedProductId}
             />
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-shopify-border rounded-lg bg-slate-50/50 min-h-[500px]">
               <div className="bg-white p-6 rounded-full shadow-sm mb-6 animate-pulse-soft">
                 <Upload className="text-shopify-subdued" size={40} />
               </div>
               <h3 className="text-lg font-semibold text-shopify-text">No Classification Yet</h3>
               <p className="text-shopify-subdued max-w-sm mt-2 mb-6">
                 Select a product from the store or fill in details manually, then click "Generate HS Code".
               </p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

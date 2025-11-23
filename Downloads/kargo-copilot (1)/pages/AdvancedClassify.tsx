
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { classifyProductWithVision, enhanceProductDescription } from '../services/geminiService';
import { updateProductHSCode } from '../services/shopifyService';
import { HSCodeResult, ProductData } from '../types';
import { ClassificationResultCard } from '../components/ui/ClassificationResultCard';
import { HSCodePicker } from '../components/ui/HSCodePicker';
import { Upload, Sparkles, Image as ImageIcon, X, BookOpen, Wand2 } from 'lucide-react';
import { convertImageToBase64 } from '../services/templateService';

export const AdvancedClassify: React.FC = () => {
  // Form State
  const [formData, setFormData] = useState<ProductData>({
    title: '',
    description: '',
    material: '',
    product_type: '',
    vendor: '',
    origin_country: '',
    images: [] 
  });
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [result, setResult] = useState<HSCodeResult | null>(null);
  const [showHSPicker, setShowHSPicker] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (field: keyof ProductData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await convertImageToBase64(e.target.files[0]);
        setImagePreview(base64);
        setFormData(prev => ({ ...prev, images: [base64] }));
      } catch (err) {
        alert("Failed to process image");
      }
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, images: [] }));
  };

  const handleClassify = async () => {
    if (!formData.title) {
      alert("Product title is required");
      return;
    }
    if (!formData.images || formData.images.length === 0) {
      alert("Please upload an image for Advanced Classification");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const classification = await classifyProductWithVision(formData);
      setResult(classification);
    } catch (error) {
      console.error(error);
      alert("Failed to classify product. Please check console or API key.");
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

  const handleSaveToShopify = async (code: string, reason: string) => {
    alert("In a real scenario, this would save to a linked product. Since this is a manual advanced check, consider copying the code.");
  };

  const fillExample = () => {
    setFormData({
      title: "Complex Mechanical Widget",
      description: "A steel assembly with gears and a rotating shaft.",
      material: "Stainless Steel",
      product_type: "Machinery Parts",
      vendor: "IndusTech",
      origin_country: "DE",
      images: [] // User must upload image for vision demo ideally, or we mock it, but file input is best
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 relative">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-shopify-text flex items-center gap-2">
            <Sparkles className="text-purple-600" /> Advanced HS Codes
          </h2>
          <p className="text-shopify-subdued mt-1">
            Use Gemini Vision AI to analyze product images for higher accuracy classification.
          </p>
        </div>
        <Button variant="plain" onClick={fillExample}>Fill Example Data</Button>
      </div>

      <HSCodePicker 
        isOpen={showHSPicker} 
        onClose={() => setShowHSPicker(false)} 
        onSelect={(entry) => {
          // Manual selection logic
          setResult({
            hs_code: entry.code,
            confidence: 100,
            description: entry.description,
            reasoning: "Manually selected from HS Code Database.",
            chapter: `${entry.chapter} - ${entry.section}`,
            alternatives: [],
            requires_review: false,
            source: 'AI_TEXT',
            timestamp: new Date().toISOString()
          });
          setShowHSPicker(false);
        }} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form - Left Column */}
        <div className="lg:col-span-5 space-y-6">
          <Card title="Product & Image">
            <div className="space-y-4">
              
              {/* Image Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors relative">
                {imagePreview ? (
                  <div className="relative group">
                    <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-md object-contain" />
                    <button 
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-white text-red-600 p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                    <p className="text-xs text-green-600 font-bold mt-2 flex items-center justify-center gap-1">
                      <ImageIcon size={12} /> Image Ready for Vision AI
                    </p>
                  </div>
                ) : (
                  <>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center py-6">
                      <Upload className="text-shopify-primary mb-2" size={32} />
                      <p className="font-medium text-shopify-text">Upload Product Image</p>
                      <p className="text-xs text-shopify-subdued mt-1">JPG, PNG, WEBP supported</p>
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-shopify-text mb-1">Product Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="w-full border border-shopify-border rounded-md px-3 py-2 bg-white text-shopify-text focus:ring-2 focus:ring-shopify-primary focus:border-shopify-primary outline-none"
                  placeholder="e.g., Industrial Gearbox"
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
                  >
                    {isEnhancing ? <span className="animate-spin">✨</span> : <Wand2 size={12} />}
                    AI Enhance
                  </button>
                </div>
                <textarea
                  rows={3}
                  className="w-full border border-shopify-border rounded-md px-3 py-2 bg-white text-shopify-text focus:ring-2 focus:ring-shopify-primary focus:border-shopify-primary outline-none resize-none"
                  placeholder="Detailed description..."
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
                    placeholder="e.g., Steel"
                    value={formData.material}
                    onChange={(e) => handleInputChange('material', e.target.value)}
                  />
                </div>
                <div>
                   <label className="block text-sm font-medium text-shopify-text mb-1">Origin</label>
                   <input
                    type="text"
                    className="w-full border border-shopify-border rounded-md px-3 py-2 text-sm bg-white text-shopify-text focus:ring-2 focus:ring-shopify-primary outline-none"
                    placeholder="e.g., DE"
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
                disabled={!imagePreview}
                icon={<Sparkles size={16} />}
              >
                Analyze Image & Classify
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
             />
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-shopify-border rounded-lg bg-slate-50/50 min-h-[500px]">
               <div className="bg-white p-6 rounded-full shadow-sm mb-6 animate-pulse-soft">
                 <ImageIcon className="text-purple-500" size={40} />
               </div>
               <h3 className="text-lg font-semibold text-shopify-text">Vision Analysis Ready</h3>
               <p className="text-shopify-subdued max-w-sm mt-2 mb-6">
                 Upload an image to see how Gemini Vision identifies materials and components that text descriptions might miss.
               </p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

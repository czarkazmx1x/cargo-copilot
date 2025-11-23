
import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Order, GeneratedDocument, DocumentType, DocumentTemplate } from '../types';
import { FileText, Download, Eye, Printer, FileCheck, Settings, Plus, Trash2, Check, Image as ImageIcon, Palette } from 'lucide-react';
import { generateDocument } from '../services/pdfService';
import { getTemplates, saveTemplate, deleteTemplate, convertImageToBase64 } from '../services/templateService';

// Mock Orders
const AVAILABLE_ORDERS: Order[] = [
  { id: '1', orderNumber: '#1024', customer: 'Alice Freeman', countryCode: 'DE', total: 145.50, fulfillmentStatus: 'unfulfilled', complianceStatus: 'missing_data', items: [], date: 'Oct 24, 2023' },
  { id: '2', orderNumber: '#1023', customer: 'Bob Smith', countryCode: 'CA', total: 89.99, fulfillmentStatus: 'unfulfilled', complianceStatus: 'compliant', items: [], date: 'Oct 24, 2023' },
];

const DOC_HISTORY: GeneratedDocument[] = [
  { id: 'd1', orderId: '1', orderNumber: '#1024', type: 'COMMERCIAL_INVOICE', url: '#', createdAt: '2023-10-24T10:00:00Z' },
];

type Tab = 'generate' | 'history' | 'templates';

export const Documents: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('generate');
  
  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string>('');
  const [selectedType, setSelectedType] = useState<DocumentType>('COMMERCIAL_INVOICE');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [recentDocs, setRecentDocs] = useState<GeneratedDocument[]>(DOC_HISTORY);

  // Template State
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const data = await getTemplates();
      setTemplates(data);
      // Default select first template if available
      if (data.length > 0 && !selectedTemplateId) {
        setSelectedTemplateId(data[0].id);
      }
    } catch (e) {
      console.error("Failed to load templates", e);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedOrder) return;
    setIsGenerating(true);

    const order = AVAILABLE_ORDERS.find(o => o.id === selectedOrder);
    const template = templates.find(t => t.id === selectedTemplateId);

    if (order) {
      try {
        const blob = await generateDocument(selectedType, order, template);
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `Kargo-${order.orderNumber}-${selectedType}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        const newDoc: GeneratedDocument = {
          id: Math.random().toString(36).substr(2, 9),
          orderId: order.id,
          orderNumber: order.orderNumber,
          type: selectedType,
          url: url,
          createdAt: new Date().toISOString()
        };
        setRecentDocs([newDoc, ...recentDocs]);
      } catch (e) {
        console.error("PDF Gen Error", e);
        alert("Failed to generate PDF. Ensure jsPDF is loaded.");
      }
    }
    
    setTimeout(() => setIsGenerating(false), 1000);
  };

  // Template Management Handlers
  const handleCreateTemplate = () => {
    const newTemplate: DocumentTemplate = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Template',
      layout: 'classic',
      primaryColor: '#008060',
      showCompanyAddress: true,
      showTaxId: true,
      createdAt: new Date().toISOString()
    };
    setEditingTemplate(newTemplate);
  };

  const handleEditTemplate = (tpl: DocumentTemplate) => {
    setEditingTemplate({ ...tpl });
  };

  const handleSaveTemplate = async () => {
    if (!editingTemplate) return;
    await saveTemplate(editingTemplate);
    setEditingTemplate(null);
    loadTemplates();
  };

  const handleDeleteTemplate = async (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      await deleteTemplate(id);
      loadTemplates();
      if (editingTemplate?.id === id) setEditingTemplate(null);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editingTemplate) {
      try {
        const base64 = await convertImageToBase64(e.target.files[0]);
        setEditingTemplate({ ...editingTemplate, logo: base64 });
      } catch (err) {
        alert("Failed to upload image");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-shopify-text">Customs Documents</h2>
          <p className="text-shopify-subdued mt-1">Generate, manage, and customize your shipping documentation.</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-shopify-border">
        <div className="flex gap-6">
          <button 
            className={`pb-3 text-sm font-medium transition-all border-b-2 ${activeTab === 'generate' ? 'border-shopify-primary text-shopify-primary' : 'border-transparent text-shopify-subdued hover:text-shopify-text'}`}
            onClick={() => setActiveTab('generate')}
          >
            Generator
          </button>
          <button 
            className={`pb-3 text-sm font-medium transition-all border-b-2 ${activeTab === 'history' ? 'border-shopify-primary text-shopify-primary' : 'border-transparent text-shopify-subdued hover:text-shopify-text'}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
          <button 
            className={`pb-3 text-sm font-medium transition-all border-b-2 ${activeTab === 'templates' ? 'border-shopify-primary text-shopify-primary' : 'border-transparent text-shopify-subdued hover:text-shopify-text'}`}
            onClick={() => setActiveTab('templates')}
          >
            Templates & Branding
          </button>
        </div>
      </div>

      {activeTab === 'generate' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
          <div className="lg:col-span-1">
            <Card title="Configuration" className="h-full">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-shopify-text mb-1">Select Order</label>
                  <select 
                    className="w-full border border-shopify-border rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-shopify-primary outline-none"
                    value={selectedOrder}
                    onChange={(e) => setSelectedOrder(e.target.value)}
                  >
                    <option value="">-- Choose Order --</option>
                    {AVAILABLE_ORDERS.map(order => (
                      <option key={order.id} value={order.id}>
                        {order.orderNumber} - {order.customer} ({order.countryCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-shopify-text mb-1">Document Template</label>
                  <select 
                    className="w-full border border-shopify-border rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-shopify-primary outline-none"
                    value={selectedTemplateId}
                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                  >
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-shopify-text mb-1">Document Type</label>
                  <div className="space-y-2">
                    {(['COMMERCIAL_INVOICE', 'PACKING_LIST', 'CERTIFICATE_OF_ORIGIN'] as DocumentType[]).map((type) => (
                      <label key={type} className={`flex items-center p-3 border rounded-md cursor-pointer transition-all ${
                        selectedType === type 
                          ? 'border-shopify-primary bg-shopify-highlight/50 ring-1 ring-shopify-primary' 
                          : 'border-shopify-border hover:bg-gray-50'
                      }`}>
                        <input 
                          type="radio" 
                          name="docType" 
                          className="text-shopify-primary focus:ring-shopify-primary h-4 w-4"
                          checked={selectedType === type}
                          onChange={() => setSelectedType(type)}
                        />
                        <span className="ml-3 text-sm font-medium text-shopify-text">
                          {type.replace('_', ' ').replace('_', ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    fullWidth 
                    variant="primary" 
                    onClick={handleGenerate}
                    disabled={!selectedOrder}
                    loading={isGenerating}
                    icon={<Download size={18} />}
                  >
                    Generate PDF
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2 flex items-center justify-center bg-slate-50 border border-shopify-border rounded-lg border-dashed p-12">
             <div className="text-center">
               <FileText size={48} className="mx-auto text-shopify-subdued mb-4" />
               <h3 className="text-lg font-medium text-shopify-text">Preview Area</h3>
               <p className="text-shopify-subdued max-w-sm mx-auto">Select an order and template to generate a preview of your customs document.</p>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <Card className="animate-in fade-in">
          <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
               <thead className="bg-slate-50 border-b border-shopify-border">
                 <tr>
                   <th className="px-4 py-3 font-medium text-shopify-subdued">Document</th>
                   <th className="px-4 py-3 font-medium text-shopify-subdued">Order</th>
                   <th className="px-4 py-3 font-medium text-shopify-subdued">Date</th>
                   <th className="px-4 py-3 font-medium text-shopify-subdued text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-shopify-border">
                 {recentDocs.map((doc) => (
                   <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                     <td className="px-4 py-4 font-medium">{doc.type.replace(/_/g, ' ')}</td>
                     <td className="px-4 py-4">{doc.orderNumber}</td>
                     <td className="px-4 py-4 text-shopify-subdued">{new Date(doc.createdAt).toLocaleDateString()}</td>
                     <td className="px-4 py-4 text-right">
                       <div className="flex justify-end gap-2">
                         <button className="p-2 text-shopify-subdued hover:text-shopify-primary"><Eye size={16} /></button>
                         <button className="p-2 text-shopify-subdued hover:text-shopify-primary"><Printer size={16} /></button>
                       </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </Card>
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
          {/* Template List */}
          <div className="lg:col-span-1 space-y-4">
             <div className="flex justify-between items-center">
               <h3 className="font-bold text-shopify-text">Your Templates</h3>
               <Button size="sm" onClick={handleCreateTemplate} icon={<Plus size={14} />}>New</Button>
             </div>
             <div className="space-y-2">
               {templates.map(t => (
                 <div 
                   key={t.id} 
                   onClick={() => handleEditTemplate(t)}
                   className={`p-4 border rounded-lg cursor-pointer transition-all ${
                     editingTemplate?.id === t.id 
                       ? 'border-shopify-primary bg-shopify-highlight/30 ring-1 ring-shopify-primary' 
                       : 'border-shopify-border hover:border-gray-400 bg-white'
                   }`}
                 >
                   <div className="flex justify-between items-start">
                     <div>
                       <p className="font-medium text-shopify-text">{t.name}</p>
                       <p className="text-xs text-shopify-subdued mt-0.5 capitalize">{t.layout} Layout</p>
                     </div>
                     {t.logo && <ImageIcon size={16} className="text-shopify-primary" />}
                   </div>
                 </div>
               ))}
             </div>
          </div>

          {/* Editor */}
          <div className="lg:col-span-2">
             {editingTemplate ? (
               <Card title={`Edit Template: ${editingTemplate.name}`}>
                 <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-sm font-medium text-shopify-text mb-1">Template Name</label>
                       <input 
                         type="text" 
                         className="w-full border border-shopify-border rounded-md px-3 py-2 focus:ring-2 focus:ring-shopify-primary outline-none"
                         value={editingTemplate.name}
                         onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})}
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-shopify-text mb-1">Layout Style</label>
                       <select 
                         className="w-full border border-shopify-border rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-shopify-primary outline-none"
                         value={editingTemplate.layout}
                         onChange={(e) => setEditingTemplate({...editingTemplate, layout: e.target.value as any})}
                       >
                         <option value="classic">Classic (Black & White)</option>
                         <option value="modern">Modern (Colored Header)</option>
                         <option value="minimal">Minimal (Clean)</option>
                       </select>
                     </div>
                   </div>

                   <div className="p-4 bg-slate-50 border border-shopify-border rounded-md">
                     <div className="flex justify-between items-center mb-3">
                       <label className="block text-sm font-medium text-shopify-text">Company Logo</label>
                       {editingTemplate.logo && (
                         <button 
                           onClick={() => setEditingTemplate({...editingTemplate, logo: undefined})}
                           className="text-xs text-red-600 hover:underline"
                         >
                           Remove Logo
                         </button>
                       )}
                     </div>
                     {editingTemplate.logo ? (
                       <div className="h-20 w-auto flex items-center bg-white border border-gray-200 p-2 rounded max-w-[200px]">
                         <img src={editingTemplate.logo} alt="Logo Preview" className="max-h-full object-contain" />
                       </div>
                     ) : (
                       <input type="file" accept="image/*" onChange={handleLogoUpload} className="text-sm" />
                     )}
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-shopify-text mb-2">Theme Color</label>
                     <div className="flex gap-3">
                       {['#008060', '#2563eb', '#db2777', '#d97706', '#000000'].map(color => (
                         <button
                           key={color}
                           onClick={() => setEditingTemplate({...editingTemplate, primaryColor: color})}
                           className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                             editingTemplate.primaryColor === color ? 'border-gray-800 scale-110' : 'border-transparent hover:scale-105'
                           }`}
                           style={{ backgroundColor: color }}
                         >
                           {editingTemplate.primaryColor === color && <Check size={14} className="text-white" />}
                         </button>
                       ))}
                       <input 
                          type="color" 
                          value={editingTemplate.primaryColor}
                          onChange={(e) => setEditingTemplate({...editingTemplate, primaryColor: e.target.value})}
                          className="w-8 h-8 rounded-full cursor-pointer border-0 p-0 overflow-hidden"
                       />
                     </div>
                   </div>

                   <div className="space-y-3">
                     <p className="text-sm font-medium text-shopify-text">Display Options</p>
                     <label className="flex items-center gap-2 cursor-pointer">
                       <input 
                         type="checkbox" 
                         checked={editingTemplate.showCompanyAddress}
                         onChange={(e) => setEditingTemplate({...editingTemplate, showCompanyAddress: e.target.checked})}
                         className="rounded text-shopify-primary focus:ring-shopify-primary"
                       />
                       <span className="text-sm text-shopify-text">Show Company Address in Header</span>
                     </label>
                     <label className="flex items-center gap-2 cursor-pointer">
                       <input 
                         type="checkbox" 
                         checked={editingTemplate.showTaxId}
                         onChange={(e) => setEditingTemplate({...editingTemplate, showTaxId: e.target.checked})}
                         className="rounded text-shopify-primary focus:ring-shopify-primary"
                       />
                       <span className="text-sm text-shopify-text">Show Tax ID / VAT Number</span>
                     </label>
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-shopify-text mb-1">Footer Text</label>
                     <input 
                       type="text" 
                       className="w-full border border-shopify-border rounded-md px-3 py-2 focus:ring-2 focus:ring-shopify-primary outline-none"
                       placeholder="e.g., Thank you for your business."
                       value={editingTemplate.footerText || ''}
                       onChange={(e) => setEditingTemplate({...editingTemplate, footerText: e.target.value})}
                     />
                   </div>

                   <div className="flex gap-3 pt-4 border-t border-shopify-border">
                     <Button variant="primary" onClick={handleSaveTemplate}>Save Template</Button>
                     <Button variant="secondary" onClick={() => handleDeleteTemplate(editingTemplate.id)} className="text-red-600 hover:bg-red-50">
                       <Trash2 size={16} />
                     </Button>
                   </div>
                 </div>
               </Card>
             ) : (
               <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-shopify-border rounded-lg bg-slate-50/50 p-12 text-center">
                 <Palette size={48} className="text-shopify-subdued mb-4" />
                 <h3 className="text-lg font-medium text-shopify-text">Select a template to edit</h3>
                 <p className="text-shopify-subdued max-w-sm mt-2">Or create a new one to customize your document branding.</p>
                 <div className="mt-6">
                   <Button onClick={handleCreateTemplate}>Create New Template</Button>
                 </div>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

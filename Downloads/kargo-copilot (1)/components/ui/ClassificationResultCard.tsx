
import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { HSCodeResult } from '../../types';
import { Check, Copy, AlertTriangle, Info, ChevronDown, ChevronUp, Edit2, Save, X, Search, ShieldAlert, AlertCircle } from 'lucide-react';
import { learnFromCorrection } from '../../services/geminiService';
import { HSCodePicker } from './HSCodePicker';

interface Props {
  result: HSCodeResult;
  productTitle: string;
  onSave?: (code: string, reason: string) => void;
  isLinkedProduct?: boolean;
}

export const ClassificationResultCard: React.FC<Props> = ({ result, productTitle, onSave, isLinkedProduct = false }) => {
  const [copied, setCopied] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [overrideCode, setOverrideCode] = useState(result.hs_code);
  const [overrideReason, setOverrideReason] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showPicker, setShowPicker] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.hs_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAccept = async () => {
    if (onSave) {
      setSaveStatus('saving');
      await onSave(result.hs_code, result.reasoning);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } else {
      alert("Code copied to clipboard!");
      handleCopy();
    }
  };

  const handleSaveOverride = async () => {
    if (!overrideCode || !overrideReason) {
      alert("Please provide both a code and a reason.");
      return;
    }
    
    // 1. Learn
    await learnFromCorrection("current-product-id", overrideCode, overrideReason);
    
    // 2. Save to Store (if linked)
    if (onSave) {
       await onSave(overrideCode, overrideReason);
    }

    setIsEditing(false);
  };

  const confidenceColor = result.confidence > 85 ? 'text-green-700 bg-green-50 border-green-200' : 
                          result.confidence > 70 ? 'text-amber-700 bg-amber-50 border-amber-200' : 
                          'text-red-700 bg-red-50 border-red-200';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
      <HSCodePicker 
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={(entry) => {
          setOverrideCode(entry.code);
          if (!overrideReason) setOverrideReason(`Selected from DB: ${entry.description}`);
          setShowPicker(false);
        }}
      />
      
      {/* Compliance Alerts */}
      {result.alerts && result.alerts.length > 0 && (
        <div className="space-y-2">
          {result.alerts.map((alert, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-md border flex items-start gap-3 ${
                alert.level === 'error' 
                  ? 'bg-red-50 border-red-200 text-red-800' 
                  : alert.level === 'warning'
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}
            >
              {alert.level === 'error' ? <ShieldAlert size={20} className="shrink-0" /> : <AlertCircle size={20} className="shrink-0" />}
              <div>
                <h4 className="font-bold text-sm">{alert.title}</h4>
                <p className="text-sm mt-0.5">{alert.message}</p>
                <p className="text-xs mt-2 opacity-80 font-medium">Source: {alert.source}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Card className={isEditing ? 'border-blue-500 ring-1 ring-blue-500' : ''}>
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-xs text-shopify-subdued uppercase font-bold tracking-wider mb-1">
              HS Code Classification
            </p>
            <div className="flex items-center gap-3">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={overrideCode}
                    onChange={(e) => setOverrideCode(e.target.value)}
                    className="text-3xl font-bold text-shopify-text border-b-2 border-shopify-primary focus:outline-none w-40"
                    autoFocus
                  />
                  <button 
                    onClick={() => setShowPicker(true)}
                    className="p-2 bg-shopify-highlight text-shopify-primary rounded hover:bg-green-100 transition-colors"
                    title="Search Database"
                  >
                    <Search size={20} />
                  </button>
                </div>
              ) : (
                <h1 className="text-4xl font-bold text-shopify-text">{result.hs_code}</h1>
              )}
              
              {!isEditing && (
                <button 
                  onClick={handleCopy}
                  className="text-shopify-subdued hover:text-shopify-primary transition-colors p-2 rounded-md hover:bg-gray-100"
                  title="Copy code"
                >
                  {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
                </button>
              )}
            </div>
            <p className="text-sm text-shopify-text mt-1 font-medium">{result.description}</p>
            <p className="text-xs text-shopify-subdued mt-0.5">{result.chapter}</p>
          </div>

          <div className={`px-3 py-1.5 rounded-full text-sm font-bold border flex items-center gap-1.5 ${confidenceColor}`}>
            {result.confidence}% Confidence
            {result.requires_review && <AlertTriangle size={14} />}
          </div>
        </div>

        {/* Reasoning */}
        <div className="bg-slate-50 rounded-lg p-4 border border-shopify-border mb-6">
          <div className="flex gap-3">
            <Info className="text-shopify-primary shrink-0 mt-0.5" size={18} />
            <div className="space-y-1">
              <p className="text-xs font-bold text-shopify-subdued uppercase">AI Reasoning</p>
              <p className="text-sm text-shopify-text leading-relaxed">
                {result.reasoning}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        {!isEditing ? (
          <div className="flex flex-col sm:flex-row gap-3 border-t border-shopify-border pt-4">
            <Button 
              variant="primary" 
              fullWidth 
              onClick={handleAccept}
              loading={saveStatus === 'saving'}
              icon={saveStatus === 'saved' ? <Check size={16}/> : undefined}
            >
              {saveStatus === 'saved' 
                ? 'Saved Successfully!' 
                : isLinkedProduct ? 'Use & Save to Product' : 'Use This Code'}
            </Button>
            <Button variant="secondary" onClick={() => setIsEditing(true)} icon={<Edit2 size={16} />}>
              Override Manually
            </Button>
            {result.alternatives.length > 0 && (
              <button 
                onClick={() => setShowAlternatives(!showAlternatives)}
                className="flex items-center justify-center gap-2 text-sm text-shopify-subdued hover:text-shopify-text px-4 py-2"
              >
                {showAlternatives ? 'Hide' : 'See'} Alternatives
                {showAlternatives ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4 border-t border-shopify-border pt-4">
             <div>
               <label className="block text-sm font-medium text-shopify-text mb-1">Reason for Override</label>
               <input
                 type="text"
                 className="w-full border border-shopify-border rounded-md px-3 py-2 text-sm"
                 placeholder="e.g., Incorrect material identification..."
                 value={overrideReason}
                 onChange={(e) => setOverrideReason(e.target.value)}
               />
             </div>
             <div className="flex gap-3">
               <Button variant="primary" onClick={handleSaveOverride} icon={<Save size={16} />}>
                 Save Correction
               </Button>
               <Button variant="secondary" onClick={() => setIsEditing(false)} icon={<X size={16} />}>
                 Cancel
               </Button>
             </div>
             <p className="text-xs text-shopify-subdued flex items-center gap-1">
               <Check size={12} /> Kargo Kopilot will learn from this correction.
             </p>
          </div>
        )}

        {/* Alternatives Dropdown */}
        {showAlternatives && !isEditing && (
          <div className="mt-4 pt-4 border-t border-dashed border-shopify-border space-y-3">
            <p className="text-xs font-bold text-shopify-subdued uppercase">Alternative Classifications</p>
            {result.alternatives.map((alt, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-md border border-transparent hover:border-shopify-border transition-all cursor-pointer group">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-shopify-text">{alt.code}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{alt.confidence}%</span>
                  </div>
                  <p className="text-xs text-shopify-subdued mt-1">{alt.reason}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    setIsEditing(true);
                    setOverrideCode(alt.code);
                    setOverrideReason(`Selected alternative: ${alt.reason}`);
                  }}
                >
                  Select
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

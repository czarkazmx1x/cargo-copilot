import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ClassificationHistoryItem } from '../types';
import { getHistory, exportHistoryToCSV } from '../services/historyService';
import { Search, Download, RefreshCw, Filter, Eye, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HSCodePicker } from '../components/ui/HSCodePicker';

export const History: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<ClassificationHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [confidenceFilter, setConfidenceFilter] = useState<number>(0);
  const [showHSPicker, setShowHSPicker] = useState(false);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const data = await getHistory(searchTerm, confidenceFilter);
      setItems(data);
    } catch (error) {
      console.error("Failed to load history", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadHistory();
    }, 500); // Debounce search
    return () => clearTimeout(timer);
  }, [searchTerm, confidenceFilter]);

  const handleExport = () => {
    exportHistoryToCSV(items);
  };

  const handleReclassify = (item: ClassificationHistoryItem) => {
    navigate('/classify', { 
      state: { 
        prefill: {
          title: item.productName,
          description: item.description,
        } 
      } 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-shopify-text">Classification History</h2>
          <p className="text-shopify-subdued mt-1">
            Review past AI decisions, export logs for auditing, or re-run analysis.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowHSPicker(true)} icon={<BookOpen size={16} />}>
            HS Code Lookup
          </Button>
          <Button variant="secondary" onClick={handleExport} icon={<Download size={16} />}>
            Export CSV
          </Button>
        </div>
      </div>

      <HSCodePicker 
        isOpen={showHSPicker}
        onClose={() => setShowHSPicker(false)}
        onSelect={(entry) => {
          // Just a lookup tool on this page, so we basically just acknowledge selection
          alert(`Selected Code: ${entry.code}\n${entry.description}\n\n(Copied to clipboard)`);
          navigator.clipboard.writeText(entry.code);
          setShowHSPicker(false);
        }}
      />

      <Card className="p-0">
        {/* Filters Toolbar */}
        <div className="p-4 border-b border-shopify-border flex flex-col md:flex-row gap-4 bg-slate-50/50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-shopify-subdued" size={18} />
            <input 
              type="text"
              placeholder="Search by product name or HS code..."
              className="w-full pl-10 pr-4 py-2 border border-shopify-border rounded-md focus:ring-2 focus:ring-shopify-primary outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-shopify-subdued" size={18} />
            <select 
              className="border border-shopify-border rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-shopify-primary outline-none"
              value={confidenceFilter}
              onChange={(e) => setConfidenceFilter(Number(e.target.value))}
            >
              <option value="0">All Confidence Levels</option>
              <option value="90">High Confidence (90%+)</option>
              <option value="80">Medium Confidence (80%+)</option>
              <option value="50">Low Confidence (&lt;80%)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-shopify-border">
              <tr>
                <th className="px-6 py-3 font-medium text-shopify-subdued">Product</th>
                <th className="px-6 py-3 font-medium text-shopify-subdued">HS Code</th>
                <th className="px-6 py-3 font-medium text-shopify-subdued">Confidence</th>
                <th className="px-6 py-3 font-medium text-shopify-subdued">Method</th>
                <th className="px-6 py-3 font-medium text-shopify-subdued">Date</th>
                <th className="px-6 py-3 font-medium text-shopify-subdued text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-shopify-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-shopify-subdued">
                    <div className="flex justify-center items-center gap-2">
                      <RefreshCw className="animate-spin" size={20} />
                      Loading history...
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-shopify-subdued">
                    No classifications found matching your filters.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-medium text-shopify-text">{item.productName}</p>
                      <p className="text-xs text-shopify-subdued truncate max-w-[200px]">{item.description}</p>
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-shopify-text">
                      {item.hsCode}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${
                              item.confidence >= 90 ? 'bg-green-500' : 
                              item.confidence >= 80 ? 'bg-amber-500' : 'bg-red-500'
                            }`} 
                            style={{ width: `${item.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{item.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                        {item.method.replace('AI_', '')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-shopify-subdued">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button 
                          className="p-1.5 text-shopify-subdued hover:text-shopify-primary hover:bg-white rounded border border-transparent hover:border-shopify-border transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-shopify-primary bg-shopify-highlight border border-shopify-primary/20 rounded hover:bg-shopify-highlight/80 transition-colors shadow-sm"
                          title="Re-classify this product"
                          onClick={() => handleReclassify(item)}
                        >
                          <RefreshCw size={12} />
                          Re-classify
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
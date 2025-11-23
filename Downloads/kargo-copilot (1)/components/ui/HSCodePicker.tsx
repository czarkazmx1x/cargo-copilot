import React, { useState, useEffect } from 'react';
import { X, Search, BookOpen, ChevronRight } from 'lucide-react';
import { HSDatabaseEntry } from '../../types';
import { searchHSDatabase } from '../../services/hsCodeService';

interface HSCodePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (entry: HSDatabaseEntry) => void;
}

export const HSCodePicker: React.FC<HSCodePickerProps> = ({ isOpen, onClose, onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<HSDatabaseEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const search = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const data = await searchHSDatabase(query);
        setResults(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(search, 400);
    return () => clearTimeout(debounce);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-shopify-border flex justify-between items-center bg-shopify-base rounded-t-lg">
          <div>
            <h3 className="font-bold text-lg text-shopify-text flex items-center gap-2">
              <BookOpen size={20} className="text-shopify-primary" />
              HS Code Database
            </h3>
            <p className="text-xs text-shopify-subdued">Search official Harmonized System codes (2022 Edition)</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-shopify-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by keyword (e.g., 'cotton', 'laptop') or code (e.g., '6109')..." 
              className="w-full pl-10 pr-4 py-3 border border-shopify-border rounded-md focus:ring-2 focus:ring-shopify-primary outline-none text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 bg-gray-50">
          {loading ? (
            <div className="py-10 text-center text-shopify-subdued">Searching database...</div>
          ) : query.length < 2 ? (
            <div className="py-12 text-center text-shopify-subdued flex flex-col items-center">
              <Search size={32} className="mb-2 opacity-20" />
              <p>Enter at least 2 characters to search.</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center text-shopify-subdued">No codes found matching "{query}".</div>
          ) : (
            <div className="space-y-2">
              {results.map((entry) => (
                <div 
                  key={entry.code}
                  onClick={() => onSelect(entry)}
                  className="bg-white border border-shopify-border rounded-md p-4 hover:border-shopify-primary cursor-pointer hover:shadow-sm transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 text-xs text-shopify-subdued">
                        <span>{entry.section}</span>
                        <ChevronRight size={10} />
                        <span>Chapter {entry.chapter}</span>
                      </div>
                      <h4 className="font-medium text-shopify-text mb-1">{entry.description}</h4>
                    </div>
                    <div className="ml-4 text-right">
                       <span className="text-lg font-mono font-bold text-shopify-primary bg-shopify-highlight px-2 py-1 rounded">
                         {entry.code}
                       </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-3 border-t border-shopify-border bg-white rounded-b-lg text-xs text-center text-shopify-subdued">
          Displaying search results from internal database.
        </div>
      </div>
    </div>
  );
};

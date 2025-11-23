
import React from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Layers, 
  Package, 
  FileText, 
  History, 
  Settings, 
  LogOut,
  Ship,
  Calculator,
  Container,
  DollarSign,
  Sparkles
} from 'lucide-react';
import { NavItem } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentTab: NavItem;
  onNavigate: (tab: NavItem) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentTab, onNavigate }) => {
  const navItems = [
    { id: NavItem.DASHBOARD, label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: NavItem.CLASSIFY, label: 'HS Codes', icon: <Search size={20} /> },
    { id: NavItem.ADVANCED_CLASSIFY, label: 'Advanced HS Codes', icon: <Sparkles size={20} /> },
    { id: NavItem.BATCH, label: 'Batch Processing', icon: <Layers size={20} /> },
    { id: NavItem.ORDERS, label: 'Orders', icon: <Package size={20} /> },
    { id: NavItem.SHIPPING, label: 'Rate Calculator', icon: <Ship size={20} /> },
    { id: NavItem.DUTY_CALC, label: 'Duty Calculator', icon: <DollarSign size={20} /> },
    { id: NavItem.LOAD_CALC, label: 'Load Calculator', icon: <Container size={20} /> },
    { id: NavItem.DOCUMENTS, label: 'Documents', icon: <FileText size={20} /> },
    { id: NavItem.HISTORY, label: 'History', icon: <History size={20} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-shopify-base text-shopify-text">
      {/* Mobile Header */}
      <div className="md:hidden bg-shopify-nav text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Ship className="text-shopify-primary" />
          <span>Kargo Kopilot</span>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-shopify-base border-r border-shopify-border h-screen sticky top-0">
        <div className="p-6 flex items-center gap-2 border-b border-shopify-border/50">
          <div className="bg-shopify-primary p-1.5 rounded-lg text-white">
             <Ship size={24} />
          </div>
          <div>
            <h1 className="font-bold text-shopify-text">Kargo Kopilot</h1>
            <p className="text-xs text-shopify-subdued">Shopify Embedded</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentTab === item.id
                  ? 'bg-white text-shopify-primary shadow-sm'
                  : 'text-shopify-subdued hover:text-shopify-text hover:bg-gray-200/50'
              }`}
            >
              <span className={currentTab === item.id ? 'text-shopify-primary' : 'text-gray-400'}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-shopify-border">
          <div className="bg-shopify-highlight rounded-md p-3 border border-shopify-primary/20">
             <h4 className="text-xs font-bold text-shopify-primaryDark uppercase mb-1">Pro Plan</h4>
             <p className="text-xs text-shopify-subdued mb-2">450 classifications left</p>
             <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
               <div className="bg-shopify-primary h-full w-[10%]"></div>
             </div>
          </div>
          <button 
            onClick={() => onNavigate(NavItem.SETTINGS)}
            className={`flex items-center gap-3 px-3 py-2 mt-2 text-sm w-full rounded-md transition-colors ${
              currentTab === NavItem.SETTINGS 
               ? 'bg-white text-shopify-primary shadow-sm' 
               : 'text-shopify-subdued hover:text-shopify-text hover:bg-gray-200/50'
            }`}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

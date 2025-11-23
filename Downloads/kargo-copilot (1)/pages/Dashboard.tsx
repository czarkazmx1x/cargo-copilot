
import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { AlertCircle, CheckCircle2, Clock, FileCheck, Ship, DollarSign, Container, ChevronRight } from 'lucide-react';
import { NavItem } from '../types';

interface DashboardProps {
  onNavigate: (tab: NavItem) => void;
}

const data = [
  { name: 'Mon', classified: 40 },
  { name: 'Tue', classified: 30 },
  { name: 'Wed', classified: 55 },
  { name: 'Thu', classified: 80 },
  { name: 'Fri', classified: 65 },
  { name: 'Sat', classified: 20 },
  { name: 'Sun', classified: 15 },
];

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-shopify-text">Overview</h2>
          <p className="text-shopify-subdued mt-1">Welcome back, Store Manager.</p>
        </div>
        <Button variant="primary" onClick={() => onNavigate(NavItem.CLASSIFY)}>
          New Classification
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-shopify-primary">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase text-shopify-subdued">Total Products</p>
              <h3 className="text-2xl font-bold mt-1">1,240</h3>
            </div>
            <PackageIcon />
          </div>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase text-shopify-subdued">Missing HS Codes</p>
              <h3 className="text-2xl font-bold mt-1 text-amber-600">42</h3>
            </div>
            <AlertCircle className="text-amber-500" />
          </div>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase text-shopify-subdued">Pending Orders</p>
              <h3 className="text-2xl font-bold mt-1">18</h3>
            </div>
            <Clock className="text-blue-500" />
          </div>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase text-shopify-subdued">Documents Generated</p>
              <h3 className="text-2xl font-bold mt-1">856</h3>
            </div>
            <FileCheck className="text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Quick Tools Section */}
      <div>
        <h3 className="text-lg font-bold text-shopify-text mb-3">Quick Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => onNavigate(NavItem.SHIPPING)}
            className="bg-white p-4 rounded-lg shadow-sm border border-shopify-border hover:border-shopify-primary hover:shadow-md transition-all text-left flex items-center gap-4 group"
          >
            <div className="bg-blue-50 p-3 rounded-md text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Ship size={24} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-shopify-text">Shipping Rate Calculator</h4>
              <p className="text-xs text-shopify-subdued mt-0.5">Compare carrier rates</p>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-shopify-primary" />
          </button>

          <button 
            onClick={() => onNavigate(NavItem.DUTY_CALC)}
            className="bg-white p-4 rounded-lg shadow-sm border border-shopify-border hover:border-shopify-primary hover:shadow-md transition-all text-left flex items-center gap-4 group"
          >
            <div className="bg-green-50 p-3 rounded-md text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
              <DollarSign size={24} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-shopify-text">Duty Calculator</h4>
              <p className="text-xs text-shopify-subdued mt-0.5">Estimate landed costs</p>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-shopify-primary" />
          </button>

          <button 
            onClick={() => onNavigate(NavItem.LOAD_CALC)}
            className="bg-white p-4 rounded-lg shadow-sm border border-shopify-border hover:border-shopify-primary hover:shadow-md transition-all text-left flex items-center gap-4 group"
          >
            <div className="bg-purple-50 p-3 rounded-md text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Container size={24} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-shopify-text">Load Calculator</h4>
              <p className="text-xs text-shopify-subdued mt-0.5">Optimize container space</p>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-shopify-primary" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Classification Volume">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e1e3e5" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6d7175', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6d7175', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f1f2f4'}} 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="classified" fill="#008060" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Recent Activity">
             <div className="space-y-4">
               {[1, 2, 3, 4].map((i) => (
                 <div key={i} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="text-shopify-primary shrink-0" size={16} />
                    <div>
                      <p className="font-medium text-shopify-text">Classified "Leather Hiking Boots"</p>
                      <p className="text-xs text-shopify-subdued">HS Code: 6403.91 • 2 hours ago</p>
                    </div>
                 </div>
               ))}
             </div>
             <div className="mt-4 pt-4 border-t border-shopify-border">
               <Button variant="plain" fullWidth onClick={() => onNavigate(NavItem.HISTORY)}>View All History</Button>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const PackageIcon = () => (
  <svg className="text-shopify-primary" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22v-9"/></svg>
);

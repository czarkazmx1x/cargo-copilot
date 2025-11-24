
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ShopifyAppBridgeProvider } from './components/ShopifyAppBridgeProvider';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Classify } from './pages/Classify';
import { AdvancedClassify } from './pages/AdvancedClassify';
import { Orders } from './pages/Orders';
import { Batch } from './pages/Batch';
import { Documents } from './pages/Documents';
import { ShippingCalculator } from './pages/ShippingCalculator';
import { LoadCalculator } from './pages/LoadCalculator';
import { DutyCalculator } from './pages/DutyCalculator';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { NavItem } from './types';

const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine current tab based on path
  const currentPath = location.pathname.substring(1) || 'dashboard';
  const currentTab = Object.values(NavItem).includes(currentPath as NavItem) 
    ? (currentPath as NavItem) 
    : NavItem.DASHBOARD;

  const handleNavigate = (tab: NavItem) => {
    navigate(`/${tab}`);
  };

  return (
    <Layout currentTab={currentTab} onNavigate={handleNavigate}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard onNavigate={handleNavigate} />} />
        <Route path="/classify" element={<Classify />} />
        <Route path="/advanced_classify" element={<AdvancedClassify />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/batch" element={<Batch />} />
        <Route path="/shipping" element={<ShippingCalculator />} />
        <Route path="/load_calc" element={<LoadCalculator />} />
        <Route path="/duty_calc" element={<DutyCalculator />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<div className="text-center py-20 text-shopify-subdued">Feature under construction</div>} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ShopifyAppBridgeProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </ShopifyAppBridgeProvider>
  );
};

export default App;

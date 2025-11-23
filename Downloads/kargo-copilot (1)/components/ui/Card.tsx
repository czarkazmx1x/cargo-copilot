import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  subdued?: boolean;
}

export const Card: React.FC<CardProps> = ({ title, children, actions, className = '', subdued = false }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-shopify-border overflow-hidden ${className}`}>
      {(title || actions) && (
        <div className="px-5 py-4 border-b border-shopify-border flex justify-between items-center">
          {title && <h3 className="font-semibold text-shopify-text text-md">{title}</h3>}
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      <div className={`px-5 py-5 ${subdued ? 'bg-slate-50' : ''}`}>
        {children}
      </div>
    </div>
  );
};
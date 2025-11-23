
import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  label?: string;
  size?: 'sm' | 'md';
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  label, 
  size = 'md',
  color = 'bg-shopify-primary' 
}) => {
  const heightClass = size === 'sm' ? 'h-1.5' : 'h-2.5';
  
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-xs font-medium text-shopify-text">{label}</span>
          <span className="text-xs font-medium text-shopify-text">{Math.round(progress)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${heightClass}`}>
        <div 
          className={`${color} ${heightClass} rounded-full transition-all duration-500 ease-out`} 
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        ></div>
      </div>
    </div>
  );
};

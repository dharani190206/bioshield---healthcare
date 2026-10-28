import React from 'react';
import { RiskLevel } from '../../types';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showIcon = true }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  if (level === 'HIGH') {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-red-100 text-red-700 border border-red-200 ${sizeClasses[size]}`}
      >
        {showIcon && <AlertCircle className="w-3.5 h-3.5 text-red-600 animate-pulse" />}
        <span>HIGH RISK</span>
      </span>
    );
  }

  if (level === 'MEDIUM') {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-amber-100 text-amber-800 border border-amber-200 ${sizeClasses[size]}`}
      >
        {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
        <span>MEDIUM RISK</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 ${sizeClasses[size]}`}
    >
      {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
      <span>LOW RISK</span>
    </span>
  );
};

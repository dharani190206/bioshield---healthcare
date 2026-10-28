import React from 'react';
import { SystemOperationalStatus, DiversionStatus, MovementStatus } from '../../types';
import { Activity, ShieldAlert, AlertOctagon, CheckCircle2, ArrowUpRight, ArrowRight, ArrowDownLeft, Shuffle } from 'lucide-react';

export const SystemStatusBadge: React.FC<{ status: SystemOperationalStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md',
}) => {
  const isSm = size === 'sm';
  const pad = isSm ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs font-semibold';

  switch (status) {
    case 'Monitoring':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 ${pad}`}>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping-slow" />
          <span>Monitoring</span>
        </span>
      );
    case 'Diversion Activated':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-red-100 text-red-700 border border-red-300 ${pad} animate-pulse`}>
          <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
          <span>Diversion Activated</span>
        </span>
      );
    case 'Standby':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300 ${pad}`}>
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          <span>Standby</span>
        </span>
      );
    case 'System Error':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 ${pad}`}>
          <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
          <span>System Error</span>
        </span>
      );
    default:
      return null;
  }
};

export const DiversionStatusBadge: React.FC<{ status: DiversionStatus }> = ({ status }) => {
  switch (status) {
    case 'Simulated Activation':
    case 'Active':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
          <Activity className="w-3 h-3 text-red-600 animate-spin" />
          <span>{status}</span>
        </span>
      );
    case 'Recommended':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
          <ShieldAlert className="w-3 h-3 text-amber-600" />
          <span>Recommended</span>
        </span>
      );
    case 'Completed':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
          <CheckCircle2 className="w-3 h-3 text-blue-600" />
          <span>Completed</span>
        </span>
      );
    case 'Not Required':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
          <span>Not Required</span>
        </span>
      );
  }
};

export const MovementBadge: React.FC<{ status: MovementStatus }> = ({ status }) => {
  let color = 'bg-slate-100 text-slate-700 border-slate-200';
  let icon = <ArrowRight className="w-3 h-3" />;

  if (status === 'Approaching') {
    color = 'bg-rose-50 text-rose-700 border-rose-200';
    icon = <ArrowUpRight className="w-3 h-3 text-rose-600 animate-bounce" />;
  } else if (status === 'Receding') {
    color = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    icon = <ArrowDownLeft className="w-3 h-3 text-emerald-600" />;
  } else if (status === 'Erratic' || status === 'Circling') {
    color = 'bg-amber-50 text-amber-700 border-amber-200';
    icon = <Shuffle className="w-3 h-3 text-amber-600" />;
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${color}`}>
      {icon}
      <span>{status}</span>
    </span>
  );
};

import React from 'react';
import { Info, Cpu, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SimulatedBanner: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 border-y sm:border sm:rounded-xl border-blue-200/80 px-4 py-2.5 mb-6 text-sm text-slate-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
      <div className="flex items-center gap-2.5">
        <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
          SIM
        </span>
        <div>
          <span className="font-semibold text-blue-900">Demonstration Mode Active: </span>
          <span className="text-slate-600">
            Wildlife telemetry and diversion activations are currently running in software simulation. Physical hardware is not connected.
          </span>
        </div>
      </div>
      <button
        onClick={() => setActiveTab('hardware')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-white hover:bg-blue-100/60 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors shadow-2xs whitespace-nowrap self-end sm:self-auto cursor-pointer"
      >
        <Cpu className="w-3.5 h-3.5 text-blue-600" />
        <span>Hardware Bridge Specs</span>
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
};

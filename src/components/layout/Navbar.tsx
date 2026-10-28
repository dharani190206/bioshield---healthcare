import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Bell,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Menu,
  X,
  Radio,
  Sparkles,
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';
import { SystemStatusBadge } from '../common/StatusBadge';

interface NavbarProps {
  onOpenSimulator: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSimulator,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const {
    activeAlertsCount,
    currentOverallRisk,
    systemStatus,
    soundEnabled,
    toggleSound,
    autoSimulateLive,
    toggleAutoSimulateLive,
    resetData,
    setActiveTab,
    activeDiversionCountdown,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-blue-600 to-sky-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                  Smart Hospital Wildlife Shield
                </span>
                <span className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 rounded border border-blue-200">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Humane Detection, Risk Prediction & Safe Diversion
              </p>
            </div>
          </div>
        </div>

        {/* Center / Right Telemetry Status Badges & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Diversion Warning Pill (if active) */}
          {activeDiversionCountdown !== null && (
            <div className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-sm">
              <Radio className="w-3.5 h-3.5" />
              <span>DIVERSION ACTIVE ({activeDiversionCountdown}s)</span>
            </div>
          )}

          {/* System Operational Status */}
          <div className="hidden lg:flex items-center">
            <SystemStatusBadge status={systemStatus} size="sm" />
          </div>

          {/* Current Risk Pill */}
          <div className="hidden sm:flex items-center">
            <RiskBadge level={currentOverallRisk} size="sm" />
          </div>

          {/* Quick Simulation Trigger Button */}
          <button
            onClick={onOpenSimulator}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm transition-all cursor-pointer hover:shadow-md"
            title="Inject simulated wildlife movement event"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Simulate Event</span>
            <span className="sm:hidden">Simulate</span>
          </button>

          {/* Live Auto Stream Toggle */}
          <button
            onClick={toggleAutoSimulateLive}
            className={`p-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer hidden md:flex items-center gap-1.5 ${
              autoSimulateLive
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
            }`}
            title={autoSimulateLive ? 'Pause background live auto-simulation' : 'Start background live auto-simulation'}
          >
            {autoSimulateLive ? (
              <>
                <Pause className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px] font-semibold text-emerald-700">Auto Live ON</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[11px] text-slate-600">Auto Stream</span>
              </>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                : 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
            }`}
            title={soundEnabled ? 'Mute alert sounds' : 'Enable alert sounds'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Alert Bell Button with Badge */}
          <button
            onClick={() => setActiveTab('alerts')}
            className="relative p-2 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            title="View alert notifications"
          >
            <Bell className="w-4 h-4" />
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {activeAlertsCount > 9 ? '9+' : activeAlertsCount}
              </span>
            )}
          </button>

          {/* Reset Demo Data button */}
          <button
            onClick={resetData}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer hidden sm:flex"
            title="Reset system to prompt demonstration sample records"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

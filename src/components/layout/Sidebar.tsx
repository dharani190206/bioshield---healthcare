import React from 'react';
import { useApp, NavTab } from '../../context/AppContext';
import {
  LayoutDashboard,
  Radar,
  ShieldAlert,
  Bell,
  History,
  ShieldCheck,
  Cpu,
  HeartHandshake,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activeTab, setActiveTab, activeAlertsCount, systemStatus, operatingMode } = useApp();

  const navItems: {
    id: NavTab;
    label: string;
    section: string;
    icon: React.ReactNode;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Home Dashboard',
      section: 'Section A',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'monitoring',
      label: 'Wildlife Monitoring',
      section: 'Section B',
      icon: <Radar className="w-4 h-4" />,
    },
    {
      id: 'risk',
      label: 'Risk Prediction',
      section: 'Section C',
      icon: <ShieldAlert className="w-4 h-4" />,
    },
    {
      id: 'alerts',
      label: 'Alerts & Notifications',
      section: 'Section D',
      icon: <Bell className="w-4 h-4" />,
      badge: activeAlertsCount > 0 ? activeAlertsCount : undefined,
      badgeColor: 'bg-red-500 text-white',
    },
    {
      id: 'history',
      label: 'Detection History',
      section: 'Section E',
      icon: <History className="w-4 h-4" />,
    },
    {
      id: 'diversion',
      label: 'Safe Diversion Control',
      section: 'Section F',
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: systemStatus === 'Diversion Activated' ? 'Active' : undefined,
      badgeColor: 'bg-rose-600 text-white animate-pulse',
    },
    {
      id: 'hardware',
      label: 'Hardware Integration',
      section: 'Section 8',
      icon: <Cpu className="w-4 h-4" />,
      badge: 'ESP32',
      badgeColor: 'bg-blue-100 text-blue-700 font-mono',
    },
  ];

  const handleSelect = (id: NavTab) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Navigation Items */}
        <div className="p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
            System Navigation
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div className="text-left">
                    <div>{item.label}</div>
                    <div className={`text-[10px] ${isActive ? 'text-blue-200' : 'text-slate-500'}`}>
                      {item.section}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.badgeColor || 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer with Humane Non-Lethal Guarantee */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60">
          <div className="rounded-xl bg-slate-800/70 p-3 border border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              <span>Humane Non-Lethal Shield</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Safe ultrasonic and optical bio-guidance. 100% compliant with wildlife protection and zero harm standards.
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-700/50">
              <span>Mode: <strong className="text-slate-200">{operatingMode}</strong></span>
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3 h-3" /> Bio-Safe
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

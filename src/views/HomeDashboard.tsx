import React from 'react';
import { useApp } from '../context/AppContext';
import { SimulatedBanner } from '../components/common/SimulatedBanner';
import { HospitalAreaMap } from '../components/hospital-map/HospitalAreaMap';
import { RiskBadge } from '../components/common/RiskBadge';
import { SystemStatusBadge, MovementBadge, DiversionStatusBadge } from '../components/common/StatusBadge';
import {
  ShieldAlert,
  Radio,
  Bell,
  Activity,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  Eye,
  Radar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const HomeDashboard: React.FC<{ onOpenSimulator: () => void }> = ({ onOpenSimulator }) => {
  const {
    detections,
    alerts,
    totalDetectionsCount,
    activeAlertsCount,
    currentOverallRisk,
    systemStatus,
    operatingMode,
    setActiveTab,
    triggerDiversion,
  } = useApp();

  const recentDetections = detections.slice(0, 5);

  // Category counts for Recharts Donut
  const birdsCount = detections.filter((d) => d.wildlifeCategory === 'Bird').length;
  const beesCount = detections.filter((d) => d.wildlifeCategory === 'Bee').length;
  const otherCount = detections.filter((d) => d.wildlifeCategory === 'Other').length;

  const categoryData = [
    { name: 'Birds', value: birdsCount, color: '#3b82f6' },
    { name: 'Bees & Wasps', value: beesCount, color: '#f59e0b' },
    { name: 'Other Wildlife', value: otherCount, color: '#10b981' },
  ];

  // Risk distribution for bar chart
  const highCount = detections.filter((d) => d.riskLevel === 'HIGH').length;
  const medCount = detections.filter((d) => d.riskLevel === 'MEDIUM').length;
  const lowCount = detections.filter((d) => d.riskLevel === 'LOW').length;

  const riskData = [
    { name: 'Low Risk', count: lowCount, fill: '#10b981' },
    { name: 'Medium Risk', count: medCount, fill: '#f59e0b' },
    { name: 'High Risk', count: highCount, fill: '#ef4444' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Simulation Banner Notice */}
      <SimulatedBanner />

      {/* Hero Welcome & Quick Action Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Hospital Operations Terminal
            </span>
            <span className="text-xs text-slate-600 font-medium">Real-Time Surveillance Active</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Smart Hospital Wildlife Shield
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Automated detection, ecological risk estimation, and safe non-lethal bio-diversion.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSimulator}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span>Launch Intrusion Test</span>
          </button>
          <button
            onClick={() => setActiveTab('diversion')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Diversion Panel</span>
          </button>
        </div>
      </div>

      {/* A. Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Wildlife Detections */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Detections
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Radar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalDetectionsCount}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              <span>{birdsCount} birds, {beesCount} bees, {otherCount} other</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={() => setActiveTab('history')}
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>View full log</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <span className="text-slate-600 font-medium">Today</span>
          </div>
        </div>

        {/* Card 2: Current Risk Level */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Current Risk Level
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <RiskBadge level={currentOverallRisk} size="lg" />
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium line-clamp-2">
              {currentOverallRisk === 'HIGH'
                ? 'Active wildlife intrusion near sensitive hospital zone!'
                : currentOverallRisk === 'MEDIUM'
                ? 'Target approaching buffer perimeter. Caution active.'
                : 'All sectors within baseline safe parameters.'}
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={() => setActiveTab('risk')}
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Inspect assessment</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <span className="text-slate-600 font-medium">Rule Engine</span>
          </div>
        </div>

        {/* Card 3: Active Alerts */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Alerts
            </span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                activeAlertsCount > 0
                  ? 'bg-red-50 text-red-600 animate-pulse'
                  : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              <Bell className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {activeAlertsCount}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500 font-medium">
              <span>{activeAlertsCount > 0 ? 'Requires staff review' : 'No unresolved warnings'}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={() => setActiveTab('alerts')}
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Review alerts</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <span className="text-slate-600 font-medium">{alerts.length} total</span>
          </div>
        </div>

        {/* Card 4: Diversion System Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Diversion System
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div>
              <SystemStatusBadge status={systemStatus} size="md" />
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Mode: <strong className="text-slate-700">{operatingMode}</strong> • Non-lethal
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={() => setActiveTab('diversion')}
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Control panel</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Bio-Safe
            </span>
          </div>
        </div>
      </div>

      {/* Visual Representation of the Hospital Monitoring Area */}
      <div>
        <HospitalAreaMap />
      </div>

      {/* Analytics & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category & Risk Charts */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">Wildlife Distribution</h3>
            <span className="text-xs text-slate-500">Live Breakdown</span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-100">
            {categoryData.map((item) => (
              <div key={item.name} className="p-1.5 rounded-lg bg-slate-50">
                <div className="font-bold text-slate-800">{item.value}</div>
                <div className="text-[11px] text-slate-500 font-medium">{item.name}</div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <div className="text-xs font-semibold text-slate-600 mb-2">Risk Classification Totals:</div>
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskData} layout="vertical" margin={{ left: -10, right: 10, top: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" textAnchor="end" tick={{ fontSize: 11 }} width={80} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {riskData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Detection Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-sm">Recent Detection Activity</h3>
              </div>
              <button
                onClick={() => setActiveTab('monitoring')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Live Feed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-1">
              {recentDetections.map((det) => (
                <div key={det.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/60 p-2 rounded-xl transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg flex-shrink-0">
                      {det.wildlifeCategory === 'Bird' ? '🦅' : det.wildlifeCategory === 'Bee' ? '🐝' : '🐾'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-xs sm:text-sm">
                          {det.subcategory || det.wildlifeCategory}
                        </span>
                        <RiskBadge level={det.riskLevel} size="sm" />
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {det.location} • <strong className="text-slate-700">{det.distanceMeters.toFixed(1)}m</strong> from zone
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                    <MovementBadge status={det.movementStatus} />
                    <DiversionStatusBadge status={det.diversionStatus} />
                    {det.riskLevel === 'HIGH' && det.diversionStatus !== 'Completed' && (
                      <button
                        onClick={() => triggerDiversion(det.wildlifeCategory, det.location)}
                        className="px-2.5 py-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
                      >
                        Safe Divert
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing 5 latest real-time events</span>
            <button
              onClick={() => setActiveTab('history')}
              className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              Browse entire history →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

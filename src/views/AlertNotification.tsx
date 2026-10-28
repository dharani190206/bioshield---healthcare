import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SimulatedBanner } from '../components/common/SimulatedBanner';
import { RiskBadge } from '../components/common/RiskBadge';
import { DiversionStatusBadge } from '../components/common/StatusBadge';
import { AlertNotification as AlertType, RiskLevel } from '../types';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Zap,
  Volume2,
  VolumeX,
  Filter,
  CheckCheck,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export const AlertNotificationView: React.FC<{ onOpenSimulator: () => void }> = ({ onOpenSimulator }) => {
  const {
    alerts,
    reviewAlert,
    reviewAllAlerts,
    triggerDiversion,
    soundEnabled,
    toggleSound,
    activeAlertsCount,
  } = useApp();

  const [filterTab, setFilterTab] = useState<'unreviewed' | 'all' | 'high' | 'reviewed'>('unreviewed');
  const [reviewerName, setReviewerName] = useState<string>('Staff Duty Officer');

  const filteredAlerts = alerts.filter((a) => {
    if (filterTab === 'unreviewed') return !a.isReviewed;
    if (filterTab === 'high') return a.riskLevel === 'HIGH';
    if (filterTab === 'reviewed') return a.isReviewed;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      <SimulatedBanner />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Section D • Alert & Notification System
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Hospital Wildlife Alerts & Warnings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time notifications for perimeter breaches, proximity escalations, and diversion state triggers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleSound}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? 'Alert Chime ON' : 'Audio Muted'}</span>
          </button>

          <button
            onClick={onOpenSimulator}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate New Alert</span>
          </button>
        </div>
      </div>

      {/* Top Banner Actions & Filter Tabs */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setFilterTab('unreviewed')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterTab === 'unreviewed'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span>Unreviewed</span>
            {activeAlertsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                {activeAlertsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setFilterTab('high')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterTab === 'high'
                ? 'bg-red-600 text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span>High Risk Only</span>
          </button>

          <button
            onClick={() => setFilterTab('reviewed')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
              filterTab === 'reviewed'
                ? 'bg-slate-800 text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span>Reviewed Archive</span>
          </button>

          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
              filterTab === 'all'
                ? 'bg-slate-800 text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span>All Alerts ({alerts.length})</span>
          </button>
        </div>

        {/* Bulk Action */}
        {activeAlertsCount > 0 && (
          <button
            onClick={reviewAllAlerts}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All as Reviewed</span>
          </button>
        )}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">No Alerts in this Category</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All active alerts have been addressed or no wildlife has breached the selected threshold.
            </p>
            <button
              onClick={onOpenSimulator}
              className="mt-2 text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              Simulate an intrusion event to generate an alert
            </button>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isHigh = alert.riskLevel === 'HIGH';
            const isReviewed = alert.isReviewed;

            return (
              <div
                key={alert.id}
                className={`bg-white rounded-2xl border p-5 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  !isReviewed && isHigh
                    ? 'border-red-300 ring-1 ring-red-200 bg-red-50/20'
                    : !isReviewed
                    ? 'border-amber-200 bg-amber-50/20'
                    : 'border-slate-200 opacity-90'
                }`}
              >
                {/* Alert Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      {alert.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {alert.alertType}
                    </span>
                    <RiskBadge level={alert.riskLevel} size="sm" />
                    <DiversionStatusBadge status={alert.diversionStatus} />
                    {isReviewed && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Reviewed
                      </span>
                    )}
                  </div>

                  <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>
                      {alert.wildlifeCategory === 'Bird' ? '🦅' : alert.wildlifeCategory === 'Bee' ? '🐝' : '🐾'}
                    </span>
                    <span>{alert.message}</span>
                  </div>

                  {/* Metadata Row: Time, Location, Distance */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(alert.timestamp).toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{alert.location}</span>
                    </div>

                    <div className="font-semibold text-slate-700">
                      Distance: {alert.distanceMeters.toFixed(1)}m
                    </div>
                  </div>

                  {/* Recommended Action Box */}
                  <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-blue-900 font-medium">
                    <strong>Recommended Action: </strong> {alert.recommendedAction}
                  </div>

                  {/* Review Audit Info */}
                  {isReviewed && alert.reviewedAt && (
                    <div className="text-[11px] text-slate-400 italic">
                      Reviewed at {new Date(alert.reviewedAt).toLocaleTimeString()} by {alert.reviewedBy || 'Staff'}
                    </div>
                  )}
                </div>

                {/* Actions Button Group */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 flex-shrink-0">
                  {!isReviewed ? (
                    <button
                      onClick={() => reviewAlert(alert.id, reviewerName)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark as Reviewed</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Archived</span>
                  )}

                  {isHigh && alert.diversionStatus !== 'Completed' && (
                    <button
                      onClick={() => triggerDiversion(alert.wildlifeCategory, alert.location)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Activate Diversion</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

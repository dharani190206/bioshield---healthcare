import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SimulatedBanner } from '../components/common/SimulatedBanner';
import { HospitalAreaMap } from '../components/hospital-map/HospitalAreaMap';
import { RiskBadge } from '../components/common/RiskBadge';
import { MovementBadge, DiversionStatusBadge } from '../components/common/StatusBadge';
import { WildlifeCategory, MovementStatus, HospitalZone } from '../types';
import {
  Radar,
  Radio,
  Clock,
  Compass,
  Sparkles,
  Zap,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from 'lucide-react';

export const WildlifeMonitoring: React.FC<{ onOpenSimulator: () => void }> = ({ onOpenSimulator }) => {
  const { detections, triggerDiversion, activeDiversionCountdown } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<WildlifeCategory | 'All'>('All');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('All');
  const [selectedMovement, setSelectedMovement] = useState<MovementStatus | 'All'>('All');
  const [highlightedZoneId, setHighlightedZoneId] = useState<string | null>(null);

  // Filter detections
  const filteredDetections = detections.filter((d) => {
    if (selectedCategory !== 'All' && d.wildlifeCategory !== selectedCategory) return false;
    if (selectedZoneFilter !== 'All' && d.zoneId !== selectedZoneFilter) return false;
    if (selectedMovement !== 'All' && d.movementStatus !== selectedMovement) return false;
    return true;
  });

  const birdsCount = detections.filter((d) => d.wildlifeCategory === 'Bird').length;
  const beesCount = detections.filter((d) => d.wildlifeCategory === 'Bee').length;
  const otherCount = detections.filter((d) => d.wildlifeCategory === 'Other').length;
  const approachingCount = detections.filter((d) => d.movementStatus === 'Approaching').length;

  return (
    <div className="space-y-6 pb-12">
      <SimulatedBanner />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Section B • Live Wildlife Monitoring
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Perimeter Detection & Tracking Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time movement vectors, proximity to sensitive hospital zones, and category classification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSimulator}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span>Simulate Wildlife Entry</span>
          </button>
        </div>
      </div>

      {/* Quick Telemetry Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
            🦅
          </div>
          <div>
            <div className="text-xl font-bold text-slate-800">{birdsCount}</div>
            <div className="text-xs text-slate-500">Birds Monitored</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
            🐝
          </div>
          <div>
            <div className="text-xl font-bold text-slate-800">{beesCount}</div>
            <div className="text-xs text-slate-500">Bee Swarms Tracked</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
            🐾
          </div>
          <div>
            <div className="text-xl font-bold text-slate-800">{otherCount}</div>
            <div className="text-xs text-slate-500">Other Small Animals</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xl">
            <Flame className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-800">{approachingCount}</div>
            <div className="text-xs text-slate-500">Approaching Sensitive</div>
          </div>
        </div>
      </div>

      {/* Monitoring-Area Illustration showing Hospital, Trees, Sensors, Birds, Bees */}
      <div>
        <HospitalAreaMap
          interactive={true}
          selectedZoneId={highlightedZoneId}
          onSelectZone={(zone: HospitalZone) => setHighlightedZoneId(zone.id)}
        />
      </div>

      {/* Filter and Live Detection Cards Section */}
      <div className="space-y-4">
        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Filter Feed:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Category pills */}
            {(['All', 'Bird', 'Bee', 'Other'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat === 'All' ? 'All Wildlife' : cat === 'Bird' ? 'Birds Only' : cat === 'Bee' ? 'Bees Only' : 'Other'}
              </button>
            ))}

            {/* Movement filter */}
            <select
              value={selectedMovement}
              onChange={(e) => setSelectedMovement(e.target.value as MovementStatus | 'All')}
              className="text-xs rounded-lg border border-slate-200 px-3 py-1.5 bg-slate-50 text-slate-700 focus:outline-none"
            >
              <option value="All">All Movement Types</option>
              <option value="Approaching">Approaching Only</option>
              <option value="Stationary">Stationary Only</option>
              <option value="Receding">Receding Only</option>
              <option value="Erratic">Erratic Only</option>
            </select>
          </div>
        </div>

        {/* Live Detected Wildlife Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDetections.map((det) => {
            const isHigh = det.riskLevel === 'HIGH';
            const isMed = det.riskLevel === 'MEDIUM';

            return (
              <div
                key={det.id}
                className={`bg-white rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md flex flex-col justify-between ${
                  isHigh
                    ? 'border-red-300 ring-1 ring-red-200'
                    : isMed
                    ? 'border-amber-200'
                    : 'border-slate-200'
                }`}
              >
                {/* Card Top: Icon, Category & Risk */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0 shadow-2xs">
                        {det.wildlifeCategory === 'Bird' ? '🦅' : det.wildlifeCategory === 'Bee' ? '🐝' : '🐾'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-base">
                          {det.subcategory || det.wildlifeCategory}
                        </div>
                        <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                          <span>{det.wildlifeCategory}</span>
                          <span>•</span>
                          <span className="font-mono">{det.id}</span>
                        </div>
                      </div>
                    </div>

                    <RiskBadge level={det.riskLevel} size="sm" />
                  </div>

                  {/* Telemetry Data Grid */}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs py-3 border-y border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Detection Time:</span>
                      <span className="font-medium text-slate-700 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(det.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Movement Status:</span>
                      <div className="mt-0.5">
                        <MovementBadge status={det.movementStatus} />
                      </div>
                    </div>

                    <div className="col-span-2">
                      <span className="text-slate-400 block text-[11px]">Location / Monitored Area:</span>
                      <span className="font-semibold text-slate-800 text-xs">
                        {det.location}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Proximity to Zone:</span>
                      <span className={`font-mono font-bold text-sm ${isHigh ? 'text-red-600' : isMed ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {det.distanceMeters.toFixed(1)} meters
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Current Status:</span>
                      <span className="font-semibold text-slate-700 text-xs">
                        {det.detectionStatus}
                      </span>
                    </div>
                  </div>

                  {/* Assessment Reason / Action */}
                  <div className="mt-3 text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <p className="line-clamp-2">{det.riskReason}</p>
                  </div>
                </div>

                {/* Card Footer: Diversion Status & Trigger Button */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <DiversionStatusBadge status={det.diversionStatus} />

                  {det.riskLevel === 'HIGH' ? (
                    <button
                      onClick={() => triggerDiversion(det.wildlifeCategory, det.location)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-2xs transition-colors cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Trigger Diversion</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setHighlightedZoneId(det.zoneId)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                    >
                      Locate on Map →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

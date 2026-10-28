import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HOSPITAL_ZONES } from '../../services/zonesAndSensors';
import { WildlifeCategory, MovementStatus } from '../../types';
import { evaluateRisk } from '../../services/riskEngine';
import { X, Sparkles, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { RiskBadge } from './RiskBadge';

interface LiveSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveSimulatorModal: React.FC<LiveSimulatorModalProps> = ({ isOpen, onClose }) => {
  const { addDetection, riskConfig } = useApp();

  const [category, setCategory] = useState<WildlifeCategory>('Bird');
  const [subcategory, setSubcategory] = useState<string>('Pigeon Flock');
  const [zoneId, setZoneId] = useState<string>('zone-icu');
  const [distanceMeters, setDistanceMeters] = useState<number>(3.5);
  const [movementStatus, setMovementStatus] = useState<MovementStatus>('Approaching');

  if (!isOpen) return null;

  // Live preview calculation using our engine
  const previewAssessment = evaluateRisk(category, zoneId, distanceMeters, movementStatus, riskConfig);

  const handlePreset = (
    cat: WildlifeCategory,
    sub: string,
    zone: string,
    dist: number,
    move: MovementStatus
  ) => {
    setCategory(cat);
    setSubcategory(sub);
    setZoneId(zone);
    setDistanceMeters(dist);
    setMovementStatus(move);
  };

  const handleSimulate = () => {
    addDetection({
      category,
      subcategory,
      zoneId,
      distanceMeters,
      movementStatus,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white font-bold">
              <Sparkles className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Wildlife Intrusion Simulator</h3>
              <p className="text-xs text-blue-200">Inject real-time telemetry events to test risk prediction</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Preset Buttons (Includes prompt sample records) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Demonstration Presets
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() =>
                  handlePreset('Bird', 'Pigeon Flock', 'zone-icu', 3.8, 'Approaching')
                }
                className="p-2.5 rounded-xl border border-red-200 bg-red-50/70 hover:bg-red-100/80 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-700">Record 3: High Risk</span>
                  <span className="text-xs">🦅</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-1 font-medium">Bird near ICU Air Vent</div>
                <div className="text-[10px] text-red-600 mt-0.5">3.8m • Auto Diversion</div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handlePreset('Bee', 'Honeybee Swarm', 'zone-entrance', 8.5, 'Approaching')
                }
                className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100/80 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800">Record 2: Medium</span>
                  <span className="text-xs">🐝</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-1 font-medium">Bees near Main Entry</div>
                <div className="text-[10px] text-amber-700 mt-0.5">8.5m • Caution Alert</div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handlePreset('Bird', 'House Sparrow', 'zone-garden', 28.0, 'Stationary')
                }
                className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/80 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800">Record 1: Low Risk</span>
                  <span className="text-xs">🌿</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-1 font-medium">Bird in Garden</div>
                <div className="text-[10px] text-emerald-700 mt-0.5">28m • Routine Safe</div>
              </button>
            </div>
          </div>

          {/* Custom Configuration Form */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            {/* Category selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Wildlife Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Bird', 'Bee', 'Other'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCategory(cat);
                      if (cat === 'Bird') setSubcategory('Rock Pigeon');
                      else if (cat === 'Bee') setSubcategory('Honeybee Cluster');
                      else setSubcategory('Gray Squirrel');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      category === cat
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{cat === 'Bird' ? '🦅 Bird' : cat === 'Bee' ? '🐝 Bee' : '🐾 Other'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Zone Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Hospital Monitored Zone
              </label>
              <select
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                {HOSPITAL_ZONES.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} ({zone.sensitivity} Sensitivity)
                  </option>
                ))}
              </select>
            </div>

            {/* Distance Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">Distance from Protected Zone:</span>
                <span className="font-bold text-blue-700 font-mono text-sm">{distanceMeters.toFixed(1)} meters</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="35.0"
                step="0.5"
                value={distanceMeters}
                onChange={(e) => setDistanceMeters(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-medium mt-1">
                <span>1.0m (Critical Intrusion)</span>
                <span>15.0m (Buffer Border)</span>
                <span>35.0m (Perimeter Outer)</span>
              </div>
            </div>

            {/* Movement Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Movement Trajectory
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Approaching', 'Stationary', 'Receding', 'Erratic'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMovementStatus(m)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                      movementStatus === m
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Assessment Preview Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Predicted Assessment Output:
              </span>
              <RiskBadge level={previewAssessment.riskLevel} size="sm" />
            </div>
            <div className="text-xs text-slate-700 leading-relaxed font-medium">
              {previewAssessment.reason}
            </div>
            <div className="text-[11px] text-blue-800 bg-blue-50/70 p-2 rounded-lg border border-blue-200/60 font-medium">
              <strong>Action: </strong> {previewAssessment.recommendedAction}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSimulate}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Inject Simulated Telemetry</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

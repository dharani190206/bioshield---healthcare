import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SimulatedBanner } from '../components/common/SimulatedBanner';
import { RiskBadge } from '../components/common/RiskBadge';
import { MovementBadge, DiversionStatusBadge } from '../components/common/StatusBadge';
import { HOSPITAL_ZONES } from '../services/zonesAndSensors';
import { evaluateRisk } from '../services/riskEngine';
import { WildlifeCategory, MovementStatus, RiskLevel } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Sliders,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Info,
  Scale,
  Cpu,
} from 'lucide-react';

export const RiskPrediction: React.FC<{ onOpenSimulator: () => void }> = ({ onOpenSimulator }) => {
  const { detections, riskConfig, updateRiskConfig, addDetection } = useApp();

  // Interactive playground state
  const [playCategory, setPlayCategory] = useState<WildlifeCategory>('Bird');
  const [playZoneId, setPlayZoneId] = useState<string>('zone-icu');
  const [playDistance, setPlayDistance] = useState<number>(4.5);
  const [playMovement, setPlayMovement] = useState<MovementStatus>('Approaching');

  // Rule settings state
  const [highThreshold, setHighThreshold] = useState<number>(riskConfig.highRiskDistanceThreshold);
  const [medThreshold, setMedThreshold] = useState<number>(riskConfig.mediumRiskDistanceThreshold);
  const [autoDiversion, setAutoDiversion] = useState<boolean>(riskConfig.autoDiversionForHighRisk);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Playground calculated assessment
  const calculated = evaluateRisk(playCategory, playZoneId, playDistance, playMovement, {
    ...riskConfig,
    highRiskDistanceThreshold: highThreshold,
    mediumRiskDistanceThreshold: medThreshold,
  });

  const handleSaveConfig = () => {
    updateRiskConfig({
      highRiskDistanceThreshold: highThreshold,
      mediumRiskDistanceThreshold: medThreshold,
      autoDiversionForHighRisk: autoDiversion,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleInjectFromPlayground = () => {
    addDetection({
      category: playCategory,
      zoneId: playZoneId,
      distanceMeters: playDistance,
      movementStatus: playMovement,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      <SimulatedBanner />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Section C • Risk Prediction & Assessment
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Wildlife Risk Prediction Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Rule-based assessment classifying wildlife proximity, movement trajectory, and sensitive zone impact.
          </p>
        </div>

        <button
          onClick={onOpenSimulator}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 text-blue-200" />
          <span>Simulate Telemetry Test</span>
        </button>
      </div>

      {/* 3 CLASSIFICATION LEVEL CARDS (Explicitly matching Section 4.C) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* LOW RISK */}
        <div className="bg-white rounded-2xl border-2 border-emerald-300 p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <RiskBadge level="LOW" size="md" />
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">LOW RISK</h3>
            <div className="space-y-2 text-xs text-slate-600">
              <p className="font-semibold text-emerald-700">
                • Wildlife detected away from sensitive hospital areas.
              </p>
              <p>• Buffer distance {'>'} {medThreshold} meters or in non-critical healing gardens.</p>
              <p>• Natural foraging without immediate hospital hazard.</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-100 relative z-10">
            <div className="text-[11px] font-bold text-slate-500 uppercase">System Action:</div>
            <div className="text-xs font-semibold text-emerald-800 mt-0.5">
              No immediate warning required. Routine monitoring active.
            </div>
          </div>
        </div>

        {/* MEDIUM RISK */}
        <div className="bg-white rounded-2xl border-2 border-amber-300 p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-0" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <RiskBadge level="MEDIUM" size="md" />
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">MEDIUM RISK</h3>
            <div className="space-y-2 text-xs text-slate-600">
              <p className="font-semibold text-amber-800">
                • Wildlife is moving toward a monitored hospital zone.
              </p>
              <p>• Distance between {highThreshold}m and {medThreshold}m approaching boundary.</p>
              <p>• Caution triggered before entering critical perimeter.</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-100 relative z-10">
            <div className="text-[11px] font-bold text-slate-500 uppercase">System Action:</div>
            <div className="text-xs font-semibold text-amber-800 mt-0.5">
              Displays caution message. Diversion mechanism placed on standby.
            </div>
          </div>
        </div>

        {/* HIGH RISK */}
        <div className="bg-white rounded-2xl border-2 border-red-300 p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -z-0" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <RiskBadge level="HIGH" size="md" />
              <ShieldAlert className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">HIGH RISK</h3>
            <div className="space-y-2 text-xs text-slate-600">
              <p className="font-semibold text-red-700">
                • Wildlife detected close to a designated sensitive zone.
              </p>
              <p>• Critical proximity breach (≤ {highThreshold}m from ICU vents or emergency entry).</p>
              <p>• High contamination or entrance blockage risk.</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-red-100 relative z-10">
            <div className="text-[11px] font-bold text-slate-500 uppercase">System Action:</div>
            <div className="text-xs font-semibold text-red-800 mt-0.5">
              Displays prominent warning. Recommends or initiates safe diversion.
            </div>
          </div>
        </div>
      </div>

      {/* Two Column: Interactive Playground & Configurable Rule Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Risk Playground / Calculator */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-800 text-base">Live Risk Calculation Playground</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">Explainable Rules</span>
          </div>

          <div className="space-y-4">
            {/* Category Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Wildlife Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Bird', 'Bee', 'Other'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setPlayCategory(cat)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      playCategory === cat
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{cat === 'Bird' ? '🦅 Bird' : cat === 'Bee' ? '🐝 Bee' : '🐾 Other'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hospital Zone Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Hospital Zone
              </label>
              <select
                value={playZoneId}
                onChange={(e) => setPlayZoneId(e.target.value)}
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
                <span className="font-semibold text-slate-700">Distance from Zone Boundary:</span>
                <span className="font-bold text-blue-700 font-mono text-sm">{playDistance.toFixed(1)}m</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="30.0"
                step="0.5"
                value={playDistance}
                onChange={(e) => setPlayDistance(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                <span>1.0m (Breach)</span>
                <span>{highThreshold}m (High Threshold)</span>
                <span>{medThreshold}m (Med Threshold)</span>
                <span>30.0m</span>
              </div>
            </div>

            {/* Movement */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Movement Status
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Approaching', 'Stationary', 'Receding', 'Erratic'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setPlayMovement(m)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${
                      playMovement === m
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated Output Result */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Calculated Output:</div>
                  <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                    Score: {calculated.riskScore}/100
                  </div>
                </div>
                <RiskBadge level={calculated.riskLevel} size="md" />
              </div>

              <div className="text-xs text-slate-700 leading-relaxed font-medium">
                <strong>Reason: </strong> {calculated.reason}
              </div>

              <div className="text-xs text-blue-900 bg-blue-50 p-2.5 rounded-lg border border-blue-200 font-medium">
                <strong>Recommended Action: </strong> {calculated.recommendedAction}
              </div>

              <button
                onClick={handleInjectFromPlayground}
                className="w-full mt-2 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Inject This Scenario into Live Telemetry</span>
              </button>
            </div>
          </div>
        </div>

        {/* Configurable Rules & Threshold Settings */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-base">Configurable Risk Rules</h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">Admin Parameters</span>
            </div>

            <div className="space-y-4 mt-4">
              {/* High Risk Distance Slider */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">High Risk Distance Threshold:</span>
                  <span className="font-bold text-red-600 font-mono text-sm">≤ {highThreshold} meters</span>
                </div>
                <p className="text-[11px] text-slate-500 mb-2">
                  Detections closer than this distance to sensitive zones trigger High Risk warning and safe diversion.
                </p>
                <input
                  type="range"
                  min="3.0"
                  max="10.0"
                  step="0.5"
                  value={highThreshold}
                  onChange={(e) => setHighThreshold(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
              </div>

              {/* Medium Risk Distance Slider */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Medium Risk Distance Threshold:</span>
                  <span className="font-bold text-amber-600 font-mono text-sm">≤ {medThreshold} meters</span>
                </div>
                <p className="text-[11px] text-slate-500 mb-2">
                  Wildlife approaching within this perimeter displays caution alert on the hospital dashboard.
                </p>
                <input
                  type="range"
                  min="10.0"
                  max="25.0"
                  step="1.0"
                  value={medThreshold}
                  onChange={(e) => setMedThreshold(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Auto Diversion Switch */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">Auto-Diversion for High Risk</div>
                  <div className="text-[11px] text-slate-500">
                    Automatically triggers simulated humane diversion on High Risk detection.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoDiversion(!autoDiversion)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    autoDiversion ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                </button>
              </div>

              {/* Rule Formula Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  <span>Risk Formulation Model</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  <code className="text-blue-700 font-mono">RiskScore = (ZoneSensitivity × 0.40) + (Proximity × 0.35) + (Trajectory × 0.15) + (SpeciesType × 0.10)</code>
                </p>
                <p className="text-[11px] text-slate-500">
                  Clearly identified as a simulation calculation engine for demonstration. Can ingest physical sensor bytes when ESP32 is connected.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {saveSuccess ? (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Rules successfully updated!
              </span>
            ) : (
              <span className="text-xs text-slate-400">Settings persist in local storage</span>
            )}
            <button
              onClick={handleSaveConfig}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-2xs transition-colors cursor-pointer"
            >
              Save Rule Configuration
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Assessment Log Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-base">Active Risk Assessment Log</h3>
          </div>
          <span className="text-xs text-slate-500">Latest Evaluations</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase font-semibold">
                <th className="py-2.5 px-3">Wildlife</th>
                <th className="py-2.5 px-3">Location & Zone</th>
                <th className="py-2.5 px-3">Risk Level</th>
                <th className="py-2.5 px-3">Assessment Reason</th>
                <th className="py-2.5 px-3">Recommended Action</th>
                <th className="py-2.5 px-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {detections.slice(0, 5).map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">
                    <span className="mr-1.5">{d.wildlifeCategory === 'Bird' ? '🦅' : d.wildlifeCategory === 'Bee' ? '🐝' : '🐾'}</span>
                    {d.subcategory || d.wildlifeCategory}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div>{d.location}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{d.distanceMeters.toFixed(1)}m away</div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <RiskBadge level={d.riskLevel} size="sm" />
                  </td>
                  <td className="py-3 px-3 max-w-xs text-[11px] text-slate-600 leading-normal">
                    {d.riskReason}
                  </td>
                  <td className="py-3 px-3 max-w-xs text-[11px] text-blue-800 font-medium">
                    {d.recommendedAction}
                  </td>
                  <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                    {new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

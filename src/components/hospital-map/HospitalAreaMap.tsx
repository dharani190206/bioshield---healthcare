import React, { useState } from 'react';
import { HOSPITAL_ZONES, SENSOR_NODES } from '../../services/zonesAndSensors';
import { useApp } from '../../context/AppContext';
import { HospitalZone, SensorNode, DetectionRecord } from '../../types';
import { Shield, Radio, Wind, Sparkles, Navigation } from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

interface HospitalAreaMapProps {
  interactive?: boolean;
  onSelectZone?: (zone: HospitalZone) => void;
  selectedZoneId?: string | null;
}

export const HospitalAreaMap: React.FC<HospitalAreaMapProps> = ({
  interactive = true,
  onSelectZone,
  selectedZoneId: propSelectedZoneId,
}) => {
  const { detections, addDetection, activeDiversionCountdown, currentDiversionTarget } = useApp();
  const [internalSelectedZone, setInternalSelectedZone] = useState<HospitalZone | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<SensorNode | null>(null);
  const [filterCategory, setFilterCategory] = useState<'All' | 'Bird' | 'Bee' | 'Other'>('All');

  const selectedZone = propSelectedZoneId
    ? HOSPITAL_ZONES.find((z) => z.id === propSelectedZoneId) || null
    : internalSelectedZone;

  // Recent detections to plot on map
  const activeDetections = detections
    .filter((d) => (filterCategory === 'All' ? true : d.wildlifeCategory === filterCategory))
    .slice(0, 8);

  const handleZoneClick = (zone: HospitalZone) => {
    if (!interactive) return;
    setInternalSelectedZone(zone);
    setSelectedSensor(null);
    if (onSelectZone) onSelectZone(zone);
  };

  const handleSensorClick = (sensor: SensorNode, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSensor(sensor);
  };

  const handleSimulateAtZone = (zone: HospitalZone, category: 'Bird' | 'Bee' | 'Other') => {
    const dist = zone.sensitivity === 'High' ? 4.2 : zone.sensitivity === 'Medium' ? 9.8 : 22.0;
    addDetection({
      category,
      zoneId: zone.id,
      distanceMeters: dist,
      movementStatus: 'Approaching',
      customLocation: `${zone.name}`,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
      {/* Map Header & Controls */}
      <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-700 flex items-center justify-center font-semibold">
            <Navigation className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">Hospital Perimeter Monitoring Matrix</h3>
            <p className="text-xs text-slate-500">Live multi-spectral sensor field & zone telemetry</p>
          </div>
        </div>

        {/* Category Filter Pills & Simulation Hint */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium hidden sm:inline">Filter Wildlife:</span>
          {(['All', 'Bird', 'Bee', 'Other'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                filterCategory === cat
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'All' ? 'All (Live)' : cat === 'Bird' ? '🦅 Birds' : cat === 'Bee' ? '🐝 Bees' : '🐾 Other'}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="relative w-full overflow-x-auto bg-[#f8fafc] flex justify-center py-2">
        <svg
          viewBox="0 0 980 580"
          className="w-full max-w-[980px] h-auto select-none font-sans"
          style={{ minWidth: '650px' }}
        >
          {/* Defs for gradients, patterns, and markers */}
          <defs>
            {/* Grid Pattern */}
            <pattern id="hospital-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
            </pattern>
            {/* Tree Leaf Pattern */}
            <radialGradient id="tree-grad" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </radialGradient>
            <radialGradient id="hospital-building-grad" cx="30%" cy="20%" r="90%">
              <stop offset="0%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </radialGradient>
            {/* Diversion Acoustic Pulse Wave */}
            <radialGradient id="pulse-acoustic" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#0284c7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Grid */}
          <rect width="980" height="580" fill="url(#hospital-grid)" />

          {/* Outer Perimeter Ground / Lawns */}
          <path
            d="M 40 40 L 940 40 L 940 540 L 40 540 Z"
            fill="#f8fafc"
            stroke="#cbd5e1"
            strokeWidth="2"
            strokeDasharray="6 4"
          />

          {/* Perimeter Walkways / Asphalt Roads */}
          <path
            d="M 40 100 L 940 100 M 40 500 L 940 500 M 460 100 L 460 500 M 700 100 L 700 500"
            stroke="#e2e8f0"
            strokeWidth="18"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 40 100 L 940 100 M 40 500 L 940 500 M 460 100 L 460 500 M 700 100 L 700 500"
            stroke="#ffffff"
            strokeWidth="2"
            strokeDasharray="8 8"
            fill="none"
          />

          {/* MAIN HOSPITAL BUILDING STRUCTURE (Central Complex) */}
          <g id="hospital-main-complex">
            {/* Main Central Wing */}
            <rect
              x="360"
              y="160"
              width="260"
              height="200"
              rx="12"
              fill="url(#hospital-building-grad)"
              stroke="#94a3b8"
              strokeWidth="3"
            />
            {/* Hospital Red Cross Emblem */}
            <rect x="475" y="195" width="30" height="10" fill="#ef4444" rx="2" />
            <rect x="485" y="185" width="10" height="30" fill="#ef4444" rx="2" />
            <text x="490" y="240" textAnchor="middle" fill="#1e293b" fontSize="13" fontWeight="bold">
              CENTRAL MEDICAL WING
            </text>
            <text x="490" y="256" textAnchor="middle" fill="#64748b" fontSize="10">
              Surgical Suites & Inpatient Tower
            </text>

            {/* West Emergency Wing */}
            <rect
              x="160"
              y="120"
              width="180"
              height="180"
              rx="10"
              fill="#f1f5f9"
              stroke="#94a3b8"
              strokeWidth="2.5"
            />
            <text x="250" y="155" textAnchor="middle" fill="#dc2626" fontSize="11" fontWeight="bold">
              TRAUMA / EMERGENCY
            </text>
            <text x="250" y="170" textAnchor="middle" fill="#64748b" fontSize="9">
              Ambulance Direct Bay
            </text>

            {/* North ICU Air Intake Structure */}
            <rect
              x="630"
              y="110"
              width="190"
              height="150"
              rx="10"
              fill="#f8fafc"
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            <text x="725" y="140" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="bold">
              ICU HVAC & STERILE INTAKE
            </text>
            <text x="725" y="155" textAnchor="middle" fill="#64748b" fontSize="9">
              HEPA Bio-Filter Fan Array
            </text>

            {/* Connective corridors */}
            <rect x="330" y="190" width="40" height="40" fill="#cbd5e1" />
            <rect x="610" y="180" width="30" height="40" fill="#cbd5e1" />
          </g>

          {/* HOSPITAL HEALING GARDEN & BIODIVERSITY ZONE */}
          <g id="healing-garden">
            <rect
              x="640"
              y="320"
              width="270"
              height="190"
              rx="16"
              fill="#ecfdf5"
              stroke="#10b981"
              strokeWidth="2"
            />
            <text x="775" y="348" textAnchor="middle" fill="#047857" fontSize="12" fontWeight="bold">
              🌿 Healing Botanical Garden
            </text>
            <text x="775" y="364" textAnchor="middle" fill="#059669" fontSize="9">
              Ecological Sanctuary (Safe Flora Zone)
            </text>

            {/* Garden Paths */}
            <path
              d="M 680 400 Q 760 380 820 420 T 880 470"
              fill="none"
              stroke="#a7f3d0"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Flowerbeds */}
            <ellipse cx="710" cy="450" rx="26" ry="16" fill="#fbcfe8" opacity="0.8" />
            <ellipse cx="830" cy="460" rx="24" ry="15" fill="#fef08a" opacity="0.8" />
            <ellipse cx="760" cy="420" rx="20" ry="12" fill="#c7d2fe" opacity="0.8" />
          </g>

          {/* OUTDOOR WAITING PAVILION */}
          <g id="waiting-pavilion">
            <rect
              x="130"
              y="360"
              width="210"
              height="150"
              rx="14"
              fill="#eff6ff"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            <text x="235" y="388" textAnchor="middle" fill="#1d4ed8" fontSize="12" fontWeight="bold">
              ⛱ Outdoor Waiting Pavilion
            </text>
            <text x="235" y="404" textAnchor="middle" fill="#2563eb" fontSize="9">
              Family & Outpatient Recovery Terrace
            </text>
            {/* Pavilion pergola lines */}
            <line x1="160" y1="420" x2="310" y2="420" stroke="#bfdbfe" strokeWidth="4" />
            <line x1="160" y1="450" x2="310" y2="450" stroke="#bfdbfe" strokeWidth="4" />
            <line x1="160" y1="480" x2="310" y2="480" stroke="#bfdbfe" strokeWidth="4" />
          </g>

          {/* MAIN ENTRANCE FOYER */}
          <g id="main-entrance-foyer">
            <rect
              x="375"
              y="370"
              width="230"
              height="110"
              rx="12"
              fill="#fffbeb"
              stroke="#f59e0b"
              strokeWidth="2"
            />
            <text x="490" y="400" textAnchor="middle" fill="#b45309" fontSize="12" fontWeight="bold">
              🚪 Main Entrance & Foyer
            </text>
            <text x="490" y="416" textAnchor="middle" fill="#d97706" fontSize="9">
              Automated Double Air-Lock Doors
            </text>
            {/* Glass Entrance Canopy */}
            <path d="M 440 440 L 540 440 L 520 465 L 460 465 Z" fill="#fde68a" opacity="0.7" />
          </g>

          {/* TREES / NATURAL HABITAT ARRAYS */}
          {[
            { cx: 90, cy: 90, r: 24 },
            { cx: 80, cy: 260, r: 28 },
            { cx: 900, cy: 90, r: 26 },
            { cx: 880, cy: 260, r: 30 },
            { cx: 670, cy: 480, r: 22 },
            { cx: 870, cy: 370, r: 25 },
            { cx: 80, cy: 460, r: 24 },
          ].map((t, idx) => (
            <g key={`tree-${idx}`}>
              <circle cx={t.cx} cy={t.cy} r={t.r} fill="url(#tree-grad)" opacity="0.9" />
              <circle cx={t.cx - t.r * 0.25} cy={t.cy - t.r * 0.25} r={t.r * 0.45} fill="#a7f3d0" opacity="0.5" />
            </g>
          ))}

          {/* ACTIVE DIVERSION PULSE ANIMATION (If system is actively diverting) */}
          {activeDiversionCountdown !== null && (
            <g id="diversion-active-wave">
              <circle cx="630" cy="180" r="90" fill="url(#pulse-acoustic)" className="animate-ping" opacity="0.6" />
              <circle cx="630" cy="180" r="140" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.8" />
              <text x="630" y="270" textAnchor="middle" fill="#0369a1" fontSize="11" fontWeight="bold">
                ⚡ Safe Ultrasonic Diversion Emitting (24kHz)
              </text>
            </g>
          )}

          {/* SENSOR NODES (S-01 to S-05) */}
          {SENSOR_NODES.map((sensor) => {
            const isSelected = selectedSensor?.id === sensor.id;
            return (
              <g
                key={sensor.id}
                transform={`translate(${sensor.coordinates.x}, ${sensor.coordinates.y})`}
                className="cursor-pointer transition-transform hover:scale-110"
                onClick={(e) => handleSensorClick(sensor, e)}
              >
                {/* Radar Sensing Ring */}
                <circle
                  r="26"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  opacity="0.7"
                  className="animate-pulse"
                />
                <circle
                  r="14"
                  fill={isSelected ? '#0284c7' : '#0f172a'}
                  stroke="#38bdf8"
                  strokeWidth="2"
                  filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.2))"
                />
                <circle r="4" fill="#38bdf8" className="animate-ping" />

                {/* Sensor ID Label */}
                <rect x="-24" y="-30" width="48" height="15" rx="3" fill="#0f172a" opacity="0.9" />
                <text x="0" y="-19" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                  {sensor.id}
                </text>
              </g>
            );
          })}

          {/* WILDLIFE DETECTION MARKERS ON MAP */}
          {activeDetections.map((det, index) => {
            const zone = HOSPITAL_ZONES.find((z) => z.id === det.zoneId) || HOSPITAL_ZONES[0];
            // Compute coordinate from record or zone center
            const x = det.coordinates?.x || zone.coordinates.x + (index % 3) * 30;
            const y = det.coordinates?.y || zone.coordinates.y + (index % 2) * 25;
            const isHigh = det.riskLevel === 'HIGH';
            const isMed = det.riskLevel === 'MEDIUM';

            const strokeColor = isHigh ? '#ef4444' : isMed ? '#f59e0b' : '#10b981';
            const fillColor = isHigh ? '#fee2e2' : isMed ? '#fef3c7' : '#d1fae5';

            return (
              <g
                key={det.id}
                transform={`translate(${x}, ${y})`}
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={() => handleZoneClick(zone)}
              >
                {/* Proximity / Trajectory Aura */}
                {isHigh && (
                  <circle r="28" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.5" className="animate-ping" />
                )}
                {/* Movement flight path vector arrow */}
                {det.movementStatus === 'Approaching' && (
                  <line
                    x1="-18"
                    y1="18"
                    x2="0"
                    y2="0"
                    stroke={strokeColor}
                    strokeWidth="2.5"
                    strokeDasharray="3 2"
                    markerEnd="url(#arrow)"
                  />
                )}

                {/* Wildlife Badge Marker */}
                <circle
                  r="16"
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth="2.5"
                  filter="drop-shadow(0px 3px 6px rgba(0,0,0,0.18))"
                />

                {/* Wildlife Emoji / Icon representation */}
                <text x="0" y="5" textAnchor="middle" fontSize="14">
                  {det.wildlifeCategory === 'Bird' ? '🦅' : det.wildlifeCategory === 'Bee' ? '🐝' : '🐿️'}
                </text>

                {/* Floating Distance Tooltip */}
                <rect x="-30" y="20" width="60" height="15" rx="3" fill="#1e293b" opacity="0.95" />
                <text x="0" y="31" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="semibold">
                  {det.distanceMeters.toFixed(1)}m | {det.riskLevel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Map Legend & Fast Action Bar */}
      <div className="p-4 border-t border-slate-100 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Visual Legend */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-3 rounded-full bg-red-500 border border-red-600 inline-block" />
            <span>High Sensitivity Zone (ICU Air Vent)</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600 inline-block" />
            <span>Medium Sensitivity (Entrance / Pavilion)</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600 inline-block" />
            <span>Healing Garden (Low Risk Buffer)</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-3 rounded-full bg-slate-900 border border-sky-400 inline-block" />
            <span>Multi-Sensor Gateway (S-01 to S-05)</span>
          </div>
        </div>

        {/* Quick Simulator injection buttons */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap hidden lg:inline">
            Quick Inject:
          </span>
          <button
            onClick={() => handleSimulateAtZone(HOSPITAL_ZONES[0], 'Bird')}
            className="flex-1 sm:flex-none text-xs font-medium px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors cursor-pointer"
            title="Simulate High Risk Bird near ICU Vent"
          >
            + High Risk Bird (ICU)
          </button>
          <button
            onClick={() => handleSimulateAtZone(HOSPITAL_ZONES[2], 'Bee')}
            className="flex-1 sm:flex-none text-xs font-medium px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors cursor-pointer"
            title="Simulate Medium Risk Bee Swarm near Entrance"
          >
            + Bee Swarm (Lobby)
          </button>
          <button
            onClick={() => handleSimulateAtZone(HOSPITAL_ZONES[4], 'Bird')}
            className="flex-1 sm:flex-none text-xs font-medium px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer"
            title="Simulate Low Risk Garden Bird"
          >
            + Garden Bird
          </button>
        </div>
      </div>

      {/* Selected Sensor / Zone Drawer Detail */}
      {(selectedSensor || selectedZone) && (
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          {selectedSensor ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">
                  {selectedSensor.name} ({selectedSensor.id})
                </div>
                <div className="text-slate-500">
                  Type: {selectedSensor.type} • Status: <span className="text-emerald-600 font-semibold">{selectedSensor.status}</span> • Battery: {selectedSensor.batteryPercent}%
                </div>
              </div>
            </div>
          ) : selectedZone ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">
                  {selectedZone.name} ({selectedZone.code})
                </div>
                <div className="text-slate-500">
                  Sensitivity: <span className="font-semibold text-slate-700">{selectedZone.sensitivity}</span> • Safe Buffer Threshold: {selectedZone.protectedThresholdMeters}m
                </div>
              </div>
            </div>
          ) : null}

          <button
            onClick={() => {
              setSelectedSensor(null);
              setInternalSelectedZone(null);
            }}
            className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer self-end sm:self-auto"
          >
            Close Inspector
          </button>
        </div>
      )}
    </div>
  );
};

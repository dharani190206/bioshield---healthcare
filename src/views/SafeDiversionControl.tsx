import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SimulatedBanner } from '../components/common/SimulatedBanner';
import { SystemStatusBadge } from '../components/common/StatusBadge';
import { SystemOperationalStatus, OperatingMode, WildlifeCategory } from '../types';
import {
  ShieldCheck,
  Zap,
  Activity,
  HeartHandshake,
  Clock,
  Radio,
  Sliders,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Volume2,
  Compass,
} from 'lucide-react';

export const SafeDiversionControlView: React.FC<{ onOpenSimulator: () => void }> = ({ onOpenSimulator }) => {
  const {
    systemStatus,
    setSystemStatus,
    operatingMode,
    setOperatingMode,
    diversions,
    triggerDiversion,
    abortDiversion,
    activeDiversionCountdown,
    currentDiversionTarget,
  } = useApp();

  const [testZone, setTestZone] = useState<string>('ICU & Surgical Air Intake (Zone A1)');
  const [testWildlife, setTestWildlife] = useState<WildlifeCategory>('Bird');
  const [testMethod, setTestMethod] = useState<
    'Ultrasonic Bio-Acoustic' | 'Optical Strobe Pulse' | 'Harmless Air/Aroma Deterrent'
  >('Ultrasonic Bio-Acoustic');

  const isDiverting = activeDiversionCountdown !== null;
  const lastDiversion = diversions[0];

  const handleStartManualTest = () => {
    triggerDiversion(testWildlife, testZone, testMethod, 'Staff Manual');
  };

  return (
    <div className="space-y-6 pb-12">
      <SimulatedBanner />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Section F • Safe Diversion Control
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Humane Safe Diversion Control Panel
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Non-lethal bio-acoustic, optical, and aroma deterrent mechanisms protecting sensitive hospital zones.
          </p>
        </div>

        {/* Current status pill */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <SystemStatusBadge status={systemStatus} size="md" />
        </div>
      </div>

      {/* ACTIVE DIVERSION LIVE BANNER / COUNTDOWN (if active) */}
      {isDiverting && (
        <div className="rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 text-white p-5 sm:p-6 shadow-lg shadow-red-500/20 animate-pulse flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-mono text-2xl font-black">
              {activeDiversionCountdown}s
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase tracking-widest text-red-200">
                Safe Diversion Cycle in Progress (Simulation)
              </div>
              <h2 className="text-xl font-bold mt-0.5">
                Target: {currentDiversionTarget || 'Monitored Perimeter'}
              </h2>
              <p className="text-xs text-red-100 mt-1">
                Transmitting humane 24kHz bio-acoustic frequency. Harmless deterrent active without disturbance to human patients.
              </p>
            </div>
          </div>

          <button
            onClick={abortDiversion}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-red-700 hover:bg-red-50 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
          >
            Abort / Silence Diversion
          </button>
        </div>
      )}

      {/* Top 4 KPI Status Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Mechanism Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              System Status
            </span>
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div className="mt-3">
            <div className="text-lg font-bold text-slate-900">
              {systemStatus}
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Hardware simulated state
            </p>
          </div>
          {/* Quick status selector */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
            {(['Standby', 'Monitoring', 'Diversion Activated', 'System Error'] as SystemOperationalStatus[]).map((st) => (
              <button
                key={st}
                onClick={() => setSystemStatus(st)}
                className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border transition-colors cursor-pointer ${
                  systemStatus === st
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Card 2: Operating Mode */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Operating Mode
            </span>
            <Sliders className="w-5 h-5 text-purple-600" />
          </div>
          <div className="mt-3">
            <div className="text-lg font-bold text-slate-900">
              {operatingMode}
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {operatingMode === 'Automatic'
                ? 'Rule-triggered response'
                : operatingMode === 'Semi-Autonomous'
                ? 'Requires staff confirm'
                : operatingMode === 'Manual Override'
                ? 'Manual control only'
                : 'Diagnostic test loop'}
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <select
              value={operatingMode}
              onChange={(e) => setOperatingMode(e.target.value as OperatingMode)}
              className="w-full text-xs rounded-lg border border-slate-200 px-2 py-1 bg-slate-50 text-slate-700 font-semibold focus:outline-none"
            >
              <option value="Automatic">Automatic (Rule Trigger)</option>
              <option value="Semi-Autonomous">Semi-Autonomous (Confirm)</option>
              <option value="Manual Override">Manual Override</option>
              <option value="Test Mode">Diagnostic Test Mode</option>
            </select>
          </div>
        </div>

        {/* Card 3: Last Activation Time */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Last Activation
            </span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div className="mt-3">
            <div className="text-lg font-bold text-slate-900">
              {lastDiversion ? new Date(lastDiversion.timestamp).toLocaleTimeString() : 'None today'}
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {lastDiversion ? `${lastDiversion.method} on ${lastDiversion.targetWildlife}` : 'Standby'}
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400">
            {lastDiversion ? `${lastDiversion.location}` : 'No activation recorded'}
          </div>
        </div>

        {/* Card 4: Humane Standard Compliance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Humane Safety
            </span>
            <HeartHandshake className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-3">
            <div className="text-lg font-bold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>100% Non-Lethal</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Zero injury, zero hospital noise
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-emerald-700 font-medium">
            Bio-Safety Compliant
          </div>
        </div>
      </div>

      {/* Manual Test & Demonstration Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Console */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-800 text-base">Simulated Diversion Test Console</h3>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Demonstration Mode
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Trigger a real-time 10-second humane safe diversion cycle. The application simulates the acoustic and optical deterrent wave in software without physical hardware.
          </p>

          <div className="space-y-4">
            {/* Target Wildlife Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target Wildlife
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Bird', 'Bee', 'Other'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setTestWildlife(cat);
                      if (cat === 'Bird') setTestMethod('Ultrasonic Bio-Acoustic');
                      else if (cat === 'Bee') setTestMethod('Harmless Air/Aroma Deterrent');
                      else setTestMethod('Optical Strobe Pulse');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      testWildlife === cat
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{cat === 'Bird' ? '🦅 Bird' : cat === 'Bee' ? '🐝 Bee' : '🐾 Other'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Test Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Diversion Emitter Location
              </label>
              <select
                value={testZone}
                onChange={(e) => setTestZone(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="ICU & Surgical Air Intake (Zone A1)">ICU & Surgical Air Intake (Zone A1 - High Sensitivity)</option>
                <option value="Emergency Ambulance Bay (Zone B2)">Emergency Ambulance Bay (Zone B2 - High Sensitivity)</option>
                <option value="Main Public Entrance (Zone C3)">Main Public Entrance (Zone C3 - Medium Sensitivity)</option>
                <option value="Outdoor Patient Waiting Pavilion (Zone D4)">Outdoor Patient Waiting Pavilion (Zone D4)</option>
              </select>
            </div>

            {/* Deterrence Method */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Humane Deterrence Modality
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'Ultrasonic Bio-Acoustic',
                    name: 'Ultrasonic Bio-Acoustic (22-26 kHz)',
                    desc: 'Inaudible to human patients; natural avian discomfort frequency that causes birds to wheel away safely.',
                  },
                  {
                    id: 'Optical Strobe Pulse',
                    name: 'Optical Strobe Pulse (520nm Green LED)',
                    desc: 'Harmless light pulsation disrupting target flight vectors without dazzling people or drivers.',
                  },
                  {
                    id: 'Harmless Air/Aroma Deterrent',
                    name: 'Micro-Mist Botanical Aroma Deterrent',
                    desc: 'Organic lavender and eucalyptus vapors that bees naturally avoid. 100% hypoallergenic and chemical-free.',
                  },
                ].map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setTestMethod(m.id as any)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      testMethod === m.id
                        ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-500'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{m.name}</span>
                      {testMethod === m.id && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Trigger Button */}
            <button
              onClick={handleStartManualTest}
              disabled={isDiverting}
              className={`w-full py-3 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isDiverting
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-red-500/20'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>{isDiverting ? `Active Cycle Running (${activeDiversionCountdown}s)` : 'Run Simulated Diversion Cycle'}</span>
            </button>
          </div>
        </div>

        {/* Humane Principles & Frequency Spectrogram */}
        <div className="space-y-6">
          {/* Humane Charter Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-base pb-3 border-b border-slate-100">
              <HeartHandshake className="w-5 h-5 text-emerald-600" />
              <h3>Humane Non-Lethal Wildlife Protection Charter</h3>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Zero Physical Harm:</strong> The system does not utilize nets, spikes, poisons, traps, or physical contact. Diversion relies exclusively on mild sensory avoidance cues.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Patient Acoustic Safety:</strong> Ultrasonic bio-frequencies operates at 22-26 kHz, outside the human hearing range (20 Hz - 20 kHz), guaranteeing absolute quiet for hospital rooms, surgical suites, and trauma wards.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Ecological Balance:</strong> Wildlife in the healing garden is welcome and undisturbed. Diversion is strictly restricted to designated sensitive sterile air ventilation and emergency bay perimeters.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Auto-Shutoff Protocols:</strong> Each activation is limited to 10-15 second pulses to prevent wildlife distress or desensitization.
                </div>
              </div>
            </div>
          </div>

          {/* Simulated Signal Wave Display */}
          <div className="bg-slate-900 rounded-2xl p-5 text-white border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-sky-400" />
                <span className="font-bold">Emmiter Telemetry Frequency Analyzer</span>
              </div>
              <span className="font-mono text-emerald-400 text-[11px]">
                {isDiverting ? 'TRANSMITTING' : 'STANDBY'}
              </span>
            </div>

            {/* Dynamic Waveform Canvas / SVG */}
            <div className="h-20 bg-slate-950 rounded-xl p-2 border border-slate-800 flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 400 60" className="w-full h-full">
                <path
                  d={
                    isDiverting
                      ? 'M 0 30 Q 25 5, 50 30 T 100 30 T 150 30 T 200 30 T 250 30 T 300 30 T 350 30 T 400 30'
                      : 'M 0 30 Q 50 25, 100 30 T 200 30 T 300 30 T 400 30'
                  }
                  fill="none"
                  stroke={isDiverting ? '#38bdf8' : '#334155'}
                  strokeWidth="2.5"
                  className={isDiverting ? 'animate-pulse' : ''}
                />
              </svg>
            </div>

            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>Freq: {isDiverting ? '24.2 kHz' : '0.0 kHz'}</span>
              <span>Modulation: Swept Sine</span>
              <span>Spl: 85 dB @ 1m (Avian)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activation History Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-base">Recent Diversion Activation History</h3>
          </div>
          <span className="text-xs text-slate-500">{diversions.length} events logged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase font-semibold">
                <th className="py-2.5 px-3">Event ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Trigger Source</th>
                <th className="py-2.5 px-3">Location / Emitter</th>
                <th className="py-2.5 px-3">Target Wildlife</th>
                <th className="py-2.5 px-3">Method</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {diversions.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-medium text-slate-900">{d.id}</td>
                  <td className="py-3 px-3 whitespace-nowrap text-slate-500">
                    {new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{d.triggerSource}</td>
                  <td className="py-3 px-3 text-slate-700">{d.location}</td>
                  <td className="py-3 px-3 font-semibold">
                    <span className="mr-1">{d.targetWildlife === 'Bird' ? '🦅' : d.targetWildlife === 'Bee' ? '🐝' : '🐾'}</span>
                    {d.targetWildlife}
                  </td>
                  <td className="py-3 px-3 text-slate-600">{d.method}</td>
                  <td className="py-3 px-3 font-mono text-slate-500">{d.durationSeconds}s</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        d.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : d.status === 'In Progress'
                          ? 'bg-red-100 text-red-800 animate-pulse'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {d.status}
                    </span>
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

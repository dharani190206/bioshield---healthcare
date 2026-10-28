import { DetectionRecord, AlertNotification, DiversionEvent, RiskConfig } from '../types';
import { DEFAULT_RISK_CONFIG } from './riskEngine';

const STORAGE_KEYS = {
  DETECTIONS: 'bioshield_detections_v1',
  ALERTS: 'bioshield_alerts_v1',
  DIVERSIONS: 'bioshield_diversions_v1',
  CONFIG: 'bioshield_config_v1',
};

// Initial demonstration data including EXACT sample records specified in prompt section 9
export const INITIAL_DETECTIONS: DetectionRecord[] = [
  // Prompt Sample Record 3:
  {
    id: 'DET-DEMO-003',
    wildlifeCategory: 'Bird',
    subcategory: 'Pigeon Flock (Columba livia)',
    timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(), // 4 mins ago
    location: 'Protected Outdoor Zone',
    zoneId: 'zone-icu',
    movementStatus: 'Approaching',
    distanceMeters: 3.8,
    detectionStatus: 'Warning Generated',
    riskLevel: 'HIGH',
    riskScore: 88,
    riskReason: 'Wildlife is detected close to a designated sensitive zone. High risk of bio-air intake contamination.',
    diversionStatus: 'Simulated Activation',
    recommendedAction: 'Immediate safe diversion: Activate ultrasonic bio-acoustic pulse and optical strobe on Zone A1.',
    sensorId: 'NODE-S01',
    confidence: 0.94,
    isSimulated: true,
    reviewed: false,
    coordinates: { x: 580, y: 150 },
  },
  // Prompt Sample Record 2:
  {
    id: 'DET-DEMO-002',
    wildlifeCategory: 'Bee',
    subcategory: 'Honeybee Swarm (Apis mellifera)',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(), // 18 mins ago
    location: 'Near Hospital Entrance',
    zoneId: 'zone-entrance',
    movementStatus: 'Approaching',
    distanceMeters: 8.5,
    detectionStatus: 'Caution Alert',
    riskLevel: 'MEDIUM',
    riskScore: 58,
    riskReason: 'Wildlife is moving toward a monitored hospital zone. Risk of swarm entering through automated sliding doors.',
    diversionStatus: 'Recommended',
    recommendedAction: 'Display caution notice on staff terminal. Standby on botanical aroma mist diversion.',
    sensorId: 'NODE-S03',
    confidence: 0.89,
    isSimulated: true,
    reviewed: false,
    coordinates: { x: 440, y: 350 },
  },
  // Prompt Sample Record 1:
  {
    id: 'DET-DEMO-001',
    wildlifeCategory: 'Bird',
    subcategory: 'House Sparrow (Passer domesticus)',
    timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(), // 42 mins ago
    location: 'Hospital Garden',
    zoneId: 'zone-garden',
    movementStatus: 'Stationary',
    distanceMeters: 28.0,
    detectionStatus: 'Monitoring',
    riskLevel: 'LOW',
    riskScore: 16,
    riskReason: 'Wildlife is detected away from sensitive hospital areas. No immediate warning is required.',
    diversionStatus: 'Not Required',
    recommendedAction: 'Routine monitoring active. No diversion required. Allow natural foraging in perimeter garden.',
    sensorId: 'NODE-S05',
    confidence: 0.96,
    isSimulated: true,
    reviewed: true,
    coordinates: { x: 790, y: 430 },
  },
  // Additional realistic hospital monitoring records
  {
    id: 'DET-DEMO-004',
    wildlifeCategory: 'Other',
    subcategory: 'Eastern Gray Squirrel',
    timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    location: 'Outdoor Patient Waiting Pavilion',
    zoneId: 'zone-waiting',
    movementStatus: 'Circling',
    distanceMeters: 13.2,
    detectionStatus: 'Caution Alert',
    riskLevel: 'MEDIUM',
    riskScore: 46,
    riskReason: 'Small mammal moving in proximity to patient seating benches.',
    diversionStatus: 'Recommended',
    recommendedAction: 'Keep audio perimeter beacon on standby. Monitor trajectory away from pediatric pavilion.',
    sensorId: 'NODE-S04',
    confidence: 0.86,
    isSimulated: true,
    reviewed: true,
    coordinates: { x: 210, y: 430 },
  },
  {
    id: 'DET-DEMO-005',
    wildlifeCategory: 'Bird',
    subcategory: 'American Crow (Corvus brachyrhynchos)',
    timestamp: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
    location: 'Emergency Ambulance Bay & Trauma Entry',
    zoneId: 'zone-emergency',
    movementStatus: 'Approaching',
    distanceMeters: 5.1,
    detectionStatus: 'Warning Generated',
    riskLevel: 'HIGH',
    riskScore: 82,
    riskReason: 'Large bird approaching active trauma drop-off bay. Risk of flight disorientation into triage doors.',
    diversionStatus: 'Simulated Activation',
    recommendedAction: 'Safe diversion: Trigger localized 22kHz sound wave away from trauma entrance.',
    sensorId: 'NODE-S02',
    confidence: 0.92,
    isSimulated: true,
    reviewed: true,
    coordinates: { x: 290, y: 200 },
  },
  {
    id: 'DET-DEMO-006',
    wildlifeCategory: 'Bee',
    subcategory: 'Yellowjacket Wasp (Vespula vulgaris)',
    timestamp: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    location: 'Hospital Healing Garden & Courtyard',
    zoneId: 'zone-garden',
    movementStatus: 'Stationary',
    distanceMeters: 32.5,
    detectionStatus: 'Monitoring',
    riskLevel: 'LOW',
    riskScore: 18,
    riskReason: 'Pollinators active around lavender beds within ecological green zone.',
    diversionStatus: 'Not Required',
    recommendedAction: 'Safe ecological presence. Preserve biodiversity in healing garden. No action needed.',
    sensorId: 'NODE-S05',
    confidence: 0.91,
    isSimulated: true,
    reviewed: true,
    coordinates: { x: 740, y: 470 },
  },
  {
    id: 'DET-DEMO-007',
    wildlifeCategory: 'Bird',
    subcategory: 'Mourning Dove',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    location: 'Main Public Entrance & Lobby',
    zoneId: 'zone-entrance',
    movementStatus: 'Receding',
    distanceMeters: 18.0,
    detectionStatus: 'Monitoring',
    riskLevel: 'LOW',
    riskScore: 22,
    riskReason: 'Bird receding toward perimeter trees away from entrance.',
    diversionStatus: 'Not Required',
    recommendedAction: 'Routine observation. Target departing naturally.',
    sensorId: 'NODE-S03',
    confidence: 0.95,
    isSimulated: true,
    reviewed: true,
    coordinates: { x: 510, y: 310 },
  },
];

export const INITIAL_ALERTS: AlertNotification[] = [
  {
    id: 'ALT-103',
    detectionId: 'DET-DEMO-003',
    alertType: 'Zone Intrusion Warning',
    riskLevel: 'HIGH',
    timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    location: 'Protected Outdoor Zone',
    wildlifeCategory: 'Bird',
    distanceMeters: 3.8,
    message: 'High risk bird cluster detected 3.8m from ICU & Surgical Air Intake Vent.',
    recommendedAction: 'Activate ultrasonic bio-acoustic pulse and optical strobe on Zone A1.',
    diversionStatus: 'Simulated Activation',
    isReviewed: false,
  },
  {
    id: 'ALT-102',
    detectionId: 'DET-DEMO-002',
    alertType: 'Movement Detected',
    riskLevel: 'MEDIUM',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    location: 'Near Hospital Entrance',
    wildlifeCategory: 'Bee',
    distanceMeters: 8.5,
    message: 'Bee activity approaching Main Entrance doors (8.5m).',
    recommendedAction: 'Display caution notice on staff terminal. Standby on botanical aroma mist.',
    diversionStatus: 'Recommended',
    isReviewed: false,
  },
  {
    id: 'ALT-101',
    detectionId: 'DET-DEMO-005',
    alertType: 'Zone Intrusion Warning',
    riskLevel: 'HIGH',
    timestamp: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
    location: 'Emergency Ambulance Bay & Trauma Entry',
    wildlifeCategory: 'Bird',
    distanceMeters: 5.1,
    message: 'Crow approaching trauma entrance canopy.',
    recommendedAction: 'Safe diversion pulse triggered. Target relocated safely toward tree line.',
    diversionStatus: 'Completed',
    isReviewed: true,
    reviewedAt: new Date(Date.now() - 1000 * 60 * 125).toISOString(),
    reviewedBy: 'Dr. Sarah Lin (Hospital Safety Officer)',
  },
];

export const INITIAL_DIVERSIONS: DiversionEvent[] = [
  {
    id: 'DIV-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    triggerSource: 'Automatic Rule',
    location: 'ICU & Surgical Air Intake Vent',
    targetWildlife: 'Bird',
    method: 'Ultrasonic Bio-Acoustic',
    durationSeconds: 8,
    status: 'In Progress',
    notes: 'Humane 24kHz bird bio-acoustic deterrence. Non-lethal frequency harmless to avian anatomy.',
  },
  {
    id: 'DIV-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
    triggerSource: 'Automatic Rule',
    location: 'Emergency Ambulance Bay',
    targetWildlife: 'Bird',
    method: 'Optical Strobe Pulse',
    durationSeconds: 12,
    status: 'Completed',
    notes: 'Harmless green LED pulsed diversion. Successfully guided crow towards north garden trees.',
  },
  {
    id: 'DIV-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    triggerSource: 'Diagnostic Test',
    location: 'Lobby Portico Node S-03',
    targetWildlife: 'Bee',
    method: 'Harmless Air/Aroma Deterrent',
    durationSeconds: 5,
    status: 'Completed',
    notes: 'Routine calibration test: Botanical organic lavender mist dispersion check. 100% operational.',
  },
];

export function loadDetections(): DetectionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DETECTIONS);
    if (!raw) {
      saveDetections(INITIAL_DETECTIONS);
      return INITIAL_DETECTIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DETECTIONS;
  }
}

export function saveDetections(data: DetectionRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DETECTIONS, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save detections to localStorage', e);
  }
}

export function loadAlerts(): AlertNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ALERTS);
    if (!raw) {
      saveAlerts(INITIAL_ALERTS);
      return INITIAL_ALERTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ALERTS;
  }
}

export function saveAlerts(data: AlertNotification[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save alerts to localStorage', e);
  }
}

export function loadDiversions(): DiversionEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DIVERSIONS);
    if (!raw) {
      saveDiversions(INITIAL_DIVERSIONS);
      return INITIAL_DIVERSIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DIVERSIONS;
  }
}

export function saveDiversions(data: DiversionEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DIVERSIONS, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save diversions to localStorage', e);
  }
}

export function loadRiskConfig(): RiskConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (!raw) return DEFAULT_RISK_CONFIG;
    return { ...DEFAULT_RISK_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_RISK_CONFIG;
  }
}

export function saveRiskConfig(config: RiskConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save risk config to localStorage', e);
  }
}

// Export functions for CSV and JSON reports
export function exportToCsv(detections: DetectionRecord[]): void {
  const headers = [
    'Detection ID',
    'Date & Time',
    'Wildlife Category',
    'Subcategory',
    'Location',
    'Zone ID',
    'Movement Status',
    'Distance (m)',
    'Risk Level',
    'Risk Score',
    'Detection Status',
    'Diversion Status',
    'Sensor ID',
    'Confidence (%)',
    'Data Origin',
  ];

  const rows = detections.map((d) => [
    d.id,
    new Date(d.timestamp).toLocaleString(),
    d.wildlifeCategory,
    `"${d.subcategory || ''}"`,
    `"${d.location}"`,
    d.zoneId,
    d.movementStatus,
    d.distanceMeters.toFixed(1),
    d.riskLevel,
    d.riskScore,
    d.detectionStatus,
    d.diversionStatus,
    d.sensorId,
    Math.round(d.confidence * 100),
    d.isSimulated ? 'Simulated Demonstration' : 'Physical Sensor',
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `smart_hospital_wildlife_shield_export_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJson(detections: DetectionRecord[]): void {
  const jsonContent = JSON.stringify(
    {
      system: 'Smart Hospital Wildlife Shield',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      totalRecords: detections.length,
      records: detections,
    },
    null,
    2
  );
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `smart_hospital_wildlife_shield_data_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function resetToDemoData() {
  saveDetections(INITIAL_DETECTIONS);
  saveAlerts(INITIAL_ALERTS);
  saveDiversions(INITIAL_DIVERSIONS);
  saveRiskConfig(DEFAULT_RISK_CONFIG);
}

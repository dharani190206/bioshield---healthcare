export type WildlifeCategory = 'Bird' | 'Bee' | 'Other';

export type MovementStatus = 'Approaching' | 'Stationary' | 'Receding' | 'Erratic' | 'Circling';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type DiversionStatus = 
  | 'Not Required'
  | 'Recommended'
  | 'Simulated Activation'
  | 'Active'
  | 'Completed'
  | 'Suppressed';

export type SystemOperationalStatus = 
  | 'Standby'
  | 'Monitoring'
  | 'Diversion Activated'
  | 'System Error';

export type OperatingMode = 'Automatic' | 'Semi-Autonomous' | 'Manual Override' | 'Test Mode';

export interface HospitalZone {
  id: string;
  name: string;
  code: string;
  sensitivity: 'High' | 'Medium' | 'Low';
  description: string;
  coordinates: { x: number; y: number; width: number; height: number };
  color: string;
  protectedThresholdMeters: number;
}

export interface SensorNode {
  id: string;
  name: string;
  type: 'Optical Edge-AI' | 'Doppler Radar' | 'Acoustic Array' | 'Multi-Sensor Hub';
  zoneId: string;
  location: string;
  status: 'Online' | 'Active Sensing' | 'Calibrating' | 'Offline';
  batteryPercent: number;
  coordinates: { x: number; y: number };
  lastPing: string;
  isSimulated: boolean;
}

export interface DetectionRecord {
  id: string;
  wildlifeCategory: WildlifeCategory;
  subcategory?: string; // e.g. "Rock Pigeon", "European Honeybee", "Gray Squirrel"
  timestamp: string; // ISO string
  location: string;
  zoneId: string;
  movementStatus: MovementStatus;
  distanceMeters: number; // Distance from protected sensitive zone
  detectionStatus: 'Monitoring' | 'Caution Alert' | 'Warning Generated' | 'Resolved';
  riskLevel: RiskLevel;
  riskScore: number; // 0 - 100
  riskReason: string;
  diversionStatus: DiversionStatus;
  recommendedAction: string;
  sensorId: string;
  confidence: number; // 0.0 - 1.0
  isSimulated: boolean;
  reviewed: boolean;
  coordinates?: { x: number; y: number }; // X, Y within hospital map
}

export interface AlertNotification {
  id: string;
  detectionId: string;
  alertType: 'Movement Detected' | 'Zone Intrusion Warning' | 'Risk Level Escalation' | 'Diversion Status Changed' | 'Sensor Health Alert';
  riskLevel: RiskLevel;
  timestamp: string;
  location: string;
  wildlifeCategory: WildlifeCategory;
  distanceMeters: number;
  message: string;
  recommendedAction: string;
  diversionStatus: DiversionStatus;
  isReviewed: boolean;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface DiversionEvent {
  id: string;
  timestamp: string;
  triggerSource: 'Automatic Rule' | 'Staff Manual' | 'Diagnostic Test' | 'Simulated Demonstration';
  location: string;
  targetWildlife: WildlifeCategory;
  method: 'Ultrasonic Bio-Acoustic' | 'Optical Strobe Pulse' | 'Harmless Air/Aroma Deterrent';
  durationSeconds: number;
  status: 'Completed' | 'Aborted' | 'In Progress';
  notes: string;
}

export interface RiskConfig {
  highRiskDistanceThreshold: number; // meters (e.g. <= 5m)
  mediumRiskDistanceThreshold: number; // meters (e.g. <= 15m)
  approachingTrajectoryWeight: number; // weight
  sensitiveZoneMultiplier: number;
  autoDiversionForHighRisk: boolean;
  requireStaffConfirmation: boolean;
  alertSoundEnabled: boolean;
}

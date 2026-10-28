import { WildlifeCategory, MovementStatus, RiskLevel, DiversionStatus, RiskConfig } from '../types';
import { HOSPITAL_ZONES } from './zonesAndSensors';

export interface AssessmentResult {
  riskLevel: RiskLevel;
  riskScore: number; // 0-100
  detectionStatus: 'Monitoring' | 'Caution Alert' | 'Warning Generated' | 'Resolved';
  diversionStatus: DiversionStatus;
  reason: string;
  recommendedAction: string;
  factorBreakdown: {
    proximityScore: number;
    trajectoryScore: number;
    zoneSensitivityScore: number;
    categoryFactorScore: number;
  };
}

export const DEFAULT_RISK_CONFIG: RiskConfig = {
  highRiskDistanceThreshold: 6.0, // meters
  mediumRiskDistanceThreshold: 15.0, // meters
  approachingTrajectoryWeight: 25,
  sensitiveZoneMultiplier: 1.5,
  autoDiversionForHighRisk: true,
  requireStaffConfirmation: false,
  alertSoundEnabled: true,
};

export function evaluateRisk(
  category: WildlifeCategory,
  zoneId: string,
  distanceMeters: number,
  movementStatus: MovementStatus,
  config: RiskConfig = DEFAULT_RISK_CONFIG
): AssessmentResult {
  const zone = HOSPITAL_ZONES.find((z) => z.id === zoneId) || HOSPITAL_ZONES[0];

  // 1. Zone Sensitivity weight
  let zoneScore = 20; // default Low
  if (zone.sensitivity === 'High') {
    zoneScore = 40;
  } else if (zone.sensitivity === 'Medium') {
    zoneScore = 25;
  }

  // 2. Proximity Factor
  // Closer to protected boundary = higher score
  let proximityScore = 10;
  if (distanceMeters <= config.highRiskDistanceThreshold) {
    proximityScore = 35;
  } else if (distanceMeters <= config.mediumRiskDistanceThreshold) {
    proximityScore = 22;
  } else {
    proximityScore = 8;
  }

  // 3. Movement Trajectory
  let trajectoryScore = 5;
  if (movementStatus === 'Approaching') {
    trajectoryScore = 20;
  } else if (movementStatus === 'Erratic' || movementStatus === 'Circling') {
    trajectoryScore = 15;
  } else if (movementStatus === 'Stationary') {
    trajectoryScore = 10;
  } else if (movementStatus === 'Receding') {
    trajectoryScore = 2;
  }

  // 4. Wildlife Category Factor
  // Bees near entrances/pediatric have sting hazard; Birds near ICU air vent have contamination hazard
  let categoryScore = 5;
  if (category === 'Bee' && (zone.id === 'zone-entrance' || zone.id === 'zone-waiting')) {
    categoryScore = 10;
  } else if (category === 'Bird' && (zone.id === 'zone-icu' || zone.id === 'zone-emergency')) {
    categoryScore = 10;
  } else if (category === 'Other') {
    categoryScore = 7;
  }

  const rawScore = Math.min(100, Math.round(zoneScore + proximityScore + trajectoryScore + categoryScore));

  // Determine Classification based on primary criteria matching requirements
  let riskLevel: RiskLevel = 'LOW';
  let detectionStatus: 'Monitoring' | 'Caution Alert' | 'Warning Generated' | 'Resolved' = 'Monitoring';
  let diversionStatus: DiversionStatus = 'Not Required';
  let reason = '';
  let recommendedAction = '';

  // HIGH RISK: Wildlife detected close to a designated sensitive zone
  if (distanceMeters <= config.highRiskDistanceThreshold || rawScore >= 70 || (zone.sensitivity === 'High' && distanceMeters <= 8)) {
    riskLevel = 'HIGH';
    detectionStatus = 'Warning Generated';
    diversionStatus = 'Simulated Activation';
    
    if (category === 'Bird') {
      reason = `Bird detected within critical proximity (${distanceMeters.toFixed(1)}m) of ${zone.name}. Risk of air vent nesting, pathogen feather dander, or structural landing.`;
      recommendedAction = `Immediate safe diversion: Activate ultrasonic bio-acoustic pulse (24 kHz) and optical green strobe on zone emitter to guide bird safely away without harm.`;
    } else if (category === 'Bee') {
      reason = `Bee swarm / activity concentrated at critical distance (${distanceMeters.toFixed(1)}m) from ${zone.name}. Risk of stings to immunocompromised patients, staff, or emergency entrants.`;
      recommendedAction = `Safe diversion protocol: Activate micro-mist botanical lavender/eucalyptus aroma deterrent to safely redirect bees away from hospital doors.`;
    } else {
      reason = `Small wildlife within immediate boundary (${distanceMeters.toFixed(1)}m) of ${zone.name}. Immediate intervention advised.`;
      recommendedAction = `Activate perimeter humane deterrent sound wave and notify hospital facility security.`;
    }
  } 
  // MEDIUM RISK: Wildlife is moving toward a monitored hospital zone
  else if (movementStatus === 'Approaching' || distanceMeters <= config.mediumRiskDistanceThreshold || rawScore >= 40) {
    riskLevel = 'MEDIUM';
    detectionStatus = 'Caution Alert';
    diversionStatus = 'Recommended';
    
    if (category === 'Bird') {
      reason = `Bird is ${movementStatus.toLowerCase()} toward ${zone.name} (${distanceMeters.toFixed(1)}m away). Movement path intersects with sensitive medical zone boundary.`;
      recommendedAction = `Issue caution alert to facility staff. Standby on humane diversion emitters. Continue active tracking for boundary breach.`;
    } else if (category === 'Bee') {
      reason = `Bee trajectory indicates movement toward ${zone.name} (${distanceMeters.toFixed(1)}m away). Potential gathering near doors or waiting patients.`;
      recommendedAction = `Display caution notice on staff terminal. Prepare gentle aromatic diversion if approach continues.`;
    } else {
      reason = `Wildlife moving toward monitored hospital zone. Proximity warning threshold approached.`;
      recommendedAction = `Monitor trajectory on camera feed. Keep diversion system on standby.`;
    }
  } 
  // LOW RISK: Wildlife is detected away from sensitive hospital areas
  else {
    riskLevel = 'LOW';
    detectionStatus = 'Monitoring';
    diversionStatus = 'Not Required';
    
    reason = `Wildlife detected in non-sensitive or open buffer perimeter (${distanceMeters.toFixed(1)}m from ${zone.name}). Movement is ${movementStatus.toLowerCase()} away from sensitive zones.`;
    recommendedAction = `Routine monitoring active. No immediate warning or diversion required. Allow natural wildlife movement in buffer zone.`;
  }

  return {
    riskLevel,
    riskScore: rawScore,
    detectionStatus,
    diversionStatus,
    reason,
    recommendedAction,
    factorBreakdown: {
      proximityScore,
      trajectoryScore,
      zoneSensitivityScore: zoneScore,
      categoryFactorScore: categoryScore,
    },
  };
}

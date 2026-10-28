import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  DetectionRecord,
  AlertNotification,
  DiversionEvent,
  RiskConfig,
  SystemOperationalStatus,
  OperatingMode,
  WildlifeCategory,
  MovementStatus,
  RiskLevel,
} from '../types';
import {
  loadDetections,
  saveDetections,
  loadAlerts,
  saveAlerts,
  loadDiversions,
  saveDiversions,
  loadRiskConfig,
  saveRiskConfig,
  resetToDemoData,
} from '../services/storage';
import { evaluateRisk } from '../services/riskEngine';
import { HOSPITAL_ZONES, SENSOR_NODES } from '../services/zonesAndSensors';
import { soundService } from '../services/sound';

export type NavTab = 'dashboard' | 'monitoring' | 'risk' | 'alerts' | 'history' | 'diversion' | 'hardware';

interface AppContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  detections: DetectionRecord[];
  alerts: AlertNotification[];
  diversions: DiversionEvent[];
  systemStatus: SystemOperationalStatus;
  operatingMode: OperatingMode;
  riskConfig: RiskConfig;
  soundEnabled: boolean;
  autoSimulateLive: boolean;
  activeDiversionCountdown: number | null;
  currentDiversionTarget: string | null;
  addDetection: (params: {
    category: WildlifeCategory;
    subcategory?: string;
    zoneId: string;
    distanceMeters: number;
    movementStatus: MovementStatus;
    customLocation?: string;
  }) => DetectionRecord;
  reviewAlert: (alertId: string, reviewerName?: string) => void;
  reviewAllAlerts: () => void;
  triggerDiversion: (
    targetWildlife: WildlifeCategory,
    location: string,
    method?: 'Ultrasonic Bio-Acoustic' | 'Optical Strobe Pulse' | 'Harmless Air/Aroma Deterrent',
    triggerSource?: 'Automatic Rule' | 'Staff Manual' | 'Diagnostic Test' | 'Simulated Demonstration'
  ) => void;
  abortDiversion: () => void;
  updateRiskConfig: (config: Partial<RiskConfig>) => void;
  setSystemStatus: (status: SystemOperationalStatus) => void;
  setOperatingMode: (mode: OperatingMode) => void;
  toggleSound: () => void;
  toggleAutoSimulateLive: () => void;
  resetData: () => void;
  // Computed helpers
  currentOverallRisk: RiskLevel;
  activeAlertsCount: number;
  highRiskCount: number;
  totalDetectionsCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [detections, setDetections] = useState<DetectionRecord[]>(() => loadDetections());
  const [alerts, setAlerts] = useState<AlertNotification[]>(() => loadAlerts());
  const [diversions, setDiversions] = useState<DiversionEvent[]>(() => loadDiversions());
  const [riskConfig, setRiskConfig] = useState<RiskConfig>(() => loadRiskConfig());
  const [systemStatus, setSystemStatus] = useState<SystemOperationalStatus>('Monitoring');
  const [operatingMode, setOperatingMode] = useState<OperatingMode>('Automatic');
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);
  const [autoSimulateLive, setAutoSimulateLive] = useState<boolean>(false);
  const [activeDiversionCountdown, setActiveDiversionCountdown] = useState<number | null>(null);
  const [currentDiversionTarget, setCurrentDiversionTarget] = useState<string | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    saveDetections(detections);
  }, [detections]);

  useEffect(() => {
    saveAlerts(alerts);
  }, [alerts]);

  useEffect(() => {
    saveDiversions(diversions);
  }, [diversions]);

  useEffect(() => {
    saveRiskConfig(riskConfig);
  }, [riskConfig]);

  // Diversion countdown timer
  useEffect(() => {
    if (activeDiversionCountdown === null) return;
    if (activeDiversionCountdown <= 0) {
      setActiveDiversionCountdown(null);
      setCurrentDiversionTarget(null);
      setSystemStatus('Monitoring');
      return;
    }
    const timer = setTimeout(() => {
      setActiveDiversionCountdown((prev) => (prev !== null && prev > 0 ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [activeDiversionCountdown]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabledState(next);
    soundService.setEnabled(next);
  };

  const toggleAutoSimulateLive = () => {
    setAutoSimulateLive((prev) => !prev);
  };

  const updateRiskConfig = (newCfg: Partial<RiskConfig>) => {
    setRiskConfig((prev) => ({ ...prev, ...newCfg }));
  };

  const abortDiversion = () => {
    setActiveDiversionCountdown(null);
    setCurrentDiversionTarget(null);
    setSystemStatus('Monitoring');
  };

  const triggerDiversion = useCallback(
    (
      targetWildlife: WildlifeCategory,
      location: string,
      method: 'Ultrasonic Bio-Acoustic' | 'Optical Strobe Pulse' | 'Harmless Air/Aroma Deterrent' = 'Ultrasonic Bio-Acoustic',
      triggerSource: 'Automatic Rule' | 'Staff Manual' | 'Diagnostic Test' | 'Simulated Demonstration' = 'Staff Manual'
    ) => {
      soundService.playDiversionSweep();
      setSystemStatus('Diversion Activated');
      setActiveDiversionCountdown(10);
      setCurrentDiversionTarget(`${targetWildlife} near ${location}`);

      const newEvent: DiversionEvent = {
        id: `DIV-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        triggerSource,
        location,
        targetWildlife,
        method,
        durationSeconds: 10,
        status: 'In Progress',
        notes: `Simulated safe diversion protocol executed. Emitting ${method} (100% humane, non-lethal). Target guided safely away from hospital perimeter.`,
      };

      setDiversions((prev) => [newEvent, ...prev]);

      // Automatically mark event completed after 10s
      setTimeout(() => {
        setDiversions((prev) =>
          prev.map((evt) => (evt.id === newEvent.id ? { ...evt, status: 'Completed' } : evt))
        );
      }, 10000);
    },
    []
  );

  const addDetection = useCallback(
    ({
      category,
      subcategory,
      zoneId,
      distanceMeters,
      movementStatus,
      customLocation,
    }: {
      category: WildlifeCategory;
      subcategory?: string;
      zoneId: string;
      distanceMeters: number;
      movementStatus: MovementStatus;
      customLocation?: string;
    }): DetectionRecord => {
      const zone = HOSPITAL_ZONES.find((z) => z.id === zoneId) || HOSPITAL_ZONES[0];
      const sensor = SENSOR_NODES.find((s) => s.zoneId === zoneId) || SENSOR_NODES[0];

      // Calculate risk and action using the rule engine
      const assessment = evaluateRisk(category, zoneId, distanceMeters, movementStatus, riskConfig);

      // Play sound according to risk level
      if (soundEnabled) {
        if (assessment.riskLevel === 'HIGH') soundService.playWarningTone();
        else if (assessment.riskLevel === 'MEDIUM') soundService.playCautionTone();
        else soundService.playLowRiskTone();
      }

      // Generate random coordinate offset around the zone for the map
      const mapX = Math.round(zone.coordinates.x + (Math.random() * 80 - 40));
      const mapY = Math.round(zone.coordinates.y + (Math.random() * 60 - 30));

      const newRecord: DetectionRecord = {
        id: `DET-${Date.now().toString().slice(-6)}`,
        wildlifeCategory: category,
        subcategory:
          subcategory ||
          (category === 'Bird' ? 'Pigeon / Sparrow' : category === 'Bee' ? 'Honeybee Cluster' : 'Small Wildlife'),
        timestamp: new Date().toISOString(),
        location: customLocation || zone.name,
        zoneId: zone.id,
        movementStatus,
        distanceMeters,
        detectionStatus: assessment.detectionStatus,
        riskLevel: assessment.riskLevel,
        riskScore: assessment.riskScore,
        riskReason: assessment.reason,
        diversionStatus: assessment.diversionStatus,
        recommendedAction: assessment.recommendedAction,
        sensorId: sensor.id,
        confidence: +(0.85 + Math.random() * 0.12).toFixed(2),
        isSimulated: true,
        reviewed: assessment.riskLevel === 'LOW',
        coordinates: { x: mapX, y: mapY },
      };

      // Add detection record
      setDetections((prev) => [newRecord, ...prev]);

      // If Medium or High risk, generate an alert notification
      if (assessment.riskLevel !== 'LOW') {
        const newAlert: AlertNotification = {
          id: `ALT-${Date.now().toString().slice(-5)}`,
          detectionId: newRecord.id,
          alertType: assessment.riskLevel === 'HIGH' ? 'Zone Intrusion Warning' : 'Movement Detected',
          riskLevel: assessment.riskLevel,
          timestamp: newRecord.timestamp,
          location: newRecord.location,
          wildlifeCategory: category,
          distanceMeters,
          message: assessment.reason,
          recommendedAction: assessment.recommendedAction,
          diversionStatus: assessment.diversionStatus,
          isReviewed: false,
        };
        setAlerts((prev) => [newAlert, ...prev]);
      }

      // If High Risk and Auto-diversion is enabled, activate simulated safe diversion!
      if (assessment.riskLevel === 'HIGH' && riskConfig.autoDiversionForHighRisk) {
        const method =
          category === 'Bee'
            ? 'Harmless Air/Aroma Deterrent'
            : ('Ultrasonic Bio-Acoustic' as const);
        triggerDiversion(category, zone.name, method, 'Automatic Rule');
      }

      return newRecord;
    },
    [riskConfig, soundEnabled, triggerDiversion]
  );

  const reviewAlert = (alertId: string, reviewerName: string = 'Staff Duty Officer') => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              isReviewed: true,
              reviewedAt: new Date().toISOString(),
              reviewedBy: reviewerName,
            }
          : a
      )
    );
    // Also mark related detection as reviewed
    const alert = alerts.find((a) => a.id === alertId);
    if (alert) {
      setDetections((prev) =>
        prev.map((d) => (d.id === alert.detectionId ? { ...d, reviewed: true } : d))
      );
    }
  };

  const reviewAllAlerts = () => {
    const now = new Date().toISOString();
    setAlerts((prev) =>
      prev.map((a) => ({
        ...a,
        isReviewed: true,
        reviewedAt: now,
        reviewedBy: 'Staff Bulk Acknowledge',
      }))
    );
  };

  const resetData = () => {
    resetToDemoData();
    setDetections(loadDetections());
    setAlerts(loadAlerts());
    setDiversions(loadDiversions());
    setRiskConfig(loadRiskConfig());
    setSystemStatus('Monitoring');
    setActiveDiversionCountdown(null);
  };

  // Live Auto-Simulation Loop (when enabled)
  useEffect(() => {
    if (!autoSimulateLive) return;

    const interval = setInterval(() => {
      // Pick random wildlife, random zone, realistic random distance and movement
      const categories: WildlifeCategory[] = ['Bird', 'Bird', 'Bee', 'Bee', 'Other'];
      const cat = categories[Math.floor(Math.random() * categories.length)];
      const zone = HOSPITAL_ZONES[Math.floor(Math.random() * HOSPITAL_ZONES.length)];
      const movements: MovementStatus[] = ['Approaching', 'Stationary', 'Receding', 'Erratic'];
      const move = movements[Math.floor(Math.random() * movements.length)];
      const dist = +(2.5 + Math.random() * 25).toFixed(1);

      addDetection({
        category: cat,
        zoneId: zone.id,
        distanceMeters: dist,
        movementStatus: move,
      });
    }, 18000); // Trigger every 18 seconds

    return () => clearInterval(interval);
  }, [autoSimulateLive, addDetection]);

  // Computed values
  const activeAlertsCount = alerts.filter((a) => !a.isReviewed).length;
  const highRiskCount = detections.filter((d) => d.riskLevel === 'HIGH').length;
  const totalDetectionsCount = detections.length;

  // Determine current overall risk based on recent active detections
  const recentDetections = detections.slice(0, 5);
  let currentOverallRisk: RiskLevel = 'LOW';
  if (recentDetections.some((d) => d.riskLevel === 'HIGH' && !d.reviewed)) {
    currentOverallRisk = 'HIGH';
  } else if (recentDetections.some((d) => d.riskLevel === 'MEDIUM' && !d.reviewed)) {
    currentOverallRisk = 'MEDIUM';
  }

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        detections,
        alerts,
        diversions,
        systemStatus,
        operatingMode,
        riskConfig,
        soundEnabled,
        autoSimulateLive,
        activeDiversionCountdown,
        currentDiversionTarget,
        addDetection,
        reviewAlert,
        reviewAllAlerts,
        triggerDiversion,
        abortDiversion,
        updateRiskConfig,
        setSystemStatus,
        setOperatingMode,
        toggleSound,
        toggleAutoSimulateLive,
        resetData,
        currentOverallRisk,
        activeAlertsCount,
        highRiskCount,
        totalDetectionsCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

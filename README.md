# Smart Hospital Wildlife Shield
### Wildlife Detection, Risk Prediction and Safe Diversion System

[![React](https://img.shields.io/badge/React-18.3-61dafb.svg?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Humane Standard](https://img.shields.io/badge/Bio--Safety-100%25%20Non--Lethal-emerald.svg)](#humane-non-lethal-diversion-philosophy)

---

## 1. Project Overview

**Smart Hospital Wildlife Shield** is an advanced, responsive web application engineered to monitor, evaluate, and mitigate wildlife intrusions around sensitive healthcare facilities. 

Hospitals feature vulnerable zones—including **ICU sterile air ventilation intakes**, **emergency trauma ambulance bays**, and **outdoor patient waiting areas**—where bird nesting, pathogen dander, or stinging insect swarms (bees and wasps) pose significant healthcare hazards. 

The primary objective of this system is to reduce wildlife-related risks around hospitals by detecting movement, estimating risk levels through explainable multi-factor algorithms, displaying real-time alerts, and activating a humane, safe diversion mechanism without causing any harm to animals.

---

## 2. Key Features & Dashboard Sections

### A. Home Dashboard
- **Executive KPI Cards**: Real-time counters for Total Wildlife Detections, Current Overall Risk Level, Number of Active Alerts, and Diversion Mechanism Status.
- **Perimeter Monitoring Matrix**: Interactive hospital blueprint visualizer showcasing building structures, sensitive zones, multi-sensor gateways (S-01 through S-05), and real-time tracked wildlife vectors.
- **Analytics Visualizations**: Recharts-powered donut charts displaying wildlife species breakdown (Birds vs Bees vs Other) and risk classification distribution.
- **Recent Detection Activity Feed**: Real-time event log with instant 1-click diversion controls.

### B. Wildlife Monitoring
- **Deep Telemetry Stream**: Displays detected wildlife category (Bird, Bee, or Other), exact timestamp, zone location, movement trajectory (Approaching, Stationary, Receding, Erratic), distance from protected zone (in meters), and detection status.
- **Perimeter Map Illustration**: Hospital blueprint with animated radar nodes, floral landscaping, and interactive zone inspections.
- **Multi-Factor Filters**: Filter live feed by species category and movement status.

### C. Risk Prediction Engine
- **Three-Tier Classification Hierarchy**:
  - **LOW RISK (Green)**: Wildlife detected in buffer zones or perimeter healing garden. Routine monitoring active; no warnings required.
  - **MEDIUM RISK (Amber)**: Wildlife moving toward a monitored hospital zone. Caution alert displayed on terminals; diversion emitters primed.
  - **HIGH RISK (Red)**: Wildlife detected within critical proximity (≤ 6.0m) of sensitive hospital zones (e.g., ICU HEPA vents). Prominent warning generated; automatic or manual safe diversion initiated.
- **Explainable Mathematical Model**:
  $$\text{Risk Score} = (\text{ZoneSensitivity} \times 0.40) + (\text{ProximityFactor} \times 0.35) + (\text{MovementTrajectory} \times 0.15) + (\text{SpeciesWeight} \times 0.10)$$
- **Interactive Risk Playground & Rule Tuner**: Adjust proximity thresholds and test simulated scenarios with immediate output prediction.

### D. Alert & Notification System
- **Real-Time Notification Feed**: Alerts generated on movement detection, zone proximity escalations, and diversion status changes.
- **Audio Cue Engine**: Synthesized browser Web Audio API chimes for soft low-risk pings, caution beeps, and high-risk warning alerts.
- **Audit Logging**: Mark alerts as reviewed with reviewer timestamps.
- **Direct Diversion Trigger**: Trigger immediate safe diversion directly from any high-risk notification.

### E. Detection History
- **Search & Multi-Filter Query Engine**: Search by detection ID, location, species name, or notes.
- **Preset Demonstration Records**: Highlighted sample demonstration records matching project requirements:
  - **Record 1**: Bird | Hospital Garden | Low Risk | Monitoring | Diversion: Not Required
  - **Record 2**: Bee | Near Hospital Entrance | Medium Risk | Caution Alert | Diversion: Recommended
  - **Record 3**: Bird | Protected Outdoor Zone | High Risk | Warning Generated | Diversion: Simulated Activation
- **Data Export**: 1-click export to standard **CSV spreadsheet** or **JSON report**.
- **Persistence**: Preserved across browser sessions via LocalStorage.

### F. Safe Diversion Control Panel
- **Status Indicators**: Standby, Monitoring, Diversion Activated, System Error.
- **Operating Modes**: Automatic, Semi-Autonomous, Manual Override, and Diagnostic Test Mode.
- **Humane Non-Lethal Modalities**:
  - **Ultrasonic Bio-Acoustic (22–26 kHz)**: Inaudible to human patients; natural avian discomfort frequency causing birds to safely reroute.
  - **Optical Strobe Pulse (520nm diffuse green LED)**: Harmless visual pulse that discourages perching without dazzling drivers or visitors.
  - **Botanical Aroma Micro-Mist**: Natural lavender and eucalyptus vapors that bees instinctively avoid; 100% hypoallergenic and chemical-free.
- **Simulated Test Cycle**: Interactive 10-second countdown with animated waveform generator and auto-completion logging.

### G. Hardware Integration (ESP32 & Sensors)
- **Microcontroller**: Dual-Core ESP32 Xtensa 32-bit MCU @ 240 MHz.
- **Sensors**: 24GHz mmWave Doppler Radar (RCWL-0516), MEMS Acoustic Microphone with 220Hz FFT wingbeat analysis, and ESP32-CAM edge vision classifier.
- **Live REST API Tester**: Interactive JSON payload dispatcher (`POST /api/v1/telemetry`) that injects real telemetry into the dashboard.
- **Firmware Blueprint**: Complete Arduino C++ firmware template ready to flash onto physical ESP32 boards.

---

## 3. System Workflow (8-Step Cycle)

```
[ STEP 1: Hospital Area Monitoring ]
               │
               ▼
[ STEP 2: Wildlife Movement Detection ] (Doppler Radar / Acoustic / Edge AI)
               │
               ▼
[ STEP 3: Data Processing ] (Species classification, velocity, distance)
               │
               ▼
[ STEP 4: Risk Assessment ] (Rule engine calculates Low / Medium / High)
               │
               ▼
[ STEP 5: Dashboard Update ] (Live map, metrics, and cards refresh)
               │
               ▼
[ STEP 6: Alert Generation ] (Audio chime + notification banner)
               │
               ▼
[ STEP 7: Safe Diversion ] (24kHz ultrasonic pulse / botanical mist)
               │
               ▼
[ STEP 8: History Storage ] (Persisted to LocalStorage + CSV exportable)
```

---

## 4. Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### Installation
```bash
# Clone or navigate to the project directory
cd bioshield

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be accessible at `http://localhost:3000`.

### Building for Production
```bash
npm run build
```
This generates the optimized, production-ready static assets in the `dist/` directory.

---

## 5. Humane & Ecological Compliance

The Smart Hospital Wildlife Shield is built upon strict bio-ethical guidelines:
1. **Zero Lethality**: No poisons, traps, electrical shocks, or structural netting.
2. **Patient Peace of Mind**: Ultrasonic frequencies operate strictly above 22 kHz, ensuring zero audible impact on patients, surgical wards, or medical equipment.
3. **Biodiversity Preservation**: Wildlife in designated green zones (healing courtyard and perimeter trees) is safeguarded and welcomed. Diversion only activates when critical hospital boundaries are breached.

---

## 6. Demonstration & Evaluation Guide

For university evaluations or technical demonstrations:
1. Open the **Home Dashboard** to review overall telemetry.
2. Click **"Simulate Event"** or **"Launch Intrusion Test"** in the top navigation bar.
3. Select **"Record 3: High Risk"** to observe:
   - Warning generated on dashboard
   - Real-time intrusion on the hospital map near the ICU Air Vent
   - Audio warning chime
   - Automatic simulated safe diversion cycle (10s countdown)
   - Diversion history log entry
4. Switch to **Detection History** to verify prompt sample records and test the **Export CSV** feature.
5. Open **Hardware Integration** to inspect the ESP32 firmware and dispatch custom REST payloads.

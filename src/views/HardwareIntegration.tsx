import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SimulatedBanner } from '../components/common/SimulatedBanner';
import { SENSOR_NODES, HOSPITAL_ZONES } from '../services/zonesAndSensors';
import {
  Cpu,
  Radio,
  Wifi,
  Terminal,
  Send,
  Code2,
  CheckCircle2,
  Layers,
  ArrowRight,
  Shield,
  Eye,
  Sliders,
  Sparkles,
} from 'lucide-react';

export const HardwareIntegrationView: React.FC = () => {
  const { addDetection } = useApp();

  const [selectedSensorId, setSelectedSensorId] = useState<string>('NODE-S01');
  const [jsonPayload, setJsonPayload] = useState<string>(
    JSON.stringify(
      {
        deviceId: 'ESP32-BIO-01',
        firmwareVersion: 'v2.4.1-rc3',
        nodeId: 'NODE-S01',
        zoneId: 'zone-icu',
        sensorType: 'Microwave Radar + Optical Edge-AI',
        telemetry: {
          movementDetected: true,
          wildlifeCategory: 'Bird',
          subcategory: 'Pigeon (Columba livia)',
          distanceMeters: 4.1,
          movementStatus: 'Approaching',
          velocityMs: 3.2,
          confidence: 0.96,
          ambientLux: 420,
          rssi: -64,
          batteryVoltage: 3.92,
        },
        timestamp: new Date().toISOString(),
      },
      null,
      2
    )
  );

  const [testResult, setTestResult] = useState<string | null>(null);

  const handleSendPacket = () => {
    try {
      const parsed = JSON.parse(jsonPayload);
      const cat = parsed.telemetry?.wildlifeCategory || 'Bird';
      const zone = parsed.zoneId || 'zone-icu';
      const dist = parsed.telemetry?.distanceMeters || 5.0;
      const move = parsed.telemetry?.movementStatus || 'Approaching';
      const sub = parsed.telemetry?.subcategory || 'ESP32 Detection';

      addDetection({
        category: cat,
        subcategory: sub,
        zoneId: zone,
        distanceMeters: dist,
        movementStatus: move,
        customLocation: `Node ${parsed.nodeId || 'ESP32'} (${zone})`,
      });

      setTestResult(`HTTP 200 OK: Ingested telemetry packet from ${parsed.deviceId}. Risk assessed & dashboard updated.`);
      setTimeout(() => setTestResult(null), 4000);
    } catch (e: any) {
      setTestResult(`Error parsing JSON payload: ${e.message}`);
    }
  };

  const sampleArduinoCode = `/*
 * Smart Hospital Wildlife Shield - ESP32 Edge Sensor Firmware
 * Hardware: ESP32 DevKit v1 + RCWL-0516 Radar + MEMS Mic (I2S) + Ultrasonic Piezo Emitter
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid     = "HOSPITAL_IOT_SECURE";
const char* password = "HOSPITAL_IOT_PASS";
const char* serverUrl = "https://hospital-wildlife-shield.local/api/v1/telemetry";

#define RADAR_PIN 14        // Microwave Doppler Movement Pin
#define PIEZO_PWM_PIN 25    // Ultrasonic Transducer PWM
#define GREEN_LED_PIN 33    // Strobe Indicator

void setup() {
  Serial.begin(115200);
  pinMode(RADAR_PIN, INPUT);
  pinMode(PIEZO_PWM_PIN, OUTPUT);
  pinMode(GREEN_LED_PIN, OUTPUT);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nWiFi Connected. IP: " + WiFi.localIP().toString());
}

void loop() {
  int movement = digitalRead(RADAR_PIN);
  if (movement == HIGH) {
    Serial.println("Movement detected by Doppler Radar. Sampling classification...");
    sendTelemetryPacket("Bird", 4.5, "Approaching");
    delay(3000); // Debounce
  }
  delay(100);
}

void sendTelemetryPacket(const char* category, float distance, const char* movement) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<256> doc;
    doc["deviceId"] = "ESP32-BIO-01";
    doc["nodeId"] = "NODE-S01";
    doc["zoneId"] = "zone-icu";
    doc["telemetry"]["wildlifeCategory"] = category;
    doc["telemetry"]["distanceMeters"] = distance;
    doc["telemetry"]["movementStatus"] = movement;

    String requestBody;
    serializeJson(doc, requestBody);
    int httpResponseCode = http.POST(requestBody);
    Serial.printf("Telemetry HTTP Response: %d\\n", httpResponseCode);
    http.end();
  }
}`;

  return (
    <div className="space-y-6 pb-12">
      <SimulatedBanner />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Section 8 • Hardware Integration Architecture
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Microcontroller & Sensor Network Interface
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Specifications for ESP32 nodes, Doppler radars, acoustic wingbeat analyzers, and ultrasonic emitters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-slate-900 text-sky-400 border border-slate-700 flex items-center gap-1.5 shadow-2xs">
            <Wifi className="w-3.5 h-3.5" />
            <span>MQTT / REST Ready</span>
          </span>
        </div>
      </div>

      {/* Physical Hardware Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Component 1: ESP32 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">ESP32 Dual-Core MCU</h3>
            <p className="text-xs text-slate-500 mt-0.5">Primary Node Gateway</p>
          </div>
          <ul className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
            <li>• Xtensa 32-bit LX6 @ 240 MHz</li>
            <li>• Built-in 802.11 b/g/n Wi-Fi & BLE</li>
            <li>• Real-time FFT spectral wingbeat analysis</li>
            <li>• Low-power deep sleep mode</li>
          </ul>
        </div>

        {/* Component 2: Motion Sensors */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">24GHz Doppler Radar</h3>
            <p className="text-xs text-slate-500 mt-0.5">Microwave Motion Sensor</p>
          </div>
          <ul className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
            <li>• RCWL-0516 / mmWave Radar</li>
            <li>• Detects movement through weather/mist</li>
            <li>• Velocity & vector calculation</li>
            <li>• Up to 25m perimeter coverage</li>
          </ul>
        </div>

        {/* Component 3: Acoustic / Edge AI */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Acoustic & Vision Edge</h3>
            <p className="text-xs text-slate-500 mt-0.5">Species Discrimination</p>
          </div>
          <ul className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
            <li>• MEMS Mic (220 Hz bee frequency filter)</li>
            <li>• ESP32-CAM quantized Tiny-YOLO model</li>
            <li>• Distinction: Bird vs Bee vs Stray Mammal</li>
            <li>• Avoids false triggers from foliage/leaves</li>
          </ul>
        </div>

        {/* Component 4: Safe Diversion Emitter */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Humane Bio-Emitter</h3>
            <p className="text-xs text-slate-500 mt-0.5">Safe Non-Lethal Hardware</p>
          </div>
          <ul className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
            <li>• Piezoelectric ultrasonic horns (24 kHz)</li>
            <li>• High-efficiency diffuse 520nm green LED</li>
            <li>• Micro-solenoid botanical vapor nozzle</li>
            <li>• Zero injury risk to animals or humans</li>
          </ul>
        </div>
      </div>

      {/* Sensor Node Deployment Status */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-base">Registered Hospital Sensor Nodes (5 Gateways)</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Field Topology</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {SENSOR_NODES.map((sensor) => {
            const isSelected = selectedSensorId === sensor.id;

            return (
              <div
                key={sensor.id}
                onClick={() => setSelectedSensorId(sensor.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-500 shadow-2xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-slate-800">{sensor.id}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping-slow" />
                </div>
                <div className="font-semibold text-slate-800 text-xs mt-1.5">{sensor.name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{sensor.type}</div>
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Bat: {sensor.batteryPercent}%</span>
                  <span className="text-emerald-600 font-semibold">{sensor.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive REST API Webhook Simulator & Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive REST API Payload Tester */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-base">Live REST API Endpoint Tester</h3>
              </div>
              <span className="text-xs font-mono text-slate-500">POST /api/v1/telemetry</span>
            </div>

            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              When physical ESP32 sensors are deployed, they transmit JSON telemetry packets over Wi-Fi/MQTT. You can edit and dispatch simulated payloads below to test end-to-end ingestion!
            </p>

            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1 font-semibold text-slate-700">
                <span>Payload Body (JSON):</span>
                <span className="text-[11px] text-slate-400 font-mono">application/json</span>
              </div>
              <textarea
                value={jsonPayload}
                onChange={(e) => setJsonPayload(e.target.value)}
                rows={12}
                className="w-full text-xs font-mono p-3 rounded-xl border border-slate-300 bg-slate-900 text-emerald-400 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-normal"
              />
            </div>
          </div>

          <div className="pt-2">
            {testResult && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold mb-3 ${
                  testResult.startsWith('HTTP 200')
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {testResult}
              </div>
            )}

            <button
              onClick={handleSendPacket}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Dispatch Payload to Live Dashboard</span>
            </button>
          </div>
        </div>

        {/* Embedded ESP32 C++ / Arduino Code Reference */}
        <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-white text-base">ESP32 Firmware Blueprint</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400">sensor_node.ino</span>
            </div>

            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Compatible C++ source template for Arduino IDE / PlatformIO to flash onto physical ESP32 sensor nodes.
            </p>

            <pre className="mt-3 text-[11px] font-mono p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 overflow-x-auto max-h-80 leading-relaxed">
              <code>{sampleArduinoCode}</code>
            </pre>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Baud Rate: 115200</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Hardware Flashing
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

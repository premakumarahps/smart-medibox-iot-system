import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Sun, 
  Thermometer, 
  Droplets, 
  Compass, 
  RotateCw, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  Send, 
  Radio, 
  Terminal, 
  Sparkles,
  RefreshCw,
  Info
} from 'lucide-react';
import { 
  simulateMedibox, 
  MediboxInputParams, 
  PRESET_CONFIGS 
} from '../core/mediboxPhysics';
import { MathView } from './MathView';
import { MQTT_TOPICS } from '../core/mediboxData';

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const DashboardSimulator: React.FC = () => {
  // State for user inputs
  const [rawLeft, setRawLeft] = useState<number>(2000);
  const [rawRight, setRawRight] = useState<number>(400); // 400 is high light since 32 is max lux, 4064 is pitch black
  const [tempC, setTempC] = useState<number>(28.5);
  const [humidity, setHumidity] = useState<number>(68);
  const [preset, setPreset] = useState<'tablet_a' | 'tablet_b' | 'tablet_c' | 'custom'>('tablet_a');
  const [customTheta, setCustomTheta] = useState<number>(45);
  const [customFactor, setCustomFactor] = useState<number>(0.6);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [autoRotateSun, setAutoRotateSun] = useState<boolean>(false);

  // Telemetry history for rolling strip charts
  const [timeLabels, setTimeLabels] = useState<string[]>([]);
  const [historyTemp, setHistoryTemp] = useState<number[]>([]);
  const [historyHumidity, setHistoryHumidity] = useState<number[]>([]);
  const [historyLight, setHistoryLight] = useState<number[]>([]);
  const [historyAngle, setHistoryAngle] = useState<number[]>([]);

  // Simulation calculation
  const sim = simulateMedibox({
    rawLdrLeft: rawLeft,
    rawLdrRight: rawRight,
    temperatureC: tempC,
    humidityPercent: humidity,
    medicationPreset: preset,
    customThetaOffset: customTheta,
    customControllingFactor: customFactor
  });

  // Automatic Sun Movement Simulation
  useEffect(() => {
    if (!autoRotateSun) return;
    const interval = setInterval(() => {
      setRawLeft((prev) => {
        const next = prev + Math.floor((Math.random() - 0.5) * 300);
        return Math.max(80, Math.min(3900, next));
      });
      setRawRight((prev) => {
        const next = prev + Math.floor((Math.random() - 0.5) * 300);
        return Math.max(80, Math.min(3900, next));
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [autoRotateSun]);

  // Rolling Chart Updates
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setTimeLabels((prev) => [...prev.slice(-14), timeStr]);
      setHistoryTemp((prev) => [...prev.slice(-14), tempC]);
      setHistoryHumidity((prev) => [...prev.slice(-14), humidity]);
      setHistoryLight((prev) => [...prev.slice(-14), sim.highestLightIntensity]);
      setHistoryAngle((prev) => [...prev.slice(-14), sim.servoAngle]);
    }, 2000);

    return () => clearInterval(interval);
  }, [tempC, humidity, sim.highestLightIntensity, sim.servoAngle]);

  // Audio tone generation for simulated alarm buzzer (GPIO 5)
  useEffect(() => {
    if (!soundEnabled) return;
    const isAlarmActive = !sim.isTempSafe || !sim.isHumiditySafe;
    if (isAlarmActive) {
      try {
        const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime); // 440 Hz (Note A4 from Arduino melody array)
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } catch {
        // audio might be blocked without direct interaction
      }
    }
  }, [sim.isTempSafe, sim.isHumiditySafe, soundEnabled]);

  // Preset switch handler
  const handlePresetChange = (newPreset: typeof preset) => {
    setPreset(newPreset);
    if (newPreset !== 'custom') {
      setCustomTheta(PRESET_CONFIGS[newPreset].thetaOffset);
      setCustomFactor(PRESET_CONFIGS[newPreset].controllingFactor);
    }
  };

  // Chart data definition
  const chartData = {
    labels: timeLabels.length > 0 ? timeLabels : ['00:00', '00:02', '00:04', '00:06', '00:08'],
    datasets: [
      {
        label: 'Temp (°C)',
        data: historyTemp.length > 0 ? historyTemp : [28, 28.2, 28.5, 28.4, 28.5],
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        yAxisID: 'yTemp',
        tension: 0.35,
        fill: true,
      },
      {
        label: 'Humidity (%)',
        data: historyHumidity.length > 0 ? historyHumidity : [65, 66, 68, 67, 68],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        yAxisID: 'yHumidity',
        tension: 0.35,
      },
      {
        label: 'Servo Angle (°)',
        data: historyAngle.length > 0 ? historyAngle : [90, 105, 125, 120, 125],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.05)',
        yAxisID: 'yAngle',
        tension: 0.35,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 400 },
    plugins: {
      legend: {
        labels: {
          color: '#94a3b8',
          font: { size: 11, family: 'Inter' }
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#e2e8f0',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        ticks: { color: '#64748b', font: { size: 10 } },
        grid: { color: 'rgba(51, 65, 85, 0.25)' }
      },
      yTemp: {
        type: 'linear' as const,
        position: 'left' as const,
        min: 20,
        max: 40,
        ticks: { color: '#06b6d4', font: { size: 10 } },
        grid: { color: 'rgba(51, 65, 85, 0.2)' },
        title: { display: true, text: 'Temp (°C)', color: '#06b6d4', font: { size: 10 } }
      },
      yHumidity: {
        type: 'linear' as const,
        position: 'right' as const,
        min: 40,
        max: 100,
        ticks: { color: '#10b981', font: { size: 10 } },
        grid: { display: false },
        title: { display: true, text: 'RH (%)', color: '#10b981', font: { size: 10 } }
      },
      yAngle: {
        type: 'linear' as const,
        position: 'right' as const,
        min: 0,
        max: 180,
        ticks: { color: '#f59e0b', font: { size: 10 } },
        grid: { display: false },
        title: { display: false }
      }
    }
  };

  return (
    <section className="py-12 bg-slate-950/60 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>Interactive Telemetry Engine</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">Replicating Node-RED & Wokwi</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              IoT Shading & Climate Dashboard
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Simulate light irradiance hitting the dual LDR sensors, adjust climate chambers, and observe how the ESP32 calculates servo shading angles via the governing physics model.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoRotateSun(!autoRotateSun)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                autoRotateSun
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${autoRotateSun ? 'animate-spin' : ''}`} />
              <span>{autoRotateSun ? 'Auto-Sun Active' : 'Auto-Sun Orbit'}</span>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                soundEnabled
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{soundEnabled ? 'Buzzer Melodies ON' : 'Buzzer Muted'}</span>
            </button>
          </div>
        </div>

        {/* Master Grid: Controls + Visual Gauges */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: Input Controllers & Medication Presets (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Medication Preset Selector Box */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  Node-RED Inbound Parameter
                </span>
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Medication Sensitivity Preset</h3>
              <p className="text-xs text-slate-400 mb-4">
                Sets default baseline angle <span className="font-mono text-cyan-300">\theta_{'{offset}'}</span> and sensitivity factor <span className="font-mono text-emerald-300">\gamma_{'{ctrl}'}</span>.
              </p>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {(['tablet_a', 'tablet_b', 'tablet_c', 'custom'] as const).map((p) => {
                  const isActive = preset === p;
                  return (
                    <button
                      key={p}
                      onClick={() => handlePresetChange(p)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/60 shadow-md shadow-cyan-500/20'
                          : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="capitalize">{p.replace('_', ' ')}</span>
                        {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {p !== 'custom' 
                          ? `${PRESET_CONFIGS[p].thetaOffset}°, CF: ${PRESET_CONFIGS[p].controllingFactor}`
                          : 'Manual Sliders'}
                      </div>
                    </button>
                  );
                })}
              </div>

              {preset !== 'custom' ? (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                  <span className="font-bold text-cyan-300">{PRESET_CONFIGS[preset].name}: </span>
                  {PRESET_CONFIGS[preset].description}
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Minimum Angle (<span className="text-cyan-400 font-mono">\theta_{'{offset}'}</span>)</span>
                      <span className="font-mono text-cyan-400 font-bold">{customTheta}°</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={120}
                      step={1}
                      value={customTheta}
                      onChange={(e) => setCustomTheta(Number(e.target.value))}
                      className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Controlling Factor (<span className="text-emerald-400 font-mono">\gamma_{'{ctrl}'}</span>)</span>
                      <span className="font-mono text-emerald-400 font-bold">{customFactor.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={customFactor}
                      onChange={(e) => setCustomFactor(Number(e.target.value))}
                      className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Light Sensors Input Card */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                  Dual-LDR Physical Inputs
                </span>
                <Sun className="w-4 h-4 text-amber-400" />
              </div>

              {/* Left LDR */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-300 font-medium">Left LDR (GPIO 35)</span>
                  <span className="font-mono text-amber-300">
                    Raw: {rawLeft} ADC | <strong className="text-white">Norm: {sim.normalizedLightLeft.toFixed(2)}</strong>
                  </span>
                </div>
                <input
                  type="range"
                  min={32}
                  max={4064}
                  value={rawLeft}
                  onChange={(e) => setRawLeft(Number(e.target.value))}
                  className="w-full accent-amber-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                  <span>Bright (32 ADC)</span>
                  <span>Dark (4064 ADC)</span>
                </div>
              </div>

              {/* Right LDR */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-300 font-medium">Right LDR (GPIO 32)</span>
                  <span className="font-mono text-amber-300">
                    Raw: {rawRight} ADC | <strong className="text-white">Norm: {sim.normalizedLightRight.toFixed(2)}</strong>
                  </span>
                </div>
                <input
                  type="range"
                  min={32}
                  max={4064}
                  value={rawRight}
                  onChange={(e) => setRawRight(Number(e.target.value))}
                  className="w-full accent-amber-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                  <span>Bright (32 ADC)</span>
                  <span>Dark (4064 ADC)</span>
                </div>
              </div>

              {/* Quick Preset Buttons for Sunlight Angles */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-2">Simulate Solar Angles:</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => { setRawLeft(350); setRawRight(3200); }}
                    className="px-2 py-1.5 rounded-lg text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                  >
                    Direct Left
                  </button>
                  <button
                    onClick={() => { setRawLeft(800); setRawRight(800); }}
                    className="px-2 py-1.5 rounded-lg text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                  >
                    Zenith Noon
                  </button>
                  <button
                    onClick={() => { setRawLeft(3200); setRawRight(350); }}
                    className="px-2 py-1.5 rounded-lg text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                  >
                    Direct Right
                  </button>
                </div>
              </div>
            </div>

            {/* Climate Inputs Card */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  DHT22 Sensor Ingestion (GPIO 12)
                </span>
                <Thermometer className="w-4 h-4 text-cyan-400" />
              </div>

              {/* Temperature Slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-300 font-medium">Temperature</span>
                  <span className={`font-mono font-bold ${
                    sim.isTempSafe ? 'text-cyan-400' : 'text-rose-400 animate-pulse'
                  }`}>
                    {tempC.toFixed(1)} °C {sim.tempStatus !== 'Normal' && `(${sim.tempStatus})`}
                  </span>
                </div>
                <input
                  type="range"
                  min={18}
                  max={42}
                  step={0.5}
                  value={tempC}
                  onChange={(e) => setTempC(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                  <span>18 °C</span>
                  <span className="text-emerald-400 font-bold">Safe: 26°C – 32°C</span>
                  <span>42 °C</span>
                </div>
              </div>

              {/* Humidity Slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-300 font-medium">Relative Humidity</span>
                  <span className={`font-mono font-bold ${
                    sim.isHumiditySafe ? 'text-emerald-400' : 'text-rose-400 animate-pulse'
                  }`}>
                    {humidity} % {sim.humidityStatus !== 'Normal' && `(${sim.humidityStatus})`}
                  </span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={100}
                  step={1}
                  value={humidity}
                  onChange={(e) => setHumidity(Number(e.target.value))}
                  className="w-full accent-emerald-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                  <span>40 %</span>
                  <span className="text-emerald-400 font-bold">Safe: 60% – 80%</span>
                  <span>100 %</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Node-RED Gauges + Interactive Servo Louver SVG (8 Cols) */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* Top Stat Banner: Dominant Light & Active Servo Angle */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-xl flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Dominant Sun Vector</div>
                  <div className="text-lg font-black text-white flex items-center gap-1.5">
                    <span>{sim.dominantLightSource} Side</span>
                    <span className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      Factor: {sim.directionFactor}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/40 shadow-xl flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <RotateCw className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Calculated Servo Angle</div>
                  <div className="text-2xl font-black text-cyan-400">
                    {sim.servoAngle}° <span className="text-xs font-normal text-slate-400">/ 180°</span>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border shadow-xl flex items-center gap-3 transition-colors ${
                sim.isTempSafe && sim.isHumiditySafe 
                  ? 'bg-slate-900/90 border-emerald-500/40 text-emerald-300' 
                  : 'bg-rose-950/40 border-rose-500/60 text-rose-300 animate-pulse'
              }`}>
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${
                  sim.isTempSafe && sim.isHumiditySafe 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                    : 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                }`}>
                  {sim.isTempSafe && sim.isHumiditySafe ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <AlertTriangle className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Chamber Biosafety</div>
                  <div className="text-sm font-bold">
                    {sim.isTempSafe && sim.isHumiditySafe ? 'Normal Storage Bounds' : 'Alarm Active: Out of Spec'}
                  </div>
                </div>
              </div>

            </div>

            {/* 4 Radial Gauges in Node-RED Style */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Live Node-RED UI Gauge Replicas
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400">Broker: test.mosquitto.org:1883</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                
                {/* Gauge 1: Temperature */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center">
                  <div className="text-[11px] font-mono text-slate-400 mb-1">Temperature</div>
                  <div className="relative w-28 h-20 mx-auto">
                    <svg viewBox="0 0 100 60" className="w-full h-full">
                      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
                      <path 
                        d="M 10 50 A 40 40 0 0 1 90 50" 
                        fill="none" 
                        stroke={sim.isTempSafe ? "#06b6d4" : "#f43f5e"} 
                        strokeWidth="10" 
                        strokeLinecap="round" 
                        strokeDasharray="125.6"
                        strokeDashoffset={125.6 * (1 - Math.max(0, Math.min(1, (tempC - 18) / 24)))}
                        className="transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute inset-x-0 bottom-0 text-center">
                      <span className="text-base font-black text-white font-mono">{tempC.toFixed(1)}</span>
                      <span className="text-[10px] text-slate-400">°C</span>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-1">26°C - 32°C Safe</div>
                </div>

                {/* Gauge 2: Humidity */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center">
                  <div className="text-[11px] font-mono text-slate-400 mb-1">Humidity</div>
                  <div className="relative w-28 h-20 mx-auto">
                    <svg viewBox="0 0 100 60" className="w-full h-full">
                      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
                      <path 
                        d="M 10 50 A 40 40 0 0 1 90 50" 
                        fill="none" 
                        stroke={sim.isHumiditySafe ? "#10b981" : "#f43f5e"} 
                        strokeWidth="10" 
                        strokeLinecap="round" 
                        strokeDasharray="125.6"
                        strokeDashoffset={125.6 * (1 - Math.max(0, Math.min(1, (humidity - 40) / 60)))}
                        className="transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute inset-x-0 bottom-0 text-center">
                      <span className="text-base font-black text-white font-mono">{humidity}</span>
                      <span className="text-[10px] text-slate-400">%</span>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-1">60% - 80% Safe</div>
                </div>

                {/* Gauge 3: Left Light */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center">
                  <div className="text-[11px] font-mono text-slate-400 mb-1">Left Light</div>
                  <div className="relative w-28 h-20 mx-auto">
                    <svg viewBox="0 0 100 60" className="w-full h-full">
                      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
                      <path 
                        d="M 10 50 A 40 40 0 0 1 90 50" 
                        fill="none" 
                        stroke="#f59e0b" 
                        strokeWidth="10" 
                        strokeLinecap="round" 
                        strokeDasharray="125.6"
                        strokeDashoffset={125.6 * (1 - sim.normalizedLightLeft)}
                        className="transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute inset-x-0 bottom-0 text-center">
                      <span className="text-base font-black text-white font-mono">{sim.normalizedLightLeft.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-1">GPIO 35 ADC</div>
                </div>

                {/* Gauge 4: Right Light */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center">
                  <div className="text-[11px] font-mono text-slate-400 mb-1">Right Light</div>
                  <div className="relative w-28 h-20 mx-auto">
                    <svg viewBox="0 0 100 60" className="w-full h-full">
                      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
                      <path 
                        d="M 10 50 A 40 40 0 0 1 90 50" 
                        fill="none" 
                        stroke="#f59e0b" 
                        strokeWidth="10" 
                        strokeLinecap="round" 
                        strokeDasharray="125.6"
                        strokeDashoffset={125.6 * (1 - sim.normalizedLightRight)}
                        className="transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute inset-x-0 bottom-0 text-center">
                      <span className="text-base font-black text-white font-mono">{sim.normalizedLightRight.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-1">GPIO 32 ADC</div>
                </div>

              </div>

              {/* Node-RED Text Box: Message for Max Light Side */}
              <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    MQTT Payload
                  </span>
                  <span className="text-slate-300">
                    <strong className="text-white">Light is strongest on the:</strong>{' '}
                    <span className="text-amber-400 font-bold underline">{sim.dominantLightSource}</span>
                  </span>
                </div>
                <div className="text-slate-400 font-mono">
                  Peak Intensity: <span className="text-white font-bold">{sim.highestLightIntensity.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Interactive SVG Diagram: Motorized Shading Louvre & Servo Window */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Physical SG90 Servo Shading Mechanics</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Mechanical response to sunlight: servo louvres pivot from 0° (clear) to 180° (full occlusion).
                  </p>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-cyan-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span>Light Shielded:</span>
                  <span className="font-bold text-emerald-400">{sim.lightBlockPercentage}%</span>
                </div>
              </div>

              {/* Graphical Representation */}
              <div className="relative w-full h-64 bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center p-4">
                
                {/* Sunlight Rays on Left and Right */}
                <div 
                  className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 transition-opacity duration-300"
                  style={{ opacity: Math.max(0.2, sim.normalizedLightLeft) }}
                >
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/30">
                    <Sun className="w-6 h-6 animate-spin" style={{ animationDuration: '10s' }} />
                  </div>
                  <span className="text-[10px] font-mono text-amber-300">Left LDR</span>
                </div>

                <div 
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 transition-opacity duration-300"
                  style={{ opacity: Math.max(0.2, sim.normalizedLightRight) }}
                >
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/30">
                    <Sun className="w-6 h-6 animate-spin" style={{ animationDuration: '10s' }} />
                  </div>
                  <span className="text-[10px] font-mono text-amber-300">Right LDR</span>
                </div>

                {/* Central Medibox Cross-Section */}
                <svg viewBox="0 0 400 200" className="w-full max-w-md h-full">
                  {/* Outer Chamber Enclosure */}
                  <rect x="70" y="30" width="260" height="140" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                  
                  {/* Shading Window Aperture */}
                  <rect x="110" y="45" width="180" height="60" rx="6" fill="#020617" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="4 2" />

                  {/* Dynamic Shading Louvres rotated by sim.servoAngle */}
                  {[0, 1, 2, 3, 4, 5].map((idx) => {
                    const louverX = 125 + idx * 28;
                    const rotationDeg = (sim.servoAngle / 180) * 85; // 0 deg open, 85 deg closed flat
                    return (
                      <g key={idx} transform={`translate(${louverX}, 75)`}>
                        <rect
                          x="-12"
                          y="-3"
                          width="26"
                          height="6"
                          rx="2"
                          fill="#38bdf8"
                          transform={`rotate(${rotationDeg})`}
                          className="transition-transform duration-300"
                          style={{ transformOrigin: '0 0' }}
                        />
                        <circle cx="0" cy="0" r="2.5" fill="#f8fafc" />
                      </g>
                    );
                  })}

                  {/* Motor Gear & Arm Linkage */}
                  <circle cx="310" cy="75" r="14" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                  <line 
                    x1="310" 
                    y1="75" 
                    x2={310 + 12 * Math.cos((sim.servoAngle * Math.PI) / 180)} 
                    y2={75 - 12 * Math.sin((sim.servoAngle * Math.PI) / 180)} 
                    stroke="#f59e0b" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                  />

                  {/* Medicine Pills Inside Chamber */}
                  <g transform="translate(160, 130)">
                    {/* Blister pack or pill container */}
                    <rect x="0" y="0" width="80" height="24" rx="4" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
                    <circle cx="15" cy="12" r="5" fill="#ec4899" />
                    <circle cx="32" cy="12" r="5" fill="#38bdf8" />
                    <circle cx="49" cy="12" r="5" fill="#a855f7" />
                    <circle cx="66" cy="12" r="5" fill="#34d399" />
                    <text x="40" y="-5" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                      Photodegradable Stock
                    </text>
                  </g>

                  {/* Internal Lux indicator */}
                  <text x="200" y="105" fill="#38bdf8" fontSize="10" textAnchor="middle" fontFamily="monospace">
                    Internal Lux: ~{sim.internalLux} lx
                  </text>
                </svg>

                {/* Floating Servo Angle Badge */}
                <div className="absolute bottom-3 right-4 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700 text-[10px] font-mono text-slate-300">
                  SG90 Angle: <span className="text-amber-400 font-bold">{sim.servoAngle}°</span>
                </div>
              </div>

              {/* Governing Physics Equation Display */}
              <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                <div className="text-slate-400 font-semibold mb-1">
                  Active Mathematical Formulation (<code className="text-cyan-300">Main_program.ino:595</code>):
                </div>
                <div className="text-center py-2 overflow-x-auto text-slate-200">
                  <MathView latex={`\\theta = \\min\\Big(180, \\, ${sim.thetaOffset}^\\circ \\cdot ${sim.directionFactor} + (180^\\circ - ${sim.thetaOffset}^\\circ) \\cdot ${sim.highestLightIntensity} \\cdot ${sim.controllingFactor}\\Big) = ${sim.servoAngle}^\\circ`} />
                </div>
              </div>
            </div>

            {/* Real-time Rolling Telemetry Chart */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Live Strip-Chart Telemetry (Time-Domain Stream)
                </h3>
                <span className="text-xs font-mono text-cyan-400">Sample Frequency: 0.5 Hz</span>
              </div>
              <div className="h-56 w-full">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>

          </div>

        </div>

        {/* MQTT Topics Monitor Terminal */}
        <div className="mt-8 p-6 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white font-mono">
                MQTT Telemetry Stream Monitor (test.mosquitto.org)
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
              QoS 2 Connected • ESP32Client-465456464S645
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {MQTT_TOPICS.map((t, idx) => {
              // Derive live value if matches simulated parameter
              let liveVal = t.payloadExample;
              if (t.topic.includes('tempurature')) liveVal = tempC.toFixed(2);
              else if (t.topic.includes('humidity')) liveVal = humidity.toFixed(2);
              else if (t.topic.includes('light_intensity/left')) liveVal = sim.normalizedLightLeft.toFixed(2);
              else if (t.topic.includes('light_intensity/right')) liveVal = sim.normalizedLightRight.toFixed(2);
              else if (t.topic.includes('light_intensity/max/source')) liveVal = sim.dominantLightSource;
              else if (t.topic.includes('light_intensity/max')) liveVal = sim.highestLightIntensity.toFixed(2);
              else if (t.topic.includes('angle/min')) liveVal = sim.thetaOffset.toString();
              else if (t.topic.includes('controlling_factor')) liveVal = sim.controllingFactor.toFixed(2);
              else if (t.topic.includes('medication_preset')) liveVal = preset;

              return (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-slate-400 text-[10px] truncate max-w-[200px]" title={t.topic}>
                      {t.topic}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                      t.direction.includes('ESP32') 
                        ? 'bg-cyan-500/20 text-cyan-300' 
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {t.direction.includes('ESP32') ? 'PUB' : 'SUB'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[11px] text-slate-400">{t.purpose}</span>
                    <span className="font-mono font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {liveVal}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

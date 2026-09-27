import React, { useState } from 'react';
import { 
  Layers, 
  ExternalLink, 
  Cpu, 
  Wifi, 
  Sun, 
  Thermometer, 
  Bell, 
  CheckCircle2, 
  ArrowRight, 
  FileCode, 
  Play, 
  Sparkles,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { PHASE_COMPARISONS } from '../core/mediboxData';

interface TwoPhasesExplorerProps {
  setActiveTab: (tab: string) => void;
}

export const TwoPhasesExplorer: React.FC<TwoPhasesExplorerProps> = ({ setActiveTab }) => {
  const [selectedPhase, setSelectedPhase] = useState<'both' | 'phase1' | 'phase2'>('both');

  return (
    <section className="py-12 bg-slate-950/40 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Evolutionary Engineering Methodology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Two-Phase Modular Architecture
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2">
            The project was conceived, implemented, and validated across two distinct engineering milestones: starting from a standalone medical reminder box and evolving into an autonomous cloud-supervised IoT device.
          </p>

          {/* Phase Filter Tabs */}
          <div className="mt-6 inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setSelectedPhase('both')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedPhase === 'both' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Side-by-Side Comparison
            </button>
            <button
              onClick={() => setSelectedPhase('phase1')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedPhase === 'phase1' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Phase 1: Embedded Hardware
            </button>
            <button
              onClick={() => setSelectedPhase('phase2')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedPhase === 'phase2' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Phase 2: IoT & Light Shading
            </button>
          </div>
        </div>

        {/* Phase Cards Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* PHASE 1 CARD */}
          {(selectedPhase === 'both' || selectedPhase === 'phase1') && (
            <div className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-2xl relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                    STAGE 01 • STANDALONE EMBEDDED
                  </span>
                  <span className="text-xs font-mono text-slate-400">Assignment 01</span>
                </div>

                <h3 className="text-2xl font-black text-white mb-2">
                  Smart Medibox Core Hardware
                </h3>
                <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                  Establishment of physical firmware logic on ESP32 DevKit v4. Synchronizes real time via NTP over local Wi-Fi, monitors DHT22 ambient chamber conditions, and renders an interactive multi-level menu on a 128×64 SSD1306 OLED display.
                </p>

                {/* Key Features List */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>NTP Real-Time Clock:</strong> Synchronizes time across global UTC time zone offsets (+12h to -12h).</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>3 Independent Alarms:</strong> Configurable medicine reminder schedules with dismissible snooze routines.</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>Multi-Note Buzzer Melodies:</strong> 8-note musical synthesizer (GPIO 5) paired with a flashing alert LED.</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>Interactive Physical UI:</strong> 4-button tactile keypad (OK, Cancel, Up, Down) for OLED navigation.</span>
                  </div>
                </div>

                {/* Screenshot / Simulation Preview */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 mb-6">
                  <img
                    src="/slides/slide_03.png"
                    alt="Phase 1 Wokwi Breadboard Setup"
                    className="w-full h-48 object-cover rounded-xl border border-slate-800/80"
                  />
                  <div className="mt-2 text-center text-[11px] font-mono text-slate-400">
                    Wokwi Project ID: <code className="text-cyan-400">391582117646451713</code>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                <a
                  href="https://wokwi.com/projects/391582117646451713"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Launch Phase 1 Wokwi Simulation</span>
                </a>

                <button
                  onClick={() => setActiveTab('video-theater')}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium"
                >
                  <Play className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Watch Presentation Video 1</span>
                </button>
              </div>
            </div>
          )}

          {/* PHASE 2 CARD */}
          {(selectedPhase === 'both' || selectedPhase === 'phase2') && (
            <div className="p-7 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-emerald-500/40 hover:border-emerald-400 transition-all shadow-2xl relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    STAGE 02 • IoT & DUAL-LDR SHADING
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">Final Defense</span>
                </div>

                <h3 className="text-2xl font-black text-white mb-2">
                  IoT Solar Shading & Cloud Supervisory
                </h3>
                <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                  Extending the embedded baseline into a connected cyber-physical medical system. Integrates dual photoresistors, motorized SG90 shading window, bi-directional MQTT pub/sub telemetry, and clinical medication presets on Node-RED.
                </p>

                {/* Key Features List */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Dual LDR Solar Differential:</strong> Measures left/right incoming intensity to determine dominant solar vector.</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Motorized SG90 Shading Window:</strong> Dynamically calculates angle <span className="font-mono text-emerald-300">\theta_{'{servo}'}</span> to prevent UV drug degradation.</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Node-RED Web Dashboard:</strong> Real-time charts, radial gauges, and interactive slider overrides.</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Clinical Drug Presets:</strong> Rapid profiles for Tablet A (45°, 0.6), Tablet B (60°, 0.8), Tablet C (35°, 0.5), or Custom tuning.</span>
                  </div>
                </div>

                {/* Screenshot / Simulation Preview */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 mb-6">
                  <img
                    src="/slides/slide_11.png"
                    alt="Phase 2 Wokwi and Node-RED Live Sync"
                    className="w-full h-48 object-cover rounded-xl border border-slate-800/80"
                  />
                  <div className="mt-2 text-center text-[11px] font-mono text-emerald-400">
                    Wokwi Project ID: <code className="text-emerald-300">397789429671309313</code>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                <a
                  href="https://wokwi.com/projects/397789429671309313"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Launch Phase 2 Wokwi Simulation</span>
                </a>

                <button
                  onClick={() => setActiveTab('video-theater')}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Watch Presentation Video 2</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Feature Comparison Table */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Architectural Feature Comparison Matrix
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Technical evolution between Assignment 1 (standalone) and Assignment 2 (IoT-enhanced).
              </p>
            </div>
            <div className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/30 self-start sm:self-auto">
              7 Key Architectural Upgrades
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                  <th className="py-3 px-4">System Domain</th>
                  <th className="py-3 px-4 text-cyan-300">Phase 1: Hardware Core</th>
                  <th className="py-3 px-4 text-emerald-300">Phase 2: IoT Enhancement</th>
                  <th className="py-3 px-4 text-slate-300">Clinical & Operational Benefit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {PHASE_COMPARISONS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">{row.feature}</td>
                    <td className="py-3.5 px-4 font-mono text-cyan-400/90">{row.phase1}</td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">{row.phase2}</td>
                    <td className="py-3.5 px-4 text-slate-400">{row.benefit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};

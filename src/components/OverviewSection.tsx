import React from 'react';
import { 
  HeartPulse, 
  Sun, 
  ShieldCheck, 
  Activity, 
  CloudLightning, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Cpu, 
  Video, 
  FileText,
  Sliders,
  Sparkles
} from 'lucide-react';
import { MathView } from './MathView';

interface OverviewSectionProps {
  setActiveTab: (tab: string) => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-16 py-12">
      
      {/* SECTION 1: THE CLINICAL PROBLEM (Photodegradation & Climate Decay) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Critical Healthcare Challenge</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                The Threat of Pharmaceutical Photodegradation
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Many critical medications—including nitroprusside, certain antibiotics, and chemotherapy regimens—suffer from <strong>photosensitivity</strong>. Prolonged exposure to sunlight or uncontrolled ambient light induces photo-oxidation, cleavage of active pharmaceutical ingredients (APIs), and formation of cytotoxic degradation byproducts.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="text-xs font-mono font-bold text-rose-400 uppercase">Risk Factor 1</div>
                  <div className="text-sm font-bold text-white">Loss of Therapeutic Potency</div>
                  <p className="text-xs text-slate-400">
                    Direct ultraviolet and visible photons break chemical bonds, rendering medications ineffective before expiration.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="text-xs font-mono font-bold text-amber-400 uppercase">Risk Factor 2</div>
                  <div className="text-sm font-bold text-white">Thermal & Moisture Instability</div>
                  <p className="text-xs text-slate-400">
                    Storage outside optimal ranges (26–32°C, 60–80% RH) accelerates hydrolytic breakdown and bacterial compromise.
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Problem Graphic from Slide 4 */}
            <div className="lg:col-span-5 space-y-3">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl relative group">
                <img
                  src="/slides/slide_04.png"
                  alt="Slide 4: Why need enhancement? Photodegradation Problem"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="text-center text-[11px] font-mono text-slate-400">
                Defense Slide 04: Clinical Case for Light Shading
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 2: THE CYBER-PHYSICAL SOLUTION ARCHITECTURE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Integrated Solution Topology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            How Smart Medibox Solves the Problem
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2">
            A closed-loop embedded system tracking multi-axis ambient solar irradiance and modulating an electromechanical servo shutter to shield pharmaceuticals.
          </p>
        </div>

        {/* 3 Step Workflow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold font-mono">
              01
            </div>
            <h3 className="text-lg font-bold text-white">Dual-LDR Sensing</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Two calibrated photoresistors placed on the left (GPIO 35) and right (GPIO 32) flanks continuously sample ambient illumination, mapping 12-bit ADC raw voltages into normalized vectors <span className="font-mono text-cyan-300">I_{'{left}'}</span> and <span className="font-mono text-cyan-300">I_{'{right}'}</span>.
            </p>
            <div className="pt-2 text-xs font-mono text-cyan-400">
              Formula: <MathView latex="I = \frac{\text{raw} - 4064}{32 - 4064}" />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all shadow-xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold font-mono">
              02
            </div>
            <h3 className="text-lg font-bold text-white">Dynamic Servo Control</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              The ESP32 calculates orientation bias <span className="font-mono text-emerald-300">\gamma_{'{dir}'}</span> (0.5 for Right, 1.5 for Left) and controls the SG90 servo motor (GPIO 13) to reposition the shading shutter between 0° (fully open) and 180° (full occlusion).
            </p>
            <div className="pt-2 text-xs font-mono text-emerald-400">
              Formula: <MathView latex="\theta = \min(180, \, \theta_{\text{offset}}\gamma_{\text{dir}} + \dots)" />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/40 transition-all shadow-xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold font-mono">
              03
            </div>
            <h3 className="text-lg font-bold text-white">Node-RED Cloud Sync</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Telemetry publishes across 9 MQTT topics via Mosquitto. Clinicians remotely select medication profiles (Tablet A, B, C, or Custom) or tune minimum offset angles directly from the interactive web dashboard.
            </p>
            <div className="pt-2 text-xs font-mono text-teal-400">
              MQTT: <span className="text-white">test.mosquitto.org:1883</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: SYSTEM ANATOMY & HARDWARE DIAGRAM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            
            <div className="w-full lg:w-1/2 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-semibold">
                Cyber-Physical Schematic
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Hardware Assembly & Functional Blocks
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The embedded enclosure integrates an ESP32 master brain, dual ADC1 photoresistor modules, a DHT22 environmental sensor, a 50Hz PWM micro servo motor, a 128×64 SSD1306 graphical OLED, an acoustic piezo buzzer, and a 4-key tactile interface.
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                  <span className="text-slate-300">Phase 1 Wokwi Simulation:</span>
                  <a 
                    href="https://wokwi.com/projects/391582117646451713" 
                    target="_blank" 
                    rel="noreferrer"
                    className="font-mono text-cyan-400 hover:underline"
                  >
                    391582117646451713 ↗
                  </a>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                  <span className="text-slate-300">Phase 2 Wokwi Simulation:</span>
                  <a 
                    href="https://wokwi.com/projects/397789429671309313" 
                    target="_blank" 
                    rel="noreferrer"
                    className="font-mono text-emerald-400 hover:underline"
                  >
                    397789429671309313 ↗
                  </a>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab('dashboard-sim')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-md"
                >
                  Open Simulator
                </button>
                <button
                  onClick={() => setActiveTab('hardware')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                >
                  View Full Pinout Table
                </button>
              </div>
            </div>

            <div className="w-full lg:w-1/2 aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl">
              <img
                src="/slides/slide_05.png"
                alt="Medibox System Overview"
                className="w-full h-full object-cover"
              />
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: CALL TO ACTION STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-emerald-950/80 border border-cyan-500/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white">
              Ready to Explore the Defense Demonstration?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Watch full video presentations, test the physical shading algorithm, or browse the 13-slide defense deck.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('video-theater')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-white text-slate-950 hover:bg-cyan-100 transition-all shadow-lg"
            >
              <Video className="w-4 h-4 text-cyan-600" />
              <span>Watch Video Demos</span>
            </button>

            <button
              onClick={() => setActiveTab('slides')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 transition-all"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Read Defense Deck</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

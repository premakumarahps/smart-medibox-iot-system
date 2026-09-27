import React from 'react';
import { 
  HeartPulse, 
  Sun, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  ChevronRight, 
  Video, 
  ExternalLink, 
  Sliders, 
  Sparkles,
  Wifi,
  CloudLightning
} from 'lucide-react';
import { MathView } from './MathView';

interface HeroProps {
  setActiveTab: (tab: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ setActiveTab }) => {
  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden border-b border-slate-800/80">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-cyan-600/15 via-teal-500/10 to-emerald-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a15_1px,transparent_1px),linear-gradient(to_bottom,#0f172a15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Badges & Academic Lineage */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold shadow-inner">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
            <span>Smart Biomedical Storage</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">Semester 4 Embedded & IoT Project</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
            <Wifi className="w-3.5 h-3.5" />
            <span>ESP32 Wi-Fi + MQTT Telemetry</span>
          </div>

          {/* Highlighted Author Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-950/80 via-slate-900 to-emerald-950/80 border border-cyan-500/50 text-cyan-200 text-xs font-medium shadow-lg shadow-cyan-950/30">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Lead Architect: <strong>Sadun Premakumara</strong></span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-200 font-mono text-[10px] font-bold border border-cyan-500/40">
              210494D
            </span>
          </div>
        </div>

        {/* Main Heading */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
            SMART MEDIBOX{' '}
            <span className="bg-gradient-to-r from-white via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
              IoT PLATFORM
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            An advanced dual-phase biomedical device engineering project. Combines <strong>NTP-synchronized medicine reminder alarms</strong>, 
            <strong>DHT22 environmental climate control</strong>, <strong>dual-LDR directional sunlight tracking</strong>, and an 
            <strong>automated motorized servo shading window</strong> integrated with a real-time Node-RED cloud dashboard.
          </p>

          {/* Key Shading Formula Teaser Pill */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 px-5 py-2.5 rounded-2xl bg-slate-900/80 border border-slate-700/60 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <span className="text-cyan-400 font-bold">Servo Shading Formula:</span>
              <MathView latex="\theta = \min\big(180, \, \theta_{\text{offset}}\gamma_{\text{dir}} + (180 - \theta_{\text{offset}}) I_{\max} \gamma_{\text{ctrl}}\big)" />
            </div>
            <span className="hidden sm:inline text-slate-700">|</span>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <span className="text-emerald-400 font-bold">Broker:</span>
              <span className="text-white">test.mosquitto.org:1883</span>
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('dashboard-sim')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white shadow-xl shadow-cyan-600/30 hover:shadow-cyan-600/50 border border-cyan-400/40 transition-all hover:scale-[1.03] active:scale-[0.98]"
            >
              <Activity className="w-4 h-4" />
              <span>Launch Live IoT Simulator</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('video-theater')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/60 shadow-lg shadow-cyan-950/30 transition-all hover:scale-[1.02]"
            >
              <Video className="w-4 h-4 text-cyan-400" />
              <span>Watch 2 Presentation Videos</span>
            </button>

            <button
              onClick={() => setActiveTab('two-phases')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm bg-slate-900/70 hover:bg-slate-800/90 text-slate-200 border border-slate-700 transition-all"
            >
              <span>Phase 1 vs Phase 2</span>
            </button>

            <button
              onClick={() => setActiveTab('slides')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm bg-slate-900/70 hover:bg-slate-800/90 text-slate-200 border border-slate-700 transition-all"
            >
              <span>13-Slide Defense Deck</span>
            </button>
          </div>
        </div>

        {/* 4 Multi-Disciplinary Core Pillar Cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Dual-LDR & Servo Shading */}
          <div 
            onClick={() => setActiveTab('dashboard-sim')}
            className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 hover:border-cyan-500/40 transition-all hover:-translate-y-1 cursor-pointer group shadow-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <Sun className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              IoT Enhancement
            </div>
            <h3 className="text-lg font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors">
              Automated Solar Shading
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Dual calibrated photoresistors (Left Pin 35, Right Pin 32) drive an SG90 servo motor (Pin 13) to shade light-sensitive pharmaceuticals from ultraviolet decay.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
              <span>Test Shading Algorithm</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Climate Control & Alarms */}
          <div 
            onClick={() => setActiveTab('dashboard-sim')}
            className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 hover:border-emerald-500/40 transition-all hover:-translate-y-1 cursor-pointer group shadow-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Clinical Monitoring
            </div>
            <h3 className="text-lg font-bold text-white mt-1 group-hover:text-emerald-300 transition-colors">
              DHT22 & NTP Alarms
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Chamber temperature (26–32°C) and humidity (60–80%) tracking with acoustic buzzer melodies, flashing alert LED, and NTP worldwide time sync.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <span>Inspect Thresholds</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Node-RED & MQTT Cloud */}
          <div 
            onClick={() => setActiveTab('dashboard-sim')}
            className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 hover:border-teal-500/40 transition-all hover:-translate-y-1 cursor-pointer group shadow-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4 group-hover:scale-110 transition-transform">
              <CloudLightning className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider">
              Cloud Dashboard
            </div>
            <h3 className="text-lg font-bold text-white mt-1 group-hover:text-teal-300 transition-colors">
              Node-RED & Mosquitto
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Bi-directional pub/sub across 9 MQTT topics. Remote medication presets: Tablet A (45°, 0.6), Tablet B (60°, 0.8), Tablet C (35°, 0.5), and Custom tuning.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-teal-400">
              <span>View Dashboard Flows</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: Presentation Videos */}
          <div 
            onClick={() => setActiveTab('video-theater')}
            className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 hover:border-purple-500/40 transition-all hover:-translate-y-1 cursor-pointer group shadow-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <Video className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
              Media & Demos
            </div>
            <h3 className="text-lg font-bold text-white mt-1 group-hover:text-purple-300 transition-colors">
              Two-Phase Video Demos
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Watch author Sadun Premakumara demonstrate Phase 1 (hardware wiring & OLED menu) and Phase 2 (live Wokwi + Node-RED MQTT sync).
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-purple-400">
              <span>Play Video Presentations</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

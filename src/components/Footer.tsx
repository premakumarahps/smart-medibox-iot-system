import React from 'react';
import { 
  HeartPulse, 
  ShieldCheck, 
  ExternalLink, 
  Download, 
  FileCode, 
  Video, 
  Presentation,
  Cpu,
  Layers,
  Activity
} from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-24 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand & Project Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-cyan-500/40 p-0.5 bg-slate-900 shadow-md shadow-cyan-950/40">
                <img 
                  src="/docs/medibox_logo.jpg" 
                  alt="Smart Medibox Logo" 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <span className="text-base font-extrabold tracking-wider bg-gradient-to-r from-white via-cyan-200 to-emerald-400 bg-clip-text text-transparent">
                SMART MEDIBOX
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              An advanced IoT healthcare embedded device engineering project designed to eliminate pharmaceutical photodegradation through dual-LDR sunlight tracking, motorized servo shutter control, and Node-RED cloud telemetry.
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Lead Hardware & IoT Developer</span>
              </div>
              <div className="text-white font-bold text-sm">
                Sadun Premakumara
              </div>
              <div className="font-mono text-cyan-400 text-xs font-semibold">
                Index: 210494D
              </div>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] font-mono">
              System Modules
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setActiveTab('overview')} 
                  className="hover:text-cyan-300 transition-colors"
                >
                  System Overview
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('dashboard-sim')} 
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <span>IoT Simulator</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyan-500/20 text-cyan-300">Live</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('two-phases')} 
                  className="hover:text-cyan-300 transition-colors"
                >
                  Phase 1 vs Phase 2
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('video-theater')} 
                  className="hover:text-cyan-300 transition-colors"
                >
                  Video Demonstrations
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('slides')} 
                  className="hover:text-cyan-300 transition-colors"
                >
                  13-Slide Defense Deck
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('firmware')} 
                  className="hover:text-cyan-300 transition-colors"
                >
                  Firmware & Node-RED
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('hardware')} 
                  className="hover:text-cyan-300 transition-colors"
                >
                  Hardware Pinout
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Downloads */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] font-mono">
              Artifact Downloads
            </h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="/docs/medibox presentation 2_Complete final.pdf" 
                  download="Medibox_Presentation_Phase2_210494D.pdf"
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Defense Presentation PDF</span>
                </a>
              </li>
              <li>
                <a 
                  href="/code/Main_program_phase2.ino" 
                  download="Main_program_phase2.ino"
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Phase 2 Firmware (.ino)</span>
                </a>
              </li>
              <li>
                <a 
                  href="/code/Main_program_phase1.ino" 
                  download="Main_program_phase1.ino"
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <FileCode className="w-3.5 h-3.5 text-slate-400" />
                  <span>Phase 1 Firmware (.ino)</span>
                </a>
              </li>
              <li>
                <a 
                  href="/code/flows_210494D_node-red.json" 
                  download="flows_210494D_node-red.json"
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <FileCode className="w-3.5 h-3.5 text-amber-400" />
                  <span>Node-RED Flows (.json)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Wokwi Cloud Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] font-mono">
              Wokwi Cloud Projects
            </h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://wokwi.com/projects/397789429671309313" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1.5 font-mono"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Phase 2 (IoT Shading) ↗</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://wokwi.com/projects/391582117646451713" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 font-mono"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Phase 1 (Embedded) ↗</span>
                </a>
              </li>
              <li className="pt-2 text-[11px] text-slate-500">
                MQTT Broker: <code className="text-slate-400">test.mosquitto.org:1883</code>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Citation Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © Semester 4 University Academic Project • Smart Medibox IoT System
          </div>
          <div className="flex items-center gap-4 text-xs">
            <a
              href="https://github.com/premakumarahps/smart-medibox-iot-system"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <span>GitHub Repository</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://premakumarahps.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Main Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span>Designed & Programmed by</span>
            <strong className="text-slate-300">Sadun Premakumara (210494D)</strong>
          </div>
        </div>

      </div>
    </footer>
  );
};

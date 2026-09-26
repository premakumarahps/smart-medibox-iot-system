import React, { useState, useRef } from 'react';
import { 
  Video, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Maximize2, 
  Clock, 
  Film, 
  CheckCircle2, 
  ExternalLink,
  Presentation,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface VideoTheaterProps {
  setActiveTab: (tab: string) => void;
}

export const VideoTheater: React.FC<VideoTheaterProps> = ({ setActiveTab }) => {
  const [activeVideo, setActiveVideo] = useState<'phase1' | 'phase2'>('phase2');
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoMeta = {
    phase1: {
      title: 'Phase 1: Embedded Hardware & Firmware Demonstration',
      author: 'Sadun Premakumara',
      index: '210494D',
      src: '/videos/210494D_explanation_presentation1.mp4',
      duration: 'Explanation & Hardware Walkthrough',
      description: 'Comprehensive technical walkthrough of the Phase 1 standalone embedded system on Wokwi. Covers ESP32 wiring, SSD1306 OLED menu system, setting UTC offsets, NTP time sync, buzzer tones, and DHT22 monitoring.',
      chapters: [
        { title: 'Project Introduction & Core Deliverables', time: 0 },
        { title: 'Wokwi ESP32 Circuit Wiring & Components', time: 30 },
        { title: 'NTP Time Synchronization & UTC Setting', time: 90 },
        { title: 'Interactive 4-Button OLED Menu Architecture', time: 160 },
        { title: 'Alarm Triggering, Melody & Buzzer Tone Demo', time: 240 },
        { title: 'DHT22 Climate Bounds Validation (26–32°C)', time: 320 }
      ]
    },
    phase2: {
      title: 'Phase 2: IoT Enhancement, Dual-LDR & Node-RED Demonstration',
      author: 'Sadun Premakumara',
      index: '210494D',
      src: '/videos/210494D_presentation.mp4',
      duration: 'Final Defense Presentation',
      description: 'The complete final defense presentation demonstrating the IoT-enhanced Medibox. Features dual LDR solar intensity normalization, SG90 servo motor shading window calculation, MQTT Mosquitto broker communication, and live interactive Node-RED dashboard control.',
      chapters: [
        { title: 'Defense Title & Problem of Photodegradation', time: 0 },
        { title: 'Dual LDR Sensor Placement & Normalization Math', time: 45 },
        { title: 'SG90 Motorized Shading Window Algorithm', time: 105 },
        { title: 'MQTT Telemetry & Mosquitto Broker Setup', time: 175 },
        { title: 'Node-RED Dashboard Gauges & Clinical Presets', time: 245 },
        { title: 'Live End-to-End Dynamic Shading Demo', time: 330 }
      ]
    }
  };

  const current = videoMeta[activeVideo];

  const handleSeek = (timeSeconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timeSeconds;
      videoRef.current.play();
    }
  };

  return (
    <section className="py-12 bg-slate-950/60 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
              <Film className="w-3.5 h-3.5" />
              <span>Multimedia Defense Theater</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">Authored by Sadun Premakumara (210494D)</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Presentation & Demonstration Videos
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Watch full-resolution screen-recorded technical presentations detailing the embedded wiring, firmware algorithms, and real-time IoT cloud synchronization.
            </p>
          </div>

          {/* Video Selector Tabs */}
          <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setActiveVideo('phase2')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeVideo === 'phase2'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phase 2: IoT Presentation</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-900/60 text-emerald-200">
                Final
              </span>
            </button>

            <button
              onClick={() => setActiveVideo('phase1')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeVideo === 'phase1'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-950/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Phase 1: Hardware Demo</span>
            </button>
          </div>
        </div>

        {/* Video Player + Chapters Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Video Screen (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl aspect-video group">
              <video
                ref={videoRef}
                key={current.src}
                src={current.src}
                controls
                preload="metadata"
                className="w-full h-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video Title & Author Banner */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    MP4 1080p
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{current.duration}</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {current.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Presenter: <strong>{current.author}</strong></span>
                  <span className="text-slate-600">•</span>
                  <span className="font-mono text-cyan-300 font-bold">{current.index}</span>
                </div>
              </div>

              {activeVideo === 'phase2' && (
                <button
                  onClick={() => setActiveTab('slides')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shrink-0 self-start sm:self-auto transition-all"
                >
                  <Presentation className="w-4 h-4 text-cyan-400" />
                  <span>View 13 Defense Slides</span>
                </button>
              )}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed px-1">
              {current.description}
            </p>

          </div>

          {/* Chapter Markers & Quick Jumps (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-sm font-bold text-white">
                    Presentation Chapters
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Click to Seek</span>
              </div>

              <div className="space-y-2">
                {current.chapters.map((ch, idx) => {
                  const minutes = Math.floor(ch.time / 60);
                  const seconds = ch.time % 60;
                  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSeek(ch.time)}
                      className="w-full flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-cyan-500/40 text-left transition-all group"
                    >
                      <span className="px-2 py-1 rounded bg-slate-900 font-mono text-[10px] font-bold text-cyan-400 border border-slate-700/80 group-hover:border-cyan-500/40 shrink-0">
                        {timeFormatted}
                      </span>
                      <div>
                        <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                          {ch.title}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Chapter {idx + 1}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quick Jump to Simulator CTA */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={() => setActiveTab('dashboard-sim')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white shadow-lg shadow-cyan-600/20 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Test Algorithms in Live Simulator</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

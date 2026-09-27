import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  Search, 
  FileCode, 
  ExternalLink, 
  Terminal, 
  BookOpen, 
  Cpu,
  Layers
} from 'lucide-react';

interface CodeFileItem {
  id: string;
  name: string;
  category: 'Phase 2 IoT' | 'Phase 1 Hardware' | 'Node-RED Cloud';
  description: string;
  path: string;
  downloadName: string;
  keySnippets: { label: string; lineHint: string }[];
}

const CODE_FILES: CodeFileItem[] = [
  {
    id: 'phase2_ino',
    name: 'Main_program.ino (Phase 2 IoT Enhanced)',
    category: 'Phase 2 IoT',
    description: 'Complete 704-line C++ firmware running on ESP32 DevKit v4. Features dual LDR reading, normalization, dynamic SG90 servo angle calculation, Mosquitto MQTT broker pub/sub, OLED display, and DHT22 climate monitoring.',
    path: '/code/Main_program_phase2.ino',
    downloadName: 'Main_program_phase2.ino',
    keySnippets: [
      { label: 'updateLight() Shading Algorithm', lineHint: 'void updateLight()' },
      { label: 'receiveCallback() MQTT Parsing', lineHint: 'void receiveCallback(' },
      { label: 'connectToBroker() Mosquitto Setup', lineHint: 'void connectToBroker()' },
      { label: 'setupMqtt() Client Init', lineHint: 'void setupMqtt()' },
      { label: 'main loop() & Task Execution', lineHint: 'void loop()' }
    ]
  },
  {
    id: 'phase1_ino',
    name: 'Main_program.ino (Phase 1 Embedded Baseline)',
    category: 'Phase 1 Hardware',
    description: 'Original 418-line firmware established for Assignment 1. Features 4-button tactile keypad input, 128×64 SSD1306 OLED multi-tiered menus, NTP time client sync, UTC offsets, and 8-note melody buzzer alarms.',
    path: '/code/Main_program_phase1.ino',
    downloadName: 'Main_program_phase1.ino',
    keySnippets: [
      { label: 'print_time_now() OLED Clock', lineHint: 'void print_time_now()' },
      { label: 'go_to_menue() 4-Button Menu Navigation', lineHint: 'void go_to_menue()' },
      { label: 'ring_alarm() & Music Notes', lineHint: 'void ring_alarm()' },
      { label: 'check_temp() DHT22 Safety Routine', lineHint: 'void check_temp()' }
    ]
  },
  {
    id: 'nodered_json',
    name: 'flows_210494D_node-red.json',
    category: 'Node-RED Cloud',
    description: 'Complete visual flow definition for the Node-RED web dashboard. Defines MQTT input receivers for temperature, humidity, and light, radial gauge widgets, slider senders for theta_offset and controllingFactor, and tablet preset logic.',
    path: '/code/flows_210494D_node-red.json',
    downloadName: 'flows_210494D_node-red.json',
    keySnippets: [
      { label: 'Temperature & Humidity MQTT In Nodes', lineHint: 'MQTT temperature data receiver' },
      { label: 'Light Intensity Left & Right Gauges', lineHint: 'light intensity gauge (left)' },
      { label: 'Slider Senders (Min Angle & Factor)', lineHint: 'Minimum angle sender' },
      { label: 'Medication Preset Logic Function', lineHint: 'filter MedicinePreset()' }
    ]
  },
  {
    id: 'diagram_phase2',
    name: 'diagram.json (Phase 2 Wokwi Assembly)',
    category: 'Phase 2 IoT',
    description: 'Complete Wokwi hardware netlist and component positions: ESP32 DevKit v4, 3 breadboards, SSD1306 OLED, SG90 servo, 2 photoresistor modules (LDR1, LDR2), DHT22, buzzer, LED, and resistors.',
    path: '/code/diagram_phase2.json',
    downloadName: 'diagram_phase2.json',
    keySnippets: [
      { label: 'ESP32 Pin Connections', lineHint: '"esp:' },
      { label: 'LDR1 & LDR2 Net Connections', lineHint: '"ldr1:' },
      { label: 'Servo Motor PWM Net Connections', lineHint: '"servo1:' }
    ]
  }
];

export const FirmwareExplorer: React.FC = () => {
  const [selectedFileId, setSelectedFileId] = useState<string>('phase2_ino');
  const [fileContent, setFileContent] = useState<string>('Loading firmware code...');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const activeFile = CODE_FILES.find((f) => f.id === selectedFileId) || CODE_FILES[0];

  useEffect(() => {
    setIsLoading(true);
    fetch(activeFile.path)
      .then((res) => {
        if (!res.ok) throw new Error('File not found');
        return res.text();
      })
      .then((text) => {
        setFileContent(text);
        setIsLoading(false);
      })
      .catch((err) => {
        setFileContent(`// Error loading source file: ${err.message}\n// File path: ${activeFile.path}`);
        setIsLoading(false);
      });
  }, [activeFile]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Search filter
  const lines = fileContent.split('\n');
  const filteredLines = searchQuery.trim() === ''
    ? lines
    : lines.filter((line) => line.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleJumpToSnippet = (hint: string) => {
    setSearchQuery(hint);
  };

  return (
    <section className="py-12 bg-slate-950/60 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
              <Code2 className="w-3.5 h-3.5" />
              <span>Full Source Code Repository</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">ESP32 C++ & Node-RED Flows</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Firmware & Cloud Architecture
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Inspect the exact production source code written by <strong>Sadun Premakumara (210494D)</strong>. Copy algorithms, review pinouts, or download raw files for Wokwi execution.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all shadow-md"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
            </button>

            <a
              href={activeFile.path}
              download={activeFile.downloadName}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 transition-all shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Raw File</span>
            </a>
          </div>
        </div>

        {/* File Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {CODE_FILES.map((file) => {
            const isActive = file.id === selectedFileId;
            return (
              <button
                key={file.id}
                onClick={() => {
                  setSelectedFileId(file.id);
                  setSearchQuery('');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 border-cyan-500/60 shadow-lg shadow-cyan-950/40 text-cyan-200'
                    : 'bg-slate-900/80 border-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800">
                    {file.category}
                  </span>
                  <FileCode className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                </div>
                <div className="text-xs font-bold text-white truncate" title={file.name}>
                  {file.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active File Context & Quick Snippet Filters */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
            {activeFile.description}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400">Quick Filters:</span>
            {activeFile.keySnippets.map((snip, idx) => (
              <button
                key={idx}
                onClick={() => handleJumpToSnippet(snip.lineHint)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all"
              >
                {snip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Code Viewer Container */}
        <div className="rounded-2xl overflow-hidden bg-[#0d1117] border border-slate-800 shadow-2xl">
          
          {/* Editor Header Bar */}
          <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="font-mono text-slate-400 ml-2">
                {activeFile.downloadName} ({lines.length} lines)
              </span>
            </div>

            {/* In-File Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search function, topic, pin..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-9 pr-8 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs font-mono"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Code Body */}
          <div className="max-h-[600px] overflow-y-auto font-mono text-xs text-slate-300 p-4 scrollbar-thin">
            {isLoading ? (
              <div className="py-12 text-center text-slate-400">Loading file contents...</div>
            ) : filteredLines.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                No lines match "{searchQuery}"
              </div>
            ) : (
              <pre className="table w-full">
                {filteredLines.map((line, idx) => (
                  <div key={idx} className="table-row hover:bg-slate-800/40">
                    <span className="table-cell pr-4 text-right select-none text-slate-600 font-mono text-[11px] w-12">
                      {idx + 1}
                    </span>
                    <span className="table-cell whitespace-pre-wrap break-all py-0.5 text-slate-200">
                      {line}
                    </span>
                  </div>
                ))}
              </pre>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

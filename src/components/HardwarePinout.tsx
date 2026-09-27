import React, { useState } from 'react';
import { 
  Cpu, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Sliders, 
  Zap, 
  Layers, 
  ShieldCheck,
  Radio
} from 'lucide-react';
import { HARDWARE_PINS } from '../core/mediboxData';

export const HardwarePinout: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredPins = HARDWARE_PINS.filter((pin) => 
    pin.component.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pin.part.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pin.gpio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pin.signalType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-12 bg-slate-950/40 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>Embedded Electrical Schematics</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">ESP32 DevKit v4 Hardware</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Hardware Architecture & GPIO Registry
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Complete pinout specifications, communication protocols (I2C, ADC, PWM, 1-Wire), and electrical operating characteristics engineered by <strong>Sadun Premakumara (210494D)</strong>.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search pin, GPIO, part..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Visual Wokwi Breadboard Architecture Card */}
        <div className="mb-8 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="w-full lg:w-1/2 aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              <img
                src="/slides/slide_05.png"
                alt="Medibox Breadboard Architecture"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full lg:w-1/2 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Triple Breadboard Topography
              </div>
              <h3 className="text-xl font-bold text-white">
                Modular Cyber-Physical Circuit Layout
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The embedded prototype incorporates three synchronized breadboards: the central master board housing the ESP32 DevKit v4 and user controls, a dedicated left half-board isolating the Left LDR photoresistor (Pin 35), and a right half-board housing the Right LDR photoresistor (Pin 32) and I2C SSD1306 OLED.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                  <span className="text-slate-400 block mb-0.5">I2C Bus Address</span>
                  <span className="font-mono font-bold text-cyan-300">0x3C (SSD1306)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                  <span className="text-slate-400 block mb-0.5">PWM Frequency</span>
                  <span className="font-mono font-bold text-emerald-300">50 Hz (SG90 Servo)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                  <span className="text-slate-400 block mb-0.5">ADC Resolution</span>
                  <span className="font-mono font-bold text-amber-300">12-bit (32–4064 Counts)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                  <span className="text-slate-400 block mb-0.5">Operating Voltage</span>
                  <span className="font-mono font-bold text-white">3.3V Logic / 5V Rail</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Hardware Pins Table */}
        <div className="rounded-3xl overflow-hidden bg-slate-900/90 border border-slate-800 shadow-2xl">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-base font-bold text-white">
              GPIO Pin Assignment & Signal Specification
            </h3>
            <span className="text-xs font-mono text-cyan-400">
              {filteredPins.length} Components Registered
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px] bg-slate-950/50">
                  <th className="py-3 px-4">Functional Role</th>
                  <th className="py-3 px-4">Physical Part</th>
                  <th className="py-3 px-4 text-cyan-300">ESP32 Pin</th>
                  <th className="py-3 px-4 text-emerald-300">Signal Interface</th>
                  <th className="py-3 px-4">Operating Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredPins.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                      {item.component}
                    </td>
                    <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                      {item.part}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                      {item.gpio}
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-400 whitespace-nowrap">
                      {item.signalType}
                    </td>
                    <td className="py-3 px-4 text-slate-400 max-w-md">
                      {item.description}
                    </td>
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

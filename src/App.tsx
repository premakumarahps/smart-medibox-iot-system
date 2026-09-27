import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { OverviewSection } from './components/OverviewSection';
import { DashboardSimulator } from './components/DashboardSimulator';
import { TwoPhasesExplorer } from './components/TwoPhasesExplorer';
import { VideoTheater } from './components/VideoTheater';
import { SlideDeckViewer } from './components/SlideDeckViewer';
import { FirmwareExplorer } from './components/FirmwareExplorer';
import { HardwarePinout } from './components/HardwarePinout';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [activeTab, setActiveTabState] = useState<string>('overview');

  const handleSetActiveTab = (tab: string) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <Analytics />
      
      {/* Top Auto-hiding Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={handleSetActiveTab} />

      {/* Main Interactive Workspace Content */}
      <main className="flex-1">
        {/* Hero Section displayed on Overview */}
        {activeTab === 'overview' && (
          <>
            <Hero setActiveTab={handleSetActiveTab} />
            <OverviewSection setActiveTab={handleSetActiveTab} />
          </>
        )}

        {/* Tab 2: Live IoT Dashboard & Shading Simulator */}
        {activeTab === 'dashboard-sim' && (
          <div className="pt-24 animate-fadeIn">
            <DashboardSimulator />
          </div>
        )}

        {/* Tab 3: Phase 1 vs Phase 2 Modular Evolution */}
        {activeTab === 'two-phases' && (
          <div className="pt-24 animate-fadeIn">
            <TwoPhasesExplorer setActiveTab={handleSetActiveTab} />
          </div>
        )}

        {/* Tab 4: Multimedia Presentation Video Theater */}
        {activeTab === 'video-theater' && (
          <div className="pt-24 animate-fadeIn">
            <VideoTheater setActiveTab={handleSetActiveTab} />
          </div>
        )}

        {/* Tab 5: 13-Slide Defense Presentation Deck */}
        {activeTab === 'slides' && (
          <div className="pt-24 animate-fadeIn">
            <SlideDeckViewer />
          </div>
        )}

        {/* Tab 6: Production Firmware & Node-RED Flows */}
        {activeTab === 'firmware' && (
          <div className="pt-24 animate-fadeIn">
            <FirmwareExplorer />
          </div>
        )}

        {/* Tab 7: Hardware Pinout & Circuit Schematic */}
        {activeTab === 'hardware' && (
          <div className="pt-24 animate-fadeIn">
            <HardwarePinout />
          </div>
        )}
      </main>

      {/* Footer Attribution & Artifact Download Hub */}
      <Footer setActiveTab={handleSetActiveTab} />

    </div>
  );
};

export default App;

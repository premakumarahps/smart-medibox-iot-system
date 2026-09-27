import React, { useState, useEffect } from 'react';
import { 
  Presentation, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Maximize2, 
  X, 
  CheckCircle2, 
  FileText,
  ShieldCheck,
  Grid,
  Sparkles
} from 'lucide-react';
import { SLIDES_DATA } from '../core/mediboxData';

export const SlideDeckViewer: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');

  const totalSlides = SLIDES_DATA.length;
  const currentSlide = SLIDES_DATA[currentSlideIndex];

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  return (
    <section className="py-12 bg-slate-950/40 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
              <Presentation className="w-3.5 h-3.5" />
              <span>Academic Defense Documentation</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">Phase 2 Slide Deck</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              13-Slide Defense Deck Reader
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Official presentation delivered by <strong>Sadun Premakumara (210494D)</strong> for the Phase 2 Medibox Enhancement defense. Explore high-resolution slides with architectural annotations.
            </p>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-3">
            <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => setViewMode('single')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'single' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Carousel
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'grid' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Grid View
              </button>
            </div>

            <a
              href="/docs/medibox presentation 2_Complete final.pdf"
              download="Medibox_Presentation_Phase2_210494D.pdf"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 transition-all shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF (2.66 MB)</span>
            </a>
          </div>
        </div>

        {/* SINGLE SLIDE CAROUSEL MODE */}
        {viewMode === 'single' ? (
          <div className="space-y-6">
            
            {/* Slide Stage */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
              
              {/* Slide Image */}
              <div className="relative aspect-[16/9] w-full flex items-center justify-center p-2 sm:p-6 bg-slate-950">
                <img
                  src={currentSlide.image}
                  alt={`Slide ${currentSlide.slideNumber}: ${currentSlide.title}`}
                  className="max-h-full max-w-full object-contain rounded-xl shadow-2xl border border-slate-800/80 cursor-zoom-in"
                  onClick={() => setIsFullscreen(true)}
                />

                {/* Left/Right Floating Navigation Buttons */}
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700/80 flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 shadow-xl"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700/80 flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 shadow-xl"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Fullscreen Button */}
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="absolute top-4 right-4 p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 backdrop-blur-md transition-all"
                  title="Expand to Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Slide Metadata Footer Bar */}
              <div className="p-5 sm:p-6 bg-slate-900/90 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      SLIDE {currentSlide.slideNumber} OF {totalSlides}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Defense Slide Deck</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {currentSlide.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                    {currentSlide.summary}
                  </p>
                </div>

                {/* Progress Indicators & Quick Controls */}
                <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                  <span className="text-xs font-mono text-slate-400">
                    {currentSlideIndex + 1} / {totalSlides}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handlePrev}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
                      title="Previous"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
                      title="Next"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Thumbnail Strip */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {SLIDES_DATA.map((slide, idx) => {
                const isActive = idx === currentSlideIndex;
                return (
                  <button
                    key={slide.slideNumber}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`relative shrink-0 w-28 aspect-[16/9] rounded-xl overflow-hidden border transition-all ${
                      isActive
                        ? 'border-cyan-400 ring-2 ring-cyan-400/40 scale-105 shadow-lg'
                        : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
                    }`}
                  >
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 px-1 rounded bg-black/80 font-mono text-[9px] text-white">
                      {slide.slideNumber}
                    </div>
                  </button>
                );
              })}
            </div>

          </div>
        ) : (
          /* GRID VIEW MODE */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SLIDES_DATA.map((slide, idx) => (
              <div
                key={slide.slideNumber}
                onClick={() => {
                  setCurrentSlideIndex(idx);
                  setViewMode('single');
                }}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all hover:-translate-y-1 cursor-pointer group shadow-xl"
              >
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80 mb-3 relative">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-cyan-300 border border-cyan-500/30">
                    Slide {slide.slideNumber}
                  </div>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {slide.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {slide.summary}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-fadeIn">
          <div className="flex items-center justify-between text-white pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="font-mono text-cyan-400 font-bold">
                Slide {currentSlide.slideNumber} of {totalSlides}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-sm font-medium">{currentSlide.title}</span>
            </div>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="max-h-full max-w-full object-contain rounded-xl"
            />
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          <div className="text-center text-xs text-slate-400 font-mono">
            Press Esc or click close to exit fullscreen • Use Left/Right keys to navigate
          </div>
        </div>
      )}
    </section>
  );
};

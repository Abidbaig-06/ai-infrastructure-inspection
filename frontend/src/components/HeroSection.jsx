import React from 'react';
import { ComplaintButton } from './ComplaintButton';
import { InspectorLogin } from './InspectorLogin';
import { ShieldCheck, Database, Cpu, MapPin } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:py-20 lg:py-24 border-b border-white/10">
      {/* Ethereal Ambient White Light Glow Orbs */}
      <div className="absolute -top-10 right-1/4 w-[500px] h-[500px] bg-white/[0.08] rounded-full blur-[140px] pointer-events-none animate-white-light-1" />
      <div className="absolute bottom-0 left-10 w-[450px] h-[450px] bg-white/[0.04] rounded-full blur-[120px] pointer-events-none animate-white-light-2" />

      {/* Structural Geometry Vector in Pure White / Silver */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-15"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="8%" y1="18%" x2="38%" y2="82%" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 6" />
        <line x1="38%" y1="82%" x2="82%" y2="28%" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 6" />
        <circle cx="8%" cy="18%" r="3.5" fill="#ffffff" />
        <circle cx="38%" cy="82%" r="3.5" fill="#ffffff" />
        <circle cx="82%" cy="28%" r="3.5" fill="#ffffff" />
      </svg>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* 2-Column Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Core Identity, Headline, Supporting Copy, Action & Status */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pill System Tag with White Specular Rim */}
            <div className="obsidian-pill-glass inline-flex items-center gap-2 px-4 py-1.5 text-zinc-200 font-mono text-xs font-semibold shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white shadow-[0_0_6px_#ffffff]"></span>
              </span>
              <span>CIVIC TECHNOLOGY & INFRASTRUCTURE INTELLIGENCE</span>
            </div>

            {/* Primary Headline with Glassy White / Silver High Contrast */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-white leading-tight">
              See Infrastructure.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400 drop-shadow-[0_4px_20px_rgba(255,255,255,0.4)]">
                Detect Risk. Prioritize Action.
              </span>
            </h1>

            {/* Concise Supporting Statement */}
            <p className="text-sm sm:text-base text-zinc-300 max-w-2xl leading-relaxed drop-shadow-sm font-normal">
              AI-powered infrastructure inspection that combines visual evidence, geographic intelligence, inspection history, complaints, and maintenance records to identify risks and prioritize action.
            </p>

            {/* Single-Line Disclaimer with Frosted Glass & White Light Accent */}
            <div className="obsidian-pill-glass px-5 py-3 text-[11px] sm:text-xs text-zinc-300 italic border-l-2 border-white max-w-2xl">
              "AI-assisted infrastructure decision support for authorized inspection and maintenance workflows. Engineering verification is required for safety-critical decisions."
            </div>

            {/* Primary Hero Action Button */}
            <div className="pt-2">
              <ComplaintButton />
            </div>

            {/* Three System Status Indicators in Pill Capsules */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="obsidian-pill-glass px-3 py-1.5 flex items-center gap-1.5 text-zinc-200">
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
                <span>GUNTUR MUNICIPAL GRID</span>
              </span>
              <span className="obsidian-pill-glass px-3 py-1.5 flex items-center gap-1.5 text-zinc-200">
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
                <span>AI COMPUTER VISION: ACTIVE</span>
              </span>
              <span className="obsidian-pill-glass px-3 py-1.5 flex items-center gap-1.5 text-zinc-200">
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
                <span>IRC:82 STANDARDS VERIFIED</span>
              </span>
            </div>
          </div>

          {/* Right Column: Authorized Officer Gateway Panel */}
          <div className="lg:col-span-5">
            <InspectorLogin />
          </div>
        </div>
      </div>
    </section>
  );
};

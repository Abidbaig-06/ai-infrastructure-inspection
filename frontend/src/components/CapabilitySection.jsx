import React from 'react';
import { Scan, MapPin, ShieldAlert, Sliders } from 'lucide-react';

export const CapabilitySection = () => {
  const capabilities = [
    {
      icon: Scan,
      title: 'AI Visual Inspection',
      description: 'Detect visible infrastructure defects from inspection imagery.',
      tag: 'COMPUTER VISION'
    },
    {
      icon: MapPin,
      title: 'GIS Infrastructure Mapping',
      description: 'View roads, buildings, bridges, drainage and other infrastructure assets geographically.',
      tag: 'SPATIAL INTELLIGENCE'
    },
    {
      icon: ShieldAlert,
      title: 'Risk Intelligence',
      description: 'Combine defect severity, context and history to produce explainable risk assessments.',
      tag: 'PREDICTIVE AI'
    },
    {
      icon: Sliders,
      title: 'Maintenance Prioritization',
      description: 'Convert infrastructure risk into resource-aware maintenance priorities.',
      tag: 'RESOURCE OPTIMIZATION'
    }
  ];

  return (
    <section className="py-14 sm:py-20 border-b border-white/10 relative overflow-hidden">
      {/* Background White Light Refraction */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-white/[0.03] rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-9 relative z-10">
        {/* Section Header */}
        <div className="space-y-2 max-w-2xl">
          <div className="obsidian-pill-glass inline-flex items-center gap-1.5 px-4 py-1 text-[11px] font-mono font-bold tracking-widest text-zinc-300 uppercase">
            <span>CORE PLATFORM CAPABILITIES</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white drop-shadow-sm">
            Integrated Civil Infrastructure Decision Support
          </h2>
        </div>

        {/* 4 Obsidian Glass Capability Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                className="charcoal-glass-card rounded-3xl p-6 space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/25 text-white flex items-center justify-center shadow-inner group-hover:scale-105 group-hover:border-white/50 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all">
                    <Icon className="w-5 h-5 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-zinc-200 transition-colors">
                      {cap.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed mt-1.5 font-normal">
                      {cap.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-wider font-semibold text-zinc-400 uppercase">
                    {cap.tag}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff] opacity-70 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

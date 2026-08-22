import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ComplaintForm } from '../components/citizen/ComplaintForm';
import { Building3DBackground } from '../components/common/Building3DBackground';
import { ROUTES } from '../config/routes';
import { ArrowLeft, MapPin, AlertTriangle } from 'lucide-react';

export const ComplaintPortalPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-obsidian-rock text-zinc-100 relative overflow-hidden">
      {/* 3D Rotating Cracked Building Background (AI Structural Defect Inspection Theme) */}
      <Building3DBackground isDamaged={true} />

      {/* Official Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-6 w-full flex flex-col justify-center space-y-4 relative z-10">
        {/* Navigation Breadcrumb Bar with Obsidian Glass */}
        <div className="obsidian-pill-glass px-4 py-2.5 rounded-xl flex items-center justify-between gap-3 text-xs border border-white/10 shadow-lg backdrop-blur-md">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-2 font-semibold text-zinc-300 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-zinc-400 group-hover:text-white" />
            <span className="tracking-wide">Return to INFRASPECTION Portal</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-[10px] font-semibold">
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span>DEFECT SCAN ACTIVE</span>
            </span>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
              <MapPin className="w-3.5 h-3.5 text-white" />
              <span>Guntur Municipal Grid (GMC)</span>
            </div>
          </div>
        </div>

        {/* Complaint Box */}
        <div className="relative z-10">
          <ComplaintForm />
        </div>
      </main>

      {/* Minimal Footer */}
      <Footer />
    </div>
  );
};

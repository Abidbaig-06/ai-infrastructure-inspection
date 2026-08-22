import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ComplaintForm } from '../components/citizen/ComplaintForm';
import { ROUTES } from '../config/routes';
import { ArrowLeft, MapPin } from 'lucide-react';

export const ComplaintPortalPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-obsidian-rock text-zinc-100 relative">
      {/* Official Minimal Header */}
      <Header />

      {/* Main Container - Compact and No-Scroll Oriented */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 w-full flex flex-col justify-center space-y-3">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/10 text-xs">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-1.5 font-semibold text-zinc-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to INFRASPECTION Portal</span>
          </Link>

          <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
            <MapPin className="w-3.5 h-3.5 text-white" />
            <span>Guntur Municipal Corporation (GMC)</span>
          </div>
        </div>

        {/* Complaint Box */}
        <div>
          <ComplaintForm />
        </div>
      </main>

      {/* Minimal Footer */}
      <Footer />
    </div>
  );
};

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, PhoneCall, Search, Lock, UserCheck, AlertTriangle, ArrowRight, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const CivicHeader = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [trackInput, setTrackInput] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (trackInput.trim()) {
      navigate(`/track/${trackInput.trim().toUpperCase()}`);
      setIsSearchOpen(false);
      setTrackInput('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Civic Tricolor Band */}
      <div className="civic-tricolor-bar" />

      {/* Emergency & Municipal Helpline Top Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
            LIVE DISPATCH MONITORING ACTIVE
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-300">
            Emergency Public Works Control Room: <strong className="text-white">Ward 01 - 12 Online</strong>
          </span>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <a
            href="tel:18002484234"
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Toll-Free Helpline: <strong>1800-CIVIC-FIX</strong></span>
          </a>

          <div className="h-3 w-px bg-slate-700 hidden sm:block" />

          {/* Subtle Agent Login Link */}
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-1 text-civic-300 hover:text-white font-medium transition-colors bg-civic-900/80 px-2.5 py-0.5 rounded border border-civic-700/50"
            >
              <UserCheck className="w-3 h-3 text-civic-400" />
              <span>Command Center ({currentUser?.name?.split(' ')[0]})</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 text-slate-400 hover:text-white font-medium transition-colors"
              title="Restricted access for authorized municipal officers and dispatch teams"
            >
              <Lock className="w-3 h-3 text-slate-400" />
              <span className="text-[11px]">Official Staff Portal</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Official Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Crest & Title */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-civic-700 to-civic-900 flex items-center justify-center text-white shadow-md shadow-civic-900/20 ring-2 ring-civic-600/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-6 h-6 text-civic-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 font-display">
                CIVIC<span className="text-civic-600">PULSE</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-civic-100 text-civic-800 rounded border border-civic-200 uppercase tracking-wider">
                AI TRIAGE
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Municipal Grievance & Public Safety Redressal Authority
            </p>
          </div>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Quick Track Ticket Form */}
          <form onSubmit={handleTrackSubmit} className="hidden sm:flex items-center relative">
            <input
              type="text"
              placeholder="Track Ticket (e.g. CP-2026-9812)..."
              value={trackInput}
              onChange={(e) => setTrackInput(e.target.value)}
              className="w-64 pl-9 pr-8 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-civic-500/20 focus:border-civic-600 uppercase transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            {trackInput && (
              <button
                type="submit"
                className="absolute right-1.5 p-1 text-slate-400 hover:text-civic-600 rounded"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Mobile Track Button */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="sm:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Direct AI Inspection Agent Button */}
          <Link
            to="/ai-agent"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg text-emerald-300 bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 shadow-sm transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>AI Inspection Agent</span>
          </Link>

          {/* Quick Submit CTA */}
          <a
            href="#file-complaint"
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg text-white bg-civic-600 hover:bg-civic-700 shadow-sm hover:shadow transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
            <span>File Grievance</span>
          </a>

          {/* Portal Switch */}
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-civic-400" />
              <span className="hidden sm:inline">Officer</span> Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Officer Login</span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Search Dropdown */}
      {isSearchOpen && (
        <div className="sm:hidden px-4 pb-3 pt-1 border-t border-slate-200 bg-slate-50">
          <form onSubmit={handleTrackSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Ticket ID (CP-2026-XXXX)..."
              value={trackInput}
              onChange={(e) => setTrackInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-civic-500 uppercase"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-2 text-xs font-semibold bg-civic-600 text-white rounded-lg"
            >
              Track
            </button>
          </form>
        </div>
      )}
    </header>
  );
};

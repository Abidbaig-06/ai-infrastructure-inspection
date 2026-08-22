import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Bell, LogOut, Building2, User, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGrievance } from '../../context/GrievanceContext';

export const OfficerHeader = () => {
  const { currentUser, logout } = useAuth();
  const { complaints } = useGrievance();
  const navigate = useNavigate();

  const criticalCount = complaints.filter(c => c.aiAnalysis?.severity === 'CRITICAL' && c.status !== 'RESOLVED').length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="civic-tricolor-bar" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Branding & Portal Badge */}
        <div className="flex items-center gap-3.5">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-civic-600 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-civic-500/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white font-display text-base">
                  CIVIC<span className="text-civic-400">PULSE</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 rounded border border-amber-500/30 uppercase">
                  OFFICER CONSOLE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                AI Municipal Triage & Field Dispatch Authority
              </p>
            </div>
          </Link>
        </div>

        {/* Right: Officer Profile, Alerts & Logout */}
        <div className="flex items-center gap-4">
          {/* Critical Hazard Alert Badge */}
          {criticalCount > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 text-red-300 border border-red-800 text-xs font-bold pulse-ring-critical">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>{criticalCount} Critical Hazards Active</span>
            </div>
          )}

          {/* Officer Identity Card */}
          <div className="flex items-center gap-3 pl-2 sm:border-l border-slate-800">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser?.name}
              className="w-9 h-9 rounded-full object-cover border border-civic-500/50 ring-2 ring-slate-800"
            />
            <div className="hidden md:block text-left text-xs">
              <p className="font-bold text-white leading-tight">{currentUser?.name || 'Officer'}</p>
              <p className="text-[11px] text-civic-300">{currentUser?.department || 'Department of Public Works'}</p>
            </div>
          </div>

          {/* Citizen Portal Link */}
          <Link
            to="/"
            className="text-xs text-slate-400 hover:text-white transition-colors hidden lg:inline-block"
            title="Switch to Public Citizen Portal"
          >
            Citizen Portal ↗
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Sign out of Officer Console"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

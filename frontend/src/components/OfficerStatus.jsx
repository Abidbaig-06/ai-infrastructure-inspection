import React from 'react';
import { useAuth } from '../context/AuthContext';

export const OfficerStatus = () => {
  const { isAuthenticated, currentUser } = useAuth();

  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono font-semibold transition-all duration-300 backdrop-blur-md ${
        isAuthenticated
          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.25),inset_0_1px_1px_rgba(255,255,255,0.4)]'
          : 'obsidian-pill-glass text-zinc-400'
      }`}
      role="status"
      aria-live="polite"
      aria-label={isAuthenticated ? 'Authorized staff is online' : 'Authorized staff is offline'}
    >
      {/* Indicator Light with White Specular Glow */}
      <span className="relative flex h-2.5 w-2.5">
        {isAuthenticated ? (
          <>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_10px_#10b981]"></span>
          </>
        ) : (
          <>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-40"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_8px_#ef4444]"></span>
          </>
        )}
      </span>

      {/* Dynamic Status Text */}
      <span className={`tracking-wider uppercase text-[11px] ${isAuthenticated ? 'text-emerald-300 font-bold drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'text-zinc-300'}`}>
        {isAuthenticated
          ? `${currentUser?.role === 'SENIOR_ENGINEER' ? 'ENGINEER' : 'INSPECTOR'} • ONLINE`
          : 'OFFICER • OFFLINE'}
      </span>
    </div>
  );
};

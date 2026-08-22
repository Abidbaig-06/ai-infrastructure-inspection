import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../config/routes';

export const Logo = ({ size = 'default' }) => {
  const isLarge = size === 'large';

  return (
    <Link
      to={ROUTES.HOME}
      className="inline-flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-white/40 rounded-xl p-1 transition-all"
      aria-label="INFRASPECTION Home"
    >
      {/* Charcoal Black Crystal Emblem with Glassy White Light Accent */}
      <div
        className={`${
          isLarge ? 'w-10 h-10' : 'w-8 h-8'
        } rounded-xl bg-gradient-to-b from-zinc-700/50 via-zinc-900/90 to-black/95 backdrop-blur-md border border-white/25 flex items-center justify-center relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.5)] group-hover:border-white/50 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all`}
      >
        {/* White Light Flare Node */}
        <div className="absolute -top-3 -left-3 w-8 h-8 bg-white/20 rounded-full blur-md" />

        {/* Structural Inspection Prism Vector */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${isLarge ? 'w-5 h-5' : 'w-4 h-4'} text-white relative z-10 drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]`}
        >
          <path d="M3 20L12 4L21 20" stroke="#d4d4d8" strokeWidth="1.8" />
          <path d="M12 4V20" stroke="#ffffff" strokeDasharray="2 2" strokeWidth="1.6" />
          <circle cx="12" cy="13" r="2.5" fill="#ffffff" className="text-white" />
          <path d="M8 17H16" stroke="#e4e4e7" strokeWidth="1.8" />
        </svg>

        {/* Specular White Light Corner Pin */}
        <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
      </div>

      {/* Brand Wordmark */}
      <div className="flex flex-col">
        <span
          className={`${
            isLarge ? 'text-xl' : 'text-base'
          } font-extrabold tracking-wider text-white font-display uppercase leading-tight drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)]`}
        >
          INFRASPECTION
        </span>
      </div>
    </Link>
  );
};

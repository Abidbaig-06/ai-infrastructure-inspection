import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { OfficerStatus } from './OfficerStatus';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../config/routes';
import { Lock, LogOut, ArrowRight, ShieldCheck } from 'lucide-react';

export const Header = ({ onOpenLogin }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="relative w-full bg-[#08080a] border-b border-white/10 transition-all z-20">
      <div className="max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Side: Logo with White Light Crystal Prism */}
        <Logo />

        {/* Right Side: Dynamic Online/Offline Status & Charcoal Glass Action */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Dynamic Online/Offline Status Indicator */}
          <OfficerStatus />

          {/* Compact Officer / Inspector Login Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate(ROUTES.HOME);
                }}
                className="obsidian-pill-glass inline-flex items-center gap-1 px-3.5 py-1.5 hover:bg-red-500/20 text-zinc-400 hover:text-red-300 text-xs font-semibold transition-colors cursor-pointer"
                title="Logout from authorized session"
                aria-label="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin || (() => {
                const el = document.getElementById('inspector-auth-panel');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              })}
              className="obsidian-pill-glass inline-flex items-center gap-1.5 px-4 py-1.5 text-zinc-200 hover:text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
              aria-label="Officer / Inspector Login"
            >
              <Lock className="w-3.5 h-3.5 text-zinc-300" />
              <span>Inspector Gateway</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

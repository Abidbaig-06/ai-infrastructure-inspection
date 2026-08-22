import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { ROUTES } from '../config/routes';
import { ShieldCheck, Lock } from 'lucide-react';

export const Footer = () => {
  const navigate = useNavigate();

  const handleScrollToLogin = () => {
    const el = document.getElementById('inspector-auth-panel');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(ROUTES.HOME);
    }
  };

  return (
    <footer className="bg-[#070709] text-zinc-400 text-xs border-t border-white/10 relative overflow-hidden">
      {/* Background White Light Refraction Glow */}
      <div className="absolute bottom-0 left-1/3 w-96 h-48 bg-white/[0.02] rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
          {/* Column 1: INFRASPECTION Brand & Status */}
          <div className="space-y-4">
            <Logo />
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              AI-powered infrastructure inspection and maintenance intelligence platform.
            </p>
            <div className="pt-2">
              <span className="charcoal-pill inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-mono text-zinc-300 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
                <span>Secure infrastructure intelligence platform</span>
              </span>
            </div>
          </div>

          {/* Column 2: Civic Services Text Links */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
              CIVIC SERVICES
            </h4>
            <ul className="space-y-2 text-zinc-400 text-xs">
              <li>
                <Link to={ROUTES.COMPLAINT_APP_URL} className="hover:text-white transition-colors">
                  Public Issue Reporting
                </Link>
              </li>
              <li>
                <Link to={ROUTES.INSPECTOR_WORKSPACE} className="hover:text-white transition-colors">
                  Infrastructure Inspection
                </Link>
              </li>
              <li>
                <Link to={ROUTES.INSPECTOR_WORKSPACE} className="hover:text-white transition-colors">
                  Asset Monitoring
                </Link>
              </li>
              <li>
                <Link to={ROUTES.INSPECTOR_WORKSPACE} className="hover:text-white transition-colors">
                  Risk Assessment
                </Link>
              </li>
              <li>
                <Link to={ROUTES.INSPECTOR_WORKSPACE} className="hover:text-white transition-colors">
                  Maintenance Priorities
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Authorized Access */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
              AUTHORIZED ACCESS
            </h4>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Restricted workspace for authorized municipal officers, inspectors, engineers and maintenance personnel.
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={handleScrollToLogin}
                className="white-glass-btn-secondary inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-zinc-200 hover:text-white text-xs font-semibold transition-all shadow-sm"
              >
                <Lock className="w-3.5 h-3.5 text-zinc-300" />
                <span>Inspector Login</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 font-sans">
          <div>
            © 2026 INFRASPECTION. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="hover:text-zinc-300 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-zinc-300 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-zinc-300 cursor-pointer transition-colors">Accessibility</span>
            <span className="hover:text-zinc-300 cursor-pointer transition-colors">Data Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, PhoneCall, Building2, ExternalLink, Lock, CheckCircle2 } from 'lucide-react';

export const CivicFooter = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Authority Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-civic-600 flex items-center justify-center text-white font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-base font-bold text-white font-display">
                CIVIC<span className="text-civic-400">PULSE</span> AI
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Official Integrated Citizen Grievance Redressal and Real-Time Infrastructure Hazard Management System. Powered by AI Computer Vision and Municipal Dispatch Telemetry.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Certified ISO 27001 & Gov-Cloud Standard</span>
            </div>
          </div>

          {/* Col 2: Emergency Response Directory */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Emergency Hotlines
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex justify-between items-center py-1 border-b border-slate-800">
                <span>Civil Safety & Potholes</span>
                <span className="font-mono text-slate-200 font-bold">1800-CIVIC-1</span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-slate-800">
                <span>Water Main Burst / Flood</span>
                <span className="font-mono text-slate-200 font-bold">1800-WATER-9</span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-slate-800">
                <span>Live Electrical Hazard</span>
                <span className="font-mono text-rose-400 font-bold">1800-POWER-911</span>
              </li>
              <li className="flex justify-between items-center py-1">
                <span>Public Sanitation</span>
                <span className="font-mono text-slate-200 font-bold">1800-CLEAN-0</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Citizen Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Citizen Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#file-complaint" className="hover:text-white transition-colors">
                  File New Grievance
                </a>
              </li>
              <li>
                <Link to="/track/CP-2026-9812" className="hover:text-white transition-colors">
                  Track Existing Ticket
                </Link>
              </li>
              <li>
                <a href="#ward-hotspots" className="hover:text-white transition-colors">
                  Municipal Ward Heatmap
                </a>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Citizen Charter & SLA Commitments
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Administration */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Authorized Personnel
            </h4>
            <p className="text-xs text-slate-400">
              Restricted portal for Municipal Commissioners, Chief Engineers, and On-Field Dispatch Crews.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-civic-300 font-semibold border border-slate-700 transition-all text-xs"
            >
              <Lock className="w-3.5 h-3.5 text-civic-400" />
              <span>Municipal Officer Access</span>
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Municipal Corporation & Department of Public Infrastructure. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Accessibility Statement</span>
            <span className="hover:text-slate-400 cursor-pointer">RTI Disclosures</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

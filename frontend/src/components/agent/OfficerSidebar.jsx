import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  FileSpreadsheet,
  BarChart3,
  ShieldAlert,
  Settings,
  Users,
  Building2,
  CheckCircle2,
  Sparkles,
  Cpu
} from 'lucide-react';
import { useGrievance } from '../../context/GrievanceContext';

export const OfficerSidebar = () => {
  const location = useLocation();
  const { complaints, workOrders } = useGrievance();

  const criticalCount = complaints.filter(c => c.aiAnalysis?.severity === 'CRITICAL' && c.status !== 'RESOLVED').length;

  const navItems = [
    {
      to: '/ai-agent',
      label: 'AI Inspection Agent',
      icon: Cpu,
      isHighlight: true,
      badge: 'AI LIVE'
    },
    {
      to: '/dashboard',
      label: 'Command Dashboard',
      icon: LayoutDashboard,
      badge: complaints.length
    },
    {
      to: '/work-orders',
      label: 'Maintenance Orders',
      icon: FileSpreadsheet,
      badge: workOrders.length
    },
    {
      to: '/analytics',
      label: 'Ward & SLA Analytics',
      icon: BarChart3
    }
  ];

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-slate-200 p-4 space-y-6">
      {/* Navigation Links */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2">
          Operations Management
        </span>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-civic-600 text-white shadow-sm shadow-civic-600/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`px-2 py-0.5 text-[10px] rounded-full font-mono font-bold ${
                    isActive ? 'bg-civic-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Critical Hazards Alert Panel */}
      {criticalCount > 0 && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs space-y-2">
          <div className="flex items-center gap-2 text-red-800 font-bold">
            <ShieldAlert className="w-4 h-4 text-red-600 animate-bounce" />
            <span>High Risk Action Needed</span>
          </div>
          <p className="text-[11px] text-red-700 leading-tight">
            {criticalCount} critical incidents require immediate engineer triage and crew deployment.
          </p>
        </div>
      )}

      {/* System Status Box */}
      <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs space-y-2">
        <div className="flex items-center justify-between text-[10px] uppercase font-bold text-civic-400">
          <span>AI Neural Engine</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            ONLINE
          </span>
        </div>
        <p className="text-[11px] text-slate-300">
          Model: CivicPulse-Vision-v3.4
        </p>
        <p className="text-[11px] text-slate-400">
          SLA Compliance: 94.8%
        </p>
      </div>
    </aside>
  );
};

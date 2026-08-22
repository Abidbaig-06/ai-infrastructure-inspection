import React from 'react';
import { AlertTriangle, CheckCircle2, Clock, ShieldAlert, Truck, Sparkles } from 'lucide-react';

export const SeverityBadge = ({ severity, size = 'sm', pulse = false }) => {
  const sev = (severity || 'MEDIUM').toUpperCase();

  const config = {
    CRITICAL: {
      bg: 'bg-red-50 text-red-700 border-red-200 ring-1 ring-red-300',
      dot: 'bg-red-600',
      label: 'CRITICAL HAZARD',
      icon: ShieldAlert,
      pulseClass: 'pulse-ring-critical'
    },
    HIGH: {
      bg: 'bg-orange-50 text-orange-700 border-orange-200 ring-1 ring-orange-300',
      dot: 'bg-orange-600',
      label: 'HIGH RISK',
      icon: AlertTriangle,
      pulseClass: 'pulse-ring-high'
    },
    MEDIUM: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-300',
      dot: 'bg-amber-500',
      label: 'MEDIUM RISK',
      icon: AlertTriangle,
      pulseClass: ''
    },
    LOW: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-300',
      dot: 'bg-emerald-600',
      label: 'LOW RISK',
      icon: CheckCircle2,
      pulseClass: ''
    }
  };

  const item = config[sev] || config.MEDIUM;
  const Icon = item.icon;

  const sizeClasses = size === 'lg'
    ? 'px-3 py-1.5 text-xs font-bold gap-1.5'
    : 'px-2.5 py-0.5 text-[11px] font-semibold gap-1';

  return (
    <span className={`inline-flex items-center rounded-full border shadow-sm ${item.bg} ${sizeClasses} ${pulse ? item.pulseClass : ''}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${item.dot} ${pulse ? 'animate-ping' : ''}`} />
      <Icon className="w-3.5 h-3.5" />
      <span>{item.label}</span>
    </span>
  );
};

export const StatusBadge = ({ status, size = 'sm' }) => {
  const st = (status || 'SUBMITTED').toUpperCase();

  const config = {
    SUBMITTED: {
      bg: 'bg-slate-100 text-slate-700 border-slate-300',
      icon: Clock,
      label: 'Submitted'
    },
    AI_TRIAGED: {
      bg: 'bg-purple-50 text-purple-700 border-purple-200 ring-1 ring-purple-300',
      icon: Sparkles,
      label: 'AI Triaged'
    },
    CREW_DISPATCHED: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-300',
      icon: Truck,
      label: 'Crew Dispatched'
    },
    IN_PROGRESS: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-300',
      icon: Clock,
      label: 'In Progress'
    },
    RESOLVED: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-300',
      icon: CheckCircle2,
      label: 'Resolved'
    },
    REJECTED: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: AlertTriangle,
      label: 'Rejected'
    }
  };

  const item = config[st] || config.SUBMITTED;
  const Icon = item.icon;

  const sizeClasses = size === 'lg'
    ? 'px-3 py-1.5 text-xs font-bold gap-1.5'
    : 'px-2.5 py-0.5 text-[11px] font-semibold gap-1';

  return (
    <span className={`inline-flex items-center rounded-full border ${item.bg} ${sizeClasses}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{item.label}</span>
    </span>
  );
};

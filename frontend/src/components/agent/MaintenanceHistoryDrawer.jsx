import React, { useState } from 'react';
import {
  History,
  Building2,
  Calendar,
  AlertTriangle,
  CheckCircle,
  FileText,
  DollarSign,
  Layers,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  TrendingDown,
  Clock,
  ShieldAlert,
  User,
  ExternalLink,
  Zap,
  Activity
} from 'lucide-react';
import { useGrievance } from '../../context/GrievanceContext';

const matchesAsset = (complaint, assetId) => {
  if (!complaint) return false;
  const cCat = (complaint.category || '').toLowerCase();
  const cTitle = (complaint.title || '').toLowerCase();
  const cDesc = (complaint.description || '').toLowerCase();
  const cWard = (complaint.location?.ward || '').toLowerCase();
  const cAddr = (complaint.location?.address || '').toLowerCase();

  switch (assetId) {
    case 'R-104':
      return (
        cCat.includes('road') ||
        cCat.includes('pothole') ||
        cCat.includes('asphalt') ||
        cTitle.includes('road') ||
        cTitle.includes('pothole') ||
        cWard.includes('lakshmipuram') ||
        cWard.includes('ward 04') ||
        cAddr.includes('lakshmipuram')
      );
    case 'W-009':
      return (
        cCat.includes('water') ||
        cCat.includes('pipe') ||
        cCat.includes('leak') ||
        cTitle.includes('water') ||
        cTitle.includes('pipeline') ||
        cWard.includes('brodipet') ||
        cWard.includes('ward 02') ||
        cAddr.includes('brodipet')
      );
    case 'E-044':
      return (
        cCat.includes('electrical') ||
        cCat.includes('power') ||
        cCat.includes('cable') ||
        cCat.includes('streetlamp') ||
        cTitle.includes('wire') ||
        cTitle.includes('cable') ||
        cTitle.includes('power') ||
        cTitle.includes('streetlamp') ||
        cWard.includes('arundelpet') ||
        cWard.includes('pattabhipuram') ||
        cWard.includes('ward 01') ||
        cWard.includes('ward 07')
      );
    case 'D-018':
      return (
        cCat.includes('drain') ||
        cCat.includes('waste') ||
        cCat.includes('sewage') ||
        cCat.includes('sanitation') ||
        cCat.includes('garbage') ||
        cTitle.includes('drain') ||
        cTitle.includes('garbage') ||
        cTitle.includes('waste') ||
        cWard.includes('old guntur') ||
        cWard.includes('ward 08')
      );
    default:
      return false;
  }
};

const ASSETS_REGISTRY = {
  'R-104': {
    assetId: 'R-104',
    name: 'Lakshmipuram 4-Lane Arterial Road',
    location: 'Lakshmipuram Main Road & Hindu College',
    ward: 'Ward 04 - Lakshmipuram',
    currentCondition: 'CRITICAL',
    conditionBadgeColor: 'bg-red-950 text-red-300 border-red-800',
    lastMaintenance: '14 Feb 2026',
    nextMaintenanceDue: '15 Sep 2026',
    nextMaintenanceType: 'Preventive Bituminous Overlay & Core Sampling',
    nextMaintenanceStatus: 'UPCOMING',
    totalMaintenanceCostFormatted: '₹1,45,000',
    totalMaintenanceCostINR: 145000,
    conditionHistory: [
      { year: '2024', status: 'GOOD', color: 'text-emerald-400 border-emerald-500' },
      { year: '2025', status: 'FAIR', color: 'text-amber-400 border-amber-500' },
      { year: '2026 (Q1)', status: 'POOR', color: 'text-orange-400 border-orange-500' },
      { year: 'CURRENT', status: 'CRITICAL', color: 'text-red-400 border-red-500 font-black' }
    ],
    previousIssues: [
      { issue: 'Pothole', count: 3, icon: '🚧' },
      { issue: 'Surface Cracking', count: 2, icon: '⚡' },
      { issue: 'Drainage Damage', count: 1, icon: '🌊' }
    ],
    timeline: [
      {
        year: '2026',
        date: '14 Feb 2026',
        title: 'Surface Repair & Asphalt Patching',
        cost: '₹45,000',
        status: 'Completed',
        badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-500/40',
        note: 'Cold-mix pothole leveling near Hindu College gate.'
      },
      {
        year: '2025',
        date: '10 Aug 2025',
        title: 'Pothole Milling & Grouting',
        cost: '₹30,000',
        status: 'Completed',
        badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-500/40',
        note: 'Monsoon cavitation filled with high-density aggregate.'
      },
      {
        year: '2025',
        date: '12 Mar 2025',
        title: 'Statutory Pavement Condition Inspection',
        cost: '₹0',
        status: 'Completed',
        badgeColor: 'bg-blue-950 text-blue-300 border-blue-500/40',
        note: 'Surface alligator crack detected on outer lane.'
      }
    ],
    repairs: [
      {
        date: '14 Feb 2026',
        repair: 'Surface Repair',
        issue: 'Road Damage & Crater',
        cost: '₹45,000',
        contractor: 'GMC Roads Division Team 01',
        status: 'Completed'
      },
      {
        date: '10 Aug 2025',
        repair: 'Pothole Repair',
        issue: 'Pothole (12cm depth)',
        cost: '₹30,000',
        contractor: 'Guntur Infra Buildcon Ltd',
        status: 'Completed'
      },
      {
        date: '12 Mar 2025',
        repair: 'Patch Repair',
        issue: 'Alligator Cracking',
        cost: '₹20,000',
        contractor: 'GMC In-house Patch Crew',
        status: 'Completed'
      }
    ],
    inspections: [
      {
        date: '21 Aug 2026',
        inspector: 'Dr. Aris Thorne (EE)',
        finding: 'Severe 14.5cm Pothole & Sub-base Void',
        condition: 'Critical',
        action: 'Immediate Emergency Repair'
      },
      {
        date: '14 Feb 2026',
        inspector: 'Insp. Sarah Jenkins',
        finding: 'Asphalt Spalling & Edge Ravelling',
        condition: 'High',
        action: 'Patch Repair Approved'
      },
      {
        date: '12 Mar 2025',
        inspector: 'Insp. Marcus Vance',
        finding: 'Minor Longitudinal Hairline Cracks',
        condition: 'Medium',
        action: 'Routine Monitoring'
      }
    ]
  },
  'W-009': {
    assetId: 'W-009',
    name: 'Brodipet Main Commercial Water Pipeline',
    location: 'Brodipet 4th Line Corner',
    ward: 'Ward 02 - Brodipet',
    currentCondition: 'CRITICAL',
    conditionBadgeColor: 'bg-red-950 text-red-300 border-red-800',
    lastMaintenance: '02 Jan 2026',
    nextMaintenanceDue: 'OVERDUE',
    nextMaintenanceType: 'Main High-Pressure Feeder Valve Gasket Replacement',
    nextMaintenanceStatus: 'OVERDUE — Immediate Action Required',
    totalMaintenanceCostFormatted: '₹95,000',
    totalMaintenanceCostINR: 95000,
    conditionHistory: [
      { year: '2024', status: 'GOOD', color: 'text-emerald-400 border-emerald-500' },
      { year: '2025', status: 'FAIR', color: 'text-amber-400 border-amber-500' },
      { year: '2026', status: 'CRITICAL', color: 'text-red-400 border-red-500 font-black' },
      { year: 'CURRENT', status: 'CRITICAL', color: 'text-red-400 border-red-500 font-black' }
    ],
    previousIssues: [
      { issue: 'Pipe Joint Leak', count: 4, icon: '💧' },
      { issue: 'Valve Gasket Failure', count: 2, icon: '🔧' },
      { issue: 'Road Cavitation from Leak', count: 1, icon: '🚧' }
    ],
    timeline: [
      {
        year: '2026',
        date: '02 Jan 2026',
        title: 'Emergency Sleeve Joint Clamping',
        cost: '₹40,000',
        status: 'Completed',
        badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-500/40',
        note: 'Repaired hairline fracture in 300mm ductile iron pipe.'
      },
      {
        year: '2025',
        date: '18 Jul 2025',
        title: 'Pressure Regulator Overhaul',
        cost: '₹35,000',
        status: 'Completed',
        badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-500/40',
        note: 'Installed high-pressure relief valve.'
      }
    ],
    repairs: [
      {
        date: '02 Jan 2026',
        repair: 'Sleeve Clamp Joint',
        issue: 'Water Leak',
        cost: '₹40,000',
        contractor: 'GMC Hydro Works Crew',
        status: 'Completed'
      },
      {
        date: '18 Jul 2025',
        repair: 'Valve Gasket Replacement',
        issue: 'Pressure Drop',
        cost: '₹35,000',
        contractor: 'AP Water Board Contractors',
        status: 'Completed'
      }
    ],
    inspections: [
      {
        date: '21 Aug 2026',
        inspector: 'Insp. Kenneth Cole',
        finding: 'High-Pressure Rupture & Subgrade Washout',
        condition: 'Critical',
        action: 'Isolate Feeder Valve & Clamp'
      },
      {
        date: '02 Jan 2026',
        inspector: 'Insp. Suresh Babu',
        finding: 'Joint Seepage near Railway Line',
        condition: 'High',
        action: 'Clamp Joint Sealing'
      }
    ]
  },
  'E-044': {
    assetId: 'E-044',
    name: 'Arundelpet 440V Overhead Power Grid',
    location: '12th Line Arundelpet & Rythu Bazaar',
    ward: 'Ward 01 - Arundelpet Central',
    currentCondition: 'CRITICAL',
    conditionBadgeColor: 'bg-red-950 text-red-300 border-red-800',
    lastMaintenance: '10 Nov 2025',
    nextMaintenanceDue: 'OVERDUE',
    nextMaintenanceType: 'Overhead Conductor Retensioning & Insulator Overhaul',
    nextMaintenanceStatus: 'OVERDUE — Immediate Action Required',
    totalMaintenanceCostFormatted: '₹62,000',
    totalMaintenanceCostINR: 62000,
    conditionHistory: [
      { year: '2024', status: 'GOOD', color: 'text-emerald-400 border-emerald-500' },
      { year: '2025', status: 'FAIR', color: 'text-amber-400 border-amber-500' },
      { year: 'CURRENT', status: 'CRITICAL', color: 'text-red-400 border-red-500 font-black' }
    ],
    previousIssues: [
      { issue: 'Cable Sagging', count: 3, icon: '⚡' },
      { issue: 'Insulator Flashover', count: 2, icon: '🔥' },
      { issue: 'Tree Branch Interference', count: 4, icon: '🌳' }
    ],
    timeline: [
      {
        year: '2025',
        date: '10 Nov 2025',
        title: 'Overhead Cross-Arm Re-alignment',
        cost: '₹22,000',
        status: 'Completed',
        badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-500/40',
        note: 'Reinforced pole bracket near Rythu Bazaar.'
      }
    ],
    repairs: [
      {
        date: '10 Nov 2025',
        repair: 'Cross-Arm Realignment',
        issue: 'Cable Sag',
        cost: '₹22,000',
        contractor: 'APCPDCL Lineman Squad',
        status: 'Completed'
      }
    ],
    inspections: [
      {
        date: '21 Aug 2026',
        inspector: 'Lineman Jordan Bell',
        finding: 'Overhead 440V Conductor Sagging at 1.82m',
        condition: 'Critical',
        action: 'De-energize & Restring'
      }
    ]
  },
  'D-018': {
    assetId: 'D-018',
    name: 'Old Guntur Trunk Outfall Drain Channel',
    location: 'Old Guntur Trunk Road & Jinnah Tower',
    ward: 'Ward 08 - Old Guntur',
    currentCondition: 'POOR',
    conditionBadgeColor: 'bg-orange-950 text-orange-300 border-orange-800',
    lastMaintenance: '28 Dec 2025',
    nextMaintenanceDue: '05 Sep 2026',
    nextMaintenanceType: 'Hydraulic De-Silting & SWM Grate Repair',
    nextMaintenanceStatus: 'UPCOMING',
    totalMaintenanceCostFormatted: '₹88,000',
    totalMaintenanceCostINR: 88000,
    conditionHistory: [
      { year: '2024', status: 'FAIR', color: 'text-amber-400 border-amber-500' },
      { year: '2025', status: 'FAIR', color: 'text-amber-400 border-amber-500' },
      { year: 'CURRENT', status: 'POOR', color: 'text-orange-400 border-orange-500 font-bold' }
    ],
    previousIssues: [
      { issue: 'Silt Clog & Overflow', count: 5, icon: '🌊' },
      { issue: 'Solid Waste Dumping', count: 4, icon: '🗑️' }
    ],
    timeline: [
      {
        year: '2025',
        date: '28 Dec 2025',
        title: 'Deep Silt Extraction',
        cost: '₹38,000',
        status: 'Completed',
        badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-500/40',
        note: 'Cleared 2.4 km section of masonry outfall drain.'
      }
    ],
    repairs: [
      {
        date: '28 Dec 2025',
        repair: 'Silt Extraction & Excavation',
        issue: 'Drainage Overflow',
        cost: '₹38,000',
        contractor: 'GMC Public Health Wing',
        status: 'Completed'
      }
    ],
    inspections: [
      {
        date: '21 Aug 2026',
        inspector: 'Insp. Sarah Jenkins',
        finding: 'Heavy Debris & Silt Obstruction',
        condition: 'High',
        action: 'Deploy Jetting & Compactor'
      }
    ]
  }
};

export const MaintenanceHistoryDrawer = ({ activeAssetId = 'R-104', activeComplaint, onInspectTicket }) => {
  const { complaints, setSelectedComplaint } = useGrievance();

  // If activeComplaint exists, determine initial asset code matching complaint category
  const defaultAssetKey = activeComplaint ? (
    activeComplaint.category?.toLowerCase().includes('road') || activeComplaint.category?.toLowerCase().includes('pothole') ? 'R-104' :
    activeComplaint.category?.toLowerCase().includes('water') || activeComplaint.category?.toLowerCase().includes('pipe') ? 'W-009' :
    activeComplaint.category?.toLowerCase().includes('electric') || activeComplaint.category?.toLowerCase().includes('power') ? 'E-044' :
    activeComplaint.category?.toLowerCase().includes('drain') || activeComplaint.category?.toLowerCase().includes('waste') ? 'D-018' : 'R-104'
  ) : (ASSETS_REGISTRY[activeAssetId] ? activeAssetId : 'R-104');

  const [selectedAssetKey, setSelectedAssetKey] = useState(defaultAssetKey);
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'MAINTENANCE' | 'REPAIRS' | 'INSPECTIONS' | 'ISSUES' | 'COSTS'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const baseAsset = ASSETS_REGISTRY[selectedAssetKey] || ASSETS_REGISTRY['R-104'];

  // Resolve or dynamically synthesize the asset record based on the active scanned complaint
  const asset = React.useMemo(() => {
    if (!activeComplaint) return baseAsset;

    const cat = (activeComplaint.category || '').toLowerCase();
    const isRoad = cat.includes('road') || cat.includes('pothole') || cat.includes('asphalt');
    const isWater = cat.includes('water') || cat.includes('pipe') || cat.includes('drain');
    const isElectric = cat.includes('electric') || cat.includes('power');
    const isBridge = cat.includes('bridge') || cat.includes('flyover');

    const severity = activeComplaint.aiAnalysis?.severity || (activeComplaint.aiAnalysis?.riskScore >= 80 ? 'CRITICAL' : 'HIGH');
    const costEstimate = isRoad ? '₹45,000' : isBridge ? '₹1,20,000' : isWater ? '₹35,000' : '₹25,000';

    return {
      ...baseAsset,
      name: activeComplaint.title || baseAsset.name,
      location: activeComplaint.location?.address || activeComplaint.location?.landmark || baseAsset.location,
      ward: activeComplaint.location?.ward || baseAsset.ward,
      currentCondition: severity,
      conditionBadgeColor: severity === 'CRITICAL' ? 'bg-red-950 text-red-300 border-red-800' : 'bg-amber-950 text-amber-300 border-amber-800',
      lastMaintenance: '28 Aug 2026 (Live AI Scan)',
      nextMaintenanceDue: severity === 'CRITICAL' ? 'Immediate SLA (4h)' : '24-48 Hours',
      nextMaintenanceType: isRoad 
        ? 'Hot-Mix Bituminous Cavity Milling & Compaction' 
        : isBridge 
        ? 'Structural Joint Rehabilitation & NDT Ultrasound' 
        : 'Hydro-Static Pressure Sealing & Conduit Clearance',
      nextMaintenanceStatus: 'SCHEDULED',
      totalMaintenanceCostFormatted: costEstimate,
      conditionHistory: [
        { year: '2024', status: 'GOOD', color: 'text-emerald-400 border-emerald-500' },
        { year: '2025', status: 'FAIR', color: 'text-amber-400 border-amber-500' },
        { year: '2026', status: 'POOR', color: 'text-orange-400 border-orange-500' },
        { year: 'CURRENT', status: severity, color: severity === 'CRITICAL' ? 'text-red-400 border-red-500 font-black' : 'text-amber-400 border-amber-500 font-black' }
      ],
      timeline: [
        {
          year: '2026',
          date: '28 Aug 2026 (Today)',
          title: `AI Inspection: ${activeComplaint.title || 'Surface Cavitation & Structural Defect'}`,
          cost: costEstimate,
          status: 'AI Scanned',
          badgeColor: 'bg-red-950 text-red-300 border-red-800',
          note: activeComplaint.description || 'Multi-stage computer vision confirmed localized substrate deterioration.'
        },
        ...baseAsset.timeline
      ],
      repairs: [
        {
          date: '28 Aug 2026',
          repair: isRoad ? 'Pothole Milling & Infill' : 'Infrastructure Rapid Repair',
          issue: activeComplaint.title || 'Surface Defect',
          cost: costEstimate,
          contractor: 'GMC Quick Response Team 01',
          status: 'In Progress'
        },
        ...baseAsset.repairs
      ]
    };
  }, [baseAsset, activeComplaint]);

  // Dynamically linked grievances for this asset
  const liveLinkedComplaints = (complaints || []).filter(c => matchesAsset(c, selectedAssetKey));
  const hasActiveCriticalIssues = liveLinkedComplaints.some(
    c => c.aiAnalysis?.severity === 'CRITICAL' || c.aiAnalysis?.riskScore >= 75
  );

  // Filter repairs
  const filteredRepairs = asset.repairs.filter((r) => {
    const matchSearch =
      r.repair.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.contractor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.date.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || r.status.toUpperCase() === statusFilter.toUpperCase();
    return matchSearch && matchStatus;
  });

  // Filter inspections
  const filteredInspections = asset.inspections.filter((ins) => {
    return (
      ins.inspector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ins.finding.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ins.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ins.date.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return 'bg-emerald-950 text-emerald-300 border-emerald-500/40';
      case 'IN PROGRESS':
        return 'bg-blue-950 text-blue-300 border-blue-500/40';
      case 'PENDING':
        return 'bg-amber-950 text-amber-300 border-amber-500/40';
      case 'DELAYED':
        return 'bg-orange-950 text-orange-300 border-orange-500/40';
      case 'CANCELLED':
        return 'bg-zinc-800 text-zinc-400 border-zinc-600';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-600';
    }
  };

  return (
    <div className="charcoal-glass rounded-[2.5rem] border border-white/20 shadow-2xl p-6 sm:p-8 space-y-6 text-zinc-100 relative overflow-hidden">
      {/* Top Specular Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

      {/* Header & Asset Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center font-bold shadow-inner">
            <History className="w-5 h-5 drop-shadow-[0_0_8px_#ffffff]" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-white">
              ASSET MAINTENANCE HISTORY & AUDIT REGISTRY
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Engineering Record System • Chronological repairs, inspections, condition changes, and next maintenance schedule
            </p>
          </div>
        </div>

        {/* Dynamic Asset Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-zinc-400">Select Asset:</span>
          <select
            value={selectedAssetKey}
            onChange={(e) => setSelectedAssetKey(e.target.value)}
            className="charcoal-glass-input px-3.5 py-2 text-xs rounded-xl font-mono font-bold text-white focus:outline-none"
          >
            {Object.entries(ASSETS_REGISTRY).map(([key, item]) => (
              <option key={key} value={key} className="bg-zinc-950 text-white">
                {item.assetId} — {item.name.split(' ')[0]} ({item.ward.split('-')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TOP STRUCTURED ASSET SUMMARY DASHBOARD */}
      <div className="charcoal-glass-card rounded-2xl p-5 border border-white/15 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="obsidian-pill-glass px-2.5 py-0.5 text-[10px] font-mono font-bold text-white">
                Asset: {asset.assetId}
              </span>
              <span className="text-xs font-mono text-zinc-300">
                {asset.location}
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white mt-1">
              {asset.name}
            </h4>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right font-mono">
              <span className="text-[10px] text-zinc-400 uppercase block">Current Condition</span>
              <span className={`px-3 py-1 rounded-full text-xs font-black border ${hasActiveCriticalIssues ? 'bg-red-950 text-red-300 border-red-800 animate-pulse' : asset.conditionBadgeColor} inline-block mt-0.5`}>
                {hasActiveCriticalIssues ? 'CRITICAL (ACTIVE HAZARD)' : asset.currentCondition}
              </span>
            </div>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-black/40 border border-white/10">
            <span className="text-[10px] text-zinc-400 block uppercase">Last Maintenance</span>
            <p className="text-sm font-bold text-white mt-1">{asset.lastMaintenance}</p>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/10">
            <span className="text-[10px] text-zinc-400 block uppercase">Next Maintenance Due</span>
            <p className={`text-sm font-bold mt-1 ${asset.nextMaintenanceDue === 'OVERDUE' || hasActiveCriticalIssues ? 'text-red-400 animate-pulse' : 'text-white'}`}>
              {hasActiveCriticalIssues ? 'URGENT AI ACTION' : asset.nextMaintenanceDue}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/10">
            <span className="text-[10px] text-zinc-400 block uppercase">Total Maintenance Cost</span>
            <p className="text-sm font-bold text-emerald-300 mt-1">{asset.totalMaintenanceCostFormatted}</p>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/10">
            <span className="text-[10px] text-zinc-400 block uppercase">Active Linked Incidents</span>
            <p className="text-sm font-bold text-cyan-300 mt-1">
              {liveLinkedComplaints.length} Live Tickets
            </p>
          </div>
        </div>
      </div>

      {/* 0. LIVE AUTOMATED INCIDENTS & CITIZEN GRIEVANCE FEED */}
      <div className="charcoal-glass-card rounded-2xl p-5 border border-cyan-500/30 space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white font-display">
                  Live Registered Defect Feed (Automated Ingestion)
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 animate-pulse">
                  {liveLinkedComplaints.length} Linked Tickets
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">
                Real-time citizen grievances and sensor logs automatically mapped to {asset.assetId} corridor
              </p>
            </div>
          </div>
        </div>

        {liveLinkedComplaints.length === 0 ? (
          <div className="text-center py-6 text-xs text-zinc-500 font-mono">
            No unaddressed grievances currently open for this asset corridor.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {liveLinkedComplaints.map((c) => (
              <div
                key={c._id || c.ticketId}
                className="p-3.5 rounded-xl bg-black/60 border border-white/15 hover:border-white/40 transition-all flex gap-3 text-xs justify-between items-center group"
              >
                <div className="flex gap-3 items-center min-w-0">
                  {c.imageUrl && (
                    <img
                      src={c.imageUrl}
                      alt="Evidence"
                      className="w-12 h-12 rounded-lg object-cover border border-white/20 shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[11px] font-bold text-cyan-300">{c.ticketId}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
                        c.aiAnalysis?.severity === 'CRITICAL'
                          ? 'bg-red-950 text-red-300 border-red-800'
                          : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}>
                        {c.aiAnalysis?.severity || 'ACTIVE'} • Risk {c.aiAnalysis?.riskScore || 80}/100
                      </span>
                    </div>
                    <h5 className="font-bold text-white line-clamp-1 text-xs">{c.title}</h5>
                    <p className="text-[10px] text-zinc-400 font-mono line-clamp-1 mt-0.5">
                      {c.location?.address || c.location?.ward}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (typeof setSelectedComplaint === 'function') setSelectedComplaint(c);
                    if (typeof onInspectTicket === 'function') onInspectTicket(c);
                  }}
                  className="px-3 py-2 rounded-xl charcoal-pill hover:border-white text-zinc-300 hover:text-white transition-all text-[10px] font-mono font-bold shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <span>Inspect</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="charcoal-glass p-3 rounded-2xl border border-white/15 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
          {[
            { id: 'ALL', label: 'All Records' },
            { id: 'MAINTENANCE', label: 'Timeline' },
            { id: 'REPAIRS', label: 'Repairs Table' },
            { id: 'INSPECTIONS', label: 'Inspections' },
            { id: 'ISSUES', label: 'Previous Issues' },
            { id: 'COSTS', label: 'Cost Breakdown' }
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl font-mono text-[11px] transition-all cursor-pointer ${
                activeFilter === f.id
                  ? 'white-gloss-btn shadow-md text-black font-bold'
                  : 'obsidian-pill-glass text-zinc-300 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search maintenance history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="charcoal-glass-input w-full pl-8 pr-3 py-1.5 text-xs rounded-xl text-white placeholder:text-zinc-500 focus:outline-none font-mono"
          />
        </div>
      </div>

      {/* 1. ASSET CONDITION HISTORY PROGRESSION & NEXT MAINTENANCE DUE */}
      {(activeFilter === 'ALL' || activeFilter === 'MAINTENANCE') && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Condition Progression */}
          <div className="md:col-span-6 charcoal-glass p-5 rounded-2xl border border-white/15 space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-zinc-300 block">
              7. Asset Condition History (Progression)
            </span>
            <div className="flex items-center justify-between gap-2 pt-2">
              {asset.conditionHistory.map((ch, idx) => (
                <React.Fragment key={ch.year}>
                  <div className="flex flex-col items-center text-center">
                    <span className="text-[10px] font-mono text-zinc-400">{ch.year}</span>
                    <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold mt-1 ${ch.color}`}>
                      {ch.status}
                    </span>
                  </div>
                  {idx < asset.conditionHistory.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Next Maintenance Due Card */}
          <div className="md:col-span-6 charcoal-glass p-5 rounded-2xl border border-white/15 space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-zinc-300">
                8. Next Maintenance Due
              </span>
              <span className={`px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                asset.nextMaintenanceDue === 'OVERDUE'
                  ? 'bg-red-950 text-red-300 border border-red-800'
                  : 'bg-blue-950 text-blue-300 border border-blue-800'
              }`}>
                {asset.nextMaintenanceStatus}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/10 font-mono text-xs space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>Scheduled Due Date:</span>
                <span className="text-white font-bold">{asset.nextMaintenanceDue}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Maintenance Type:</span>
                <span className="text-zinc-200">{asset.nextMaintenanceType}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CHRONOLOGICAL MAINTENANCE TIMELINE */}
      {(activeFilter === 'ALL' || activeFilter === 'MAINTENANCE') && (
        <div className="charcoal-glass p-5 rounded-2xl border border-white/15 space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 block">
            1. Chronological Maintenance Timeline
          </span>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/20">
            {asset.timeline.map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-white border-2 border-black shadow-[0_0_6px_#ffffff]" />
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 group-hover:border-white/30 transition-all font-mono text-xs space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{item.date}</span>
                      <span className="text-zinc-400">•</span>
                      <span className="text-zinc-200 font-semibold">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-300 font-bold">{item.cost}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${item.badgeColor}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. REPAIR HISTORY TABLE */}
      {(activeFilter === 'ALL' || activeFilter === 'REPAIRS' || activeFilter === 'COSTS') && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 block">
              2. Repair History Table
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              {filteredRepairs.length} Historical Intervention(s)
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/15">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-black/80 text-[10px] text-zinc-400 uppercase border-b border-white/10 sticky top-0">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Repair Type</th>
                  <th className="py-3 px-4">Issue Reported</th>
                  <th className="py-3 px-4">Repair Cost</th>
                  <th className="py-3 px-4">Team / Contractor</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-black/40">
                {filteredRepairs.map((r, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap text-zinc-300">{r.date}</td>
                    <td className="py-3 px-4 font-bold text-white">{r.repair}</td>
                    <td className="py-3 px-4 text-zinc-300">{r.issue}</td>
                    <td className="py-3 px-4 font-bold text-emerald-300 whitespace-nowrap">{r.cost}</td>
                    <td className="py-3 px-4 text-zinc-400">{r.contractor}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(r.status)}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. INSPECTION HISTORY TABLE */}
      {(activeFilter === 'ALL' || activeFilter === 'INSPECTIONS') && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 block">
              3. Inspection History Table
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              {filteredInspections.length} Official Inspection(s)
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/15">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-black/80 text-[10px] text-zinc-400 uppercase border-b border-white/10 sticky top-0">
                <tr>
                  <th className="py-3 px-4">Inspection Date</th>
                  <th className="py-3 px-4">Inspector</th>
                  <th className="py-3 px-4">Detected Issue / Finding</th>
                  <th className="py-3 px-4">Condition</th>
                  <th className="py-3 px-4">Result / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-black/40">
                {filteredInspections.map((ins, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap text-zinc-300">{ins.date}</td>
                    <td className="py-3 px-4 font-bold text-white">{ins.inspector}</td>
                    <td className="py-3 px-4 text-zinc-200">{ins.finding}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ins.condition === 'Critical' ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {ins.condition}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-300 font-sans text-[11px]">{ins.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. PREVIOUS ISSUES & FAILURES (RECURRING PROBLEMS) */}
      {(activeFilter === 'ALL' || activeFilter === 'ISSUES') && (
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 block">
            5. Previous Issues & Failure Recurrence
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {asset.previousIssues.map((iss, i) => (
              <div key={i} className="charcoal-glass p-4 rounded-2xl border border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{iss.icon}</span>
                  <div>
                    <h5 className="font-bold text-white text-xs">{iss.issue}</h5>
                    <span className="text-[10px] font-mono text-zinc-400">Recurring Defect Type</span>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-lg font-black text-amber-300">{iss.count}</span>
                  <span className="text-[10px] text-zinc-400 block">occurrences</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Sliders,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  Users,
  Wrench,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  DollarSign,
  Activity,
  Layers
} from 'lucide-react';

const PRIORITIZED_ASSETS = [
  {
    code: 'R-104',
    name: 'Lakshmipuram 4-Lane Main Road',
    issue: 'Severe 14.5cm Asphalt Crater & Sub-Base Fracture',
    location: 'Ward 04 - Lakshmipuram & Hindu College',
    severity: 92,
    publicImpact: 'HIGH',
    urgency: 'IMMEDIATE',
    recurrence: 76,
    exposure: 90,
    priorityRank: 'P1 — CRITICAL',
    costINR: 80000,
    costFormatted: '₹80,000',
    assignedTeam: 'Road Repair Team 01',
    assignedEquipment: 'Asphalt Hot-Box & 2T Compactor',
    resourceStatus: 'Assigned',
    scheduleDate: '21 Aug 2026',
    scheduleAction: 'Emergency Pothole Milling & Bituminous Compaction'
  },
  {
    code: 'E-044',
    name: 'Arundelpet 440V Power Corridor',
    issue: 'Exposed Overhead Conductor Sag at 1.82m',
    location: 'Ward 01 - Arundelpet Central & Rythu Bazaar',
    severity: 96,
    publicImpact: 'CRITICAL',
    urgency: 'IMMEDIATE',
    recurrence: 65,
    exposure: 94,
    priorityRank: 'P1 — CRITICAL',
    costINR: 25000,
    costFormatted: '₹25,000',
    assignedTeam: 'Electrical Rapid Linemen 02',
    assignedEquipment: 'Insulated Aerial Boom Lift',
    resourceStatus: 'En Route',
    scheduleDate: '21 Aug 2026',
    scheduleAction: 'Overhead Conductor Tensioning & Insulator Replacement'
  },
  {
    code: 'W-009',
    name: 'Brodipet Main Commercial Conduit',
    issue: 'High-Pressure 300mm Drinking Water Pipeline Rupture',
    location: 'Ward 02 - Brodipet 4th Line Corner',
    severity: 89,
    publicImpact: 'HIGH',
    urgency: 'HIGH',
    recurrence: 82,
    exposure: 86,
    priorityRank: 'P2 — HIGH',
    costINR: 45000,
    costFormatted: '₹45,000',
    assignedTeam: 'Hydro Isolation Unit 01',
    assignedEquipment: 'Dewatering Pump & Pipe Clamp Kit',
    resourceStatus: 'Assigned',
    scheduleDate: '22 Aug 2026',
    scheduleAction: 'Sleeve Clamp Joint Sealing & Subgrade Grouting'
  },
  {
    code: 'D-018',
    name: 'Old Guntur Trunk Outfall Drain',
    issue: 'Heavy Silt Accumulation & Commercial Debris Clog',
    location: 'Ward 08 - Old Guntur Trunk Road',
    severity: 78,
    publicImpact: 'MEDIUM',
    urgency: 'STANDARD',
    recurrence: 70,
    exposure: 74,
    priorityRank: 'P2 — HIGH',
    costINR: 35000,
    costFormatted: '₹35,000',
    assignedTeam: 'Sanitation Mechanical Unit 03',
    assignedEquipment: 'High-Pressure Jetting & Skid Loader',
    resourceStatus: 'Available',
    scheduleDate: '23 Aug 2026',
    scheduleAction: 'Drainage Channel De-Silting & SWM Clearance'
  },
  {
    code: 'B-021',
    name: 'Chuttugunta 4-Lane Railway Overbridge',
    issue: 'Deck Expansion Joint Spalling & Bearing Stress',
    location: 'Ward 39 - Chuttugunta Circle',
    severity: 74,
    publicImpact: 'HIGH',
    urgency: 'SCHEDULED',
    recurrence: 55,
    exposure: 88,
    priorityRank: 'P3 — MEDIUM',
    costINR: 120000,
    costFormatted: '₹1,20,000',
    assignedTeam: 'Bridge Structural Crew 02',
    assignedEquipment: 'Hydraulic Jacking & Elastomeric Kit',
    resourceStatus: 'Scheduled',
    scheduleDate: '26 Aug 2026',
    scheduleAction: 'Structural Joint Rehabilitation & Pier NDT Inspection'
  }
];

export const MaintenancePrioritizer = ({ onSelectComplaint }) => {
  const [selectedAsset, setSelectedAsset] = useState(PRIORITIZED_ASSETS[0]);
  const [isApproved, setIsApproved] = useState(false);

  // Budget calculations
  const totalBudget = 500000; // ₹5,00,000
  const allocatedBudget = 245000; // ₹2,45,000
  const remainingBudget = totalBudget - allocatedBudget; // ₹2,55,000

  const handleApprove = () => {
    setIsApproved(true);
    setTimeout(() => setIsApproved(false), 4000);
  };

  return (
    <div className="charcoal-glass rounded-[2.5rem] border border-white/20 shadow-2xl p-6 sm:p-8 space-y-8 text-zinc-100 relative overflow-hidden">
      {/* Top Specular Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center font-bold shadow-inner">
            <Sliders className="w-5 h-5 drop-shadow-[0_0_8px_#ffffff]" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-white">
              RESOURCE-AWARE PRIORITIZATION MANAGEMENT
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Decision Support System: What should be repaired first, and how should available resources be used?
            </p>
          </div>
        </div>

        {/* Selected Asset Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-zinc-400">Inspecting Asset:</span>
          <select
            value={selectedAsset.code}
            onChange={(e) => {
              const match = PRIORITIZED_ASSETS.find((a) => a.code === e.target.value);
              if (match) setSelectedAsset(match);
            }}
            className="charcoal-glass-input px-3 py-1.5 text-xs rounded-xl font-mono font-bold text-white focus:outline-none"
          >
            {PRIORITIZED_ASSETS.map((ast) => (
              <option key={ast.code} value={ast.code} className="bg-zinc-950 text-white">
                {ast.code} — {ast.name.split(' ')[0]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 1. SEVERITY & RISK ASSESSMENT */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>1. Severity & Risk Assessment ({selectedAsset.code} — {selectedAsset.name})</span>
          </h4>
          <span className="text-[10px] font-mono text-zinc-400">IRC:82 & CPHEEO Risk Matrix</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="charcoal-glass p-4 rounded-2xl border border-red-500/30 bg-red-950/20">
            <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block mb-1">
              Overall Risk
            </span>
            <p className="text-2xl font-black font-mono text-red-400">
              {selectedAsset.severity >= 90 ? 'CRITICAL' : 'HIGH'}
            </p>
            <span className="text-[10px] font-mono text-red-300/80">Immediate Intervention</span>
          </div>

          <div className="charcoal-glass p-4 rounded-2xl border border-white/15">
            <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block mb-1">
              Severity
            </span>
            <p className="text-2xl font-black font-mono text-white">
              {selectedAsset.severity} <span className="text-xs font-normal text-zinc-400">/ 100</span>
            </p>
            <span className="text-[10px] font-mono text-zinc-400">Structural Cavitation</span>
          </div>

          <div className="charcoal-glass p-4 rounded-2xl border border-white/15">
            <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block mb-1">
              Public Impact
            </span>
            <p className="text-2xl font-black font-mono text-amber-300">
              {selectedAsset.publicImpact}
            </p>
            <span className="text-[10px] font-mono text-zinc-400">High-Traffic Transit Corridor</span>
          </div>

          <div className="charcoal-glass p-4 rounded-2xl border border-white/15">
            <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block mb-1">
              Urgency
            </span>
            <p className="text-2xl font-black font-mono text-white">
              {selectedAsset.urgency}
            </p>
            <span className="text-[10px] font-mono text-zinc-400">Statutory SLA &lt; 4 Hours</span>
          </div>
        </div>
      </div>

      {/* 2. PRIORITY SCORE CALCULATION */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-zinc-400" />
          <span>2. Priority Score Calculation</span>
        </h4>

        <div className="charcoal-glass p-5 rounded-2xl border border-white/15 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-black/50 border border-white/10">
              <span className="text-[10px] text-zinc-400 block">Severity (35%)</span>
              <p className="text-base font-bold text-white mt-0.5">{selectedAsset.severity}</p>
            </div>
            <div className="p-3 rounded-xl bg-black/50 border border-white/10">
              <span className="text-[10px] text-zinc-400 block">Public Impact (25%)</span>
              <p className="text-base font-bold text-white mt-0.5">{selectedAsset.publicImpact === 'CRITICAL' ? 95 : selectedAsset.publicImpact === 'HIGH' ? 88 : 75}</p>
            </div>
            <div className="p-3 rounded-xl bg-black/50 border border-white/10">
              <span className="text-[10px] text-zinc-400 block">Urgency (20%)</span>
              <p className="text-base font-bold text-white mt-0.5">{selectedAsset.urgency === 'IMMEDIATE' ? 95 : 82}</p>
            </div>
            <div className="p-3 rounded-xl bg-black/50 border border-white/10">
              <span className="text-[10px] text-zinc-400 block">Recurrence (10%)</span>
              <p className="text-base font-bold text-white mt-0.5">{selectedAsset.recurrence}</p>
            </div>
            <div className="p-3 rounded-xl bg-black/50 border border-white/10">
              <span className="text-[10px] text-zinc-400 block">Exposure (10%)</span>
              <p className="text-base font-bold text-white mt-0.5">{selectedAsset.exposure}</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/70 border border-red-500/40 text-xs font-mono">
            <span className="text-zinc-300 font-bold uppercase">Final Priority Rating:</span>
            <span className="px-3 py-1 rounded-full bg-red-600 text-white font-black text-xs shadow-[0_0_10px_#ef4444]">
              {selectedAsset.priorityRank}
            </span>
          </div>
        </div>
      </div>

      {/* 3. BUDGET ALLOCATION */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          <span>3. Budget Allocation</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Budget Overview KPI Cards */}
          <div className="md:col-span-5 grid grid-cols-1 gap-3">
            <div className="charcoal-glass p-4 rounded-2xl border border-white/15">
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">Available Budget</span>
              <p className="text-2xl font-black font-mono text-white mt-1">₹5,00,000</p>
              <span className="text-[10px] font-mono text-zinc-400">GMC Monthly Infrastructure Maintenance Fund</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="charcoal-glass p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">Allocated</span>
                <p className="text-lg font-black font-mono text-emerald-300 mt-0.5">₹2,45,000</p>
                <span className="text-[10px] font-mono text-emerald-400">49% Utilized</span>
              </div>

              <div className="charcoal-glass p-3.5 rounded-2xl border border-white/15">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">Remaining</span>
                <p className="text-lg font-black font-mono text-white mt-0.5">₹2,55,000</p>
                <span className="text-[10px] font-mono text-zinc-400">Unallocated Reserve</span>
              </div>
            </div>
          </div>

          {/* Budget Consumed by Prioritized Assets */}
          <div className="md:col-span-7 charcoal-glass p-4 rounded-2xl border border-white/15 space-y-2">
            <span className="text-[11px] font-mono font-bold text-zinc-300 uppercase block">
              Budget Consumption by Prioritized Assets:
            </span>

            <div className="space-y-2 text-xs font-mono">
              {PRIORITIZED_ASSETS.map((ast) => (
                <div
                  key={ast.code}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white px-2 py-0.5 rounded bg-white/10 text-[11px]">
                      {ast.code}
                    </span>
                    <span className="text-zinc-300 text-[11px] truncate max-w-[200px]">
                      {ast.name}
                    </span>
                  </div>
                  <span className="text-white font-bold">{ast.costFormatted}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. WORKFORCE & EQUIPMENT ALLOCATION */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-blue-400" />
          <span>4. Workforce & Equipment Allocation</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="charcoal-glass p-3.5 rounded-2xl border border-white/15">
            <span className="text-[10px] text-zinc-400 uppercase font-bold block">Available Teams</span>
            <p className="text-2xl font-black text-white mt-1">4</p>
            <span className="text-[10px] text-zinc-400">GMC Rapid Units</span>
          </div>

          <div className="charcoal-glass p-3.5 rounded-2xl border border-white/15">
            <span className="text-[10px] text-zinc-400 uppercase font-bold block">Active Teams</span>
            <p className="text-2xl font-black text-emerald-400 mt-1">2</p>
            <span className="text-[10px] text-zinc-400">Currently in Field</span>
          </div>

          <div className="charcoal-glass p-3.5 rounded-2xl border border-white/15">
            <span className="text-[10px] text-zinc-400 uppercase font-bold block">Available Equipment</span>
            <p className="text-2xl font-black text-white mt-1">3</p>
            <span className="text-[10px] text-zinc-400">Reserve Machinery</span>
          </div>

          <div className="charcoal-glass p-3.5 rounded-2xl border border-white/15">
            <span className="text-[10px] text-zinc-400 uppercase font-bold block">Equipment In Use</span>
            <p className="text-2xl font-black text-amber-300 mt-1">2</p>
            <span className="text-[10px] text-zinc-400">Compactors & Lifts</span>
          </div>
        </div>

        {/* Assigned Team & Equipment Table */}
        <div className="overflow-x-auto rounded-2xl border border-white/15">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-black/70 text-[10px] text-zinc-400 uppercase border-b border-white/10">
              <tr>
                <th className="py-2.5 px-4">Asset Code</th>
                <th className="py-2.5 px-4">Assigned Team</th>
                <th className="py-2.5 px-4">Equipment Deployed</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-black/40">
              {PRIORITIZED_ASSETS.slice(0, 3).map((ast) => (
                <tr key={ast.code} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">{ast.code}</td>
                  <td className="py-3 px-4 text-zinc-200">{ast.assignedTeam}</td>
                  <td className="py-3 px-4 text-zinc-300">{ast.assignedEquipment}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ast.resourceStatus === 'En Route'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {ast.resourceStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. REPAIR SCHEDULING (TIMELINE / CALENDAR PRESENTATION) */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-purple-400" />
          <span>5. Repair Scheduling Timeline</span>
        </h4>

        <div className="charcoal-glass p-5 rounded-2xl border border-white/15 space-y-4">
          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/20">
            {PRIORITIZED_ASSETS.map((ast) => (
              <div key={ast.code} className="relative group">
                <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-white border-2 border-black shadow-[0_0_6px_#ffffff]" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 rounded-xl bg-black/40 border border-white/10 group-hover:border-white/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold font-mono text-purple-300 whitespace-nowrap">
                      {ast.scheduleDate.split(' ')[0]} {ast.scheduleDate.split(' ')[1]}
                    </span>
                    <span className="obsidian-pill-glass px-2 py-0.5 text-[10px] font-mono text-white font-bold">
                      {ast.code}
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {ast.scheduleAction}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">
                    {ast.location.split('-')[1]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. AI-BASED RESOURCE OPTIMIZATION */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>6. AI Resource Optimization (Decision Support)</span>
        </h4>

        <div className="charcoal-glass p-6 rounded-3xl border border-white/25 bg-white/[0.02] shadow-2xl space-y-4">
          <p className="text-xs text-zinc-300 font-mono">
            Based on current severity, risk, budget, workforce, and equipment across GMC Wards:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Recommended Priority Sequence */}
            <div className="md:col-span-5 p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase block">
                Recommended Execution Sequence:
              </span>
              <ol className="list-decimal list-inside space-y-1.5 text-xs font-mono text-white font-bold">
                <li>R-104 (Lakshmipuram 4-Lane Pothole)</li>
                <li>E-044 (Arundelpet Live Conductor Sag)</li>
                <li>W-009 (Brodipet Drinking Water Burst)</li>
                <li>D-018 (Old Guntur Outfall Drain Clog)</li>
                <li>B-021 (Chuttugunta ROB Joint Spall)</li>
              </ol>
            </div>

            {/* Expected Cost & Risk Reduction */}
            <div className="md:col-span-7 grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col justify-between">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">
                  Expected Cycle Cost
                </span>
                <p className="text-2xl font-black font-mono text-white mt-1">₹2,35,000</p>
                <span className="text-[10px] font-mono text-emerald-400">Within ₹5.0L Budget Cap</span>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/40 flex flex-col justify-between">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">
                  Expected Risk Reduction
                </span>
                <p className="text-2xl font-black font-mono text-emerald-300 mt-1">68%</p>
                <span className="text-[10px] font-mono text-emerald-400">High Municipal Safety ROI</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/80 border border-white/10 text-xs font-mono text-zinc-300">
            <strong className="text-white">Recommended Action:</strong> Proceed with <span className="text-white font-bold">R-104 & E-044</span> immediately with Rapid Units 01 & 02. Schedule <span className="text-white font-bold">W-009 & D-018</span> next in 24-hour maintenance shift.
          </div>

          {/* Human Approval Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] font-mono text-zinc-400">
              * Final execution authorization remains under authorized municipal executive control.
            </span>

            <button
              type="button"
              onClick={handleApprove}
              className="white-gloss-btn w-full sm:w-auto py-3 px-6 rounded-full font-black text-xs shadow-2xl flex items-center justify-center gap-2 cursor-pointer transition-all uppercase tracking-wide"
            >
              <CheckCircle2 className="w-4 h-4 text-black" />
              <span>{isApproved ? '✓ AI Resource Plan Approved & Dispatched' : 'Approve AI Resource Plan'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

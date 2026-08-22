import React, { useState, useEffect } from 'react';
import { fetchPrioritizedPlan } from '../../services/api';
import { SeverityBadge } from '../common/StatusBadge';
import {
  Sliders,
  DollarSign,
  Users,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  Truck,
  ArrowRight,
  Clock,
  ShieldAlert,
  Download
} from 'lucide-react';

export const MaintenancePrioritizer = ({ onSelectComplaint }) => {
  const [monthlyBudget, setMonthlyBudget] = useState(25000);
  const [availableCrews, setAvailableCrews] = useState(4);
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    loadPlan();
  }, [monthlyBudget, availableCrews]);

  const loadPlan = async () => {
    setLoading(true);
    try {
      const res = await fetchPrioritizedPlan({
        monthlyBudgetUSD: monthlyBudget,
        availableCrewsCount: availableCrews
      });
      if (res.success && res.data) {
        setPlanData(res.data);
      }
    } catch (err) {
      console.error('Error loading prioritization plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorizeAll = () => {
    setIsAuthorized(true);
    setTimeout(() => setIsAuthorized(false), 4000);
  };

  return (
    <div className="charcoal-glass rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8 space-y-6 text-zinc-100 relative overflow-hidden">
      {/* Top Specular White Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

      {/* Title & Resource Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center font-bold shadow-inner">
              <Sliders className="w-4 h-4 drop-shadow-[0_0_6px_#ffffff]" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-white">
                Resource-Aware Maintenance Prioritization Engine
              </h3>
              <p className="text-xs text-zinc-400">
                Optimizes municipal repair dispatch by ROI (Risk Mitigated per Dollar Spent)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Budget Slider */}
          <div className="charcoal-glass-card p-3 rounded-2xl border border-white/15 flex-1 md:w-60">
            <div className="flex justify-between text-[11px] font-bold text-zinc-300 mb-1 font-mono">
              <span>Monthly Budget:</span>
              <span className="text-white">${monthlyBudget.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="60000"
              step="5000"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>

          {/* Crews Selector */}
          <div className="charcoal-glass-card p-3 rounded-2xl border border-white/15 flex-1 md:w-40">
            <div className="flex justify-between text-[11px] font-bold text-zinc-300 mb-1 font-mono">
              <span>Crews Active:</span>
              <span className="text-white">{availableCrews} Units</span>
            </div>
            <input
              type="range"
              min="2"
              max="8"
              step="1"
              value={availableCrews}
              onChange={(e) => setAvailableCrews(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>
        </div>
      </div>

      {/* Resource Optimization KPIs */}
      {planData && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
          <div className="p-4 rounded-2xl charcoal-glass-card border border-white/10">
            <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block mb-1">
              Budget Utilization
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold font-mono text-white">
                ${planData.budgetSummary?.totalAllocatedBudgetUSD.toLocaleString()}
              </span>
              <span className="text-[11px] text-zinc-400 font-mono">
                ({planData.budgetSummary?.budgetUtilizationPct}%)
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl charcoal-glass-card border border-white/10">
            <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block mb-1">
              Total Risk Mitigated
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold font-mono text-white">
                {planData.resourceSummary?.estimatedTotalRiskMitigated} pts
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold font-mono">High ROI</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl charcoal-glass-card border border-white/10">
            <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block mb-1">
              Approved for Dispatch
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold font-mono text-white">
                {planData.resourceSummary?.scheduledWorksCount} Works
              </span>
              <span className="text-[11px] text-zinc-400 font-mono">In cycle</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl charcoal-glass-card border border-white/10">
            <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block mb-1">
              Projected SLA Compliance
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold font-mono text-white">
                {planData.resourceSummary?.projectedAverageSLACompliance}
              </span>
              <span className="text-[11px] text-zinc-400 font-mono">&lt; 24h</span>
            </div>
          </div>
        </div>
      )}

      {/* Prioritized Ranked Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/15">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/15 bg-black/60 text-zinc-400 uppercase font-mono font-bold text-[10px] tracking-wider">
              <th className="py-3.5 px-4">Priority Rank</th>
              <th className="py-3.5 px-4">Ticket ID & Hazard Defect</th>
              <th className="py-3.5 px-4">GMC Ward</th>
              <th className="py-3.5 px-4">Risk Score</th>
              <th className="py-3.5 px-4">Est. Budget</th>
              <th className="py-3.5 px-4">Assigned Shift</th>
              <th className="py-3.5 px-4">Plan Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-black/30">
            {planData?.prioritizedQueue?.map((item) => (
              <tr
                key={item.ticketId}
                onClick={() => onSelectComplaint && onSelectComplaint(item)}
                className="hover:bg-white/5 transition-colors cursor-pointer"
              >
                {/* Rank */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] font-mono ${
                    item.rank === 1 ? 'bg-red-600 text-white shadow-[0_0_6px_#ef4444]' : item.rank === 2 ? 'bg-orange-500 text-white' : 'bg-zinc-800 text-zinc-300'
                  }`}>
                    #{item.rank}
                  </span>
                </td>

                {/* Ticket & Title */}
                <td className="py-3.5 px-4 max-w-xs">
                  <div>
                    <span className="font-mono font-bold text-white text-[11px] block">{item.ticketId}</span>
                    <p className="font-bold text-zinc-200 line-clamp-1">{item.title}</p>
                    <span className="text-[10px] text-zinc-400 font-mono">{item.category}</span>
                  </div>
                </td>

                {/* Ward */}
                <td className="py-3.5 px-4 text-zinc-300 whitespace-nowrap">
                  <p className="font-semibold">{item.ward}</p>
                </td>

                {/* Risk */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 font-mono font-bold">
                    <span className={`w-2 h-2 rounded-full ${item.riskScore >= 85 ? 'bg-red-500 animate-ping' : 'bg-amber-400'}`} />
                    <span className="text-white">{item.riskScore}/100</span>
                    <span className="text-[10px] text-zinc-400 font-normal">({item.severity})</span>
                  </div>
                </td>

                {/* Budget */}
                <td className="py-3.5 px-4 whitespace-nowrap font-mono font-semibold text-white">
                  ${item.estimatedCostUSD}
                </td>

                {/* Shift */}
                <td className="py-3.5 px-4 whitespace-nowrap text-zinc-300 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{item.scheduledSlot}</span>
                  </div>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase ${
                    item.allocationStatus === 'APPROVED_FOR_DISPATCH'
                      ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                      : 'bg-zinc-900 text-zinc-400 border border-white/10'
                  }`}>
                    {item.allocationStatus === 'APPROVED_FOR_DISPATCH' ? '✓ Dispatched' : 'Queued'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Action */}
      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs text-zinc-400 font-mono">
          Prioritization Plan ID: <strong className="text-white">{planData?.planId}</strong>
        </span>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleAuthorizeAll}
            className="white-gloss-btn w-full sm:w-auto px-6 py-3 font-black text-xs rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-black" />
            <span>{isAuthorized ? '✓ Dispatches Authorized in GMC Grid' : 'Authorize & Dispatch Maintenance Plan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

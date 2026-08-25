import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  User,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';

export const AlertDefectCard = ({
  complaint,
  onInspect,
  onSelectAsset,
  isSelected = false
}) => {
  const [showDrawer, setShowDrawer] = useState(false);

  const citizen = complaint.citizen;
  const isAnonymous =
    complaint.isAnonymous ||
    citizen?.anonymous ||
    !citizen?.name ||
    citizen?.name === 'Anonymous Citizen';
  const reporterName = isAnonymous ? 'Anonymous' : citizen.name;
  const submissionDate = complaint.createdAt
    ? new Date(complaint.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '21 Aug 2026';

  const defectImage =
    complaint.imageUrl ||
    complaint.resolutionProof?.beforeImageUrl ||
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80';

  const getCategoryIcon = (cat) => {
    if (cat?.includes('Road') || cat?.includes('Pothole')) return '🚧';
    if (cat?.includes('Water') || cat?.includes('Sewage')) return '💧';
    if (cat?.includes('Electrical') || cat?.includes('Wire')) return '⚡';
    if (cat?.includes('Light')) return '💡';
    if (cat?.includes('Waste') || cat?.includes('Garbage')) return '🗑️';
    if (cat?.includes('Drainage') || cat?.includes('Canal')) return '🌊';
    return '📍';
  };

  const getSeverityBadge = (sev) => {
    const s = sev?.toUpperCase() || 'MEDIUM';
    if (s === 'CRITICAL') {
      return (
        <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-red-500/15 border border-red-500/40 text-red-400">
          CRITICAL
        </span>
      );
    }
    if (s === 'HIGH') {
      return (
        <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-amber-500/15 border border-amber-500/40 text-amber-400">
          HIGH
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-cyan-500/15 border border-cyan-500/40 text-cyan-300">
        MEDIUM
      </span>
    );
  };

  return (
    <div
      className={`charcoal-glass rounded-xl border transition-all text-zinc-100 shadow-md group ${
        isSelected
          ? 'border-white shadow-[0_0_20px_rgba(255,255,255,0.25)] ring-2 ring-white/40 bg-white/[0.08]'
          : 'border-white/10 hover:border-white/30 hover:bg-white/[0.04]'
      }`}
    >
      {/* Single Compact Line Row */}
      <div className="p-2.5 sm:p-3 flex items-center justify-between gap-3">
        {/* Left: Thumbnail & Category Icon */}
        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/15 bg-black/60 flex-shrink-0">
          <img
            src={defectImage}
            alt={complaint.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <span className="absolute bottom-0 right-0 bg-black/75 px-1 text-[10px] rounded-tl">
            {getCategoryIcon(complaint.category)}
          </span>
        </div>

        {/* Center: Text Line info */}
        <div
          onClick={() => onInspect && onInspect(complaint)}
          className="flex-1 min-w-0 cursor-pointer"
        >
          {/* Top Line: Ticket ID + Title */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="obsidian-pill-glass px-1.5 py-0.2 text-[9px] font-mono font-bold text-zinc-300">
              {complaint.ticketId}
            </span>
            <h4 className="text-xs font-bold text-white truncate max-w-[280px] group-hover:text-zinc-200 transition-colors">
              {complaint.title}
            </h4>
          </div>

          {/* Bottom Line: Location • Date • Reporter */}
          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 mt-1 truncate">
            <span className="flex items-center gap-1 text-zinc-300 truncate max-w-[140px]">
              <MapPin className="w-2.5 h-2.5 text-zinc-400 flex-shrink-0" />
              <span className="truncate">{complaint.location?.ward || complaint.location?.address || 'GMC Grid'}</span>
            </span>
            <span>•</span>
            <span className="text-zinc-400">{submissionDate}</span>
            <span>•</span>
            <span className={isAnonymous ? 'text-zinc-500 italic' : 'text-zinc-300'}>{reporterName}</span>
          </div>
        </div>

        {/* Right: Severity Badge & Inspect Button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {getSeverityBadge(complaint.reportedSeverity || complaint.aiAnalysis?.severity)}

          <button
            type="button"
            onClick={() => onInspect && onInspect(complaint)}
            className="white-glass-btn-secondary px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer hover:bg-white hover:text-black"
            title="Inspect Issue"
          >
            <span>Inspect</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

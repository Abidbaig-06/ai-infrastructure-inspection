import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  User,
  ShieldAlert,
  FileText,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
  Layers,
  AlertCircle
} from 'lucide-react';

export const AlertDefectCard = ({ complaint, onInspect, onSelectAsset }) => {
  const [showComplaintsDrawer, setShowComplaintsDrawer] = useState(false);

  // Extract citizen and submission information
  const citizen = complaint.citizen;
  const isAnonymous = complaint.isAnonymous || citizen?.anonymous || !citizen?.name || citizen?.name === 'Anonymous Citizen';
  const reporterName = isAnonymous ? 'Anonymous' : citizen.name;
  const submissionType = isAnonymous ? 'Anomaly Report' : 'Citizen Portal';
  const submissionDate = complaint.createdAt
    ? new Date(complaint.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : '21 Aug 2026';

  // Extract accurate defect image associated with this specific complaint
  const defectImage =
    complaint.imageUrl ||
    complaint.resolutionProof?.beforeImageUrl ||
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80';

  // Category Icon & Badge
  const getCategoryIcon = (cat) => {
    if (cat?.includes('Road') || cat?.includes('Pothole')) return '🚧';
    if (cat?.includes('Water') || cat?.includes('Sewage')) return '💧';
    if (cat?.includes('Electrical') || cat?.includes('Wire')) return '⚡';
    if (cat?.includes('Light')) return '💡';
    if (cat?.includes('Waste') || cat?.includes('Garbage')) return '🗑️';
    if (cat?.includes('Drainage') || cat?.includes('Canal')) return '🌊';
    return '📍';
  };

  return (
    <div className="charcoal-glass rounded-2xl border border-white/15 hover:border-white/35 transition-all overflow-hidden text-zinc-100 shadow-xl flex flex-col justify-between group">
      {/* 1. Defect / Issue Title & Category */}
      <div className="p-4 sm:p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base">{getCategoryIcon(complaint.category)}</span>
            <span className="obsidian-pill-glass px-2.5 py-0.5 text-[10px] font-mono text-zinc-300">
              {complaint.ticketId}
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">
            {complaint.category?.split('&')[0]}
          </span>
        </div>

        <h4 className="text-sm font-bold text-white tracking-tight leading-snug group-hover:text-zinc-200 transition-colors">
          {complaint.title}
        </h4>

        {/* 2. Related Image: The Actual Image Associated with that Particular Alert */}
        <div className="relative rounded-xl overflow-hidden border border-white/10 h-40 bg-black/60">
          <img
            src={defectImage}
            alt={complaint.title}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-2 left-2 obsidian-pill-glass px-2 py-0.5 text-[9px] font-mono text-zinc-200 backdrop-blur-md">
            Verified Evidence Photo
          </div>
        </div>

        {/* 3. Location / Ward */}
        <div className="flex items-start gap-1.5 text-xs text-zinc-300 font-mono pt-1">
          <MapPin className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0 mt-0.5" />
          <span className="line-clamp-1">{complaint.location?.address || complaint.location?.ward || 'GMC Infrastructure Grid'}</span>
        </div>

        {/* 4. User-Submitted Issue Information (Clearly distinguishes Registered vs Anonymous) */}
        <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-[11px] font-mono space-y-1">
          <div className="flex justify-between items-center text-zinc-400">
            <span>Reported By:</span>
            <span className={isAnonymous ? 'text-zinc-400 italic' : 'text-white font-bold'}>
              {reporterName}
            </span>
          </div>

          <div className="flex justify-between items-center text-zinc-400">
            <span>Submitted Via:</span>
            <span className="text-zinc-200">{submissionType}</span>
          </div>

          <div className="flex justify-between items-center text-zinc-400">
            <span>Submitted On:</span>
            <span className="text-zinc-300">{submissionDate}</span>
          </div>

          {isAnonymous && (
            <p className="text-[10px] text-zinc-500 pt-1 border-t border-white/5 italic">
              User information was not provided.
            </p>
          )}
        </div>

        {/* 5. Related Complaint Data (Expandable Section) */}
        <div className="border-t border-white/10 pt-2">
          <button
            type="button"
            onClick={() => setShowComplaintsDrawer(!showComplaintsDrawer)}
            className="w-full flex items-center justify-between text-[11px] font-mono text-zinc-300 hover:text-white py-1 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <FileText className="w-3 h-3 text-zinc-400" />
              <span>Related Complaint Data (1 report)</span>
            </span>
            {showComplaintsDrawer ? (
              <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            )}
          </button>

          {showComplaintsDrawer && (
            <div className="mt-2 p-3 rounded-xl bg-black/80 border border-white/10 text-[10px] font-mono space-y-1.5 animate-fade-in">
              <div className="flex justify-between text-zinc-400">
                <span>Complaint ID:</span>
                <span className="text-white font-bold">{complaint.ticketId}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Complaint Type:</span>
                <span className="text-zinc-200">{complaint.category}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Location:</span>
                <span className="text-zinc-200 truncate max-w-[180px]">
                  {complaint.location?.ward || complaint.location?.address}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Submitted:</span>
                <span className="text-zinc-200">{submissionDate}</span>
              </div>
              <div className="pt-1 text-zinc-400">
                <span className="block text-zinc-500 mb-0.5">Description:</span>
                <p className="text-zinc-300 line-clamp-3 font-sans text-[11px]">
                  {complaint.description || 'Infrastructure damage reported by citizen.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 6. Inspect Issue Action Button */}
      <div className="p-4 pt-0">
        <button
          type="button"
          onClick={() => onInspect && onInspect(complaint)}
          className="white-gloss-btn w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md group-hover:scale-[1.01]"
        >
          <span>Inspect Issue</span>
          <ArrowRight className="w-3.5 h-3.5 text-black group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

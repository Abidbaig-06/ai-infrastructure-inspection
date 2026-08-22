import React from 'react';
import {
  ShieldAlert,
  Ruler,
  BookOpen,
  User,
  Smartphone,
  FileText,
  Activity,
  Wrench,
  DollarSign,
  FileCheck,
  CheckCircle,
  Clock,
  MapPin,
  Sparkles
} from 'lucide-react';

export const InspectionIntelligencePanel = ({
  sample,
  inspectionResult,
  onOpenDossier
}) => {
  // Determine defect summary data dynamically from sample & inspection result
  const defectTitle =
    inspectionResult?.visionDefects?.[0]?.defectType ||
    sample?.title ||
    'Alligator Cracking & Asphalt Spalling';

  const severity = inspectionResult?.severity || 'CRITICAL';
  const dimensions =
    inspectionResult?.visionDefects?.[0]?.dimensions ||
    'Length: 2.8m, Width: 1.6m, Depth: 14.5cm';

  const statutoryRef =
    inspectionResult?.visionDefects?.[0]?.ircCodeStandard ||
    'IRC:82-2015 Pavement Maintenance Standard (Severity III)';

  // Reporter & Submission Source logic
  const isAnonymous = sample?.isAnonymous || false;
  const inspectorName = isAnonymous ? 'Anonymous' : (sample?.inspectorName || 'Ramesh Kumar');
  const inspectorRole = isAnonymous
    ? 'User information was not provided'
    : 'Field Inspector, GMC - Engineering Department';
  const inspectionDate = sample?.inspectionDate || '21 Aug 2026, 09:42 AM';
  const submissionSource = isAnonymous ? 'AI Anomaly Detection' : 'Field Inspection App';
  const submissionStatus = isAnonymous ? 'User data not provided' : 'User Data Provided';

  // Related complaints (2) specifically linked to current defect location & category
  const relatedComplaints = sample?.relatedComplaints || [
    {
      ticketId: 'CP-2026-7701',
      title: 'Water logging and pothole causing vehicle damage.',
      reporter: 'John D.',
      date: '20 Aug 2026, 08:15 AM',
      status: 'OPEN',
      statusColor: 'bg-red-950 text-red-300 border-red-800'
    },
    {
      ticketId: 'CP-2026-7332',
      title: 'Deep pothole on main road, difficult for commuters.',
      reporter: 'Priya S.',
      date: '18 Aug 2026, 11:03 AM',
      status: 'IN PROGRESS',
      statusColor: 'bg-amber-950 text-amber-300 border-amber-800'
    }
  ];

  // Engineering recommendation & BOQ cost
  const recommendedAction =
    inspectionResult?.engineeringRecommendations?.recommendedAction ||
    'Immediate Emergency Full-Depth Patching & Sub-Base Grouting';

  const estimatedCostUSD = inspectionResult?.engineeringRecommendations?.estimatedCostUSD || 872;
  const estimatedCostINR = Math.round(estimatedCostUSD * 83.5);

  // Risk scores
  const compositeScore = inspectionResult?.compositeRiskScore || 93;
  const structuralScore = inspectionResult?.multiFactorBreakdown?.structuralSeverity || 95;
  const trafficScore = inspectionResult?.multiFactorBreakdown?.trafficExposure || 92;
  const weatherScore = inspectionResult?.multiFactorBreakdown?.weatherVulnerability || 88;

  return (
    <div className="charcoal-glass rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-7 space-y-5 text-zinc-100 relative overflow-hidden flex flex-col justify-between">
      {/* Top Specular White Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

      {/* 1. DEFECT SUMMARY & STATUS BADGE */}
      <div className="space-y-3 pb-4 border-b border-white/10">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>DEFECT SUMMARY</span>
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-red-950 text-red-300 border border-red-700 shadow-[0_0_10px_rgba(239,68,68,0.3)] uppercase">
            {severity} SEVERITY
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
          {defectTitle}
        </h3>

        {/* Two-Column Engineering Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-2xl bg-black/50 border border-white/10 space-y-1">
            <span className="text-[10px] font-mono text-zinc-400 uppercase flex items-center gap-1">
              <Ruler className="w-3 h-3 text-zinc-400" />
              <span>Physical Dimensions</span>
            </span>
            <p className="text-xs font-mono font-bold text-white">
              {dimensions}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-black/50 border border-white/10 space-y-1">
            <span className="text-[10px] font-mono text-zinc-400 uppercase flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-zinc-400" />
              <span>Statutory Reference</span>
            </span>
            <p className="text-xs font-mono font-bold text-zinc-200">
              {statutoryRef}
            </p>
          </div>
        </div>
      </div>

      {/* 2. INSPECTION SOURCE & UPLOADER */}
      <div className="space-y-2 pb-4 border-b border-white/10">
        <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 tracking-wider block">
          INSPECTION SOURCE
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Uploaded By */}
          <div className="p-3 rounded-2xl bg-black/40 border border-white/10 font-mono text-xs space-y-1">
            <span className="text-[10px] text-zinc-400 block uppercase">Uploaded By:</span>
            <p className="font-bold text-white">{inspectorName}</p>
            <p className="text-[10px] text-zinc-400 font-sans">{inspectorRole}</p>
            <p className="text-[10px] text-zinc-500 pt-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3 text-zinc-500" />
              <span>{inspectionDate}</span>
            </p>
          </div>

          {/* Submission Source */}
          <div className="p-3 rounded-2xl bg-black/40 border border-white/10 font-mono text-xs space-y-1">
            <span className="text-[10px] text-zinc-400 block uppercase">Submission Source:</span>
            <p className="font-bold text-zinc-200 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-zinc-400" />
              <span>{submissionSource}</span>
            </p>
            <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold mt-1 ${
              isAnonymous ? 'bg-zinc-800 text-zinc-400 border border-zinc-700' : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
            }`}>
              {submissionStatus}
            </span>
          </div>
        </div>
      </div>

      {/* 3. RELATED COMPLAINTS (2) */}
      <div className="space-y-2.5 pb-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 tracking-wider flex items-center gap-1.5">
            <FileText className="w-3 h-3 text-zinc-400" />
            <span>Related Complaints ({relatedComplaints.length})</span>
          </span>
          <span className="text-[10px] font-mono text-zinc-500">Connected to Location</span>
        </div>

        <div className="space-y-2">
          {relatedComplaints.map((c) => (
            <div
              key={c.ticketId}
              className="p-3 rounded-xl bg-black/40 border border-white/10 hover:border-white/25 transition-all text-xs font-mono space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{c.ticketId}</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${c.statusColor}`}>
                  {c.status}
                </span>
              </div>
              <p className="text-zinc-300 font-sans text-[11px] leading-tight">
                {c.title}
              </p>
              <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-0.5">
                <span>{c.reporter}</span>
                <span>{c.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. ENGINEERING RECOMMENDATION & BOQ */}
      <div className="space-y-3 pt-1">
        <div>
          <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 tracking-wider block mb-1">
            Recommended Engineering Action
          </span>
          <p className="text-xs text-zinc-200 font-medium leading-snug">
            {recommendedAction}
          </p>
        </div>

        <div className="flex items-center justify-between font-mono">
          <span className="text-[10px] uppercase font-bold text-zinc-400">Estimated Cost:</span>
          <span className="text-sm font-extrabold text-white">
            ₹{estimatedCostINR.toLocaleString()} <span className="text-[10px] font-normal text-zinc-400">(${estimatedCostUSD}.00 USD)</span>
          </span>
        </div>

        {/* View Statutory Dossier Button */}
        <button
          type="button"
          onClick={onOpenDossier}
          className="white-gloss-btn w-full py-3 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl"
        >
          <FileCheck className="w-4 h-4 text-black" />
          <span>View Statutory Dossier</span>
        </button>
      </div>
    </div>
  );
};

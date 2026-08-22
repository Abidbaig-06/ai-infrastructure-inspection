import React, { useState } from 'react';
import { SeverityBadge, StatusBadge } from '../common/StatusBadge';
import {
  X,
  Sparkles,
  ShieldAlert,
  Wrench,
  DollarSign,
  Clock,
  MapPin,
  Truck,
  CheckCircle2,
  FileSpreadsheet,
  AlertTriangle,
  Send,
  User,
  Phone
} from 'lucide-react';
import { useGrievance } from '../../context/GrievanceContext';
import { useAuth } from '../../context/AuthContext';

export const AIAnalysisModal = ({
  complaint,
  isOpen,
  onClose,
  onOpenDispatch,
  onOpenWorkOrder
}) => {
  const { updateStatus, resolveComplaint } = useGrievance();
  const { currentUser } = useAuth();
  const [isResolving, setIsResolving] = useState(false);
  const [resolveNote, setResolveNote] = useState('');
  const [afterImage, setAfterImage] = useState('https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop&q=80');

  if (!isOpen || !complaint) return null;

  const ai = complaint.aiAnalysis || {};
  const isResolved = complaint.status === 'RESOLVED';

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    try {
      await resolveComplaint(complaint._id || complaint.ticketId, {
        resolvedBy: `${currentUser?.name || 'Officer'} (${currentUser?.badgeNumber || 'ENG-01'})`,
        resolutionNotes: resolveNote || 'Field repairs completed and quality inspected according to municipal code standards.',
        afterImageUrl: afterImage,
        citizenFeedbackRating: 5
      });
      setIsResolving(false);
    } catch (err) {
      alert('Error resolving complaint: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="charcoal-glass rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-white/25 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh] text-zinc-100 relative">
        {/* Top Specular White Light Beam */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

        {/* Modal Header */}
        <div className="p-6 flex items-center justify-between gap-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-inner">
              <Sparkles className="w-5 h-5 drop-shadow-[0_0_6px_#ffffff]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono text-sm font-bold text-white tracking-wider">
                  {complaint.ticketId}
                </span>
                <SeverityBadge severity={ai.severity} />
                <StatusBadge status={complaint.status} />
              </div>
              <h3 className="text-base font-bold font-display text-zinc-200 line-clamp-1">
                {complaint.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl charcoal-pill hover:border-white/50 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Grid: Image with Vision Detection Overlay & Risk Index Meter */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Image with Vision Defect Overlay */}
            <div className="md:col-span-7 space-y-2">
              <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider block">
                Citizen Photo & AI Vision Bounding Tag
              </span>
              <div className="relative rounded-2xl overflow-hidden bg-black border border-white/20 shadow-inner group">
                <img
                  src={complaint.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80'}
                  alt={complaint.title}
                  className="w-full h-64 object-cover object-center opacity-95"
                />

                {/* Simulated Computer Vision Detection Bounding Box */}
                <div className="absolute inset-x-8 inset-y-12 border-2 border-dashed border-white rounded-xl pointer-events-none bg-white/10 flex items-start justify-start p-2 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  <span className="bg-black text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-md shadow border border-white/40">
                    AI DEFECT DETECTED: {complaint.category?.toUpperCase()} ({Math.round((ai.confidenceScore || 0.95) * 100)}% CONFIDENCE)
                  </span>
                </div>

                {/* Location overlay footer */}
                <div className="absolute bottom-0 inset-x-0 bg-black/80 backdrop-blur-md p-3 text-white text-xs border-t border-white/10">
                  <p className="font-semibold truncate">📍 {complaint.location?.address}</p>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    🏛️ {complaint.location?.ward} ({complaint.location?.zone})
                  </p>
                </div>
              </div>
            </div>

            {/* Right: AI Risk Gauge & Composite Score */}
            <div className="md:col-span-5 charcoal-glass-card rounded-2xl p-5 border border-white/20 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                    AI Hazard Risk Index
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    v3.4-Neural
                  </span>
                </div>

                {/* Risk Gauge Bar */}
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold font-mono text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                    {ai.riskScore || 50}
                  </span>
                  <span className="text-sm font-semibold text-zinc-400">/ 100</span>
                  <span className="ml-auto px-2.5 py-0.5 rounded-md text-xs font-bold font-mono bg-red-950 text-red-300 border border-red-800">
                    {ai.severity || 'MEDIUM'}
                  </span>
                </div>

                <div className="w-full bg-zinc-900 rounded-full h-2 mt-2.5 overflow-hidden border border-white/10">
                  <div
                    className={`h-2 rounded-full ${
                      (ai.riskScore || 50) > 80
                        ? 'bg-red-500 shadow-[0_0_6px_#ef4444]'
                        : (ai.riskScore || 50) > 60
                        ? 'bg-orange-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${ai.riskScore || 50}%` }}
                  />
                </div>
              </div>

              {/* Metric Breakdown */}
              <div className="space-y-2.5 text-xs pt-3 border-t border-white/10">
                <div className="flex justify-between items-center text-zinc-300">
                  <span>Urgency Tier:</span>
                  <strong className="text-white font-mono">{ai.urgencyLevel || 'Standard'}</strong>
                </div>
                <div className="flex justify-between items-center text-zinc-300">
                  <span>Statutory SLA:</span>
                  <strong className="text-white font-mono">{ai.slaHours || 48} Hours</strong>
                </div>
                <div className="flex justify-between items-center text-zinc-300">
                  <span>Estimated Budget:</span>
                  <strong className="text-white font-mono">
                    ${ai.estimatedCost?.min || 300} - ${ai.estimatedCost?.max || 750}
                  </strong>
                </div>
                <div className="flex justify-between items-center text-zinc-300">
                  <span>Assigned Dept:</span>
                  <strong className="text-white truncate max-w-[170px]">
                    {ai.assignedDepartment || 'Public Works'}
                  </strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-[11px] text-zinc-300">
                <strong className="text-white block mb-0.5 font-mono">⚠️ Safety Directive:</strong>
                {ai.safetyPrecaution || 'Standard traffic cones and perimeter barrier required.'}
              </div>
            </div>
          </div>

          {/* Detected Hazards & Equipment List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4.5 rounded-2xl charcoal-glass-card border border-white/10">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-white" />
                Detected Structural Anomalies
              </h4>
              <ul className="space-y-1.5 text-xs text-zinc-300">
                {ai.detectedHazards?.map((hazard, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-white font-bold">•</span>
                    <span>{hazard}</span>
                  </li>
                )) || <li>General infrastructure defect detected.</li>}
              </ul>
            </div>

            <div className="p-4.5 rounded-2xl charcoal-glass-card border border-white/10">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-white" />
                Recommended Machinery & Materials
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {ai.recommendedEquipment?.map((eq, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-[11px] font-mono rounded-lg charcoal-pill text-zinc-200"
                  >
                    ⚙️ {eq}
                  </span>
                )) || <span className="text-xs text-zinc-400">Standard Tool Truck</span>}
              </div>
            </div>
          </div>

          {/* Citizen Details & Description */}
          <div className="p-4.5 rounded-2xl charcoal-glass-card border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-white uppercase tracking-wider">
                Citizen Statement & Contact
              </span>
              <span className="text-zinc-400 font-mono">
                Filed by: <strong className="text-white">{complaint.citizen?.name || 'Anonymous'}</strong> ({complaint.citizen?.phone})
              </span>
            </div>
            <p className="text-xs text-zinc-300 bg-black/40 p-3 rounded-xl border border-white/10 leading-relaxed font-sans">
              "{complaint.description}"
            </p>
          </div>

          {/* Assigned Crew Section if Dispatched */}
          {complaint.assignedCrew?.crewId && (
            <div className="p-4.5 rounded-2xl charcoal-glass-card border border-white/15 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-white" />
                  Assigned Maintenance Crew
                </span>
                <span className="font-mono font-bold text-white charcoal-pill px-2.5 py-0.5 rounded-md">
                  {complaint.assignedCrew.crewId}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-zinc-300">
                <div>
                  <span className="text-zinc-500 block text-[10px] font-mono">Team Supervisor:</span>
                  <strong className="text-white">{complaint.assignedCrew.teamLead}</strong>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] font-mono">Dispatch ETA:</span>
                  <strong className="text-white">{complaint.assignedCrew.etaMinutes || 20} Minutes</strong>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] font-mono">Contact Line:</span>
                  <strong className="font-mono text-white">{complaint.assignedCrew.contactPhone}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Resolution Proof Card if Resolved */}
          {isResolved && complaint.resolutionProof && (
            <div className="p-4.5 rounded-2xl charcoal-glass-card border border-emerald-500/40 text-xs space-y-3">
              <div className="flex items-center gap-2 text-emerald-300 font-bold uppercase tracking-wider font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verified Field Resolution Record</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {complaint.resolutionProof.afterImageUrl && (
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-emerald-300 block mb-1">
                      Post-Repair Photo Proof
                    </span>
                    <img
                      src={complaint.resolutionProof.afterImageUrl}
                      alt="Resolution Proof"
                      className="w-full h-36 object-cover rounded-xl border border-emerald-400/40"
                    />
                  </div>
                )}
                <div className="space-y-1 text-zinc-300">
                  <span className="text-[10px] uppercase font-mono font-bold text-emerald-300 block mb-1">
                    Inspection Notes
                  </span>
                  <p className="bg-black/40 p-2.5 rounded-xl border border-white/10 text-[11px]">
                    {complaint.resolutionProof.resolutionNotes}
                  </p>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    Resolved By: <strong className="text-white">{complaint.resolutionProof.resolvedBy}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Corrective Completion Form Drawer if marking resolved */}
          {isResolving && (
            <form onSubmit={handleResolveSubmit} className="p-4.5 rounded-2xl charcoal-glass border border-white/30 space-y-3 text-xs">
              <h4 className="font-bold text-white uppercase font-mono">
                Submit Corrective Field Resolution Proof
              </h4>
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  After-Repair Image URL
                </label>
                <input
                  type="url"
                  required
                  value={afterImage}
                  onChange={(e) => setAfterImage(e.target.value)}
                  className="charcoal-glass-input w-full px-3 py-2 text-xs rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Corrective Action Notes *
                </label>
                <textarea
                  required
                  rows={2}
                  value={resolveNote}
                  onChange={(e) => setResolveNote(e.target.value)}
                  placeholder="e.g. Completed asphalt milling and hot compaction. 4-meter perimeter sealed and opened to traffic."
                  className="charcoal-glass-input w-full px-3 py-2 text-xs rounded-xl focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="white-gloss-btn px-4 py-2 font-bold rounded-xl shadow cursor-pointer"
                >
                  Confirm & Close Ticket
                </button>
                <button
                  type="button"
                  onClick={() => setIsResolving(false)}
                  className="white-glass-btn-secondary px-3 py-2 font-semibold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Audit Timeline */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
              Redressal Audit Trail & Timeline
            </span>
            <div className="space-y-2">
              {complaint.timeline?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl charcoal-glass-card border border-white/10 text-xs"
                >
                  <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#ffffff] mt-1.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-white">{item.action}</strong>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-zinc-300 text-[11px] mt-0.5">{item.note}</p>
                    <span className="text-[10px] text-zinc-400 font-mono">By: {item.by}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="border-t border-white/10 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-mono">
              Status: <strong className="text-white">{complaint.status}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {complaint.status !== 'RESOLVED' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenDispatch(complaint);
                  }}
                  className="white-glass-btn-secondary inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5 text-white" />
                  <span>Dispatch Field Crew</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenWorkOrder(complaint);
                  }}
                  className="white-gloss-btn inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-black text-xs transition-colors cursor-pointer shadow-md"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-black" />
                  <span>Issue Work Order</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsResolving(!isResolving)}
                  className="white-glass-btn-secondary inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-emerald-300 border-emerald-500/40 font-bold text-xs transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Resolved</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              className="white-glass-btn-secondary px-4 py-2 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

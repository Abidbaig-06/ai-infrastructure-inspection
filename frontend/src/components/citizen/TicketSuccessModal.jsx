import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, QrCode, Shield, ArrowRight, Printer, Share2, Copy, Clock, Building2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const TicketSuccessModal = ({ ticket, onClose }) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  }, []);

  if (!ticket) return null;

  const copyTicketId = () => {
    navigator.clipboard.writeText(ticket.ticketId);
    alert(`Ticket ID ${ticket.ticketId} copied to clipboard!`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="charcoal-glass rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-white/25 animate-in fade-in zoom-in-95 duration-200 text-zinc-100 relative">
        {/* Specular White Light Top Beam */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent" />

        {/* Top Header */}
        <div className="p-6 text-white text-center relative border-b border-white/10">
          <div className="w-14 h-14 rounded-2xl bg-white text-zinc-950 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(255,255,255,0.4)]">
            <CheckCircle2 className="w-8 h-8 text-black" />
          </div>
          <h3 className="text-xl font-bold font-display text-white">Grievance Registered Successfully</h3>
          <p className="text-xs text-zinc-300 mt-1 font-mono">
            Official Municipal Redressal Ticket Dispatched
          </p>
        </div>

        {/* Ticket Body Card */}
        <div className="p-6 space-y-5">
          {/* Ticket ID Box */}
          <div className="charcoal-glass-card border-2 border-dashed border-white/30 rounded-2xl p-4 text-center relative group">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block mb-1 font-mono">
              OFFICIAL TRACKING TICKET ID
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-wider drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                {ticket.ticketId}
              </span>
              <button
                onClick={copyTicketId}
                className="p-1.5 rounded-lg charcoal-pill hover:border-white/50 text-white transition-colors"
                title="Copy Ticket ID"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Keep this ID safe to track field dispatch & resolution proofs.
            </p>
          </div>

          {/* Key Summary Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="charcoal-glass-card p-3 rounded-xl border border-white/10">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1 font-mono">
                Assigned Dept
              </span>
              <p className="font-semibold text-white line-clamp-1">
                {ticket.aiAnalysis?.assignedDepartment || 'Public Works Dept'}
              </p>
            </div>

            <div className="charcoal-glass-card p-3 rounded-xl border border-white/10">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1 font-mono">
                AI Risk Score
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${ticket.aiAnalysis?.severity === 'CRITICAL' ? 'bg-red-500 shadow-[0_0_6px_#ef4444]' : 'bg-amber-400 shadow-[0_0_6px_#f59e0b]'}`} />
                <span className="font-bold text-white font-mono">
                  {ticket.aiAnalysis?.riskScore || 50}/100 ({ticket.aiAnalysis?.severity || 'MEDIUM'})
                </span>
              </div>
            </div>

            <div className="charcoal-glass-card p-3 rounded-xl border border-white/10">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1 font-mono">
                SLA Target
              </span>
              <div className="flex items-center gap-1 font-semibold text-white">
                <Clock className="w-3.5 h-3.5 text-white" />
                <span>{ticket.aiAnalysis?.slaHours || 48} Hours Max</span>
              </div>
            </div>

            <div className="charcoal-glass-card p-3 rounded-xl border border-white/10">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1 font-mono">
                Ward & Zone
              </span>
              <p className="font-semibold text-white truncate">
                {ticket.location?.ward || 'Ward 04'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <Link
              to={`/track/${ticket.ticketId}`}
              className="white-gloss-btn w-full py-3.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>Track Live Resolution Timeline</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </Link>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 py-2 px-3 rounded-xl white-glass-btn-secondary font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Receipt</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="py-2 px-4 rounded-xl white-glass-btn-secondary font-semibold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

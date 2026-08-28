import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Printer, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';

export const TicketSuccessModal = ({ ticket, onClose }) => {
  const navigate = useNavigate();

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

  const handleClose = () => {
    if (onClose) onClose();
    navigate('/');
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
                className="p-1.5 rounded-lg charcoal-pill hover:border-white/50 text-white transition-colors cursor-pointer"
                title="Copy Ticket ID"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Keep this ID safe to track field dispatch & resolution proofs.
            </p>
          </div>

          {/* Action Buttons: Print Official Receipt & Close */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 py-3 px-4 rounded-xl white-gloss-btn text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer hover:opacity-95"
            >
              <Printer className="w-4 h-4 text-black" />
              <span>Print Official Receipt</span>
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="py-3 px-6 rounded-xl white-glass-btn-secondary font-semibold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

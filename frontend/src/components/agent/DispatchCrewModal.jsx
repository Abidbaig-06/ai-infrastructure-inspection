import React, { useState } from 'react';
import { Truck, X, User, Phone, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useGrievance } from '../../context/GrievanceContext';
import { useAuth } from '../../context/AuthContext';

const FIELD_UNITS = [
  { id: 'CREW-ALPHA-01', lead: 'Marcus Vance', phone: '+1 (555) 019-2834', type: 'Rapid Asphalt & Paving Unit' },
  { id: 'CREW-HYDRO-02', lead: 'Insp. Kenneth Cole', phone: '+1 (555) 332-9011', type: 'High-Pressure Water & Sewer Squad' },
  { id: 'CREW-ELEC-03', lead: 'Lineman Jordan Bell', phone: '+1 (555) 443-8821', type: 'Emergency High-Voltage Lineman Unit' },
  { id: 'CREW-CIVIC-04', lead: 'Capt. Elena Gomez', phone: '+1 (555) 881-2299', type: 'Structural Shoring & Hazard Clearance' }
];

export const DispatchCrewModal = ({ complaint, isOpen, onClose }) => {
  const { dispatchCrew } = useGrievance();
  const { currentUser } = useAuth();

  const [selectedUnit, setSelectedUnit] = useState(FIELD_UNITS[0]);
  const [etaMinutes, setEtaMinutes] = useState(25);
  const [instructions, setInstructions] = useState('Immediate site inspection and deploy safety perimeter.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !complaint) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await dispatchCrew(
        complaint._id || complaint.ticketId,
        {
          crewId: selectedUnit.id,
          teamLead: selectedUnit.lead,
          contactPhone: selectedUnit.phone,
          etaMinutes: Number(etaMinutes)
        },
        `${currentUser?.name || 'Dispatcher'} (${currentUser?.badgeNumber || 'DSP-01'})`
      );
      onClose();
    } catch (err) {
      alert('Error dispatching crew: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="charcoal-glass rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-white/25 animate-in fade-in zoom-in-95 text-zinc-100 relative">
        {/* Top Specular White Beam */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center shadow-inner">
              <Truck className="w-5 h-5 drop-shadow-[0_0_6px_#ffffff]" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-white">Dispatch Field Maintenance Crew</h3>
              <p className="text-[11px] text-zinc-400 font-mono">Ticket: {complaint.ticketId}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-2 rounded-xl charcoal-pill hover:border-white/50 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Target Location Alert */}
          <div className="p-3.5 rounded-2xl charcoal-glass-card border border-white/15">
            <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block mb-0.5">
              Incident Site Location
            </span>
            <p className="font-semibold text-white">{complaint.location?.address}</p>
            <p className="text-[11px] text-zinc-400 font-mono">{complaint.location?.ward}</p>
          </div>

          {/* Unit Selector */}
          <div>
            <label className="block font-bold text-white mb-2 uppercase tracking-wider font-mono">
              Select Field Unit
            </label>
            <div className="space-y-2">
              {FIELD_UNITS.map((unit) => (
                <button
                  key={unit.id}
                  type="button"
                  onClick={() => setSelectedUnit(unit)}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    selectedUnit.id === unit.id
                      ? 'border-white bg-white/20 ring-2 ring-white/50 shadow-[0_0_15px_rgba(255,255,255,0.25)]'
                      : 'charcoal-glass-card border-white/10 hover:border-white/30'
                  }`}
                >
                  <div>
                    <span className="font-bold text-white block font-mono">{unit.id}</span>
                    <span className="text-[11px] text-zinc-400">{unit.type}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-zinc-200 font-semibold block">{unit.lead}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">{unit.phone}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ETA Input */}
          <div>
            <label className="block font-bold text-zinc-300 mb-1.5 font-mono">
              Estimated On-Site Arrival (Minutes) *
            </label>
            <div className="relative">
              <input
                type="number"
                min="5"
                max="180"
                required
                value={etaMinutes}
                onChange={(e) => setEtaMinutes(e.target.value)}
                className="charcoal-glass-input w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-mono font-bold focus:outline-none"
              />
              <Clock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Special instructions */}
          <div>
            <label className="block font-bold text-zinc-300 mb-1.5 font-mono">
              Field Dispatch Instructions
            </label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="charcoal-glass-input w-full p-3 rounded-xl text-xs focus:outline-none"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="white-gloss-btn flex-1 py-3 px-4 rounded-xl font-black flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Truck className="w-4 h-4 text-black" />
              <span>{isSubmitting ? 'Transmitting Dispatch...' : 'Confirm Dispatch Unit'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="white-glass-btn-secondary py-3 px-5 rounded-xl font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

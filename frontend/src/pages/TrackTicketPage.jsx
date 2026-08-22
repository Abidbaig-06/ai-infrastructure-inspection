import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SeverityBadge, StatusBadge } from '../components/common/StatusBadge';
import { fetchComplaintByTicket } from '../services/api';
import { ROUTES } from '../config/routes';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Truck,
  Sparkles,
  Building2,
  Shield,
  Star,
  ArrowLeft,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';

const customPin = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const TrackTicketPage = () => {
  const { ticketId } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState(ticketId || '');
  const [rating, setRating] = useState(5);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    if (ticketId) {
      loadTicket(ticketId);
    }
  }, [ticketId]);

  const loadTicket = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchComplaintByTicket(id);
      if (res.success && res.data) {
        setComplaint(res.data);
      } else {
        setError('Grievance ticket not found. Please verify the Ticket ID.');
      }
    } catch (err) {
      setError('Ticket not found. Check ID format (e.g. CP-2026-9812).');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      loadTicket(searchInput.trim().toUpperCase());
    }
  };

  const STEPS = [
    { key: 'SUBMITTED', label: '1. Registered', icon: FileSpreadsheet },
    { key: 'AI_TRIAGED', label: '2. AI Triage', icon: Sparkles },
    { key: 'CREW_DISPATCHED', label: '3. Dispatched', icon: Truck },
    { key: 'IN_PROGRESS', label: '4. In Progress', icon: Clock },
    { key: 'RESOLVED', label: '5. Resolved', icon: CheckCircle2 }
  ];

  const getStepIndex = (status) => {
    const map = {
      SUBMITTED: 0,
      AI_TRIAGED: 1,
      CREW_DISPATCHED: 2,
      IN_PROGRESS: 3,
      RESOLVED: 4
    };
    return map[status] ?? 1;
  };

  const currentStep = complaint ? getStepIndex(complaint.status) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-obsidian-rock text-zinc-100 relative">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Top Search Bar & Back button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to INFRASPECTION Portal</span>
          </Link>

          <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md w-full">
            <input
              type="text"
              placeholder="Search Ticket ID (e.g. CP-2026-9812)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="charcoal-glass-input flex-1 px-4 py-2.5 text-xs rounded-xl uppercase font-mono focus:outline-none"
            />
            <button
              type="submit"
              className="white-gloss-btn px-5 py-2.5 font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              Track
            </button>
          </form>
        </div>

        {loading ? (
          <div className="charcoal-glass rounded-3xl p-12 text-center border border-white/15 shadow-2xl space-y-3">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto shadow-[0_0_15px_#ffffff]" />
            <p className="text-xs font-bold text-white font-mono">Connecting to Municipal Redressal Grid...</p>
          </div>
        ) : error || !complaint ? (
          <div className="charcoal-glass rounded-3xl p-8 text-center border border-red-500/30 shadow-2xl space-y-3">
            <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Grievance Record Not Found</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">{error}</p>
            <Link
              to={ROUTES.COMPLAINT_APP_URL}
              className="white-gloss-btn inline-block px-5 py-2 text-xs font-bold rounded-xl mt-2"
            >
              File New Grievance
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Ticket Header Banner with Specular White Rim */}
            <div className="charcoal-glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 relative overflow-hidden text-white">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs uppercase font-mono font-bold text-zinc-300">
                      Grievance Tracking Ticket
                    </span>
                    <span className="font-mono text-xs px-2.5 py-0.5 rounded-md charcoal-pill text-zinc-200">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-wider drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                    {complaint.ticketId}
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-xl">
                    {complaint.title}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    <SeverityBadge severity={complaint.aiAnalysis?.severity} size="lg" pulse={complaint.aiAnalysis?.severity === 'CRITICAL'} />
                    <StatusBadge status={complaint.status} size="lg" />
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">
                    SLA Target: <strong className="text-white">{complaint.aiAnalysis?.slaHours || 48} Hours</strong>
                  </span>
                </div>
              </div>

              {/* Progress Stepper Bar */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="grid grid-cols-5 gap-2 text-center">
                  {STEPS.map((step, idx) => {
                    const isPassed = idx <= currentStep;
                    const isCurrent = idx === currentStep;
                    const StepIcon = step.icon;

                    return (
                      <div key={step.key} className="space-y-2 relative">
                        <div
                          className={`w-9 h-9 rounded-full mx-auto flex items-center justify-center text-xs font-bold transition-all ${
                            isCurrent
                              ? 'bg-white text-zinc-950 shadow-[0_0_15px_#ffffff] scale-110'
                              : isPassed
                              ? 'bg-emerald-500 text-white shadow-[0_0_10px_#10b981]'
                              : 'bg-zinc-900 text-zinc-500 border border-white/10'
                          }`}
                        >
                          <StepIcon className="w-4 h-4" />
                        </div>
                        <span
                          className={`text-[10px] sm:text-xs block font-bold truncate font-mono ${
                            isPassed ? 'text-white' : 'text-zinc-500'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left 2 Cols: Details & Timeline */}
              <div className="md:col-span-2 space-y-6">
                {/* Evidence Photo Card */}
                <div className="charcoal-glass rounded-3xl p-6 border border-white/15 shadow-xl space-y-3">
                  <span className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider block">
                    Citizen Photo Evidence & Location Tag
                  </span>
                  <div className="rounded-2xl overflow-hidden bg-black border border-white/20 relative">
                    <img
                      src={complaint.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80'}
                      alt="Incident Evidence"
                      className="w-full h-64 object-cover object-center opacity-95"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-black/80 backdrop-blur-md p-3 text-white text-xs border-t border-white/10">
                      <p className="font-semibold truncate">📍 {complaint.location?.address}</p>
                      <p className="text-[11px] text-zinc-400 font-mono">🏛️ {complaint.location?.ward}</p>
                    </div>
                  </div>
                </div>

                {/* Resolution Comparison if Resolved */}
                {complaint.status === 'RESOLVED' && complaint.resolutionProof && (
                  <div className="charcoal-glass rounded-3xl p-6 border border-emerald-500/40 shadow-2xl space-y-4">
                    <div className="flex items-center gap-2 text-emerald-300 font-bold uppercase tracking-wider text-xs font-mono">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>Verified Field Resolution Completed</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block mb-1">
                          Before Corrective Action
                        </span>
                        <img
                          src={complaint.imageUrl}
                          alt="Before"
                          className="w-full h-32 object-cover rounded-xl border border-white/15"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono font-bold text-emerald-300 block mb-1">
                          After Corrective Action (Verified)
                        </span>
                        <img
                          src={complaint.resolutionProof.afterImageUrl || 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop&q=80'}
                          alt="After"
                          className="w-full h-32 object-cover rounded-xl border border-emerald-400/40"
                        />
                      </div>
                    </div>

                    <p className="text-xs text-zinc-200 charcoal-pill p-3.5 rounded-xl border border-white/15">
                      <strong>Field Report:</strong> {complaint.resolutionProof.resolutionNotes}
                    </p>

                    {/* Citizen Star Feedback */}
                    <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <span className="font-semibold text-zinc-300">
                        Rate Municipal Resolution Quality:
                      </span>
                      {!feedbackSubmitted ? (
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => {
                                setRating(star);
                                setFeedbackSubmitted(true);
                              }}
                              className="text-amber-400 hover:scale-110 transition-transform p-0.5"
                            >
                              <Star className={`w-4 h-4 ${star <= rating ? 'fill-amber-400' : 'text-zinc-600'}`} />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="text-emerald-400 font-bold font-mono">
                          ✓ Feedback recorded. Thank you!
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Audit Timeline in Charcoal Glass */}
                <div className="charcoal-glass rounded-3xl p-6 border border-white/15 shadow-xl space-y-4">
                  <h3 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">
                    Full Chronological Redressal Audit Trail
                  </h3>
                  <div className="space-y-3">
                    {complaint.timeline?.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl charcoal-glass-card border border-white/10 text-xs">
                        <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_6px_#ffffff] mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <strong className="text-white font-bold">{item.action}</strong>
                            <span className="text-[10px] text-zinc-400 font-mono">
                              {new Date(item.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-zinc-300 text-[11px] mt-0.5">{item.note}</p>
                          <span className="text-[10px] text-zinc-400 font-mono">Logged by: {item.by}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Col: AI Risk Matrix & Location Map */}
              <div className="space-y-6">
                {/* AI Triage Card in Charcoal Glass */}
                <div className="charcoal-glass rounded-3xl p-6 border border-white/15 shadow-xl space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-white drop-shadow-[0_0_6px_#ffffff]" />
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      AI Triage Evaluation
                    </h3>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-white/10">
                      <span className="text-zinc-400">Risk Score:</span>
                      <strong className="font-mono text-white text-sm">{complaint.aiAnalysis?.riskScore || 50}/100</strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-white/10">
                      <span className="text-zinc-400">Severity:</span>
                      <strong className="text-white font-bold">{complaint.aiAnalysis?.severity}</strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-white/10">
                      <span className="text-zinc-400">Division:</span>
                      <strong className="text-white text-right truncate max-w-[150px]">
                        {complaint.aiAnalysis?.assignedDepartment}
                      </strong>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-zinc-400">Resolution SLA:</span>
                      <strong className="text-white font-mono">{complaint.aiAnalysis?.slaHours || 48} Hours</strong>
                    </div>
                  </div>
                </div>

                {/* Assigned Crew Card */}
                {complaint.assignedCrew?.crewId && (
                  <div className="charcoal-glass rounded-3xl p-6 border border-white/15 shadow-xl space-y-3 text-xs">
                    <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wider font-mono">
                      <Truck className="w-4 h-4 text-white" />
                      <span>On-Field Crew Unit</span>
                    </div>
                    <div className="space-y-1.5 text-zinc-300">
                      <p>Unit: <strong className="font-mono text-white">{complaint.assignedCrew.crewId}</strong></p>
                      <p>Team Lead: <strong className="text-white">{complaint.assignedCrew.teamLead}</strong></p>
                      <p>Dispatched ETA: <strong className="text-white font-mono">{complaint.assignedCrew.etaMinutes || 20} Mins</strong></p>
                    </div>
                  </div>
                )}

                {/* Leaflet GPS Mini Map */}
                <div className="charcoal-glass rounded-3xl p-6 border border-white/15 shadow-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-white" />
                    <h3 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">
                      Pinned Coordinates
                    </h3>
                  </div>

                  <div className="h-48 rounded-2xl overflow-hidden border border-white/15">
                    <MapContainer
                      center={[complaint.location?.latitude || 16.3067, complaint.location?.longitude || 80.4365]}
                      zoom={14}
                      scrollWheelZoom={false}
                      className="h-full w-full"
                    >
                      <TileLayer
                        attribution='&copy; OpenStreetMap'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker
                        position={[complaint.location?.latitude || 16.3067, complaint.location?.longitude || 80.4365]}
                        icon={customPin}
                      />
                    </MapContainer>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    GPS: ({complaint.location?.latitude}, {complaint.location?.longitude})
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

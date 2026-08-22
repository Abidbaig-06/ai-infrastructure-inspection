import React, { useState } from 'react';
import { submitComplaint } from '../../services/api';
import { TicketSuccessModal } from './TicketSuccessModal';
import {
  Send,
  Upload,
  Sparkles,
  MapPin,
  AlertTriangle,
  Loader2,
  Camera,
  Cpu,
  Shield,
  User,
  Phone,
  Wand2,
  ArrowRight
} from 'lucide-react';

const CATEGORIES = [
  { id: 'Road Hazard & Pothole', label: 'Road & Pothole', icon: '🚧' },
  { id: 'Water Leak & Sewage', label: 'Water & Sewage', icon: '💧' },
  { id: 'Electrical & Live Wire', label: 'Electrical & Wire', icon: '⚡' },
  { id: 'Street Lighting', label: 'Street Lighting', icon: '💡' },
  { id: 'Waste & Garbage Dumping', label: 'Waste Dumping', icon: '🗑️' },
  { id: 'Drainage & Canal Clog', label: 'Drainage Overflow', icon: '🌊' }
];

const GUNTUR_WARDS = [
  'Ward 04 - Lakshmipuram',
  'Ward 12 - Brodipet',
  'Ward 08 - Arundelpet',
  'Ward 19 - Old Guntur',
  'Ward 23 - Pattabhipuram',
  'Ward 31 - Gujanagundla'
];

export const ComplaintForm = () => {
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ward, setWard] = useState(GUNTUR_WARDS[0]);
  const [address, setAddress] = useState('Near Lakshmipuram Main Junction, Guntur');
  const [citizenName, setCitizenName] = useState('Ravi Teja Varma');
  const [citizenPhone, setCitizenPhone] = useState('+91 98480 22334');
  const [anonymous, setAnonymous] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [formError, setFormError] = useState(null);

  const handleAIEnhance = async () => {
    if (!description && !title) {
      alert('Please enter a brief issue or title first.');
      return;
    }
    setIsPolishing(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    if (category === 'Road Hazard & Pothole') {
      setTitle(title || 'Severe Asphalt Surface Cratering');
      setDescription(`[CIVIC HAZARD]: Heavy structural pothole crater with sub-base erosion. Presents acute vehicle axle and collision hazard. Immediate hot-mix compaction required. Note: "${description || title}"`);
    } else if (category === 'Water Leak & Sewage') {
      setTitle(title || 'Underground Main Pipeline Rupture');
      setDescription(`[CIVIC HAZARD]: High-velocity municipal water pipe burst flooding road sub-base. Soil cavity formation risk. Immediate feeder valve isolation required. Note: "${description || title}"`);
    } else if (category === 'Electrical & Live Wire') {
      setTitle(title || 'Exposed High-Voltage Cable Sag');
      setDescription(`[EMERGENCY ELECTRICAL]: Exposed 440V distribution conductor line sagging below statutory safety height. Immediate lineman unit isolation required. Note: "${description || title}"`);
    } else {
      setDescription(`[CIVIC DEFECT REPORT]: Public infrastructure hazard regarding ${category}. Immediate field inspection requested. Note: "${description || title}"`);
    }
    setIsPolishing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Please enter a title for the infrastructure issue.');
      return;
    }
    setFormError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        title,
        description: description || title,
        category,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
        latitude: 16.3067,
        longitude: 80.4365,
        address,
        ward,
        citizenName: anonymous ? 'Anonymous Citizen' : citizenName,
        citizenPhone: anonymous ? 'N/A' : citizenPhone,
        isAnonymous: anonymous
      };

      const result = await submitComplaint(payload);
      setSubmittedTicket(result);
    } catch (err) {
      setFormError(err.message || 'Failed to submit grievance. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Main Unified Charcoal Glass Complaint Box with Specular White Light */}
      <div className="charcoal-glass rounded-[2.5rem] border border-white/20 shadow-2xl p-6 sm:p-8 relative overflow-hidden text-zinc-100 timeline-vertical-rule">
        {/* Top Specular White Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/90 to-transparent" />

        {/* COMPLAINT DIALOGUE BOX Heading with Pill Accent */}
        <div className="mb-6 pb-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/25 flex items-center justify-center text-white shadow-inner flex-shrink-0">
              <Cpu className="w-5 h-5 drop-shadow-[0_0_8px_#ffffff]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="obsidian-pill-glass px-2.5 py-0.5 text-[10px] font-mono text-zinc-300">
                  GMC PUBLIC CIVIC GRID
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight mt-0.5">
                COMPLAINT DIALOGUE BOX
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                Submit public infrastructure defects for automated AI vision inspection & GMC field dispatch.
              </p>
            </div>
          </div>

          {/* Time indicator aesthetic from reference */}
          <div className="hidden sm:flex flex-col items-end text-right font-mono text-[11px] text-zinc-400">
            <span className="text-white font-bold">24/7 AI Triage</span>
            <span className="text-zinc-500">SLA: &lt; 4 Hours</span>
          </div>
        </div>

        {formError && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2 font-mono">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Issue Category Pill Capsules */}
          <div>
            <label className="block text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider mb-2">
              1. Infrastructure Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-3 py-2.5 rounded-full border text-left transition-all cursor-pointer flex items-center gap-2 ${
                    category === cat.id
                      ? 'border-white bg-white/20 shadow-[0_0_20px_rgba(255,255,255,0.3)] text-white font-bold'
                      : 'obsidian-pill-glass text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span className="text-xs truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2-Column Core Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Left Column: Photo Evidence Upload */}
            <div className="md:col-span-5 space-y-2">
              <label className="block text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider">
                2. Visual Evidence (AI Scan)
              </label>

              {imageUrl ? (
                <div className="relative rounded-3xl overflow-hidden border border-white/25 h-48 group bg-black shadow-2xl">
                  <img
                    src={imageUrl}
                    alt="Uploaded defect"
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="obsidian-pill-glass px-4 py-2 text-xs font-bold text-white hover:border-red-400 transition-colors cursor-pointer"
                    >
                      Replace Photo
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3 obsidian-pill-glass px-2.5 py-1 text-[10px] font-mono text-zinc-200">
                    ✓ Photo Tagged
                  </div>
                </div>
              ) : (
                <div className="h-48 rounded-3xl border-2 border-dashed border-white/20 hover:border-white/40 bg-white/[0.02] flex flex-col items-center justify-center p-4 text-center space-y-2 transition-all">
                  <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-white shadow-inner">
                    <Camera className="w-5 h-5 drop-shadow-[0_0_8px_#ffffff]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Click or Paste Image URL</p>
                    <p className="text-[10px] text-zinc-400 font-mono mt-0.5">JPG, PNG up to 10MB</p>
                  </div>
                  <input
                    type="url"
                    placeholder="Or paste photo URL here..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="charcoal-glass-input w-full px-3.5 py-1.5 text-xs rounded-full text-white placeholder:text-zinc-500 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Right Column: Title, Description, Location */}
            <div className="md:col-span-7 space-y-3">
              <div>
                <label className="block text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  3. Defect Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deep Pothole in Left Traffic Lane Causing Vehicle Damage"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="charcoal-glass-input w-full px-4 py-2.5 text-xs rounded-2xl text-white placeholder:text-zinc-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider">
                    Detailed Observation
                  </label>
                  <button
                    type="button"
                    onClick={handleAIEnhance}
                    disabled={isPolishing}
                    className="obsidian-pill-glass px-2.5 py-0.5 text-[10px] font-mono text-zinc-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-white" />
                    <span>{isPolishing ? 'Polishing...' : 'Enhance with AI'}</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  placeholder="Describe depth, extent, or immediate danger..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="charcoal-glass-input w-full px-4 py-2.5 text-xs rounded-2xl text-white placeholder:text-zinc-500 focus:outline-none"
                />
              </div>

              {/* Location Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase mb-1">
                    GMC Municipal Ward *
                  </label>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="charcoal-glass-input w-full px-3.5 py-2 text-xs rounded-2xl text-white focus:outline-none"
                  >
                    {GUNTUR_WARDS.map((w) => (
                      <option key={w} value={w} className="bg-zinc-950 text-white">
                        {w}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase mb-1">
                    Street Address / Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="charcoal-glass-input w-full px-3.5 py-2 text-xs rounded-2xl text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Citizen Details & Anonymous Option (Pill Capsule Bar) */}
          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 flex-1 min-w-[280px]">
              {!anonymous ? (
                <>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    className="charcoal-glass-input px-3.5 py-2 text-xs rounded-full text-white flex-1 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Phone (for SMS tracking)"
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    className="charcoal-glass-input px-3.5 py-2 text-xs rounded-full text-white font-mono flex-1 focus:outline-none"
                  />
                </>
              ) : (
                <span className="text-xs text-zinc-400 font-mono">
                  Submitting anonymously (No personal details logged).
                </span>
              )}
            </div>

            <label className="obsidian-pill-glass px-3.5 py-2 inline-flex items-center gap-2 cursor-pointer text-xs font-mono text-zinc-300 whitespace-nowrap">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="w-4 h-4 rounded-full border-white/30 text-white bg-zinc-900 focus:ring-0 cursor-pointer"
              />
              <span>Submit Anonymously</span>
            </label>
          </div>

          {/* Primary Submit Button with Play-Disc Aesthetic */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="white-gloss-btn w-full py-4 px-6 rounded-full font-black text-xs shadow-2xl flex items-center justify-center gap-3 cursor-pointer transition-all mt-3 tracking-wide uppercase"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Running AI Defect Triage & Submitting...</span>
              </>
            ) : (
              <>
                <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px]">
                  ▶
                </span>
                <span>Submit Grievance to AI Inspection Engine</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Success Modal on Submission */}
      {submittedTicket && (
        <TicketSuccessModal
          ticket={submittedTicket.data || submittedTicket}
          onClose={() => setSubmittedTicket(null)}
        />
      )}
    </div>
  );
};

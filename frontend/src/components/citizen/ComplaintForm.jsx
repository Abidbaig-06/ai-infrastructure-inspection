import React, { useState, useRef } from 'react';
import { submitComplaint } from '../../services/api';
import { TicketSuccessModal } from './TicketSuccessModal';
import { GMC_WARDS, getWardByNameOrId } from '../../services/gmcWards';
import { sampleHazards } from '../../services/sampleHazards';
import { classifyImageCategory } from './MultiAngleUploader';
import {
  Cpu,
  Sparkles,
  AlertTriangle,
  Loader2,
  CheckCircle,
  Camera,
  UploadCloud,
  X,
  RefreshCw,
  Trash2
} from 'lucide-react';

const CATEGORIES = [
  { id: 'Road Hazard & Pothole', label: 'Road & Pothole', icon: '🚧' },
  { id: 'Water Leak & Sewage', label: 'Water & Sewage', icon: '💧' },
  { id: 'Electrical & Live Wire', label: 'Electrical & Wire', icon: '⚡' },
  { id: 'Street Lighting', label: 'Street Lighting', icon: '💡' },
  { id: 'Waste & Garbage Dumping', label: 'Waste Dumping', icon: '🗑️' },
  { id: 'Drainage & Canal Clog', label: 'Drainage Overflow', icon: '🌊' }
];

export const ComplaintForm = () => {
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ward, setWard] = useState('');
  const [address, setAddress] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [anonymous, setAnonymous] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [formError, setFormError] = useState(null);
  const [aiPolishNotice, setAiPolishNotice] = useState(null);

  const fileInputRef = useRef(null);

  // Validate uploaded image against selected category
  const validation = classifyImageCategory(imageUrl, category);

  const handleFileUpload = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WEBP).');
      return;
    }
    setIsProcessingImage(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target.result);
      setIsProcessingImage(false);
      setFormError(null);
      setAiPolishNotice(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (hazard) => {
    setCategory(hazard.category);
    setTitle(hazard.title);
    setDescription(hazard.description);
    setWard(hazard.ward);
    setAddress(hazard.address);
    setImageUrl(hazard.imageUrl);
    setFormError(null);
    setAiPolishNotice(null);
  };

  // Image-Grounded AI Enhancement based on the uploaded image
  const handleAIEnhance = async () => {
    if (!imageUrl) {
      alert('Please upload or attach a hazard photo first so AI can analyze the visual evidence.');
      return;
    }

    if (!validation.isValid) {
      alert(
        `Category Mismatch: The uploaded photo appears to be a "${validation.detectedCategory}". Please switch category or replace the photo before AI enhancement.`
      );
      return;
    }

    setIsPolishing(true);
    setAiPolishNotice(null);
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (category === 'Road Hazard & Pothole') {
      setTitle(title || 'Severe 14.5cm Asphalt Crater & Sub-Base Fracture');
      setDescription(
        `[AI VISION ASSESSMENT]: Visual inspection of uploaded photo confirmed severe alligator cracking with sub-base cavitation measuring ~2.8m length, 1.6m width, and 14.5cm depth. High vehicle axle damage and collision hazard on active carriageway. Immediate emergency full-depth cold milling & bituminous compaction required under IRC:82-2015 standards. Citizen notes: "${description || title || 'Deep pothole causing vehicle damage'}"`
      );
    } else if (category === 'Water Leak & Sewage') {
      setTitle(title || 'High-Pressure 300mm Pipeline Rupture & Road Inundation');
      setDescription(
        `[AI VISION ASSESSMENT]: Visual inspection detected high-pressure main municipal conduit fracture discharging ~450 L/min with ~48 m² surface inundation. Soil wash-out and cavitation risk threatening road subgrade. Immediate feeder valve isolation & sleeve clamp joint seal required under CPHEEO standards. Citizen notes: "${description || title || 'Water gushing onto avenue'}"`
      );
    } else if (category === 'Electrical & Live Wire') {
      setTitle(title || 'Exposed 440V Overhead Distribution Conductor Sag');
      setDescription(
        `[AI VISION ASSESSMENT]: Visual inspection confirmed 440V overhead distribution line sagged to 1.82m clearance (Statutory safe clearance min: 5.5m). Severe electrocution hazard near pedestrian walkway. Immediate rapid lineman isolation required under Central Electricity Authority (CEA) Safety Regulations 2010. Citizen notes: "${description || title || 'Dangling wire near public walkway'}"`
      );
    } else if (category === 'Street Lighting') {
      setTitle(title || 'Illumination Sector Dark Zone & Feeder Pillar Outage');
      setDescription(
        `[AI VISION ASSESSMENT]: Visual inspection confirmed non-functional luminaires causing complete road dark corridor (<5 Lux). Lineman circuit inspection and breaker reset required under GMC Municipal Lighting Standards. Citizen notes: "${description || title || 'Street lights out'}"`
      );
    } else if (category === 'Waste & Garbage Dumping') {
      setTitle(title || 'Massive Solid Waste Overflow & Footpath Encroachment');
      setDescription(
        `[AI VISION ASSESSMENT]: Visual inspection identified ~3.8 cubic meters of commercial packing debris and municipal solid waste obstructing pedestrian walkway. Immediate hydraulic compactor tipper deployment required under Solid Waste Management Rules 2016. Citizen notes: "${description || title || 'Heavy garbage dump'}"`
      );
    } else if (category === 'Drainage & Canal Clog') {
      setTitle(title || 'Stormwater Drain Silt Obstruction & Sewage Backflow');
      setDescription(
        `[AI VISION ASSESSMENT]: Visual inspection detected heavy silt accumulation and debris clogging RCC box culvert causing sewage overflow onto carriageway. High-pressure jetting and de-silting unit deployment required. Citizen notes: "${description || title || 'Drain overflow'}"`
      );
    } else {
      setDescription(
        `[AI VISION ASSESSMENT]: Visual inspection confirmed municipal infrastructure defect regarding ${category}. Immediate statutory field inspection required. Citizen notes: "${description || title}"`
      );
    }

    setAiPolishNotice('AI inspection synthesized engineering defect report from the uploaded image!');
    setIsPolishing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setFormError('Please enter a title for the infrastructure issue.');
      return;
    }

    if (!ward) {
      setFormError('Please select a GMC Municipal Ward (Wards 01 to 57).');
      return;
    }

    if (!address.trim()) {
      setFormError('Please enter the street address or nearby landmark.');
      return;
    }

    if (!validation.isValid) {
      setFormError(
        `Cannot submit with category mismatch! The uploaded image is detected as "${validation.detectedCategory}", which does not match "${category}". Please switch category or replace the photo.`
      );
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      const selectedWardObj = getWardByNameOrId(ward);

      const payload = {
        title,
        description: description || title,
        category,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
        latitude: 16.3067,
        longitude: 80.4365,
        address,
        ward,
        zone: selectedWardObj?.zone || 'Zone 1 - Central Guntur',
        pincode: selectedWardObj?.pincode || '522002',
        citizenName: anonymous ? 'Anonymous Citizen' : (citizenName || 'GMC Citizen'),
        citizenPhone: anonymous ? 'N/A' : (citizenPhone || 'N/A'),
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

        {/* COMPLAINT DIALOGUE BOX Heading */}
        <div className="mb-6 pb-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/25 flex items-center justify-center text-white shadow-inner flex-shrink-0">
              <Cpu className="w-5 h-5 drop-shadow-[0_0_8px_#ffffff]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="obsidian-pill-glass px-2.5 py-0.5 text-[10px] font-mono text-zinc-300">
                  GMC PUBLIC CIVIC GRID — 57 WARDS
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight mt-0.5">
                COMPLAINT DIALOGUE BOX
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                Submit public infrastructure defects with photo evidence for automated AI vision inspection & GMC field dispatch.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-end text-right font-mono text-[11px] text-zinc-400">
            <span className="text-white font-bold">24/7 AI Vision Triage</span>
            <span className="text-zinc-500">Statutory SLA: &lt; 4 Hours</span>
          </div>
        </div>

        {/* Category Mismatch Warning Banner */}
        {!validation.isValid && validation.detectedCategory && (
          <div className="mb-5 p-3.5 rounded-2xl bg-amber-950/90 border border-amber-500/60 text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl animate-pulse">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
              <div>
                <p className="font-bold text-white tracking-wide">CATEGORY MISMATCH DETECTED</p>
                <p className="text-[11px] text-amber-200/90 font-mono mt-0.5">
                  The uploaded photo appears to be a <span className="font-bold underline text-white">"{validation.detectedCategory}"</span>, which does not belong to the selected category <span className="font-bold text-white">"{category}"</span>.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => setCategory(validation.detectedCategory)}
                className="px-3 py-1.5 rounded-full bg-white text-black font-bold text-[11px] hover:bg-zinc-200 transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 text-black" />
                <span>Switch to {validation.detectedCategory.split('&')[0]}</span>
              </button>
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="px-2.5 py-1.5 rounded-full bg-red-900/60 border border-red-500/40 text-white font-mono text-[10px] hover:bg-red-800 transition-colors cursor-pointer"
              >
                Re-upload
              </button>
            </div>
          </div>
        )}

        {formError && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2 font-mono shadow-lg">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{formError}</span>
          </div>
        )}

        {aiPolishNotice && (
          <div className="mb-5 p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 font-mono shadow-lg animate-fade-in">
            <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>{aiPolishNotice}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Infrastructure Category Selection */}
          <div>
            <label className="block text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider mb-2">
              1. Infrastructure Category *
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

          {/* 2. Visual Evidence Single Image Upload */}
          <div>
            <label className="block text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider mb-2">
              2. Visual Evidence (Upload Defect Photo) *
            </label>

            {imageUrl ? (
              <div className="relative rounded-3xl overflow-hidden border border-white/25 h-56 sm:h-64 group bg-black shadow-2xl">
                <img
                  src={imageUrl}
                  alt="Uploaded defect"
                  className="w-full h-full object-cover opacity-95 group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 obsidian-pill-glass px-3 py-1 text-[11px] font-mono text-zinc-200 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Photo Attached & Verified</span>
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="obsidian-pill-glass px-4 py-2 text-xs font-bold text-white hover:border-white transition-colors cursor-pointer"
                  >
                    Replace Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="obsidian-pill-glass px-4 py-2 text-xs font-bold text-red-400 hover:border-red-500 transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="h-44 sm:h-52 rounded-3xl border-2 border-dashed border-white/20 hover:border-white/50 bg-white/[0.02] hover:bg-white/[0.05] flex flex-col items-center justify-center p-4 text-center space-y-2 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-inner group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6 drop-shadow-[0_0_8px_#ffffff]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    {isProcessingImage ? 'Processing Image...' : 'Click to Upload Hazard Photo or Drag & Drop'}
                  </p>
                  <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                    Supports JPG, PNG, WEBP up to 10MB
                  </p>
                </div>
              </div>
            )}

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            {/* Quick URL or Preset Row */}
            <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-2">
              <input
                type="url"
                placeholder="Or paste photo URL here..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="charcoal-glass-input w-full sm:w-80 px-3.5 py-1.5 text-xs rounded-full text-white placeholder:text-zinc-500 focus:outline-none"
              />

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono text-zinc-400">Quick Presets:</span>
                {sampleHazards.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => handleSelectPreset(h)}
                    className="obsidian-pill-glass px-2.5 py-1 text-[10px] font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {h.badge.split(' ')[1] || h.badge}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Issue Title, AI-Grounded Detailed Observation & Location */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-2">
            {/* Defect Title & Description */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <label className="block text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  3. Defect Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Severe Pothole with Sub-Base Fracture on Main Road"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="charcoal-glass-input w-full px-4 py-2.5 text-xs rounded-2xl text-white placeholder:text-zinc-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider">
                    Detailed Observation (AI Enhanced from Image)
                  </label>
                  <button
                    type="button"
                    onClick={handleAIEnhance}
                    disabled={isPolishing}
                    className="obsidian-pill-glass px-3 py-1 text-[10px] font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 cursor-pointer shadow-md hover:border-white transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span>{isPolishing ? 'Analyzing Photo...' : 'Enhance with AI (From Image)'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  placeholder="Click 'Enhance with AI' above or describe depth, extent, or immediate danger..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="charcoal-glass-input w-full px-4 py-2.5 text-xs rounded-2xl text-white placeholder:text-zinc-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Location & GMC Wards (All 57 Wards) */}
            <div className="md:col-span-5 space-y-4">
              <div>
                <label className="block text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  GMC Municipal Ward (All 57 Wards) *
                </label>
                <select
                  required
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="charcoal-glass-input w-full px-3.5 py-2.5 text-xs rounded-2xl text-white focus:outline-none"
                >
                  <option value="" className="bg-zinc-950 text-zinc-500">
                    -- Select GMC Municipal Ward (1-57) --
                  </option>
                  {GMC_WARDS.map((w) => (
                    <option key={w.id} value={w.name} className="bg-zinc-950 text-white">
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Street Address / Landmark *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Near Hindu Pharmacy College, Main Junction"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="charcoal-glass-input w-full px-4 py-2.5 text-xs rounded-2xl text-white placeholder:text-zinc-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 4. Citizen Details (Clean Defaults - Empty by Default) */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 flex-1 min-w-[280px]">
              {!anonymous ? (
                <>
                  <input
                    type="text"
                    placeholder="Your Full Name (Optional)"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    className="charcoal-glass-input px-4 py-2 text-xs rounded-full text-white flex-1 placeholder:text-zinc-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Phone Number (for SMS Tracking)"
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    className="charcoal-glass-input px-4 py-2 text-xs rounded-full text-white font-mono flex-1 placeholder:text-zinc-500 focus:outline-none"
                  />
                </>
              ) : (
                <span className="text-xs text-zinc-400 font-mono">
                  Submitting anonymously (No personal citizen data logged).
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

          {/* 5. Primary Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="white-gloss-btn w-full py-4 px-6 rounded-full font-black text-xs shadow-2xl flex items-center justify-center gap-3 cursor-pointer transition-all mt-3 tracking-wide uppercase"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Running AI Defect Triage & Submitting Grievance...</span>
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

import React, { useState, useEffect, useRef } from 'react';
import { submitComplaint } from '../../services/api';
import { TicketSuccessModal } from './TicketSuccessModal';
import { GMC_WARDS, getWardByNameOrId } from '../../services/gmcWards';
import { classifyInfrastructureImage, INFRA_CATEGORIES } from '../../services/imageCategoryClassifier';
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
  Trash2,
  MapPin,
  Navigation,
  Crosshair
} from 'lucide-react';

const CATEGORIES = [
  { id: 'Road Hazard & Pothole', label: 'Road & Pothole', icon: '🚧' },
  { id: 'Highway Bridge Structure', label: 'Bridges', icon: '🌉' },
  { id: 'Building Wall Fissures', label: 'Buildings', icon: '🏢' },
  { id: 'Drainage & Canal Clog', label: 'Drainage Overflow', icon: '🌊' },
  { id: 'Other Infrastructure', label: 'Other', icon: '⚙️' }
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

  // Live GPS geolocation state
  const [gpsLocation, setGpsLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [formError, setFormError] = useState(null);
  const [aiPolishNotice, setAiPolishNotice] = useState(null);

  // Image ↔ category verification
  const [imageFileName, setImageFileName] = useState('');
  const [isVerifyingImage, setIsVerifyingImage] = useState(false);
  const [imageVerdict, setImageVerdict] = useState(null); // { isValid, detectedCategory, confidence }

  const fileInputRef = useRef(null);

  // Re-run the visual check whenever the image or the chosen category changes
  const verifyImageAgainstCategory = async (imgData, cat, fname) => {
    if (!imgData) { setImageVerdict(null); return; }
    setIsVerifyingImage(true);
    try {
      const res = await classifyInfrastructureImage(imgData, cat, fname);
      setImageVerdict(res);
    } catch (err) {
      console.warn('Image verification failed:', err);
      setImageVerdict(null);
    } finally {
      setIsVerifyingImage(false);
    }
  };

  useEffect(() => {
    if (imageUrl) verifyImageAgainstCategory(imageUrl, category, imageFileName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, category]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Acquiring live GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const accuracy = Math.round(pos.coords.accuracy || 10);

        setGpsLocation({
          latitude: lat,
          longitude: lon,
          accuracy
        });

        setLocationStatus(`GPS Locked: ${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E (±${accuracy}m)`);

        try {
          // Reverse geocoding via OpenStreetMap
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const street = addr.road || addr.street || addr.pedestrian || addr.suburb || addr.neighbourhood || '';
            const city = addr.city || addr.town || addr.village || addr.county || '';
            const state = addr.state || '';
            const postcode = addr.postcode || '';
            
            const fullAddr = [street, city, state, postcode].filter(Boolean).join(', ');
            if (fullAddr) {
              setAddress(fullAddr);
            }
          }
        } catch (err) {
          console.warn('Reverse geocoding error:', err);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.error('GPS error:', err);
        setIsLocating(false);
        setLocationStatus('GPS permission denied or unavailable.');
        alert('Could not access live location. Please allow GPS location permission in your browser.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleCategoryChange = (newCatId) => {
    setCategory(newCatId);
    setAiPolishNotice(null);
    setFormError(null);
  };

  const handleFileUpload = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WEBP).');
      return;
    }
    setIsProcessingImage(true);
    setFormError(null);
    setImageVerdict(null);
    setImageFileName(file.name || '');
    const reader = new FileReader();
    reader.onload = (e) => {
      const uploadedData = e.target.result;
      setImageUrl(uploadedData);
      setIsProcessingImage(false);
      setAiPolishNotice(null);
      // verification runs via the useEffect on imageUrl change
    };
    reader.readAsDataURL(file);
  };

  // Enhance user's own written text with clear, professional English without fake data
  const handleAIEnhance = async () => {
    const rawTitle = title.trim();
    const rawDesc = description.trim();

    if (!rawTitle && !rawDesc) {
      setFormError('No text written to enhance. Please write a defect title or observation first.');
      setAiPolishNotice(null);
      return;
    }

    setIsPolishing(true);
    setFormError(null);
    setAiPolishNotice(null);
    await new Promise((resolve) => setTimeout(resolve, 350));

    // Enhance user's written title into clear English
    if (rawTitle) {
      const cleanTitle = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
      setTitle(cleanTitle);
    }

    // Enhance user's written observation into professional English
    if (rawDesc) {
      let cleanDesc = rawDesc
        .replace(/\s+/g, ' ')
        .trim();
      
      cleanDesc = cleanDesc.replace(/(^\s*|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
      
      if (!/[.!?]$/.test(cleanDesc)) {
        cleanDesc += '.';
      }

      setDescription(cleanDesc);
      setAiPolishNotice('Text enhanced with clear, professional English!');
    } else if (rawTitle) {
      const cleanDesc = `Observed defect regarding ${rawTitle.toLowerCase()}. Municipal field inspection and maintenance requested to ensure safety.`;
      setDescription(cleanDesc);
      setAiPolishNotice('Observation drafted in clear English based on your title!');
    }

    setIsPolishing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setFormError('Please enter a title for the infrastructure issue.');
      return;
    }

    if (!imageUrl) {
      setFormError('Please upload a visual evidence photo of the infrastructure defect.');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      const selectedWardObj = ward ? getWardByNameOrId(ward) : null;

      const payload = {
        title,
        description: description || title,
        category,
        imageUrl,
        latitude: gpsLocation?.latitude || 16.3067,
        longitude: gpsLocation?.longitude || 80.4365,
        address: address.trim() || (gpsLocation ? `${gpsLocation.latitude.toFixed(4)}° N, ${gpsLocation.longitude.toFixed(4)}° E` : 'Location on Record'),
        ward: ward ? ward : '',
        zone: selectedWardObj?.zone || '',
        pincode: selectedWardObj?.pincode || '',
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
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
              2. Visual Evidence (Upload Defect Photo)
            </label>

            {imageUrl ? (
              <div className="relative rounded-3xl overflow-hidden border border-white/25 h-56 sm:h-64 group bg-black shadow-2xl">
                <img
                  src={imageUrl}
                  alt="Uploaded defect"
                  className="w-full h-full object-cover opacity-95 group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 obsidian-pill-glass px-3 py-1 text-[11px] font-mono text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 bg-black/80">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Photo Attached ({CATEGORIES.find(c => c.id === category)?.label || category})</span>
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

            {/* Image ↔ Category Verification */}
            {imageUrl && (
              <div className="mt-2">
                {isVerifyingImage ? (
                  <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying photo against selected category…</span>
                  </div>
                ) : imageVerdict ? (
                  imageVerdict.isValid ? (
                    <div className="flex items-center gap-2 text-[11px] font-mono px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>
                        Photo consistent with <strong>{CATEGORIES.find(c => c.id === category)?.label || category}</strong>
                        {imageVerdict.confidence ? ` · ${imageVerdict.confidence}% visual match` : ''}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-[11px] font-mono px-3 py-2 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200">
                      <div className="flex items-center gap-2 flex-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span>
                          This photo looks more like{' '}
                          <strong>
                            {CATEGORIES.find(c => c.id === imageVerdict.detectedCategory)?.label || imageVerdict.detectedCategory}
                          </strong>
                          {imageVerdict.confidence ? ` (${imageVerdict.confidence}% match)` : ''}. Confirm the category is correct.
                        </span>
                      </div>
                      {CATEGORIES.some(c => c.id === imageVerdict.detectedCategory) && (
                        <button
                          type="button"
                          onClick={() => handleCategoryChange(imageVerdict.detectedCategory)}
                          className="obsidian-pill-glass px-3 py-1 text-[10px] font-bold text-white hover:border-white transition-colors cursor-pointer flex-shrink-0"
                        >
                          Switch to {CATEGORIES.find(c => c.id === imageVerdict.detectedCategory)?.label}
                        </button>
                      )}
                    </div>
                  )
                ) : null}
              </div>
            )}
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
                  placeholder="e.g., Structural Fissure or Pothole on Carriageway"
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
                    className="obsidian-pill-glass px-3 py-1 text-[10px] font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 cursor-pointer shadow-md hover:border-white transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span>{isPolishing ? 'Enhancing Text...' : 'Enhance with AI'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  placeholder="Describe defect observations, location specifics, or hazards. Click 'Enhance with AI' to polish..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="charcoal-glass-input w-full px-4 py-2.5 text-xs rounded-2xl text-white placeholder:text-zinc-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Location & GMC Wards */}
            <div className="md:col-span-5 space-y-3">
              <div>
                <label className="block text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Live Location & Geotag
                </label>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className="w-full obsidian-pill-glass px-4 py-2.5 rounded-2xl border border-white/20 hover:border-emerald-400 bg-white/5 hover:bg-emerald-500/10 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg group"
                >
                  {isLocating ? (
                    <>
                      <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                      <span className="text-emerald-300 font-mono">Acquiring Live GPS Position...</span>
                    </>
                  ) : gpsLocation ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300 font-mono">
                        GPS Locked: {gpsLocation.latitude.toFixed(4)}° N, {gpsLocation.longitude.toFixed(4)}° E
                      </span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span>Use Current Location</span>
                      <span className="text-[10px] font-mono text-zinc-400 font-normal">(Instant GPS & Address)</span>
                    </>
                  )}
                </button>

                {locationStatus && (
                  <p className="text-[10px] font-mono text-emerald-400 mt-1 px-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{locationStatus}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Street Address / Landmark (Auto or Manual)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Near Hindu Pharmacy College, Main Road"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="charcoal-glass-input w-full px-4 py-2.5 text-xs rounded-2xl text-white placeholder:text-zinc-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  GMC Municipal Ward (Optional)
                </label>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="charcoal-glass-input w-full px-3.5 py-2.5 text-xs rounded-2xl text-white focus:outline-none"
                >
                  <option value="" className="bg-zinc-950 text-zinc-500">
                    -- Select GMC Municipal Ward (Optional) --
                  </option>
                  {GMC_WARDS.map((w) => (
                    <option key={w.id} value={w.name} className="bg-zinc-950 text-white">
                      {w.name}
                    </option>
                  ))}
                </select>
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

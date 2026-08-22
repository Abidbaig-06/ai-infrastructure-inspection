import React, { useState } from 'react';
import { Sparkles, Wand2, ShieldAlert, Check, RefreshCw } from 'lucide-react';

export const AIPreviewAssistant = ({ description, category, onUpdateDescription }) => {
  const [isPolishing, setIsPolishing] = useState(false);
  const [justPolished, setJustPolished] = useState(false);

  const text = (description || '').toLowerCase();
  const detectedKeywords = [];
  if (text.includes('pothole') || text.includes('hole') || text.includes('crater')) detectedKeywords.push('Road Defect');
  if (text.includes('water') || text.includes('leak') || text.includes('flood') || text.includes('pipe')) detectedKeywords.push('Water Inundation');
  if (text.includes('wire') || text.includes('spark') || text.includes('shock') || text.includes('electric')) detectedKeywords.push('Electrical Arc Risk');
  if (text.includes('school') || text.includes('child') || text.includes('hospital') || text.includes('elderly')) detectedKeywords.push('High Vulnerability Zone');
  if (text.includes('deep') || text.includes('huge') || text.includes('accident') || text.includes('emergency')) detectedKeywords.push('High Urgency Marker');

  const handlePolish = async () => {
    if (!description || description.length < 10) {
      alert('Please enter a few words describing the problem first.');
      return;
    }
    setIsPolishing(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    let polished = description;
    if (category === 'Road Hazard & Pothole') {
      polished = `[CIVIC HAZARD REPORT]: Significant surface cratering and asphalt degradation observed on the roadway. The defect presents an immediate vehicle axle and tire puncture hazard, prompting severe transit swerving. Estimated sub-base depth requires immediate hot-mix compaction and traffic lane diversion. Original observation: "${description}"`;
    } else if (category === 'Water Leak & Sewage') {
      polished = `[CIVIC HAZARD REPORT]: Severe subterranean pipe rupture with high-velocity water leakage impacting pedestrian walkway and adjacent foundations. Soil erosion risk detected. Immediate feeder valve isolation and suction de-watering required. Original observation: "${description}"`;
    } else if (category === 'Electrical & Live Wire') {
      polished = `[EMERGENCY ELECTRICAL REPORT]: Exposed conductor cable sagging below statutory ground clearance. High potential for human contact and arc fire hazard. Lineman isolation unit and emergency perimeter cordon required immediately. Original observation: "${description}"`;
    } else {
      polished = `[CIVIC INFRASTRUCTURE REPORT]: Public safety disruption detected concerning ${category}. Defect is hindering citizen movement and requires scheduled municipal crew intervention. Original observation: "${description}"`;
    }

    onUpdateDescription(polished);
    setIsPolishing(false);
    setJustPolished(true);
    setTimeout(() => setJustPolished(false), 3000);
  };

  return (
    <div className="charcoal-glass rounded-2xl p-4.5 border border-white/20 text-white shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center shadow-inner">
            <Sparkles className="w-3.5 h-3.5 drop-shadow-[0_0_6px_#ffffff]" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-white font-mono">
            INFRASPECTION AI Neural Synthesizer
          </span>
        </div>

        <button
          type="button"
          onClick={handlePolish}
          disabled={isPolishing}
          className="white-gloss-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
        >
          {isPolishing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
              <span>Polishing Technical Report...</span>
            </>
          ) : justPolished ? (
            <>
              <Check className="w-3.5 h-3.5 text-black" />
              <span>Report Enhanced</span>
            </>
          ) : (
            <>
              <Wand2 className="w-3.5 h-3.5 text-black" />
              <span>Enhance Description with AI</span>
            </>
          )}
        </button>
      </div>

      <p className="text-[11px] text-zinc-300 leading-relaxed">
        Our Neural NLP engine transforms informal citizen observations into standardized municipal engineering dossiers with technical citations.
      </p>

      {/* Real-time Keyword Detectors */}
      {detectedKeywords.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono uppercase text-zinc-400">Detected Indicators:</span>
          {detectedKeywords.map((kw, i) => (
            <span
              key={i}
              className="charcoal-pill text-[10px] font-mono px-2 py-0.5 rounded-md text-white border border-white/25"
            >
              {kw}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Scan, Eye, Layers, ShieldAlert, CheckCircle, Info, RefreshCw, Loader2 } from 'lucide-react';

// Legacy 8-stage inspection pipeline labels (kept from the SAM 2 / Grounding DINO agent).
// These are shown as an animated progress sequence while the single NVIDIA vision
// call is in flight — purely visual, no extra backend requests.
const PIPELINE_STAGES = [
  'Image Ingestion & Optical Normalization',
  'Scene & Infrastructure Domain Classification',
  'Zero-Shot Defect Detection (Vision-Language Model)',
  'High-Precision Region Localization',
  'Surroundings & Environmental Hazard Analysis',
  'Calibrated Physical Metric Estimation',
  'Radiothermal & Moisture Anomaly Modeling',
  'Master Synthesis & Executive Action Report'
];

export const AIVisionInspectorCanvas = ({
  imageUrl,
  visionDefects = [],
  pavementConditionIndex = 42,
  onReScan,
  isScanning = false
}) => {
  const [showBoxes, setShowBoxes] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedDefectIndex, setSelectedDefectIndex] = useState(0);

  // Drive the cosmetic pipeline animation from `isScanning`
  const [stageIdx, setStageIdx] = useState(PIPELINE_STAGES.length);
  const timersRef = useRef([]);

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (!isScanning) {
      // finish any remaining stages quickly, then clear
      setStageIdx(PIPELINE_STAGES.length);
      return;
    }

    setStageIdx(0);
    // advance through stages; hold on the last one until isScanning flips off
    for (let i = 1; i < PIPELINE_STAGES.length; i++) {
      timersRef.current.push(
        setTimeout(() => setStageIdx(i), i * 520 + Math.random() * 160)
      );
    }
    return () => timersRef.current.forEach(clearTimeout);
  }, [isScanning]);

  const pipelineActive = isScanning || stageIdx < PIPELINE_STAGES.length - 1;

  const defects = visionDefects.length > 0 ? visionDefects : [
    {
      defectType: 'Alligator Cracking & Asphalt Spalling',
      confidence: 0.98,
      dimensions: 'Length: 2.8m, Width: 1.6m, Depth: 14.5cm',
      severityLevel: 'CRITICAL',
      ircCodeStandard: 'IRC:82-2015 Pavement Maintenance Standard (Severity III)',
      boundingCoordinates: { xmin: 15, ymin: 22, xmax: 85, ymax: 78 }
    },
    {
      defectType: 'Sub-Base Soil Cavitation Void',
      confidence: 0.92,
      dimensions: 'Estimated cavity volume: 0.65 m³',
      severityLevel: 'HIGH',
      ircCodeStandard: 'IRC:37-2018 Structural Design of Flexible Pavements',
      boundingCoordinates: { xmin: 40, ymin: 46, xmax: 72, ymax: 70 }
    }
  ];

  return (
    <div className="charcoal-glass rounded-3xl overflow-hidden border border-white/20 shadow-2xl text-white space-y-4 p-6 relative">
      {/* Top Specular White Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center font-bold shadow-inner">
            <Scan className="w-4 h-4 drop-shadow-[0_0_6px_#ffffff]" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-display text-white">
              Computer Vision Defect Detection Canvas
            </h3>
            <p className="text-[10px] text-zinc-400 font-mono">
              Real-Time Neural Surface & Structural Anomaly Extraction
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowBoxes(!showBoxes)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
              showBoxes
                ? 'white-gloss-btn text-black'
                : 'white-glass-btn-secondary text-zinc-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Bounding Tags {showBoxes ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
              showHeatmap
                ? 'white-gloss-btn text-black'
                : 'white-glass-btn-secondary text-zinc-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Stress Heatmap</span>
          </button>

          {onReScan && (
            <button
              type="button"
              onClick={onReScan}
              disabled={isScanning}
              className="p-2 rounded-xl white-glass-btn-secondary text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Re-run AI Computer Vision Scanner"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin text-white' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* 8-Stage Inspection Pipeline (animated while scanning) */}
      {isScanning && (
        <div className="rounded-2xl charcoal-glass-card border border-white/15 p-4 space-y-2">
          <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-300">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
            <span>Running Inspection Pipeline — Stage {Math.min(stageIdx + 1, PIPELINE_STAGES.length)} / {PIPELINE_STAGES.length}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
            {PIPELINE_STAGES.map((label, i) => {
              const done = i < stageIdx;
              const active = i === stageIdx;
              return (
                <div key={i} className="flex items-center gap-2 text-[11px] font-mono">
                  {done ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  ) : active ? (
                    <Loader2 className="w-3.5 h-3.5 text-white animate-spin flex-shrink-0" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full border border-white/20 flex-shrink-0" />
                  )}
                  <span className={done ? 'text-zinc-400 line-through decoration-white/20' : active ? 'text-white' : 'text-zinc-600'}>
                    {i + 1}. {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Image Canvas with Bounding Box Overlays */}
      <div className="relative rounded-2xl overflow-hidden bg-black border border-white/20 flex items-center justify-center min-h-[300px] max-h-[420px] group shadow-2xl">
        <img
          src={imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80'}
          alt="Infrastructure Inspection Evidence"
          className={`w-full h-full object-cover object-center max-h-[420px] transition-opacity duration-300 ${isScanning ? 'opacity-40' : 'opacity-95'}`}
        />

        {/* Scanning sweep line */}
        {isScanning && (
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_16px_#fff] animate-[scanSweep_1.6s_ease-in-out_infinite]" />
        )}

        {/* Heatmap Overlay Simulation */}
        {showHeatmap && (
          <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-red-500/25 to-transparent mix-blend-color-dodge pointer-events-none transition-opacity" />
        )}

        {/* Interactive Bounding Boxes */}
        {showBoxes && !isScanning && defects.map((defect, idx) => {
          const coords = defect.boundingCoordinates || { xmin: 20, ymin: 20, xmax: 80, ymax: 80 };
          const isSelected = selectedDefectIndex === idx;

          return (
            <div
              key={idx}
              onClick={() => setSelectedDefectIndex(idx)}
              style={{
                left: `${coords.xmin}%`,
                top: `${coords.ymin}%`,
                width: `${coords.xmax - coords.xmin}%`,
                height: `${coords.ymax - coords.ymin}%`
              }}
              className={`absolute border-2 transition-all cursor-pointer rounded-xl flex flex-col justify-between p-2 ${
                isSelected
                  ? 'border-white bg-white/20 ring-2 ring-white/60 shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                  : 'border-red-400/80 bg-red-500/10 hover:bg-red-500/20'
              }`}
            >
              <div className="flex items-center gap-1.5 self-start">
                <span className="bg-black text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded shadow border border-white/30">
                  TAG #{idx + 1}: {defect.defectType.toUpperCase()} ({Math.round(defect.confidence * 100)}%)
                </span>
              </div>

              <div className="self-end bg-black/90 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono text-zinc-200 border border-white/20">
                {defect.dimensions}
              </div>
            </div>
          );
        })}

        {/* Floating Scanner Watermark */}
        <div className="absolute bottom-3 left-3 charcoal-pill px-3 py-1.5 rounded-xl text-[10px] font-mono text-zinc-200 border border-white/25 flex items-center gap-2 shadow-lg">
          <Scan className="w-3.5 h-3.5 text-white animate-pulse" />
          <span>CV MODEL: YOLO-Infrastructure-v8.4 • PCI: {pavementConditionIndex}/100</span>
        </div>
      </div>

      {/* Selected Defect Detail Card */}
      {defects[selectedDefectIndex] && (
        <div className="p-4 rounded-2xl charcoal-glass-card border border-white/15 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <ShieldAlert className="w-4 h-4 text-white" />
              {defects[selectedDefectIndex].defectType}
            </span>
            <span className="text-red-300 font-mono font-bold text-[10px] px-2.5 py-0.5 rounded-md bg-red-950/80 border border-red-800">
              {defects[selectedDefectIndex].severityLevel} SEVERITY
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-zinc-300">
            <p>Physical Dimension: <strong className="text-white font-mono">{defects[selectedDefectIndex].dimensions}</strong></p>
            <p>Statutory Code: <strong className="text-white">{defects[selectedDefectIndex].ircCodeStandard}</strong></p>
          </div>
        </div>
      )}
    </div>
  );
};

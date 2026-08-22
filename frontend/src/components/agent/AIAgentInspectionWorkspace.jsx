import React, { useState, useEffect } from 'react';
import {
  Scan,
  Sparkles,
  ShieldAlert,
  Layers,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Wrench,
  History,
  MapPin,
  Camera,
  Info,
  Activity,
  Zap,
  TrendingUp,
  Sliders,
  DollarSign
} from 'lucide-react';

export const AIAgentInspectionWorkspace = ({
  complaint,
  onGenerateReport,
  onCreateWorkOrder,
  onViewHistory,
  onReturnToMap
}) => {
  // Determine defect characteristics based on complaint category & details
  const category = complaint?.category || 'Road Hazard & Pothole';
  const isRoad = category.includes('Road') || category.includes('Pothole') || (!category.includes('Water') && !category.includes('Electrical') && !category.includes('Waste'));
  const isWater = category.includes('Water') || category.includes('Sewage');
  const isElectric = category.includes('Electrical') || category.includes('Wire');
  const isWaste = category.includes('Waste') || category.includes('Garbage') || category.includes('Drainage') || category.includes('Debris');

  // Simulation State
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);

  // Defect Dataset tailored to active complaint
  const detectedDefects = isRoad
    ? [
        { type: 'Pothole Void', confidence: 94, severity: 92, share: 45, color: '#ef4444', size: '2.8m × 1.6m × 14.5cm', bbox: { xmin: 18, ymin: 24, xmax: 82, ymax: 76 } },
        { type: 'Alligator Surface Cracks', confidence: 87, severity: 81, share: 30, color: '#f97316', size: 'Length: 4.2m longitudinal', bbox: { xmin: 42, ymin: 48, xmax: 74, ymax: 72 } },
        { type: 'Sub-Base Aggregate Erosion', confidence: 81, severity: 72, share: 15, color: '#eab308', size: 'Cavity: 0.65 m³', bbox: { xmin: 28, ymin: 32, xmax: 60, ymax: 62 } },
        { type: 'Edge Spalling', confidence: 76, severity: 64, share: 10, color: '#10b981', size: 'Edge length: 1.4m', bbox: { xmin: 68, ymin: 55, xmax: 88, ymax: 80 } }
      ]
    : isWater
    ? [
        { type: 'Water Main Fracture', confidence: 96, severity: 95, share: 50, color: '#ef4444', size: '300mm CI pipe rupture', bbox: { xmin: 22, ymin: 26, xmax: 78, ymax: 74 } },
        { type: 'Sub-Grade Hydro Erosion', confidence: 88, severity: 86, share: 30, color: '#f97316', size: 'Sub-surface void: 1.8 m³', bbox: { xmin: 44, ymin: 46, xmax: 76, ymax: 70 } },
        { type: 'Surface Flooding Pond', confidence: 83, severity: 74, share: 20, color: '#eab308', size: 'Puddle area: 18 sq.m', bbox: { xmin: 15, ymin: 60, xmax: 85, ymax: 88 } }
      ]
    : isElectric
    ? [
        { type: '440V Conductor Snap', confidence: 97, severity: 98, share: 55, color: '#ef4444', size: '45m span, 1.2m from ground', bbox: { xmin: 20, ymin: 20, xmax: 80, ymax: 80 } },
        { type: 'Support Arm Fracture', confidence: 89, severity: 88, share: 30, color: '#f97316', size: '35° angle deflection', bbox: { xmin: 35, ymin: 30, xmax: 65, ymax: 55 } },
        { type: 'Ceramic Insulator Arc Risk', confidence: 82, severity: 78, share: 15, color: '#eab308', size: 'Arc zone: 4.0m radius', bbox: { xmin: 50, ymin: 50, xmax: 75, ymax: 75 } }
      ]
    : [
        { type: 'Commercial Debris Heap', confidence: 93, severity: 89, share: 50, color: '#ef4444', size: 'Volume: 12.5 cu.m, Area: 25 sq.m', bbox: { xmin: 20, ymin: 25, xmax: 80, ymax: 75 } },
        { type: 'Drainage Channel Blockage', confidence: 86, severity: 82, share: 35, color: '#f97316', size: 'Choke length: 8.0m', bbox: { xmin: 40, ymin: 45, xmax: 75, ymax: 70 } },
        { type: 'Pedestrian Obstruction', confidence: 80, severity: 70, share: 15, color: '#eab308', size: '100% pavement blocked', bbox: { xmin: 15, ymin: 65, xmax: 85, ymax: 85 } }
      ];

  // Deterministic Impact Factors
  const impactFactors = {
    publicSafety: isRoad ? 91 : isElectric ? 98 : isWater ? 85 : 78,
    trafficDisruption: isRoad ? 84 : isWater ? 92 : isElectric ? 75 : 88,
    infrastructureDamage: isRoad ? 89 : isWater ? 94 : isElectric ? 90 : 72,
    weatherVulnerability: isRoad ? 73 : isWater ? 88 : isElectric ? 94 : 80,
    failureEscalation: isRoad ? 82 : isWater ? 90 : isElectric ? 95 : 76
  };

  const avgSeverity = Math.round(detectedDefects.reduce((sum, d) => sum + d.severity, 0) / detectedDefects.length);
  const avgImpact = Math.round(
    (impactFactors.publicSafety + impactFactors.trafficDisruption + impactFactors.infrastructureDamage + impactFactors.weatherVulnerability + impactFactors.failureEscalation) / 5
  );
  const trafficExposure = impactFactors.trafficDisruption;
  const recurrenceScore = 72;
  const weatherScore = impactFactors.weatherVulnerability;

  const compositeRiskScore = Math.min(
    100,
    Math.round(
      avgSeverity * 0.35 +
      avgImpact * 0.25 +
      trafficExposure * 0.20 +
      recurrenceScore * 0.10 +
      weatherScore * 0.10
    )
  );

  const getImpactLevel = (val) => {
    if (val >= 81) return { level: 'CRITICAL', color: 'text-red-400 bg-red-950/80 border-red-800' };
    if (val >= 61) return { level: 'HIGH', color: 'text-orange-400 bg-orange-950/80 border-orange-800' };
    if (val >= 31) return { level: 'MEDIUM', color: 'text-amber-400 bg-amber-950/80 border-amber-800' };
    return { level: 'LOW', color: 'text-emerald-400 bg-emerald-950/80 border-emerald-800' };
  };

  const riskLevelData = getImpactLevel(compositeRiskScore);

  const startSimulation = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 1000);
  };

  useEffect(() => {
    startSimulation();
  }, [complaint?.ticketId, complaint?.id]);

  return (
    <div className="charcoal-glass rounded-3xl border border-white/20 shadow-2xl p-4 sm:p-7 space-y-6 text-zinc-100 relative overflow-hidden">
      {/* Top Specular White Beam */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

      {/* 1. HEADER & ASSET IDENTIFICATION */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/25 flex items-center justify-center text-white shadow-inner">
            <Scan className="w-6 h-6 drop-shadow-[0_0_8px_#ffffff]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold font-display text-white tracking-tight">
                AI VISION & DEFECT DETECTION
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-700 flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                AI AGENT ONLINE
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">
                DEMO AI SIMULATION
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Autonomous Infrastructure Inspection Agent • Multimodal Evidence & Risk Triage
            </p>
          </div>
        </div>

        {/* Selected Asset Metadata Pill */}
        <div className="flex flex-wrap items-center gap-2.5 bg-black/60 px-4 py-2.5 rounded-2xl border border-white/15 text-xs font-mono">
          <div className="text-left">
            <span className="text-[10px] text-zinc-400 block uppercase">Inspected Asset</span>
            <strong className="text-white font-bold">{complaint?.ticketId || 'CP-2026-3292'}</strong>
          </div>
          <span className="text-zinc-600">|</span>
          <div className="text-left">
            <span className="text-[10px] text-zinc-400 block uppercase">Location</span>
            <span className="text-zinc-200">{complaint?.location?.address || 'Brodipet 4th Line, Guntur'}</span>
          </div>
          <button
            type="button"
            onClick={startSimulation}
            disabled={isProcessing}
            className="ml-2 white-glass-btn-secondary px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:text-white cursor-pointer"
            title="Re-run AI Agent Inspection Simulation"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{isProcessing ? 'Analyzing...' : 'Re-Run AI Agent'}</span>
          </button>
        </div>
      </div>

      {/* 2. CLEAN TWO-COLUMN WORKSPACE: LEFT CV CANVAS | RIGHT RISK, INSIGHTS & ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (Col 7): Computer Vision Defect Detection Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <div className="charcoal-glass rounded-2xl p-5 border border-white/15 space-y-4 shadow-xl relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Scan className="w-4 h-4 text-cyan-400" />
                  <span>Computer Vision Defect Detection Canvas</span>
                </h3>
                <p className="text-[10px] text-zinc-400 font-mono">
                  Neural Surface & Structural Anomaly Extraction
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                  className={`px-3 py-1 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                    showBoundingBoxes ? 'white-gloss-btn text-black' : 'white-glass-btn-secondary text-zinc-300'
                  }`}
                >
                  <Layers className="w-3 h-3 inline mr-1" />
                  <span>Bounding Tags {showBoundingBoxes ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={`px-3 py-1 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                    showHeatmap ? 'white-gloss-btn text-black' : 'white-glass-btn-secondary text-zinc-300'
                  }`}
                >
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  <span>Stress Heatmap</span>
                </button>
              </div>
            </div>

            {/* Inspection Image Canvas */}
            <div className="relative rounded-2xl overflow-hidden bg-black border border-white/20 flex items-center justify-center min-h-[380px] max-h-[500px] shadow-2xl group">
              <img
                src={complaint?.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80'}
                alt="Defect Evidence"
                className="w-full h-full object-cover max-h-[500px] opacity-95 transition-transform duration-500 group-hover:scale-[1.01]"
              />

              {/* Stress Heatmap Simulation */}
              {showHeatmap && (
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/25 via-red-500/30 to-amber-400/20 mix-blend-color-dodge pointer-events-none" />
              )}

              {/* Computer Vision Bounding Boxes */}
              {showBoundingBoxes && detectedDefects.map((def, idx) => (
                <div
                  key={idx}
                  style={{
                    left: `${def.bbox.xmin}%`,
                    top: `${def.bbox.ymin}%`,
                    width: `${def.bbox.xmax - def.bbox.xmin}%`,
                    height: `${def.bbox.ymax - def.bbox.ymin}%`
                  }}
                  className={`absolute border-2 transition-all rounded-xl p-2 flex flex-col justify-between cursor-pointer ${
                    idx === 0
                      ? 'border-red-500 bg-red-500/15 shadow-[0_0_18px_rgba(239,68,68,0.4)]'
                      : 'border-orange-400 bg-orange-500/10'
                  }`}
                >
                  <div className="self-start bg-black/90 px-2 py-0.5 rounded text-[9px] font-mono font-bold text-white border border-white/30 shadow">
                    TAG #{idx + 1}: {def.type.toUpperCase()} ({def.confidence}%)
                  </div>
                  <div className="self-end bg-black/90 px-2 py-0.5 rounded text-[9px] font-mono text-zinc-300 border border-white/20">
                    {def.size}
                  </div>
                </div>
              ))}

              {/* Technical Model Watermark */}
              <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-mono text-zinc-300 border border-white/20 flex items-center gap-2 shadow-lg">
                <Scan className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>MODEL: Infrastructure-Vision-v1.0 • MODE: CV + LLM</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Col 5): Cleanly Arranged Intelligence, Risk, Evidence & Action Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. Deterministic Composite Risk Index */}
          <div className="charcoal-glass rounded-2xl p-5 border border-white/15 space-y-3 shadow-xl">
            <div className="flex items-center justify-between font-mono">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                DETERMINISTIC COMPOSITE RISK
              </span>
              <span className={`px-2.5 py-0.5 rounded-md font-bold text-xs border ${riskLevelData.color}`}>
                {compositeRiskScore} / 100 — {riskLevelData.level}
              </span>
            </div>

            {/* Risk Progression Pipeline */}
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 font-mono text-[10px] flex flex-wrap items-center justify-between gap-1 text-zinc-400">
              <span>DEFECT ({avgSeverity})</span>
              <span>➔</span>
              <span>IMPACT ({avgImpact})</span>
              <span>➔</span>
              <span>TRAFFIC ({trafficExposure})</span>
              <span>➔</span>
              <span className="text-red-400 font-bold">RISK ({compositeRiskScore})</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-400 pt-1">
              <div>Severity Weight (35%): <strong className="text-white">{Math.round(avgSeverity * 0.35)}</strong></div>
              <div>Impact Weight (25%): <strong className="text-white">{Math.round(avgImpact * 0.25)}</strong></div>
              <div>Traffic Weight (20%): <strong className="text-white">{Math.round(trafficExposure * 0.20)}</strong></div>
              <div>Recurrence Weight (10%): <strong className="text-white">{Math.round(recurrenceScore * 0.10)}</strong></div>
            </div>
          </div>

          {/* 2. AI Inspection Insight & Reasoning */}
          <div className="charcoal-glass rounded-2xl p-5 border border-white/15 space-y-2.5 shadow-xl text-xs">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI INSPECTION INSIGHT</span>
            </span>

            <p className="text-zinc-200 font-sans leading-relaxed text-[12px]">
              "Visual inspection confirms significant <strong>{detectedDefects[0].type}</strong> ({detectedDefects[0].size}) with surrounding structural fatigue. High commercial traffic exposure combined with upcoming monsoon runoff creates immediate sub-base cavitation risk."
            </p>

            <div className="pt-2 border-t border-white/10 space-y-1 text-[11px] text-zinc-300">
              <span className="font-mono font-bold text-white text-[10px] uppercase block">WHY THIS MATTERS:</span>
              <ul className="list-disc pl-4 space-y-0.5 text-zinc-300">
                <li>Immediate vehicular damage & 2-wheeler collision hazard.</li>
                <li>Water ingress accelerates foundation sub-grade loss.</li>
                <li>Recurrent complaints verified across GMC Ward records.</li>
              </ul>
            </div>

            <p className="text-[10px] text-zinc-400 font-mono italic pt-1 border-t border-white/5">
              ⚠️ AI decision support — physical engineering verification required.
            </p>
          </div>

          {/* 3. Evidence Sources Used & Statutory Standard */}
          <div className="charcoal-glass rounded-2xl p-4 border border-white/15 space-y-2 font-mono text-xs shadow-xl">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              EVIDENCE SOURCES & STATUTORY REFERENCE
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-300">
              <div>📷 Photo: <strong className="text-white">IMG-{complaint?.ticketId?.split('-')[2] || '3292'}</strong></div>
              <div>📍 Ward: <strong className="text-white">{complaint?.location?.ward?.split('-')[0] || 'Ward 02'}</strong></div>
              <div>🗣 Alert Ref: <strong className="text-white">{complaint?.ticketId || 'CP-2026-3292'}</strong></div>
              <div>📋 Prior Repairs: <strong className="text-white">2 Recorded</strong></div>
            </div>
            <div className="pt-1.5 border-t border-white/10 text-[10px] text-zinc-400 flex items-center justify-between">
              <span>Standard: <strong className="text-cyan-300">{isRoad ? 'IRC:82-2015' : isWater ? 'CPHEEO Manual' : isElectric ? 'CEA Reg 2010' : 'SWM Rules 2016'}</strong></span>
              <span>SLA Target: <strong className="text-amber-300">4 Hours</strong></span>
            </div>
          </div>

          {/* 4. Final Action Workflow Buttons */}
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={onGenerateReport}
                className="white-gloss-btn py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
              >
                <FileCheck className="w-4 h-4 text-black" />
                <span>Generate Dossier Report</span>
              </button>

              <button
                type="button"
                onClick={onCreateWorkOrder}
                className="white-glass-btn-secondary py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 hover:text-white cursor-pointer"
              >
                <Wrench className="w-4 h-4 text-cyan-400" />
                <span>Create Work Order</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={onViewHistory}
                className="charcoal-pill py-2.5 px-3 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <History className="w-3.5 h-3.5 text-zinc-400" />
                <span>View Asset History</span>
              </button>

              <button
                type="button"
                onClick={onReturnToMap}
                className="charcoal-pill py-2.5 px-3 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                <span>Return to Map</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Scan, Layers, ShieldAlert, CheckCircle, RefreshCw, Loader2, Ruler,
  Thermometer, Crosshair, Waves, Building2, FileCheck, ChevronRight
} from 'lucide-react';

/* =============================================================================
   8-STAGE AI INFRASTRUCTURE INSPECTION WORKSPACE
   Rebuilt from the original SAM 2 / Grounding DINO agent UI.
   All stage visuals are CSS/SVG overlays drawn on the SINGLE source photo,
   driven by the structured JSON returned by the NVIDIA NIM vision engine.
   ========================================================================== */

const STAGES = [
  { n: 1, key: 'image', title: 'Image', long: 'Image Ingestion & Optical Normalization', hud: 'INGESTING SENSOR…' },
  { n: 2, key: 'infra', title: 'Infrastructure', long: 'Scene & Infrastructure Domain Classification', hud: 'SURFACE MAPPING…' },
  { n: 3, key: 'defects', title: 'Defects', long: 'Zero-Shot Defect Detection', hud: 'DEFECT LOCALIZATION…' },
  { n: 4, key: 'segment', title: 'Segmenting', long: 'High-Precision Region Segmentation', hud: 'CONTOUR SEGMENTATION…' },
  { n: 5, key: 'surround', title: 'Surroundings', long: 'Surroundings & Environmental Hazard Analysis', hud: 'SURROUNDINGS SCAN…' },
  { n: 6, key: 'measure', title: 'Measurements', long: 'Calibrated Physical Metric Estimation', hud: 'CROSSHAIR METRICS…' },
  { n: 7, key: 'thermal', title: 'Radiothermal', long: 'Radiothermal & Moisture Anomaly Modeling', hud: 'THERMAL INFERENCE…' },
  { n: 8, key: 'master', title: 'Result', long: 'Master Multi-Spectral Synthesis & Action Report', hud: 'SYNTHESIZING REPORT…' }
];

const SEV_COLOR = {
  CRITICAL: '#ef4444',
  HIGH: '#f97316',
  MEDIUM: '#eab308',
  LOW: '#10b981'
};

const DEMO = {
  engine: 'demo',
  infrastructure: { type: 'ROAD', confidence: 0.94, surfaceRegion: { xmin: 4, ymin: 10, xmax: 96, ymax: 95 } },
  visionDefects: [
    { defectType: 'Alligator Cracking & Asphalt Spalling', confidence: 0.98, dimensions: 'Length: 2.8m, Width: 1.6m, Depth: 14.5cm', severityLevel: 'CRITICAL', ircCodeStandard: 'IRC:82-2015 (Severity III)', isCrack: true, hasWater: false, lengthMeters: 2.8, widthMeters: 1.6, boundingCoordinates: { xmin: 15, ymin: 22, xmax: 85, ymax: 78 } },
    { defectType: 'Sub-Base Soil Cavitation Void', confidence: 0.92, dimensions: 'Cavity volume ~0.65 m³', severityLevel: 'HIGH', ircCodeStandard: 'IRC:37-2018', isCrack: false, hasWater: true, lengthMeters: 1.2, widthMeters: 0.5, boundingCoordinates: { xmin: 40, ymin: 46, xmax: 72, ymax: 70 } }
  ],
  measurements: [
    { defectType: 'Alligator Cracking & Asphalt Spalling', lengthMeters: 2.8, widthMeters: 1.6, center: { x: 50, y: 50 } },
    { defectType: 'Sub-Base Soil Cavitation Void', lengthMeters: 1.2, widthMeters: 0.5, center: { x: 56, y: 58 } }
  ],
  surroundings: { cracksDetected: true, waterOrMoisture: true, deteriorationRating: 'Severe', inspectionZoneRadiusMeters: 3.2, zoneCenter: { x: 50, y: 50 } },
  thermal: { highAnomalyPct: 34, moderatePct: 27, nominalPct: 39, riskLevel: 'HIGH', hotspots: [{ x: 50, y: 50, intensity: 0.95 }, { x: 56, y: 58, intensity: 0.8 }] },
  keyFindings: ['Structural alligator cracking across the primary wheel path.', 'Sub-base moisture ingress accelerating cavitation.'],
  recommendations: ['Emergency full-depth patching within 24–48h.', 'Restore sub-base drainage and compact GSB layer.'],
  summary: 'Severe pavement deterioration with sub-base voiding on a high-traffic arterial corridor. Immediate corrective repair is required to prevent progressive failure.',
  recommendedAction: 'Emergency full-depth patching & sub-base grouting.',
  overallSeverity: 'CRITICAL', riskLevel: 'CRITICAL', overallConfidence: 0.93,
  totalDetections: 2, criticalDefects: 2, pavementConditionIndex: 42
};

const pct = (v) => `${v}%`;

export const AIVisionInspectorCanvas = ({
  imageUrl,
  report,          // full inspection payload from /api/ai-agent/vision
  visionDefects,   // legacy prop — still accepted
  pavementConditionIndex,
  onReScan,
  isScanning = false
}) => {
  // Resolve the working dataset
  const data = useMemo(() => {
    if (report && report.visionDefects) return report;
    if (visionDefects && visionDefects.length) {
      return { ...DEMO, visionDefects, measurements: DEMO.measurements };
    }
    return DEMO;
  }, [report, visionDefects]);

  const defects = data.visionDefects || [];
  const pci = pavementConditionIndex ?? data.pavementConditionIndex ?? 42;

  // Which stage the stepper is focused on (independent of scan animation)
  const [focusStage, setFocusStage] = useState(8);
  // How far the pipeline animation has progressed while scanning
  const [progress, setProgress] = useState(STAGES.length);
  const timersRef = useRef([]);

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (!isScanning) { setProgress(STAGES.length); return; }
    setProgress(0);
    setFocusStage(1);
    for (let i = 1; i < STAGES.length; i++) {
      timersRef.current.push(setTimeout(() => {
        setProgress(i);
        setFocusStage(Math.min(i + 1, STAGES.length));
      }, i * 620 + Math.random() * 180));
    }
    return () => timersRef.current.forEach(clearTimeout);
  }, [isScanning]);

  // Master layer toggles (stage 8)
  const [layers, setLayers] = useState({
    surface: true, boxes: true, contours: true, cracks: true,
    water: true, zone: true, metrics: true, thermal: false
  });
  const toggle = (k) => setLayers((s) => ({ ...s, [k]: !s[k] }));

  const done = (n) => progress >= n && isScanning ? false : (isScanning ? progress >= n : true);
  const stageState = (n) => {
    if (!isScanning) return 'done';
    if (progress >= n) return 'done';
    if (progress === n - 1) return 'active';
    return 'pending';
  };

  return (
    <div className="space-y-4">
      {/* ===== TOP: 8-STAGE STEPPER ===== */}
      <div className="charcoal-glass rounded-3xl border border-white/15 shadow-2xl p-4 sm:p-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Scan className="w-4 h-4 text-white drop-shadow-[0_0_6px_#fff]" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-display text-white">AI Infrastructure Inspection — 8 Stage Pipeline</h3>
              <p className="text-[10px] font-mono text-zinc-400">
                {isScanning
                  ? `Running stage ${Math.min(progress + 1, 8)} / 8 · ${STAGES[Math.min(progress, 7)].hud}`
                  : `Engine: ${data.engine} · ${data.totalDetections} detections · ${data.criticalDefects} critical`}
              </p>
            </div>
          </div>
          {onReScan && (
            <button
              type="button" onClick={onReScan} disabled={isScanning}
              className="white-glass-btn-secondary px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 text-zinc-200 hover:text-white cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-white' : ''}`} />
              <span>{isScanning ? 'Inspecting…' : 'Re-Run Inspection'}</span>
            </button>
          )}
        </div>

        {/* stepper track */}
        <div className="relative flex items-center justify-between gap-1">
          <div className="absolute left-0 right-0 top-3 h-[2px] bg-white/10" />
          <div
            className="absolute left-0 top-3 h-[2px] bg-white transition-all duration-500 shadow-[0_0_10px_#fff]"
            style={{ width: `${(Math.min(progress, 7) / 7) * 100}%` }}
          />
          {STAGES.map((s) => {
            const st = stageState(s.n);
            const focused = focusStage === s.n;
            return (
              <button
                key={s.n}
                type="button"
                onClick={() => setFocusStage(s.n)}
                className="relative z-10 flex flex-col items-center gap-1 group cursor-pointer"
                style={{ flex: '1 1 0' }}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold border transition-all
                  ${st === 'done' ? 'bg-emerald-500 border-emerald-400 text-black'
                    : st === 'active' ? 'bg-white border-white text-black animate-pulse'
                    : 'bg-zinc-900 border-white/20 text-zinc-500'}
                  ${focused ? 'ring-2 ring-white/70 scale-110' : ''}`}>
                  {st === 'done' ? <CheckCircle className="w-3.5 h-3.5" /> : st === 'active' ? <Loader2 className="w-3 h-3 animate-spin" /> : s.n}
                </span>
                <span className={`text-[9px] font-mono text-center leading-tight ${focused ? 'text-white' : 'text-zinc-500'} hidden sm:block`}>
                  {s.n}. {s.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===== MAIN GRID: STAGE CARDS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {STAGES.slice(0, 7).map((s) => (
          <StageCard
            key={s.n}
            stage={s}
            state={stageState(s.n)}
            focused={focusStage === s.n}
            onFocus={() => setFocusStage(s.n)}
            imageUrl={imageUrl}
            data={data}
            defects={defects}
            pci={pci}
          />
        ))}
      </div>

      {/* ===== STAGE 8: MASTER COMPOSITE ===== */}
      <div className={`charcoal-glass rounded-3xl border shadow-2xl p-4 sm:p-5 relative overflow-hidden transition-all
        ${focusStage === 8 ? 'border-white/40 ring-1 ring-white/20' : 'border-white/15'}`}>
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-white text-black text-[10px] font-mono font-black">STAGE 8</span>
            <div>
              <h3 className="text-sm font-bold font-display text-white">Final AI Analysis Result — Master Visual Overlay</h3>
              <p className="text-[10px] font-mono text-zinc-400">Composite of all inspection layers</p>
            </div>
          </div>
          {/* layer toggles */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              ['surface', 'Surface', '#1976D2'],
              ['boxes', 'Boxes', '#ef4444'],
              ['contours', 'Contours', '#ef4444'],
              ['cracks', 'Cracks', '#eab308'],
              ['water', 'Water', '#06b6d4'],
              ['zone', 'Zone', '#eab308'],
              ['metrics', 'Metrics', '#22c55e'],
              ['thermal', 'Thermal', '#f97316']
            ].map(([k, label, c]) => (
              <button
                key={k}
                type="button"
                onClick={() => toggle(k)}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold border flex items-center gap-1 transition-all cursor-pointer
                  ${layers[k] ? 'bg-white/10 border-white/40 text-white' : 'bg-black/40 border-white/10 text-zinc-500'}`}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: c, opacity: layers[k] ? 1 : 0.3 }} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden bg-black border border-white/20 shadow-2xl">
          <BaseImage imageUrl={imageUrl} dim={isScanning} />
          <ScanFx active={isScanning} />
          <Overlays
            layers={layers}
            data={data}
            defects={defects}
            show={{ surface: true, boxes: true, contours: true, cracks: true, water: true, zone: true, metrics: true, thermal: true }}
          />
          {/* floating legend */}
          <div className="absolute bottom-3 right-3 charcoal-glass rounded-xl border border-white/20 p-2.5 text-[9px] font-mono space-y-1 max-w-[180px]">
            <div className="text-white font-bold mb-1">COLOR CODE</div>
            <Legend c="#ef4444" t="Damage / Spalling" on={layers.boxes || layers.contours} />
            <Legend c="#eab308" t="Cracks & Fissures" on={layers.cracks} />
            <Legend c="#06b6d4" t="Water / Moisture" on={layers.water} />
            <Legend c="#1976D2" t="Infrastructure Surface" on={layers.surface} />
            <Legend c="#22c55e" t="Measurement Crosshairs" on={layers.metrics} />
            <Legend c="#f97316" t="Thermal Anomaly" on={layers.thermal} />
          </div>
        </div>

        {/* executive synthesis */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 charcoal-glass-card rounded-2xl border border-white/15 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-300">AI Inspection Summary</span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border`}
                style={{ color: SEV_COLOR[data.riskLevel] || '#eab308', borderColor: (SEV_COLOR[data.riskLevel] || '#eab308') + '66', background: (SEV_COLOR[data.riskLevel] || '#eab308') + '18' }}>
                {data.riskLevel} RISK
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
              <Stat k="Infrastructure" v={data.infrastructure?.type?.replace(/_/g, ' ')} accent="#60a5fa" />
              <Stat k="Detections" v={data.totalDetections} />
              <Stat k="Critical" v={data.criticalDefects} accent="#ef4444" />
              <Stat k="Confidence" v={`${Math.round((data.overallConfidence || 0) * 100)}%`} accent="#22c55e" />
            </div>
            <p className="text-xs text-zinc-200 leading-relaxed">{data.summary}</p>
            {data.recommendedAction && (
              <p className="text-xs text-zinc-300"><strong className="text-white">Recommended action:</strong> {data.recommendedAction}</p>
            )}
          </div>
          <div className="grid grid-rows-2 gap-4">
            <ListCard title="Key Findings" items={data.keyFindings} icon={<CheckCircle className="w-3.5 h-3.5 text-emerald-400" />} />
            <ListCard title="Recommendations" items={data.recommendations} icon={<ChevronRight className="w-3.5 h-3.5 text-white" />} />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------------------- */
/* Per-stage card                                                              */
/* ---------------------------------------------------------------------------- */
const StageCard = ({ stage, state, focused, onFocus, imageUrl, data, defects, pci }) => {
  const scanning = state === 'active';
  const s = stage.key;

  const meta = buildMeta(stage.n, data, defects, pci);

  return (
    <div
      onClick={onFocus}
      className={`charcoal-glass rounded-2xl border shadow-xl overflow-hidden cursor-pointer transition-all
        ${focused ? 'border-white/40 ring-1 ring-white/20' : 'border-white/15 hover:border-white/25'}`}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-5 h-5 rounded-md bg-white/10 border border-white/20 flex items-center justify-center text-[10px] font-mono font-bold text-white flex-shrink-0">
            {stage.n}
          </span>
          <span className="text-[11px] font-mono font-bold text-white uppercase truncate">{stage.long}</span>
        </div>
        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded flex-shrink-0
          ${state === 'done' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
            : state === 'active' ? 'bg-white/15 text-white border border-white/30'
            : 'bg-zinc-900 text-zinc-500 border border-white/10'}`}>
          {state === 'done' ? 'DONE' : state === 'active' ? 'SCAN' : 'IDLE'}
        </span>
      </div>

      <div className="relative aspect-[16/10] bg-black">
        <BaseImage imageUrl={imageUrl} dim={scanning} />
        <ScanFx active={scanning} />
        {state !== 'pending' && (
          <Overlays
            data={data}
            defects={defects}
            show={{
              surface: s === 'infra' || s === 'segment',
              boxes: s === 'defects' || s === 'segment',
              contours: s === 'segment',
              cracks: s === 'surround',
              water: s === 'surround',
              zone: s === 'surround',
              metrics: s === 'measure',
              thermal: s === 'thermal'
            }}
            layers={{ surface: true, boxes: true, contours: true, cracks: true, water: true, zone: true, metrics: true, thermal: true }}
          />
        )}
        <div className="absolute bottom-2 left-2 charcoal-pill px-2 py-1 rounded-lg text-[8px] font-mono text-zinc-200 border border-white/20">
          STAGE {stage.n}: {stage.title.toUpperCase()}
        </div>
      </div>

      <div className="px-3 py-2 grid grid-cols-1 gap-1">
        {meta.map(([k, v, accent]) => (
          <div key={k} className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-zinc-500">{k}</span>
            <span className="font-bold" style={{ color: accent || '#e4e4e7' }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------------------- */
/* Shared visual primitives                                                    */
/* ---------------------------------------------------------------------------- */
const BaseImage = ({ imageUrl, dim }) => (
  <img
    src={imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=900&auto=format&fit=crop&q=80'}
    alt="Inspection evidence"
    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${dim ? 'opacity-35' : 'opacity-95'}`}
  />
);

const ScanFx = ({ active }) => {
  if (!active) return null;
  return (
    <>
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_16px_#fff] animate-[scanSweep_1.6s_ease-in-out_infinite]" />
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{ backgroundImage: 'linear-gradient(#ffffff22 1px,transparent 1px),linear-gradient(90deg,#ffffff22 1px,transparent 1px)', backgroundSize: '24px 24px' }} />
    </>
  );
};

/* All overlay layers as absolutely-positioned SVG / divs, in image-% space */
const Overlays = ({ data, defects, show, layers }) => {
  const on = (k) => show[k] && layers[k];
  const infra = data.infrastructure || {};
  const sr = infra.surfaceRegion || { xmin: 4, ymin: 8, xmax: 96, ymax: 96 };
  const sur = data.surroundings || {};
  const zc = sur.zoneCenter || { x: 50, y: 50 };
  const th = data.thermal || {};

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Stage 7 thermal — CSS gradient tint + hotspot radials */}
      {on('thermal') && (
        <div className="absolute inset-0 mix-blend-screen"
          style={{
            background:
              `radial-gradient(circle at 30% 70%, rgba(6,182,212,0.35), transparent 45%),` +
              (th.hotspots || []).map(h =>
                `radial-gradient(circle at ${h.x}% ${h.y}%, rgba(239,68,68,${0.25 + h.intensity * 0.5}) 0%, rgba(249,115,22,${0.2 + h.intensity * 0.3}) 25%, transparent 55%)`
              ).join(',') + ',linear-gradient(135deg, rgba(37,99,235,0.25), rgba(234,179,8,0.15))'
          }}
        />
      )}

      {/* Stage 2 surface region */}
      {on('surface') && (
        <div className="absolute border-2 border-[#1976D2] bg-[#1976D2]/15 rounded"
          style={{ left: pct(sr.xmin), top: pct(sr.ymin), width: pct(sr.xmax - sr.xmin), height: pct(sr.ymax - sr.ymin) }}>
          <span className="absolute -top-4 left-0 text-[8px] font-mono font-bold text-[#5aa9ff] bg-black/70 px-1 rounded">
            {infra.type?.replace(/_/g, ' ')} · {Math.round((infra.confidence || 0) * 100)}%
          </span>
        </div>
      )}

      {/* Stage 5 dynamic inspection zone (dashed ellipse) */}
      {on('zone') && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <ellipse
            cx={zc.x} cy={zc.y} rx={Math.min(46, sur.inspectionZoneRadiusMeters * 9 || 26)} ry={Math.min(38, sur.inspectionZoneRadiusMeters * 7 || 20)}
            fill="none" stroke="#eab308" strokeWidth="0.6" strokeDasharray="2 1.5" opacity="0.9"
          />
        </svg>
      )}

      {/* Defect boxes / contours / crosshairs */}
      {defects.map((d, i) => {
        const b = d.boundingCoordinates || { xmin: 20, ymin: 20, xmax: 80, ymax: 80 };
        const w = b.xmax - b.xmin, h = b.ymax - b.ymin;
        const col = d.isCrack ? '#eab308' : SEV_COLOR[d.severityLevel] || '#ef4444';
        const cx = b.xmin + w / 2, cy = b.ymin + h / 2;
        return (
          <React.Fragment key={i}>
            {/* Stage 3 bbox */}
            {on('boxes') && !(d.isCrack && !on('cracks')) && (
              <div className="absolute rounded"
                style={{ left: pct(b.xmin), top: pct(b.ymin), width: pct(w), height: pct(h), border: `1.5px solid ${col}`, background: `${col}14` }}>
                <span className="absolute -top-4 left-0 text-[8px] font-mono font-bold px-1 rounded text-black whitespace-nowrap"
                  style={{ background: col }}>
                  #{i + 1} {d.defectType.split(/[&,]/)[0].trim().toUpperCase()} {Math.round(d.confidence * 100)}%
                </span>
              </div>
            )}
            {/* Stage 4 contour (rounded pulsing outline) */}
            {on('contours') && (
              <div className="absolute rounded-2xl animate-pulse"
                style={{ left: pct(b.xmin + w * 0.06), top: pct(b.ymin + h * 0.06), width: pct(w * 0.88), height: pct(h * 0.88), border: `1.5px dashed ${col}`, boxShadow: `0 0 12px ${col}88 inset` }} />
            )}
            {/* Stage 6 measurement crosshair + label */}
            {on('metrics') && (
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1={cx} y1={b.ymin} x2={cx} y2={b.ymax} stroke="#22c55e" strokeWidth="0.4" />
                <line x1={b.xmin} y1={cy} x2={b.xmax} y2={cy} stroke="#22c55e" strokeWidth="0.4" />
                <circle cx={cx} cy={cy} r="1" fill="#22c55e" />
              </svg>
            )}
            {on('metrics') && (d.lengthMeters || d.widthMeters) && (
              <span className="absolute text-[8px] font-mono font-bold text-black bg-[#22c55e] px-1 rounded"
                style={{ left: pct(b.xmin), top: pct(b.ymax + 1) }}>
                {[d.lengthMeters && `L ${d.lengthMeters}m`, d.widthMeters && `W ${d.widthMeters}m`].filter(Boolean).join(' · ')}
              </span>
            )}
          </React.Fragment>
        );
      })}

      {/* Stage 5 water marker */}
      {on('water') && sur.waterOrMoisture && (
        <div className="absolute" style={{ left: pct(zc.x - 6), top: pct(zc.y + 12) }}>
          <span className="text-[9px] font-mono font-bold text-black bg-[#06b6d4] px-1.5 py-0.5 rounded flex items-center gap-1">
            <Waves className="w-2.5 h-2.5" /> WATER
          </span>
        </div>
      )}
    </div>
  );
};

const Legend = ({ c, t, on }) => (
  <div className="flex items-center gap-1.5" style={{ opacity: on ? 1 : 0.35 }}>
    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />
    <span className="text-zinc-300">{t}</span>
  </div>
);

const Stat = ({ k, v, accent }) => (
  <div className="rounded-lg bg-black/40 border border-white/10 p-2">
    <div className="text-[9px] text-zinc-500 uppercase">{k}</div>
    <div className="text-sm font-black" style={{ color: accent || '#fff' }}>{v ?? '—'}</div>
  </div>
);

const ListCard = ({ title, items, icon }) => (
  <div className="charcoal-glass-card rounded-2xl border border-white/15 p-3">
    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1.5">{title}</div>
    <ul className="space-y-1">
      {(items && items.length ? items : ['—']).map((t, i) => (
        <li key={i} className="flex items-start gap-1.5 text-[11px] text-zinc-200 leading-snug">
          <span className="mt-0.5 flex-shrink-0">{icon}</span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  </div>
);

/* Meta strip content per stage */
function buildMeta(n, data, defects, pci) {
  const infra = data.infrastructure || {};
  const sur = data.surroundings || {};
  const th = data.thermal || {};
  const primary = defects[0] || {};
  const m0 = (data.measurements || [])[0] || {};
  switch (n) {
    case 1:
      return [['Source', 'Field Photograph'], ['Status', 'Normalized', '#22c55e'], ['PCI', `${pci}/100`, '#eab308']];
    case 2:
      return [
        ['Infrastructure', infra.type?.replace(/_/g, ' ') || '—', '#60a5fa'],
        ['Confidence', `${Math.round((infra.confidence || 0) * 100)}%`],
        ['Surface Mask', 'BLUE #1976D2']
      ];
    case 3:
      return [
        ['Primary Type', (primary.defectType || '—').split(/[&,]/)[0].trim(), '#ef4444'],
        ['Total Detected', defects.length],
        ['Boxes', 'RED damage · YELLOW cracks']
      ];
    case 4:
      return [
        ['Segmented', `${defects.length} instance(s)`],
        ['Method', 'Region contouring'],
        ['Masks', 'RED / YELLOW']
      ];
    case 5:
      return [
        ['Inspection Zone', `~${sur.inspectionZoneRadiusMeters ?? 3.2} m radius`, '#eab308'],
        ['Cracks', sur.cracksDetected ? 'Detected' : 'None', sur.cracksDetected ? '#eab308' : '#71717a'],
        ['Water / Drainage', sur.waterOrMoisture ? 'Detected' : 'None', sur.waterOrMoisture ? '#06b6d4' : '#71717a'],
        ['Deterioration', sur.deteriorationRating || '—']
      ];
    case 6:
      return [
        ['Scale', 'IMAGE-BASED ESTIMATE', '#22c55e'],
        ['Primary Length', m0.lengthMeters ? `${m0.lengthMeters} m` : '—'],
        ['Primary Width', m0.widthMeters ? `${m0.widthMeters} m` : '—']
      ];
    case 7:
      return [
        ['High Anomaly', `${th.highAnomalyPct ?? 0}%`, '#f97316'],
        ['Moderate', `${th.moderatePct ?? 0}%`, '#eab308'],
        ['Nominal', `${th.nominalPct ?? 0}%`, '#22c55e'],
        ['Thermal Risk', th.riskLevel || '—', SEV_COLOR[th.riskLevel] || '#ef4444']
      ];
    default:
      return [];
  }
}

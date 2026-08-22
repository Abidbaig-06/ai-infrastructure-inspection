import React, { useState } from 'react';
import {
  Scan,
  Sparkles,
  Layers,
  Search,
  Maximize2,
  Bookmark,
  Printer,
  Info,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Wrench,
  History,
  TrendingUp,
  Activity,
  ExternalLink,
  ChevronRight,
  Eye,
  RefreshCw
} from 'lucide-react';

export const ManageMyRoadsVisionWorkspace = ({
  complaint,
  onGenerateReport,
  onCreateWorkOrder,
  onViewHistory,
  onReturnToMap
}) => {
  // Street segments matching the Guntur network and the reference dashboard
  const streetSegments = [
    {
      id: 'seg-01',
      code: 'R-104',
      name: 'LAKSHMIPURAM WAY',
      fromStreet: 'HINDU PHARMACY COLLEGE',
      toStreet: 'LODGE CENTER JUNCTION',
      lengthFt: '2,880.00 Ft (878 m)',
      widthFt: '30 Ft',
      squareYards: '2,454.66',
      rsr: 66,
      repairMethod: 'Mill and Overlay - 2"',
      repairColor: '#f97316', // Orange
      estimatedCostUSD: 29455.96,
      estimatedCostINR: 245000,
      category: 'Road Hazard & Pothole',
      imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
      defectName: 'Severe Alligator Cracking & Asphalt Void',
      defectConfidence: 94,
      dimensions: 'Length: 2.8m, Width: 1.6m, Depth: 14.5cm',
      ward: 'Ward 04 - Lakshmipuram West'
    },
    {
      id: 'seg-02',
      code: 'W-009',
      name: 'BRODIPET 4TH LINE / ANDOVER DR',
      fromStreet: 'RAILWAY STATION EAST GATE',
      toStreet: 'COMMERCIAL CENTER CIRCLE',
      lengthFt: '1,049.28 Ft',
      widthFt: '30 Ft',
      squareYards: '3,497.60',
      rsr: 41,
      repairMethod: 'Reclamation & Sub-Base Grouting',
      repairColor: '#ef4444', // Red
      estimatedCostUSD: 41971.16,
      estimatedCostINR: 348000,
      category: 'Water Leak & Sewage',
      imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
      defectName: 'High-Pressure Water Main Burst & Cavitation',
      defectConfidence: 96,
      dimensions: 'Pipe Dia: 300mm, Sub-Surface Void: 1.8 m³',
      ward: 'Ward 02 - Brodipet Main'
    },
    {
      id: 'seg-03',
      code: 'E-044',
      name: 'ARUNDELPET 12TH LINE / ANNES CT',
      fromStreet: 'RYTHU BAZAAR GATE',
      toStreet: 'MUNICIPAL HIGH SCHOOL',
      lengthFt: '1,820.00 Ft',
      widthFt: '24 Ft',
      squareYards: '4,853.30',
      rsr: 78,
      repairMethod: 'Preventative Maintenance & Sealing',
      repairColor: '#22c55e', // Green
      estimatedCostUSD: 13850.00,
      estimatedCostINR: 115000,
      category: 'Electrical & Live Wire',
      imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop&q=80',
      defectName: '440V Conductor Snap & Support Arm Deflection',
      defectConfidence: 97,
      dimensions: 'Span: 45m, Clearance: 1.2m',
      ward: 'Ward 01 - Arundelpet Central'
    },
    {
      id: 'seg-04',
      code: 'D-018',
      name: 'OLD GUNTUR TRUNK / HADDON RD',
      fromStreet: 'JINNAH TOWER CENTER',
      toStreet: 'RTC OLD BUS STAND',
      lengthFt: '3,150.00 Ft',
      widthFt: '36 Ft',
      squareYards: '12,600.00',
      rsr: 52,
      repairMethod: 'Routine Maintenance & Debris Removal',
      repairColor: '#0ea5e9', // Blue
      estimatedCostUSD: 18720.00,
      estimatedCostINR: 156000,
      category: 'Waste & Garbage Dumping',
      imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80',
      defectName: 'Solid Waste Accumulation & Drain Choke',
      defectConfidence: 91,
      dimensions: 'Footprint: 25 sq.m, Volume: 12.5 cu.m',
      ward: 'Ward 08 - Old Guntur Heritage'
    }
  ];

  const [selectedSegment, setSelectedSegment] = useState(streetSegments[0]);
  const [showBoundingTags, setShowBoundingTags] = useState(true);
  const [showStressHeatmap, setShowStressHeatmap] = useState(false);
  const [activeRankTab, setActiveRankTab] = useState('Reclamation');
  const [activeBacklogTab, setActiveBacklogTab] = useState('Arterials');
  const [isAiScanning, setIsAiScanning] = useState(false);

  const handleRescan = () => {
    setIsAiScanning(true);
    setTimeout(() => {
      setIsAiScanning(false);
    }, 1200);
  };

  // Donut chart repair category shares (Miles)
  const repairCategories = [
    { label: 'Mill and Overlay - 2"', miles: 17.4, share: 27, color: '#f97316' },
    { label: 'No Maintenance Required', miles: 21.5, share: 33, color: '#3b82f6' },
    { label: 'Preventative Maintenance', miles: 11.7, share: 18, color: '#22c55e' },
    { label: 'Reclamation', miles: 3.8, share: 6, color: '#ef4444' },
    { label: 'Routine Maintenance', miles: 10.0, share: 16, color: '#0ea5e9' }
  ];

  // Ranked segments by CBV
  const rankedSegments = {
    Reclamation: [
      { name: 'TRINITY RDG-02 (Lakshmipuram)', cbv: '4.82', pci: 38 },
      { name: 'HILLSIDE AVE-02 (Brodipet)', cbv: '4.45', pci: 41 },
      { name: 'COURTNEY DR-03 (Arundelpet)', cbv: '3.90', pci: 46 },
      { name: 'OVERLOOK TER (Old Guntur)', cbv: '3.62', pci: 50 },
      { name: 'PARK DR-02 (Nallapadu)', cbv: '3.15', pci: 54 },
      { name: 'CHURCH ST-01 (Kothapet)', cbv: '2.88', pci: 58 },
      { name: 'GOFF BROOK LN-02 (Pattabhipuram)', cbv: '2.40', pci: 62 }
    ],
    'Mill & Overlay-2"': [
      { name: 'LAKSHMIPURAM MAIN CORRIDOR', cbv: '5.10', pci: 66 },
      { name: 'AMARAVATHI ROAD SECTOR-3', cbv: '4.75', pci: 68 },
      { name: 'CHILLAKALURIPET BYPASS LINK', cbv: '4.20', pci: 71 },
      { name: 'GUJ красивое JANAGAR LOOP', cbv: '3.80', pci: 74 }
    ],
    Preventative: [
      { name: 'ARUNDELPET 12TH LINE AVENUE', cbv: '5.40', pci: 78 },
      { name: 'VIDYANAGAR RING ROAD EXT', cbv: '4.95', pci: 82 },
      { name: 'SYAMALA NAGAR 3RD CROSS', cbv: '4.30', pci: 85 }
    ],
    Routine: [
      { name: 'OLD GUNTUR TRUNK CONNECTOR', cbv: '3.95', pci: 52 },
      { name: 'GMC MARKET ACCESS ALLEY', cbv: '3.40', pci: 55 }
    ]
  };

  // Backlog bars by functional class
  const backlogData = {
    Arterials: [
      { label: 'Mill and Overlay - 2"', miles: 0.12, width: '42%', color: '#f97316' },
      { label: 'No Maintenance Required', miles: 0.06, width: '22%', color: '#3b82f6' },
      { label: 'Preventative Maintenance', miles: 0.28, width: '92%', color: '#22c55e' },
      { label: 'Routine Maintenance', miles: 0.20, width: '68%', color: '#0ea5e9' }
    ],
    Collectors: [
      { label: 'Mill and Overlay - 2"', miles: 0.18, width: '60%', color: '#f97316' },
      { label: 'No Maintenance Required', miles: 0.14, width: '45%', color: '#3b82f6' },
      { label: 'Preventative Maintenance', miles: 0.19, width: '65%', color: '#22c55e' },
      { label: 'Routine Maintenance', miles: 0.11, width: '38%', color: '#0ea5e9' }
    ],
    Locals: [
      { label: 'Mill and Overlay - 2"', miles: 0.24, width: '80%', color: '#f97316' },
      { label: 'No Maintenance Required', miles: 0.28, width: '94%', color: '#3b82f6' },
      { label: 'Preventative Maintenance', miles: 0.15, width: '50%', color: '#22c55e' },
      { label: 'Routine Maintenance', miles: 0.08, width: '28%', color: '#0ea5e9' }
    ]
  };

  return (
    <div className="bg-[#0b1320] text-slate-100 rounded-3xl border border-[#1e293b] shadow-2xl overflow-hidden font-sans space-y-3 p-3 sm:p-5">
      {/* 1. TOP HEADER (ManageMyRoads BETA Style) */}
      <div className="bg-[#060c16] border border-[#1e293b] rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          {/* Distinctive BETA Badge */}
          <div className="flex items-center">
            <span className="px-2.5 py-1 bg-[#b91c1c] text-white font-black text-xs tracking-widest rounded-l-lg border-y border-l border-red-500 shadow">
              B E T A
            </span>
            <span className="px-3 py-1 bg-[#0f172a] text-cyan-400 font-mono text-xs font-bold rounded-r-lg border border-[#334155]">
              AI-GIS v3.4
            </span>
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-wide uppercase flex items-center gap-2">
              <span>ManageMyRoads</span>
              <span className="text-[11px] text-slate-400 font-normal font-mono">• Guntur Municipal Corporation</span>
            </h2>
          </div>
        </div>

        {/* AI Agent Status Pill & Controls */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1 rounded-xl bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.25)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>AI VISION AGENT ACTIVE</span>
          </span>

          <button
            type="button"
            onClick={handleRescan}
            className="p-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Re-run AI Computer Vision Scan"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAiScanning ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{isAiScanning ? 'Scanning...' : 'Re-Scan'}</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN 3-PANEL GRID: LEFT METRICS | CENTER GIS MAP & IMAGE CALLOUT | RIGHT LEGEND & SEGMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* LEFT PANEL (Col 3): Road Network Rating, Road Miles, Repair Category Donut Chart, Links */}
        <div className="lg:col-span-3 space-y-3">
          {/* Road Network Rating Card */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 text-center space-y-1 shadow-lg">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Road Network Rating
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
              78.61
            </div>
            <span className="text-[10px] text-slate-400 font-mono block">
              Last Updated: 08/22/2026
            </span>
          </div>

          {/* Road Miles Card */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 text-center space-y-1 shadow-lg">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Road Miles
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
              64.45
            </div>
            <span className="text-[10px] text-slate-400 font-mono block">
              103.72 km GMC Urban Network
            </span>
          </div>

          {/* Repair Category (Miles) Donut Chart Card */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 space-y-3 shadow-lg">
            <span className="text-xs font-bold text-white uppercase tracking-wider block border-b border-[#1e293b] pb-2">
              Repair Category (Miles)
            </span>

            {/* SVG Donut Chart */}
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {repairCategories.map((cat, idx) => {
                  const offset = repairCategories.slice(0, idx).reduce((acc, c) => acc + c.share, 0);
                  return (
                    <circle
                      key={idx}
                      cx="50"
                      cy="50"
                      r="36"
                      fill="transparent"
                      stroke={cat.color}
                      strokeWidth="16"
                      strokeDasharray={`${cat.share} ${100 - cat.share}`}
                      strokeDashoffset={-offset}
                      className="transition-all duration-300 hover:opacity-80"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center font-mono pointer-events-none text-center">
                <span className="text-xs font-bold text-white">64.5</span>
                <span className="text-[9px] text-slate-400">Total Mi</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="space-y-1.5 font-mono text-[10px] pt-1">
              {repairCategories.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="line-clamp-1">{cat.label}</span>
                  </div>
                  <strong className="text-white">{cat.miles}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Web Links Card */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-3.5 text-xs font-mono space-y-1.5 text-slate-400 shadow-lg">
            <span className="text-[10px] font-bold text-slate-200 uppercase tracking-wider block">
              Web Links:
            </span>
            <p className="text-cyan-400 hover:underline cursor-pointer flex items-center gap-1">
              <span>• GMC GIS Client Portal</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </p>
            <p className="text-cyan-400 hover:underline cursor-pointer flex items-center gap-1">
              <span>• Mee Bhoomi Pavement Center</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </p>
            <p className="text-cyan-400 hover:underline cursor-pointer flex items-center gap-1">
              <span>• BETA Group AI Vision Core</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </p>
            <p className="text-[9px] text-slate-500 pt-1 italic">
              This platform is intended for planning purposes only.
            </p>
          </div>
        </div>

        {/* CENTER MAIN GIS MAP & FLOATING INSET INSPECTION CALLOUT (Col 6) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="bg-[#060c16] border border-[#1e293b] rounded-2xl p-2 relative overflow-hidden shadow-2xl min-h-[520px] flex flex-col justify-between">
            {/* Map Top Toolbar */}
            <div className="flex items-center justify-between bg-[#0f172a]/90 backdrop-blur-md p-2 rounded-xl border border-[#1e293b] text-xs font-mono z-20">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold border border-slate-700">
                  🗺️ Aerial Imagery
                </span>
                <span className="text-slate-400">Maxar, Microsoft Earthstar</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowBoundingTags(!showBoundingTags)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${
                    showBoundingTags ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Tags {showBoundingTags ? 'ON' : 'OFF'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowStressHeatmap(!showStressHeatmap)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${
                    showStressHeatmap ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Heatmap
                </button>
              </div>
            </div>

            {/* GIS Aerial Road Map Canvas */}
            <div className="relative rounded-xl overflow-hidden bg-[#0a0f18] min-h-[440px] flex items-center justify-center my-2 border border-slate-800">
              {/* Aerial Satellite Background Image */}
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&auto=format&fit=crop&q=80"
                alt="Aerial GIS Roadway"
                className="w-full h-full object-cover min-h-[440px] opacity-75"
              />

              {/* Simulated Roadway Corridor Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Green segment (Preventative) */}
                <path
                  d="M 20 280 Q 80 250 140 240"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="5"
                  strokeDasharray="6 4"
                />
                {/* Orange main segment (Mill and Overlay - 2") */}
                <path
                  d="M 140 240 Q 300 220 540 180"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="7"
                />
                {/* Dotted roadway points */}
                <circle cx="160" cy="236" r="3" fill="#ffffff" />
                <circle cx="210" cy="230" r="3" fill="#ffffff" />
                <circle cx="270" cy="223" r="3" fill="#ffffff" />
                <circle cx="340" cy="213" r="3" fill="#ffffff" />
                <circle cx="410" cy="202" r="3" fill="#ffffff" />
                <circle cx="480" cy="190" r="3" fill="#ffffff" />
                <circle cx="530" cy="182" r="3" fill="#ffffff" />

                {/* State Arterial Cross Route */}
                <path
                  d="M 500 80 L 580 380"
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="6"
                />

                {/* Projection Callout Vector Lines pointing to inspection window */}
                <line x1="320" y1="210" x2="160" y2="175" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.9" />
                <line x1="340" y1="210" x2="380" y2="175" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.9" />
              </svg>

              {/* FLOATING INSPECTION IMAGE CALLOUT (Directly from reference design) */}
              <div className="absolute top-6 left-12 right-12 bg-black/95 rounded-xl border-2 border-white/80 shadow-2xl p-2.5 space-y-2 z-30 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-1 border-b border-white/20 text-[11px] font-mono">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Scan className="w-3.5 h-3.5 text-cyan-400" />
                    <span>AI STREET-LEVEL INSPECTION CALLOUT</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 font-bold border border-red-800 text-[10px]">
                    RSR: {selectedSegment.rsr}/100
                  </span>
                </div>

                {/* Inspection Photo with AI Neural Detection Overlays */}
                <div className="relative rounded-lg overflow-hidden h-44 bg-black border border-white/20">
                  <img
                    src={selectedSegment.imageUrl}
                    alt="Street Defect"
                    className="w-full h-full object-cover"
                  />

                  {showStressHeatmap && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/30 via-red-500/40 to-transparent mix-blend-color-dodge" />
                  )}

                  {/* AI Vision Bounding Tag Overlays */}
                  {showBoundingTags && (
                    <div className="absolute inset-4 border-2 border-dashed border-white rounded-lg bg-white/10 p-2 flex flex-col justify-between">
                      <div className="self-start bg-black/90 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white border border-white/30">
                        AI TAG: {selectedSegment.defectName.toUpperCase()} ({selectedSegment.defectConfidence}%)
                      </div>
                      <div className="self-end bg-black/90 px-2 py-0.5 rounded text-[10px] font-mono text-zinc-300 border border-white/20">
                        {selectedSegment.dimensions}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-300">
                  <span>Target: <strong>{selectedSegment.name}</strong></span>
                  <span>Method: <strong className="text-orange-400">{selectedSegment.repairMethod}</strong></span>
                </div>
              </div>

              {/* Target Segment Pin Marker on Map */}
              <div className="absolute top-[205px] left-[328px] z-20">
                <div className="w-6 h-6 border-2 border-white bg-white/30 rounded-sm shadow-[0_0_15px_#ffffff] animate-pulse" />
              </div>
            </div>

            {/* Bottom Coordinates Status Bar */}
            <div className="flex items-center justify-between px-3 py-1 text-[10px] font-mono text-slate-400 border-t border-[#1e293b]">
              <span>Pavement Management • Parking Assessments</span>
              <span>Coordinates: 16.3125° N, 80.4280° E</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL (Col 3): Map Legend & Detailed Street Segment Inspector Cards */}
        <div className="lg:col-span-3 space-y-3">
          {/* Map Legend Card */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 space-y-2 text-xs font-mono shadow-lg">
            <span className="font-bold text-white uppercase tracking-wider block border-b border-[#1e293b] pb-1.5">
              Map Legend:
            </span>

            <div className="space-y-1 text-[11px] text-slate-300">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Roadway Points</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white inline-block" />
                <span>• Inspected Points</span>
              </div>
            </div>

            <div className="space-y-1.5 text-[10px] pt-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Repair Category</span>
              <div className="flex items-center gap-1.5 text-orange-400">
                <span className="w-3 h-1 rounded bg-orange-500" />
                <span>Mill and Overlay - 2"</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-400">
                <span className="w-3 h-1 rounded bg-blue-500" />
                <span>No Maintenance Required</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-3 h-1 rounded bg-emerald-500" />
                <span>Preventative Maintenance</span>
              </div>
              <div className="flex items-center gap-1.5 text-red-400">
                <span className="w-3 h-1 rounded bg-red-500" />
                <span>Reclamation</span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-3 h-1 rounded bg-cyan-500" />
                <span>Routine Maintenance</span>
              </div>
            </div>

            <div className="space-y-1 text-[10px] pt-1 border-t border-[#1e293b]">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Non-Inspected Roadways</span>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span>- - -</span>
                <span>Private</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span>───</span>
                <span>State / Arterial</span>
              </div>
            </div>
          </div>

          {/* Interactive Street Segment Inspector Cards */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-white uppercase tracking-wider block px-1">
              Street Segments ({streetSegments.length})
            </span>

            {streetSegments.map((seg) => {
              const isSelected = selectedSegment.id === seg.id;
              return (
                <div
                  key={seg.id}
                  onClick={() => setSelectedSegment(seg)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-xs font-mono space-y-1 shadow-lg ${
                    isSelected
                      ? 'bg-[#1e293b] border-white text-white ring-1 ring-white/50'
                      : 'bg-[#0f172a] border-[#1e293b] text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-white uppercase">{seg.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-black/60 text-cyan-300 border border-white/20">
                      RSR: {seg.rsr}
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-400 space-y-0.5 pt-1">
                    <p>From Street: <strong className="text-slate-200">{seg.fromStreet}</strong></p>
                    <p>To Street: <strong className="text-slate-200">{seg.toStreet}</strong></p>
                    <p>Length: {seg.lengthFt} • Width: {seg.widthFt}</p>
                    <p>Square Yards: {seg.squareYards}</p>
                    <p>Repair: <strong className="text-orange-400">{seg.repairMethod}</strong></p>
                    <p className="text-emerald-400 font-bold pt-0.5">
                      Estimated Cost: ₹{seg.estimatedCostINR.toLocaleString()} (${seg.estimatedCostUSD.toFixed(2)})
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM TWO ANALYTICS PANELS: RANKED SEGMENTS BY CBV | BACKLOG SUMMARY BY CLASS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 pt-1">
        {/* Left Bottom (Col 6): Roadway Segments Ranked by CBV */}
        <div className="lg:col-span-6 bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1e293b] pb-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Roadway Segments Ranked by CBV ({activeRankTab})
            </span>
          </div>

          {/* Rank Filter Tabs */}
          <div className="flex flex-wrap gap-1 text-[10px] font-mono">
            {['Reclamation', 'Mill & Overlay-2"', 'Preventative', 'Routine'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveRankTab(tab)}
                className={`px-3 py-1 rounded-lg font-bold border transition-colors cursor-pointer ${
                  activeRankTab === tab
                    ? 'bg-cyan-600 text-white border-cyan-400'
                    : 'bg-[#060c16] text-slate-400 border-[#1e293b] hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Ranked List Table */}
          <div className="space-y-1 font-mono text-xs max-h-48 overflow-y-auto divide-y divide-[#1e293b]">
            {(rankedSegments[activeRankTab] || rankedSegments['Reclamation']).map((item, idx) => (
              <div key={idx} className="pt-1.5 pb-1 flex items-center justify-between text-slate-300 hover:text-white">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-bold">#{idx + 1}</span>
                  <span className="text-[11px]">{item.name}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span>CBV: <strong className="text-cyan-400">{item.cbv}</strong></span>
                  <span className="text-slate-500">|</span>
                  <span>PCI: <strong className="text-white">{item.pci}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Bottom (Col 6): Backlog Summary by Functional Class (Horizontal Bar Graph) */}
        <div className="lg:col-span-6 bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1e293b] pb-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Backlog Summary by Functional Class ({activeBacklogTab})
            </span>
          </div>

          {/* Functional Class Filter Tabs */}
          <div className="flex gap-1 text-[10px] font-mono">
            {['Arterials', 'Collectors', 'Locals'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveBacklogTab(tab)}
                className={`px-3 py-1 rounded-lg font-bold border transition-colors cursor-pointer ${
                  activeBacklogTab === tab
                    ? 'bg-cyan-600 text-white border-cyan-400'
                    : 'bg-[#060c16] text-slate-400 border-[#1e293b] hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Horizontal Bar Chart */}
          <div className="space-y-2.5 font-mono text-xs pt-1">
            {(backlogData[activeBacklogTab] || backlogData['Arterials']).map((bar, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300">{bar.label}</span>
                  <span className="text-white font-bold">{bar.miles} Mi</span>
                </div>
                <div className="w-full bg-[#060c16] h-3.5 rounded-md overflow-hidden border border-[#1e293b]">
                  <div
                    className="h-full transition-all duration-700 rounded-sm"
                    style={{ width: bar.width, backgroundColor: bar.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. BOTTOM ACTION TOOLBAR: REPORT, WORK ORDER, HISTORY */}
      <div className="bg-[#060c16] border border-[#1e293b] rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Info className="w-4 h-4 text-cyan-400" />
          <span>Selected Segment: <strong className="text-white">{selectedSegment.name}</strong> • RSR: <strong className="text-amber-400">{selectedSegment.rsr}</strong></span>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={onGenerateReport}
            className="white-gloss-btn px-4 py-2 font-black rounded-xl text-black flex items-center gap-1.5 shadow-lg cursor-pointer"
          >
            <FileCheck className="w-4 h-4 text-black" />
            <span>Generate Statutory Dossier</span>
          </button>

          <button
            type="button"
            onClick={onCreateWorkOrder}
            className="px-4 py-2 font-bold rounded-xl bg-cyan-900/80 hover:bg-cyan-800 text-cyan-200 border border-cyan-600/60 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Wrench className="w-4 h-4 text-cyan-400" />
            <span>Create Work Order</span>
          </button>

          <button
            type="button"
            onClick={onViewHistory}
            className="px-3.5 py-2 font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 cursor-pointer border border-slate-700"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>Asset History</span>
          </button>
        </div>
      </div>
    </div>
  );
};

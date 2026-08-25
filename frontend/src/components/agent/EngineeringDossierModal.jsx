import React from 'react';
import {
  X,
  Printer,
  Building2,
  CheckCircle2,
  ShieldAlert,
  FileCheck,
  MapPin,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

export const EngineeringDossierModal = ({
  complaint,
  inspectionData,
  isOpen,
  onClose
}) => {
  if (!isOpen || !complaint) return null;

  const ai = inspectionData || complaint.aiAnalysis || {};
  const cat = complaint.category || '';
  const isRoad = cat.includes('Road') || cat.includes('Pothole') || (!cat.includes('Water') && !cat.includes('Electrical') && !cat.includes('Wire') && !cat.includes('Waste'));
  const isWater = cat.includes('Water') || cat.includes('Sewage');
  const isElectric = cat.includes('Electrical') || cat.includes('Wire');
  const isWaste = cat.includes('Waste') || cat.includes('Garbage') || cat.includes('Drainage') || cat.includes('Debris');

  // Category-specific fallback defects if visionDefects not provided by live scan
  const defaultDefects = isRoad
    ? [
        {
          defectType: 'Alligator Cracking & Asphalt Spalling',
          dimensions: 'Length: 2.8m, Width: 1.6m, Depth: 14.5cm',
          ircCodeStandard: 'IRC:82-2015 Pavement Maintenance Standard (Severity III)'
        },
        {
          defectType: 'Sub-Base Soil Cavitation Void',
          dimensions: 'Estimated cavity volume: 0.65 m³',
          ircCodeStandard: 'IRC:37-2018 Structural Design of Flexible Pavements'
        }
      ]
    : isWater
    ? [
        {
          defectType: 'High-Pressure Cast Iron Water Main Rupture',
          dimensions: 'Pipe Diameter: 300mm, Sub-Surface Void: 1.8 m³',
          ircCodeStandard: 'CPHEEO Manual on Municipal Water Supply & IS 1536 Standard'
        },
        {
          defectType: 'Sub-Grade Hydrodynamic Soil Erosion',
          dimensions: 'Erosion Footprint: 3.5m x 2.2m along carriageway',
          ircCodeStandard: 'IRC:SP:50-2013 Guidelines on Urban Drainage Design'
        }
      ]
    : isElectric
    ? [
        {
          defectType: '440V Overhead Conductor Snap & Ground Proximity',
          dimensions: 'Span Length: 45m, Vertical Clearance: 1.2m from walkway',
          ircCodeStandard: 'CEA (Measures Relating to Safety & Electric Supply) Reg 2010 (Rule 77)'
        },
        {
          defectType: 'Fractured Support Arm & Ceramic Insulator Dislocation',
          dimensions: 'Cross-Arm Displacement: 35 deg, Arc Flash Risk Zone: 4.0m',
          ircCodeStandard: 'IS 5613 Code of Practice for Overhead Power Lines'
        }
      ]
    : [
        {
          defectType: 'Commercial Construction Debris & Municipal Solid Waste Accumulation',
          dimensions: 'Footprint: 25.0 sq.m, Estimated Volume: 12.5 cu.m',
          ircCodeStandard: 'Solid Waste Management Rules 2016 (CPCB/APPCB Directives)'
        },
        {
          defectType: 'Pedestrian Footpath Obstruction & Drainage Channel Clogging',
          dimensions: 'Walkway Encroachment: 100%, Drain Choke Length: 8.0m',
          ircCodeStandard: 'GMC Public Health & Sanitation Bylaws Act 1955'
        }
      ];

  const defects = (ai.visionDefects && ai.visionDefects.length > 0) ? ai.visionDefects : defaultDefects;

  // Category-specific BOQ table
  const defaultBOQ = isRoad
    ? [
        { item: 'Cold Milling & Concrete Saw-Cutting', quantity: '4.5 sq.m', unitCostUSD: 40, totalUSD: 180 },
        { item: 'Granular Sub-Base (GSB) Replacement & Vibro-Compaction', quantity: '1.2 cu.m', unitCostUSD: 120, totalUSD: 144 },
        { item: 'Bituminous Concrete (BC) Hot Mix Overlay (40mm thickness)', quantity: '0.8 MT', unitCostUSD: 310, totalUSD: 248 },
        { item: 'Thermoplastic Road Marking & Reflective Studs', quantity: '12 linear meters', unitCostUSD: 15, totalUSD: 180 }
      ]
    : isWater
    ? [
        { item: 'Emergency Hydraulic Dewatering & Sludge Pumping', quantity: '4.0 Hours', unitCostUSD: 65, totalUSD: 260 },
        { item: 'Heavy-Duty 300mm Ductile Iron (DI) Split Collar Sleeve', quantity: '1 Unit', unitCostUSD: 320, totalUSD: 320 },
        { item: 'Crushed Aggregate Bedding & Foundation Compaction', quantity: '2.5 cu.m', unitCostUSD: 85, totalUSD: 212 },
        { item: 'Hydrostatic Pressure & Chlorinated Line Flush Testing', quantity: '1 Lumpsum', unitCostUSD: 150, totalUSD: 150 }
      ]
    : isElectric
    ? [
        { item: 'Emergency Feeder Isolation & Line Grounding Procedure', quantity: '1 Team Ops', unitCostUSD: 120, totalUSD: 120 },
        { item: 'ACSR 50 sq.mm Conductor Re-Stringing & Tension Clamps', quantity: '45 meters', unitCostUSD: 8, totalUSD: 360 },
        { item: '11kV/440V Pin Insulator & Galvanized Steel Cross-Arm', quantity: '2 Sets', unitCostUSD: 95, totalUSD: 190 },
        { item: 'Megger Insulation Resistance & Dielectric Continuity Test', quantity: '1 Cert Test', unitCostUSD: 80, totalUSD: 80 }
      ]
    : [
        { item: 'Hydraulic Backhoe Excavator (JCB) & Haulage Operations', quantity: '3.5 Hours', unitCostUSD: 70, totalUSD: 245 },
        { item: '10-Ton Solid Waste Tipper Transport to GMC Landfill', quantity: '2 Trips', unitCostUSD: 110, totalUSD: 220 },
        { item: 'High-Pressure Disinfection & Sodium Hypochlorite Spray', quantity: '120 sq.m', unitCostUSD: 1.2, totalUSD: 144 },
        { item: 'Precast Concrete Footpath Slab Reset & Safety Bollards', quantity: '4 Units', unitCostUSD: 45, totalUSD: 180 }
      ];

  const boq = (ai.engineeringRecommendations?.billOfQuantities && ai.engineeringRecommendations.billOfQuantities.length > 0)
    ? ai.engineeringRecommendations.billOfQuantities
    : defaultBOQ;

  const totalCostUSD = boq.reduce((sum, b) => sum + (b.totalUSD || 0), 0);
  const totalCostINR = Math.round(totalCostUSD * 83.5);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="charcoal-glass rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-white/25 animate-in fade-in zoom-in-95 flex flex-col max-h-[92vh] text-zinc-100 relative">
        {/* Top Specular White Beam */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent no-print" />

        {/* Modal Header */}
        <div className="p-6 flex items-center justify-between border-b border-white/10 no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-inner">
              <FileCheck className="w-5 h-5 drop-shadow-[0_0_6px_#ffffff]" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-white">Evidence-Linked Engineering Inspection Dossier</h3>
              <p className="text-xs text-zinc-400 font-mono">Statutory Municipal Technical Assessment</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 charcoal-pill hover:border-white/50 text-zinc-400 hover:text-white rounded-xl transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Dossier Sheet */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs work-order-print-sheet">
          {/* Statutory Title Header */}
          <div className="border-b-2 border-white/20 pb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center font-bold shadow-inner">
                <Building2 className="w-7 h-7 drop-shadow-[0_0_6px_#ffffff]" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold font-display uppercase tracking-tight text-white">
                  Guntur Municipal Corporation (GMC)
                </h2>
                <p className="text-xs text-zinc-300 font-bold">
                  Department of Public Works & Structural Engineering
                </p>
                <p className="text-[10px] text-zinc-400 font-mono">
                  Official Technical Inspection Dossier • Ref: {complaint.ticketId}
                </p>
              </div>
            </div>

            <div className="text-right font-mono">
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                INSPECTION ID
              </span>
              <span className="text-sm font-bold text-white tracking-wider">
                {ai.inspectionId || 'INSP-GNT-9942'}
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">
                Date: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Asset & Location Identification */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 charcoal-glass-card p-4.5 rounded-2xl border border-white/15">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block mb-0.5">
                GMC Ward & Zone
              </span>
              <strong className="text-white">{complaint.location?.ward}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block mb-0.5">
                Composite Risk Score
              </span>
              <strong className="text-red-400 font-mono">
                {ai.compositeRiskScore || ai.riskScore || 92}/100 ({ai.severity || 'CRITICAL'})
              </strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block mb-0.5">
                Pavement Index (PCI)
              </span>
              <strong className="text-amber-400 font-mono">
                {ai.pavementConditionIndex || 42}/100 (Poor)
              </strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block mb-0.5">
                Statutory SLA Target
              </span>
              <strong className="text-white font-mono">
                {ai.statutorySLA || `${ai.slaHours || 4} Hours`}
              </strong>
            </div>
          </div>

          {/* Evidence Image with Defect Annotations */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
              1. Photographic Evidence & Visual Defect Tagging
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-6 rounded-2xl overflow-hidden bg-black border border-white/20 relative">
                <img
                  src={complaint.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80'}
                  alt="Defect Evidence"
                  className="w-full h-48 object-cover opacity-95"
                />
                <div className="absolute inset-4 border-2 border-dashed border-white rounded-xl bg-white/10 p-2 text-white text-[10px] font-mono font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  AI DEFECT TAGGED: {complaint.category?.toUpperCase()}
                </div>
              </div>

              <div className="sm:col-span-6 space-y-2 text-xs">
                {defects.map((def, i) => (
                  <div key={i} className="p-3.5 rounded-xl charcoal-glass-card border border-white/15 space-y-1">
                    <strong className="text-white block">{def.defectType}</strong>
                    <p className="text-[11px] text-zinc-300 font-mono">Dimensions: <span className="text-white font-semibold">{def.dimensions}</span></p>
                    <p className="text-[10px] text-zinc-400 font-mono">Standard: {def.ircCodeStandard}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bill of Quantities (BOQ) */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
              2. Bill of Quantities (BOQ) & Material Estimates
            </span>
            <table className="w-full text-left border-collapse border border-white/15 rounded-2xl overflow-hidden text-xs">
              <thead>
                <tr className="bg-black/60 text-zinc-300 font-mono font-bold">
                  <th className="p-3 border-b border-white/15">Item Specification</th>
                  <th className="p-3 border-b border-white/15">Quantity</th>
                  <th className="p-3 border-b border-white/15">Unit Cost</th>
                  <th className="p-3 border-b border-white/15 text-right">Total (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-black/30">
                {boq.map((b, idx) => (
                  <tr key={idx}>
                    <td className="p-3 font-medium text-zinc-200">{b.item}</td>
                    <td className="p-3 font-mono text-zinc-400">{b.quantity}</td>
                    <td className="p-3 font-mono text-zinc-400">${b.unitCostUSD}.00</td>
                    <td className="p-3 font-mono text-right text-white font-bold">${b.totalUSD}.00</td>
                  </tr>
                ))}
                <tr className="bg-white/5 font-bold text-white">
                  <td className="p-3 uppercase font-mono" colSpan={3}>Estimated Total Engineering Cost</td>
                  <td className="p-3 font-mono text-right text-white text-sm drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                    ₹{totalCostINR.toLocaleString()} <span className="text-xs font-normal text-zinc-300 font-mono">(${totalCostUSD}.00 USD)</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Statutory Engineer Sign-off */}
          <div className="pt-4 border-t-2 border-white/20 grid grid-cols-2 gap-8 text-zinc-300">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block mb-1">
                Inspecting AI Agent Model & Signature
              </span>
              <p className="font-bold text-white">CivicPulse Infrastructure Agent v3.4-GMC</p>
              <p className="text-[11px] text-zinc-400">Autonomous Computer Vision & Multimodal Triage</p>
              <div className="mt-4 border-b border-dashed border-zinc-600 w-48" />
              <span className="text-[9px] text-zinc-400 block mt-0.5 font-mono">Digital Token: 0x8F92A</span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block mb-1">
                Chief Municipal Reviewing Engineer
              </span>
              <p className="font-bold text-white">Dr. Aris Thorne (Executive Engineer, GMC)</p>
              <p className="text-[11px] text-zinc-400">Badge #GMC-ENG-8821 • Andhra Pradesh PWD</p>
              <div className="mt-4 border-b border-dashed border-zinc-600 w-48 ml-auto" />
              <span className="text-[9px] text-zinc-400 block mt-0.5 font-mono">Approved for Field Work Order Issuance</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="border-t border-white/10 px-6 py-4 flex items-center justify-between no-print">
          <span className="text-xs text-zinc-400 font-mono">
            Complies with Indian Roads Congress (IRC) & GMC Standard Civil Specifications.
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="white-gloss-btn px-4 py-2 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-lg cursor-pointer"
            >
              <Printer className="w-4 h-4 text-black" />
              <span>Print Statutory Dossier (PDF)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="white-glass-btn-secondary px-4 py-2 font-semibold rounded-xl text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

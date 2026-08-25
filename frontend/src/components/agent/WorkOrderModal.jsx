import React, { useState } from 'react';
import { FileSpreadsheet, X, Printer, CheckCircle, Building2, QrCode, Shield, DollarSign, Calendar } from 'lucide-react';
import { useGrievance } from '../../context/GrievanceContext';
import { useAuth } from '../../context/AuthContext';

export const WorkOrderModal = ({ complaint, isOpen, onClose }) => {
  const { generateMaintenanceWorkOrder } = useGrievance();
  const { currentUser } = useAuth();

  const [contractor, setContractor] = useState('Apex Civil Engineering & Paving Corp');
  const [budgetLabor, setBudgetLabor] = useState(450);
  const [budgetMaterials, setBudgetMaterials] = useState(650);
  const [budgetMachinery, setBudgetMachinery] = useState(300);
  const [deadlineHours, setDeadlineHours] = useState(24);
  const [isGenerated, setIsGenerated] = useState(false);
  const [generatedOrder, setGeneratedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !complaint) return null;

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        complaintTicketId: complaint.ticketId,
        title: `Maintenance Order: ${complaint.title}`,
        department: complaint.aiAnalysis?.assignedDepartment || 'Department of Public Works',
        priority: complaint.aiAnalysis?.severity === 'CRITICAL' ? 'EMERGENCY' : 'HIGH',
        contractorName: contractor,
        leadEngineer: currentUser?.name || 'Dr. Aris Thorne',
        budgetLabor,
        budgetMaterials,
        budgetMachinery,
        deadlineHours,
        officerName: currentUser?.name || 'Dr. Aris Thorne',
        badgeNumber: currentUser?.badgeNumber || 'ENG-8821',
        siteAddress: complaint.location?.address,
        ward: complaint.location?.ward,
        latitude: complaint.location?.latitude,
        longitude: complaint.location?.longitude
      };

      const res = await generateMaintenanceWorkOrder(payload);
      setGeneratedOrder(res);
      setIsGenerated(true);
    } catch (err) {
      alert('Error creating work order: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="charcoal-glass rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-white/25 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh] text-zinc-100 relative">
        {/* Top Specular White Beam */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent no-print" />

        {/* Header Bar */}
        <div className="p-6 flex items-center justify-between border-b border-white/10 no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-inner">
              <FileSpreadsheet className="w-5 h-5 drop-shadow-[0_0_6px_#ffffff]" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-white">Official Municipal Maintenance Work Order</h3>
              <p className="text-xs text-zinc-400 font-mono">Grievance Ticket: {complaint.ticketId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 charcoal-pill hover:border-white/50 text-zinc-400 hover:text-white rounded-xl transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Work Order Content / Printable Sheet */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs work-order-print-sheet">
          {/* Printable Official Header */}
          <div className="border-b-2 border-white/20 pb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center font-bold shadow-inner">
                <Building2 className="w-7 h-7 drop-shadow-[0_0_6px_#ffffff]" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold font-display uppercase tracking-tight text-white">
                  Municipal Department of Public Infrastructure
                </h2>
                <p className="text-xs text-zinc-300 font-semibold">
                  Field Maintenance & Emergency Repair Authorization
                </p>
                <p className="text-[10px] text-zinc-400 font-mono">
                  Standard Form 409-B • Gov Civil Safety Grid
                </p>
              </div>
            </div>

            <div className="text-right font-mono">
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                WORK ORDER NO.
              </span>
              <span className="text-sm font-bold text-white tracking-wider">
                {generatedOrder?.workOrderNumber || complaint.workOrderRef || 'WO-2026-PENDING'}
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">
                Date: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Grievance & Site Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 charcoal-glass-card p-4.5 rounded-2xl border border-white/15">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block mb-0.5">
                Target Ticket
              </span>
              <strong className="font-mono text-white">{complaint.ticketId}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block mb-0.5">
                Department
              </span>
              <strong className="text-white truncate block">
                {complaint.aiAnalysis?.assignedDepartment || 'Transportation Dept'}
              </strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block mb-0.5">
                Severity / Urgency
              </span>
              <strong className="text-red-400">
                {complaint.aiAnalysis?.severity || 'HIGH'} (Risk {complaint.aiAnalysis?.riskScore || 75}/100)
              </strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block mb-0.5">
                Ward & Zone
              </span>
              <strong className="text-white">{complaint.location?.ward}</strong>
            </div>
          </div>

          {/* Work Site Location */}
          <div className="p-4 rounded-2xl charcoal-glass-card border border-white/15">
            <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block mb-1">
              Field Execution Site
            </span>
            <p className="font-bold text-white text-xs">{complaint.location?.address}</p>
            <p className="text-[11px] text-zinc-400 font-mono">
              Landmark: {complaint.location?.landmark || 'N/A'} • Coordinates: ({complaint.location?.latitude}, {complaint.location?.longitude})
            </p>
          </div>

          {/* Scope of Work */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              1. Statutory Scope of Engineering Works
            </h4>
            <div className="p-4 rounded-2xl charcoal-glass-card border border-white/10 space-y-1.5 text-zinc-300">
              <p>• Immediate deployment of high-visibility Type-III traffic barriers and pedestrian bridge plate.</p>
              <p>• Remove degraded aggregate and excavate compromised sub-base to statutory depth.</p>
              <p>• Apply high-grade polymer asphalt / pipe sleeve according to municipal engineering standard specs.</p>
              <p>• Perform post-repair photographic verification and clearance sign-off on INFRASPECTION app.</p>
            </div>
          </div>

          {/* Required Equipment & Safety */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl charcoal-glass-card border border-white/10 space-y-1.5">
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block">
                Required Machinery & Tools
              </span>
              {complaint.aiAnalysis?.recommendedEquipment?.map((eq, i) => (
                <div key={i} className="text-white font-semibold font-mono text-xs">• {eq}</div>
              )) || <div className="text-white font-semibold">• Standard Heavy Maintenance Truck</div>}
            </div>

            <div className="p-4 rounded-2xl charcoal-glass-card border border-white/10 space-y-1.5">
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block">
                Safety Checklist Verification
              </span>
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Class 3 Hi-Vis & PPE Mandatory</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Underground Utility Line Scan Cleared</span>
              </div>
            </div>
          </div>

          {/* Financial Budget Estimate */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              2. Approved Municipal Budget Allocation
            </h4>
            <table className="w-full text-left border-collapse border border-white/15 rounded-2xl overflow-hidden text-xs">
              <thead>
                <tr className="bg-black/60 text-zinc-300 font-mono font-bold">
                  <th className="p-3 border-b border-white/15">Cost Item</th>
                  <th className="p-3 border-b border-white/15">Allocation</th>
                  <th className="p-3 border-b border-white/15 text-right">Amount (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-black/30">
                <tr>
                  <td className="p-3 text-zinc-200">Labor & Specialist Field Crew (4 Members)</td>
                  <td className="p-3 text-zinc-400 font-mono">Standard Union Rate</td>
                  <td className="p-3 text-right font-mono text-white">${budgetLabor}.00</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-200">Approved Materials & Sealants</td>
                  <td className="p-3 text-zinc-400 font-mono">Certified Aggregate Mix</td>
                  <td className="p-3 text-right font-mono text-white">${budgetMaterials}.00</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-200">Heavy Machinery & Logistics Fuel</td>
                  <td className="p-3 text-zinc-400 font-mono">Vibro-Roller / Hydro Unit</td>
                  <td className="p-3 text-right font-mono text-white">${budgetMachinery}.00</td>
                </tr>
                <tr className="bg-white/5 font-bold text-white">
                  <td className="p-3 text-xs uppercase font-mono" colSpan={2}>Total Authorized Expenditure</td>
                  <td className="p-3 text-right font-mono text-white text-sm drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                    ${Number(budgetLabor) + Number(budgetMaterials) + Number(budgetMachinery)}.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Official Sign-Off Section */}
          <div className="pt-4 border-t-2 border-white/20 grid grid-cols-2 gap-8 text-zinc-300">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block mb-1">
                Issued By Authorized Officer
              </span>
              <p className="font-bold text-white">{currentUser?.name || 'Dr. Aris Thorne'}</p>
              <p className="text-[11px] text-zinc-400">Chief Municipal Engineer • Badge #{currentUser?.badgeNumber || 'ENG-8821'}</p>
              <div className="mt-4 border-b border-dashed border-zinc-600 w-48" />
              <span className="text-[9px] text-zinc-400 block mt-0.5 font-mono">Digital Signature Verified</span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block mb-1">
                Field Contractor Acknowledgment
              </span>
              <p className="font-bold text-white">{contractor}</p>
              <p className="text-[11px] text-zinc-400">Target SLA: Within {deadlineHours} Hours</p>
              <div className="mt-4 border-b border-dashed border-zinc-600 w-48 ml-auto" />
              <span className="text-[9px] text-zinc-400 block mt-0.5 font-mono">Field Supervisor Acceptance</span>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="border-t border-white/10 px-6 py-4 flex items-center justify-between no-print">
          <div>
            {!isGenerated && (
              <span className="text-xs text-zinc-300 font-mono">
                Click below to stamp and dispatch this work order into the municipal record.
              </span>
            )}
            {isGenerated && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 font-mono">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Work Order Active & Dispatched to Field Crew</span>
              </span>
            )}
          </div>

          <div className="flex gap-2">
            {!isGenerated ? (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isSubmitting}
                className="white-gloss-btn px-4 py-2 font-black rounded-xl text-xs shadow-lg cursor-pointer"
              >
                {isSubmitting ? 'Stamping...' : 'Issue & Authorize Work Order'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePrint}
                className="white-gloss-btn px-4 py-2 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-lg cursor-pointer"
              >
                <Printer className="w-4 h-4 text-black" />
                <span>Print Official PDF</span>
              </button>
            )}

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

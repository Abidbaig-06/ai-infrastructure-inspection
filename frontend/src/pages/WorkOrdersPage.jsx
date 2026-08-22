import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { WorkOrderModal } from '../components/agent/WorkOrderModal';
import { useGrievance } from '../context/GrievanceContext';
import { ROUTES } from '../config/routes';
import { Link } from 'react-router-dom';
import {
  FileSpreadsheet,
  Printer,
  Search,
  CheckCircle,
  Clock,
  Building2,
  DollarSign,
  Truck,
  Plus,
  ArrowLeft
} from 'lucide-react';

export const WorkOrdersPage = () => {
  const { workOrders, complaints, openWorkOrder } = useGrievance();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredOrders = workOrders.filter((wo) =>
    wo.workOrderNumber?.toLowerCase().includes(search.toLowerCase()) ||
    wo.title?.toLowerCase().includes(search.toLowerCase()) ||
    wo.complaintTicketId?.toLowerCase().includes(search.toLowerCase()) ||
    wo.siteLocation?.ward?.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenPrint = (order) => {
    const linkedComplaint = complaints.find(c => c.ticketId === order.complaintTicketId) || {
      ticketId: order.complaintTicketId,
      title: order.title,
      location: order.siteLocation,
      aiAnalysis: {
        severity: order.priority === 'EMERGENCY' ? 'CRITICAL' : 'HIGH',
        riskScore: 85,
        assignedDepartment: order.department,
        recommendedEquipment: ['Heavy Maintenance Unit', 'Asphalt / Hydro Unit']
      }
    };
    setSelectedOrder(linkedComplaint);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-obsidian-rock text-zinc-100 relative">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header Banner in Charcoal Glass */}
        <div className="charcoal-glass p-6 sm:p-7 rounded-3xl border border-white/20 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                to={ROUTES.HOME}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-mono transition-colors mr-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
              <span className="text-zinc-600">/</span>
              <span className="text-xs font-mono font-bold text-zinc-300 uppercase">
                ENGINEERING WORK ORDERS
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold font-display text-white">
              Municipal Maintenance Work Orders
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Official Engineering Tasking, Contractor Budgets & Safety Verification
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Work Order #..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="charcoal-glass-input pl-9 pr-3 py-2 text-xs rounded-xl w-48 sm:w-60 focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>

        {/* Work Orders Table */}
        <div className="charcoal-glass rounded-3xl border border-white/15 shadow-2xl overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
              Active Municipal Engineering Authorizations
            </span>
            <span className="text-xs font-mono text-zinc-400">
              {filteredOrders.length} Authorized Work Orders
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/15 bg-black/60 text-zinc-400 uppercase font-mono font-bold text-[10px] tracking-wider">
                  <th className="p-4">Work Order #</th>
                  <th className="p-4">Target Task & Location</th>
                  <th className="p-4">Assigned Contractor</th>
                  <th className="p-4">Budget Total</th>
                  <th className="p-4">Status & SLA</th>
                  <th className="p-4 text-right">Official Document</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-black/30">
                {filteredOrders.map((wo) => (
                  <tr key={wo._id || wo.workOrderNumber} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-white block">
                        {wo.workOrderNumber}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        Ref: {wo.complaintTicketId}
                      </span>
                    </td>

                    <td className="p-4 max-w-xs">
                      <p className="font-bold text-zinc-200 line-clamp-1">{wo.title}</p>
                      <p className="text-[11px] text-zinc-400">
                        📍 {wo.siteLocation?.ward} • {wo.department}
                      </p>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span className="font-semibold text-zinc-200 block">{wo.contractorName}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">Lead: {wo.leadEngineer}</span>
                    </td>

                    <td className="p-4 whitespace-nowrap font-mono font-bold text-white">
                      ${(wo.allocatedBudget?.totalUSD || 1400).toLocaleString()}.00
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                        {wo.status}
                      </span>
                      <span className="text-[10px] text-zinc-400 block mt-1 font-mono">
                        Due: {wo.statutoryDeadlineHours || 24}h max
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenPrint(wo)}
                        className="white-gloss-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5 text-black" />
                        <span>Print Work Order</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Work Order Modal */}
      {selectedOrder && (
        <WorkOrderModal
          complaint={selectedOrder}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <Footer />
    </div>
  );
};

import React, { useState } from 'react';
import { OfficerHeader } from '../components/agent/OfficerHeader';
import { OfficerSidebar } from '../components/agent/OfficerSidebar';
import { MetricCard } from '../components/common/MetricCard';
import { SeverityBadge, StatusBadge } from '../components/common/StatusBadge';
import { InteractiveGISMap } from '../components/agent/InteractiveGISMap';
import { AIAnalysisModal } from '../components/agent/AIAnalysisModal';
import { DispatchCrewModal } from '../components/agent/DispatchCrewModal';
import { WorkOrderModal } from '../components/agent/WorkOrderModal';
import { SeverityDonutChart } from '../components/charts/SeverityDonutChart';
import { useGrievance } from '../context/GrievanceContext';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  Clock,
  Truck,
  CheckCircle2,
  Filter,
  Search,
  RefreshCw,
  Download,
  Eye,
  FileSpreadsheet,
  MapPin,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export const DashboardPage = () => {
  const {
    complaints,
    analytics,
    loading,
    filters,
    setFilters,
    selectedComplaint,
    isAiModalOpen,
    setIsAiModalOpen,
    isDispatchModalOpen,
    setIsDispatchModalOpen,
    isWorkOrderModalOpen,
    setIsWorkOrderModalOpen,
    openAiInspector,
    openDispatch,
    openWorkOrder,
    refreshData
  } = useGrievance();

  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'DISPATCHED' | 'RESOLVED'

  // Filter complaints based on search and tab
  const displayedComplaints = complaints.filter((c) => {
    if (activeTab === 'CRITICAL' && c.aiAnalysis?.severity !== 'CRITICAL') return false;
    if (activeTab === 'DISPATCHED' && c.status !== 'CREW_DISPATCHED' && c.status !== 'IN_PROGRESS') return false;
    if (activeTab === 'RESOLVED' && c.status !== 'RESOLVED') return false;
    return true;
  });

  const exportCSV = () => {
    const headers = ['Ticket ID', 'Title', 'Category', 'Severity', 'Risk Score', 'Status', 'Ward', 'Created At'];
    const rows = displayedComplaints.map(c => [
      c.ticketId,
      `"${c.title.replace(/"/g, '""')}"`,
      c.category,
      c.aiAnalysis?.severity,
      c.aiAnalysis?.riskScore,
      c.status,
      `"${c.location?.ward}"`,
      c.createdAt
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CivicPulse_Grievances_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <OfficerHeader />

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <OfficerSidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
          {/* Top Banner / Welcome */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900">
                  Municipal Operations Command Center
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  LIVE GRID
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Officer In Charge: <strong>{currentUser?.name || 'Dr. Aris Thorne'}</strong> ({currentUser?.department})
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={refreshData}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                title="Refresh Grievance Feeds"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-civic-600' : ''}`} />
                <span>Sync Data</span>
              </button>

              <button
                type="button"
                onClick={exportCSV}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* KPI Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Active Grievances"
              value={complaints.length}
              subtitle="All City Sectors"
              icon={AlertTriangle}
              colorScheme="blue"
              trend="up"
              trendLabel="+4 new"
            />
            <MetricCard
              title="Critical Risk Hazards"
              value={complaints.filter(c => c.aiAnalysis?.severity === 'CRITICAL' && c.status !== 'RESOLVED').length}
              subtitle="Immediate Action"
              icon={ShieldAlert}
              colorScheme="red"
              trend="down"
              trendLabel="-2 resolved"
              badgeText="URGENT"
            />
            <MetricCard
              title="Active Field Dispatches"
              value={complaints.filter(c => c.status === 'CREW_DISPATCHED' || c.status === 'IN_PROGRESS').length}
              subtitle="Crews on Site"
              icon={Truck}
              colorScheme="amber"
              trend="up"
              trendLabel="14 crews deployed"
            />
            <MetricCard
              title="SLA Compliance Rate"
              value={analytics?.aiMetrics?.autoSlaComplianceRate || "94.8%"}
              subtitle="Target < 24h"
              icon={CheckCircle2}
              colorScheme="green"
              trend="up"
              trendLabel="+1.2%"
            />
          </div>

          {/* Interactive GIS Map & Risk Severity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* GIS Map View */}
            <div className="lg:col-span-8 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-civic-600" />
                  Live Citywide GIS Hazard Mapping & Telemetry
                </span>
                <span className="text-[11px] text-slate-500">
                  Click any pin to inspect & dispatch
                </span>
              </div>

              <InteractiveGISMap
                complaints={complaints}
                onSelectComplaint={openAiInspector}
                onDispatch={openDispatch}
                height="380px"
              />
            </div>

            {/* Severity Breakdown Donut Chart */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                  AI Severity Classification
                </span>
                <p className="text-[11px] text-slate-500">
                  Neural model risk categorization
                </p>
              </div>

              <SeverityDonutChart summary={analytics?.summary} />

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                <span>Avg Triage Latency: <strong>0.42s</strong></span>
                <span>Accuracy: <strong className="text-emerald-600">98.4%</strong></span>
              </div>
            </div>
          </div>

          {/* Complaints Management Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              {/* Tab Filters */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {[
                  { key: 'ALL', label: 'All Grievances' },
                  { key: 'CRITICAL', label: 'Critical Risk' },
                  { key: 'DISPATCHED', label: 'Dispatched' },
                  { key: 'RESOLVED', label: 'Resolved' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === tab.key
                        ? 'bg-white text-slate-900 shadow-sm font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search & Category Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by Ticket ID, Ward, Landmark..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-civic-500 w-56 sm:w-64 bg-slate-50 focus:bg-white"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>

                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 bg-slate-50 text-slate-700 font-medium"
                >
                  <option value="ALL">All Categories</option>
                  <option value="Road Hazard & Pothole">Road Hazard & Pothole</option>
                  <option value="Water Leak & Sewage">Water Leak & Sewage</option>
                  <option value="Electrical & Live Wire">Electrical & Live Wire</option>
                  <option value="Street Lighting">Street Lighting</option>
                  <option value="Waste & Garbage Dumping">Waste Management</option>
                  <option value="Structural Damage">Structural Damage</option>
                </select>

                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 bg-slate-50 text-slate-700 font-medium"
                >
                  <option value="risk">Sort by Risk Score (Highest)</option>
                  <option value="date">Sort by Date (Newest)</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 uppercase font-bold text-[10px] tracking-wider">
                    <th className="py-3 px-3">Ticket ID</th>
                    <th className="py-3 px-3">Hazard Title & Photo</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Ward / Location</th>
                    <th className="py-3 px-3">AI Risk Score</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedComplaints.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No grievances match the active filter criteria.
                      </td>
                    </tr>
                  ) : (
                    displayedComplaints.map((c) => (
                      <tr key={c._id || c.ticketId} className="hover:bg-slate-50/80 transition-colors">
                        {/* Ticket ID */}
                        <td className="py-3.5 px-3 font-mono font-bold text-civic-800 whitespace-nowrap">
                          {c.ticketId}
                        </td>

                        {/* Title & Thumbnail */}
                        <td className="py-3.5 px-3 max-w-xs">
                          <div className="flex items-center gap-2.5">
                            {c.imageUrl && (
                              <img
                                src={c.imageUrl}
                                alt="Thumb"
                                className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-slate-200"
                              />
                            )}
                            <div>
                              <p className="font-bold text-slate-900 line-clamp-1">{c.title}</p>
                              <p className="text-[10px] text-slate-400 font-mono">
                                SLA: {c.aiAnalysis?.slaHours || 48}h Target
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-3 text-slate-700 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] font-medium border border-slate-200">
                            {c.category}
                          </span>
                        </td>

                        {/* Ward */}
                        <td className="py-3.5 px-3 text-slate-600 max-w-[160px] truncate">
                          <p className="font-semibold text-slate-800 truncate">{c.location?.ward}</p>
                          <p className="text-[10px] text-slate-400 truncate">{c.location?.address}</p>
                        </td>

                        {/* AI Risk Score */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                              <span className={`w-2 h-2 rounded-full ${
                                c.aiAnalysis?.severity === 'CRITICAL' ? 'bg-red-600 animate-ping' : c.aiAnalysis?.severity === 'HIGH' ? 'bg-orange-500' : 'bg-amber-500'
                              }`} />
                              <span>{c.aiAnalysis?.riskScore || 50}/100</span>
                            </div>
                            <SeverityBadge severity={c.aiAnalysis?.severity} size="sm" />
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <StatusBadge status={c.status} size="sm" />
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openAiInspector(c)}
                              className="p-1.5 rounded-lg bg-civic-50 hover:bg-civic-100 text-civic-700 border border-civic-200 transition-colors"
                              title="Inspect AI Vision Report"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {c.status !== 'RESOLVED' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => openDispatch(c)}
                                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 transition-colors"
                                  title="Dispatch Maintenance Unit"
                                >
                                  <Truck className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => openWorkOrder(c)}
                                  className="p-1.5 rounded-lg bg-civic-600 hover:bg-civic-700 text-white transition-colors"
                                  title="Issue Work Order"
                                >
                                  <FileSpreadsheet className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Deep-Dive AI Inspection Modal */}
      <AIAnalysisModal
        complaint={selectedComplaint}
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onOpenDispatch={(c) => openDispatch(c)}
        onOpenWorkOrder={(c) => openWorkOrder(c)}
      />

      {/* Field Crew Dispatch Modal */}
      <DispatchCrewModal
        complaint={selectedComplaint}
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
      />

      {/* Maintenance Work Order Modal */}
      <WorkOrderModal
        complaint={selectedComplaint}
        isOpen={isWorkOrderModalOpen}
        onClose={() => setIsWorkOrderModalOpen(false)}
      />
    </div>
  );
};

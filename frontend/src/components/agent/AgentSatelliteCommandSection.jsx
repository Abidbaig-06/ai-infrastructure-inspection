import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGrievance } from '../../context/GrievanceContext';
import { RealLifeSatelliteMap } from './RealLifeSatelliteMap';
import { AIVisionInspectorCanvas } from './AIVisionInspectorCanvas';
import { MaintenancePrioritizer } from './MaintenancePrioritizer';
import { MaintenanceHistoryDrawer } from './MaintenanceHistoryDrawer';
import { AlertDefectCard } from './AlertDefectCard';
import { AIAnalysisModal } from './AIAnalysisModal';
import { DispatchCrewModal } from './DispatchCrewModal';
import { WorkOrderModal } from './WorkOrderModal';
import { EngineeringDossierModal } from './EngineeringDossierModal';
import {
  Lock,
  UserCheck,
  Building2,
  Scan,
  Sliders,
  History,
  FileCheck,
  AlertTriangle,
  Truck,
  CheckCircle2,
  Eye,
  LogOut,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const AgentSatelliteCommandSection = () => {
  const { currentUser, isAuthenticated, login, logout, demoOfficers } = useAuth();
  const { complaints, selectedComplaint, selectComplaint } = useGrievance();

  const [email, setEmail] = useState('engineer@civic.gov');
  const [password, setPassword] = useState('demo');
  const [activeSubTab, setActiveSubTab] = useState('satellite-map'); // 'satellite-map' | 'prioritizer' | 'history'
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [workOrderModalOpen, setWorkOrderModalOpen] = useState(false);
  const [dossierModalOpen, setDossierModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password });
  };

  const handleDemoLogin = async (officer) => {
    await login({ email: officer.email, password: 'demo' });
  };

  const handleInspectComplaint = (c) => {
    selectComplaint(c);
    setSelectedTicket(c);
    setAnalysisModalOpen(true);
  };

  const activeComplaintItem = selectedTicket || selectedComplaint || complaints[0];

  return (
    <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl p-4 sm:p-7 space-y-6">
      {/* Officer Header / Authentication Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-civic-500/20 text-civic-400 flex items-center justify-center font-bold border border-civic-500/30">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold font-display text-white">
                Officer / Agent Command Center
              </h3>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                GMC SATELLITE LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Upper-View Real-Life Satellite Imagery • Red Dot Defect Spotting & Maintenance Triage
            </p>
          </div>
        </div>

        {/* Authentication Status / 1-Click Login */}
        {isAuthenticated ? (
          <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt="Officer Avatar"
              className="w-7 h-7 rounded-full object-cover ring-1 ring-civic-400"
            />
            <div className="text-left text-xs">
              <p className="font-bold text-white leading-tight">{currentUser?.name}</p>
              <span className="text-[10px] text-civic-300 font-mono">{currentUser?.role}</span>
            </div>
            <button
              type="button"
              onClick={logout}
              className="ml-2 p-1.5 text-slate-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium mr-1">Quick Agent Login:</span>
            {demoOfficers.map((off) => (
              <button
                key={off.email}
                type="button"
                onClick={() => handleDemoLogin(off)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-civic-900/90 hover:bg-civic-800 text-civic-200 border border-civic-700/60 shadow transition-all flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5 text-civic-400" />
                <span>{off.name.split(' ')[0]} ({off.role.split('_')[0]})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Agent Workspace (Always Accessible) */}
      <div className="space-y-6">
        {/* Navigation Tabs */}
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs">
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setActiveSubTab('satellite-map')}
              className={`px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'satellite-map'
                  ? 'bg-civic-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span>🛰️ Aerial Satellite (Red Dots)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('history')}
              className={`px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'history'
                  ? 'bg-civic-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Asset Maintenance History</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('prioritizer')}
              className={`px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'prioritizer'
                  ? 'bg-civic-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Resource-Aware Prioritization</span>
            </button>
          </div>

          <div className="flex items-center gap-2 px-2 text-slate-400 text-[11px] font-mono">
            <span>City: <strong>Guntur (GMC)</strong></span>
          </div>
        </div>

        {/* SUBTAB 1: Satellite Map with Pulsing Red Dots */}
        {activeSubTab === 'satellite-map' && (
          <div className="space-y-6">
            {/* Real-Life Satellite Aerial Map Component */}
            <RealLifeSatelliteMap
              complaints={complaints}
              onSelectComplaint={(c) => handleInspectComplaint(c)}
              selectedComplaintId={selectedTicket?.ticketId}
              height="520px"
            />

            {/* Complaints Feed Grid Below Map */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                  <span>Reported Issues & Evidence Feed ({complaints.length} Registered in Guntur)</span>
                </h4>
                <span className="text-xs text-slate-500 font-mono">
                  Evidence-Linked Field Intelligence
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {complaints.map((c) => (
                  <AlertDefectCard
                    key={c.ticketId}
                    complaint={c}
                    onInspect={handleInspectComplaint}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: Resource-Aware Prioritization Planner */}
        {activeSubTab === 'prioritizer' && (
          <div className="text-slate-900">
            <MaintenancePrioritizer
              onSelectComplaint={(c) => {
                selectComplaint(c);
                setSelectedTicket(c);
                setDossierModalOpen(true);
              }}
            />
          </div>
        )}

        {/* SUBTAB 3: Maintenance History Retrieval */}
        {activeSubTab === 'history' && (
          <div className="text-slate-900">
            <MaintenanceHistoryDrawer activeAssetId="ASSET-RD-GNT-04" />
          </div>
        )}
      </div>

      {/* Modals for Deep-Dive Actions */}
      {activeComplaintItem && (
        <>
          <AIAnalysisModal
            complaint={activeComplaintItem}
            isOpen={analysisModalOpen}
            onClose={() => setAnalysisModalOpen(false)}
            onDispatchCrew={() => {
              setAnalysisModalOpen(false);
              setDispatchModalOpen(true);
            }}
            onCreateWorkOrder={() => {
              setAnalysisModalOpen(false);
              setWorkOrderModalOpen(true);
            }}
          />

          <DispatchCrewModal
            complaint={activeComplaintItem}
            isOpen={dispatchModalOpen}
            onClose={() => setDispatchModalOpen(false)}
          />

          <WorkOrderModal
            complaint={activeComplaintItem}
            isOpen={workOrderModalOpen}
            onClose={() => setWorkOrderModalOpen(false)}
          />

          <EngineeringDossierModal
            complaint={activeComplaintItem}
            isOpen={dossierModalOpen}
            onClose={() => setDossierModalOpen(false)}
          />
        </>
      )}
    </div>
  );
};

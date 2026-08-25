import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { RealLifeSatelliteMap } from '../components/agent/RealLifeSatelliteMap';
import { AIVisionInspectorCanvas } from '../components/agent/AIVisionInspectorCanvas';
import { AIAgentInspectionWorkspace } from '../components/agent/AIAgentInspectionWorkspace';
import { MaintenancePrioritizer } from '../components/agent/MaintenancePrioritizer';
import { MaintenanceHistoryDrawer } from '../components/agent/MaintenanceHistoryDrawer';
import { AlertDefectCard } from '../components/agent/AlertDefectCard';
import { InspectionIntelligencePanel } from '../components/agent/InspectionIntelligencePanel';
import { AIAnalysisModal } from '../components/agent/AIAnalysisModal';
import { DispatchCrewModal } from '../components/agent/DispatchCrewModal';
import { WorkOrderModal } from '../components/agent/WorkOrderModal';
import { EngineeringDossierModal } from '../components/agent/EngineeringDossierModal';
import { InfraspectionAIAssistantBot } from '../components/agent/InfraspectionAIAssistantBot';
import { useGrievance } from '../context/GrievanceContext';
import { useAuth } from '../context/AuthContext';
import { sampleHazards } from '../services/sampleHazards';
import { inspectInfrastructureAI } from '../services/api';
import { ROUTES } from '../config/routes';
import {
  Shield,
  Layers,
  Scan,
  Sliders,
  History,
  FileCheck,
  MapPin,
  ArrowLeft,
  ArrowRight,
  Eye,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export const InspectionWorkspacePage = () => {
  const { complaints, selectComplaint, setSelectedComplaint, selectedComplaint } = useGrievance();
  const { currentUser } = useAuth();

  // Navigation tab order: 1: 'satellite-map' | 2: 'cv-inspector' | 3: 'history' | 4: 'prioritizer'
  const [activeTab, setActiveTab] = useState('satellite-map');
  const [selectedSample, setSelectedSample] = useState(sampleHazards[0]);
  const [inspectionResult, setInspectionResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedAssetId, setSelectedAssetId] = useState('R-104');

  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [workOrderModalOpen, setWorkOrderModalOpen] = useState(false);
  const [dossierModalOpen, setDossierModalOpen] = useState(false);

  const handleInspectComplaint = (c) => {
    if (!c) return;
    if (typeof selectComplaint === 'function') {
      selectComplaint(c);
    } else if (typeof setSelectedComplaint === 'function') {
      setSelectedComplaint(c);
    }
    setSelectedTicket(c);
    setAnalysisModalOpen(true);
  };

  const runInspection = async (sample) => {
    if (!sample) return;
    setIsScanning(true);
    try {
      const res = await inspectInfrastructureAI({
        imageUrl: sample.imageUrl,
        title: sample.title,
        description: sample.description,
        category: sample.category,
        location: {
          ward: sample.ward || sample.location?.ward,
          latitude: sample.latitude || sample.location?.latitude,
          longitude: sample.longitude || sample.location?.longitude,
          address: sample.address || sample.location?.address
        },
        reportedSeverity: 'CRITICAL'
      });
      if (res.success && res.data) {
        setInspectionResult(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const getActiveComplaintForDossier = () => {
    if (selectedTicket) {
      return selectedTicket;
    }
    if (selectedSample) {
      return {
        ticketId: selectedSample.relatedComplaints?.[0]?.ticketId || `INSP-${selectedSample.id?.toUpperCase()}`,
        title: selectedSample.title,
        description: selectedSample.description,
        category: selectedSample.category,
        imageUrl: selectedSample.imageUrl,
        location: {
          ward: selectedSample.ward,
          address: selectedSample.address,
          latitude: selectedSample.latitude,
          longitude: selectedSample.longitude,
          landmark: selectedSample.landmark
        },
        citizen: {
          name: selectedSample.inspectorName || 'Ramesh Kumar',
          phone: '9848022338',
          email: 'inspector@gmc.gov.in'
        },
        isAnonymous: selectedSample.isAnonymous || false,
        aiAnalysis: inspectionResult || {
          severity: 'CRITICAL',
          compositeRiskScore: 94,
          pavementConditionIndex: 42,
          statutorySLA: '4 Hours'
        }
      };
    }
    return selectedComplaint || complaints[0];
  };

  const activeComplaintItem = getActiveComplaintForDossier();

  return (
    <div className="min-h-screen flex flex-col bg-obsidian-rock text-zinc-100 relative">
      <Header />

      <main className="flex-1 max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 w-full">
        {/* Top Control Bar with Glassy White Light Border */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/15">
          <div className="flex items-center gap-3">
            <Link
              to={ROUTES.HOME}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Portal Home</span>
            </Link>
            <span className="text-zinc-600">|</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                AUTHORIZED INSPECTOR WORKSPACE ({currentUser?.name || 'Authorized Engineer'})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDossierModalOpen(true)}
              className="white-glass-btn-secondary px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5 text-white" />
              <span>Generate Statutory Dossier</span>
            </button>
          </div>
        </div>

        {/* Workspace Navigation Tabs in Exact Reordered Sequence */}
        <div className="charcoal-glass flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl border border-white/15 text-xs shadow-xl">
          <div className="flex flex-wrap gap-1.5">
            {/* Position 1: Aerial Satellite */}
            <button
              type="button"
              onClick={() => setActiveTab('satellite-map')}
              className={`px-4 py-2 rounded-xl font-black transition-all flex items-center gap-2 text-xs cursor-pointer ${
                activeTab === 'satellite-map'
                  ? 'white-gloss-btn shadow-lg'
                  : 'text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>🛰️ Aerial Satellite (Red Dots)</span>
            </button>

            {/* Position 2: Asset Maintenance History */}
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-xl font-black transition-all flex items-center gap-2 text-xs cursor-pointer ${
                activeTab === 'history'
                  ? 'white-gloss-btn shadow-lg'
                  : 'text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Asset Maintenance History</span>
            </button>

            {/* Position 4: Resource-Aware Prioritization (Reordered to 4th position) */}
            <button
              type="button"
              onClick={() => setActiveTab('prioritizer')}
              className={`px-4 py-2 rounded-xl font-black transition-all flex items-center gap-2 text-xs cursor-pointer ${
                activeTab === 'prioritizer'
                  ? 'white-gloss-btn shadow-lg'
                  : 'text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Resource-Aware Prioritization</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-zinc-400 px-3">
            GUNTUR MUNICIPAL CORPORATION (GMC)
          </span>
        </div>

        {/* TAB 1: SATELLITE MAP WITH SIDEBAR EVIDENCE FEED (SIDE-BY-SIDE SPLIT LAYOUT) */}
        {activeTab === 'satellite-map' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Sidebar Column: Reported Issues & Evidence Feed */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col space-y-3.5">
              <div className="charcoal-glass rounded-2xl p-3.5 border border-white/15 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_8px_#ef4444]"></span>
                  </span>
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                      Reported Issues & Evidence Feed
                    </h4>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      Field Intelligence & Citizen Reports
                    </span>
                  </div>
                </div>
                <span className="obsidian-pill-glass px-2.5 py-1 text-[10px] font-mono font-bold text-red-400 border border-red-500/30 bg-red-500/10">
                  {complaints.length} Registered
                </span>
              </div>

              {/* Vertical Scrollable Feed Cards */}
              <div className="space-y-2.5 max-h-[820px] overflow-y-auto pr-1.5 custom-scrollbar">
                {complaints.map((c) => (
                  <AlertDefectCard
                    key={c.ticketId}
                    complaint={c}
                    onInspect={handleInspectComplaint}
                    isSelected={selectedTicket?.ticketId === c.ticketId}
                  />
                ))}
              </div>
            </div>

            {/* Right Column: Real-Life Satellite Map with Pulsing Red Dots */}
            <div className="lg:col-span-7 xl:col-span-8 lg:sticky lg:top-6">
              <RealLifeSatelliteMap
                complaints={complaints}
                onSelectComplaint={handleInspectComplaint}
                selectedComplaintId={selectedTicket?.ticketId}
                height="820px"
              />
            </div>
          </div>
        )}

        {/* TAB 2: AI VISION & DEFECT DETECTION (AUTONOMOUS INSPECTION AGENT SIMULATION) */}
        {activeTab === 'cv-inspector' && (
          <div className="space-y-6">
            {/* Quick Sample Selector for Live AI Agent Testing */}
            <div className="charcoal-glass rounded-2xl p-4 border border-white/15 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                  Select Guntur Defect Asset to Launch AI Agent Inspection:
                </span>
                <span className="text-[10px] font-mono text-cyan-300">
                  Autonomous CV & Multimodal Analysis Pipeline
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {sampleHazards.map((hazard) => (
                  <button
                    key={hazard.id}
                    type="button"
                    onClick={() => {
                      setSelectedSample(hazard);
                      setSelectedTicket(null);
                      runInspection(hazard);
                    }}
                    className={`p-3 rounded-xl text-left border transition-all text-xs flex flex-col justify-between cursor-pointer ${
                      selectedSample?.id === hazard.id && !selectedTicket
                        ? 'bg-white/15 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                        : 'charcoal-pill text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span className="font-bold line-clamp-1">{hazard.badge}</span>
                    <span className="text-[10px] text-zinc-400 font-mono mt-1">{hazard.ward.split('-')[1]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Complete Interactive AI Agent Inspection Workspace Simulation */}
            <AIAgentInspectionWorkspace
              complaint={activeComplaintItem}
              onGenerateReport={() => setDossierModalOpen(true)}
              onCreateWorkOrder={() => setWorkOrderModalOpen(true)}
              onViewHistory={() => {
                if (activeComplaintItem?.category?.includes('Road') || activeComplaintItem?.category?.includes('Pothole')) {
                  setSelectedAssetId('R-104');
                } else if (activeComplaintItem?.category?.includes('Water')) {
                  setSelectedAssetId('W-009');
                } else if (activeComplaintItem?.category?.includes('Electrical') || activeComplaintItem?.category?.includes('Wire')) {
                  setSelectedAssetId('E-044');
                } else {
                  setSelectedAssetId('D-018');
                }
                setActiveTab('history');
              }}
              onReturnToMap={() => setActiveTab('satellite-map')}
            />
          </div>
        )}

        {/* TAB 3: ASSET MAINTENANCE HISTORY (3RD POSITION) */}
        {activeTab === 'history' && (
          <div className="text-zinc-100">
            <MaintenanceHistoryDrawer
              activeAssetId={selectedAssetId}
              onInspectTicket={(c) => {
                if (typeof selectComplaint === 'function') {
                  selectComplaint(c);
                } else if (typeof setSelectedComplaint === 'function') {
                  setSelectedComplaint(c);
                }
                setSelectedTicket(c);
                setAnalysisModalOpen(true);
              }}
            />
          </div>
        )}

        {/* TAB 4: RESOURCE-AWARE PRIORITIZATION MANAGEMENT (4TH POSITION) */}
        {activeTab === 'prioritizer' && (
          <div className="text-zinc-100">
            <MaintenancePrioritizer
              onSelectComplaint={(c) => {
                if (typeof selectComplaint === 'function') {
                  selectComplaint(c);
                } else if (typeof setSelectedComplaint === 'function') {
                  setSelectedComplaint(c);
                }
                setSelectedTicket(c);
                setDossierModalOpen(true);
              }}
            />
          </div>
        )}
      </main>

      {/* Modals */}
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
            inspectionData={inspectionResult}
            isOpen={dossierModalOpen}
            onClose={() => setDossierModalOpen(false)}
          />
        </>
      )}

      {/* Floating AI Guide Assistant (Only in Authorized Workspace) */}
      <InfraspectionAIAssistantBot />

      <Footer />
    </div>
  );
};

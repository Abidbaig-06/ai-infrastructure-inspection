import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { RealLifeSatelliteMap } from '../components/agent/RealLifeSatelliteMap';
import { AIVisionInspectorCanvas } from '../components/agent/AIVisionInspectorCanvas';
import { MaintenancePrioritizer } from '../components/agent/MaintenancePrioritizer';
import { MaintenanceHistoryDrawer } from '../components/agent/MaintenanceHistoryDrawer';
import { AIAnalysisModal } from '../components/agent/AIAnalysisModal';
import { DispatchCrewModal } from '../components/agent/DispatchCrewModal';
import { WorkOrderModal } from '../components/agent/WorkOrderModal';
import { EngineeringDossierModal } from '../components/agent/EngineeringDossierModal';
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
  const { complaints, selectComplaint, selectedComplaint } = useGrievance();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('satellite-map'); // 'satellite-map' | 'cv-inspector' | 'prioritizer' | 'history'
  const [selectedSample, setSelectedSample] = useState(sampleHazards[0]);
  const [inspectionResult, setInspectionResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [workOrderModalOpen, setWorkOrderModalOpen] = useState(false);
  const [dossierModalOpen, setDossierModalOpen] = useState(false);

  const handleInspectComplaint = (c) => {
    selectComplaint(c);
    setSelectedTicket(c);
    setAnalysisModalOpen(true);
  };

  const runInspection = async (sample) => {
    setIsScanning(true);
    try {
      const res = await inspectInfrastructureAI({
        imageUrl: sample.imageUrl,
        title: sample.title,
        description: sample.description,
        category: sample.category,
        location: {
          ward: sample.ward,
          latitude: sample.latitude,
          longitude: sample.longitude,
          address: sample.address
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

  const activeComplaintItem = selectedTicket || selectedComplaint || complaints[0];

  return (
    <div className="min-h-screen flex flex-col bg-obsidian-rock text-zinc-100 relative">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
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

        {/* Workspace Navigation Tabs in Charcoal Glass */}
        <div className="charcoal-glass flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl border border-white/15 text-xs shadow-xl">
          <div className="flex flex-wrap gap-1.5">
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

            <button
              type="button"
              onClick={() => {
                setActiveTab('cv-inspector');
                if (!inspectionResult) runInspection(selectedSample);
              }}
              className={`px-4 py-2 rounded-xl font-black transition-all flex items-center gap-2 text-xs cursor-pointer ${
                activeTab === 'cv-inspector'
                  ? 'white-gloss-btn shadow-lg'
                  : 'text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Scan className="w-3.5 h-3.5" />
              <span>AI Vision & Defect Detection</span>
            </button>

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
          </div>

          <span className="text-[11px] font-mono text-zinc-400 px-3">
            GUNTUR MUNICIPAL CORPORATION (GMC)
          </span>
        </div>

        {/* TAB 1: SATELLITE MAP WITH PULSING RED DOTS */}
        {activeTab === 'satellite-map' && (
          <div className="space-y-6">
            <RealLifeSatelliteMap
              complaints={complaints}
              onSelectComplaint={handleInspectComplaint}
              selectedComplaintId={selectedTicket?.ticketId}
              height="540px"
            />

            {/* Complaints Feed Grid Below Map in Charcoal Glass */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                  <span>Registered Defect Coordinates on Infrastructure Grid</span>
                </h4>
                <span className="text-xs text-zinc-400 font-mono">
                  {complaints.length} Total Complaints in Guntur
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {complaints.map((c) => {
                  const severity = c.aiAnalysis?.severity || 'MEDIUM';
                  return (
                    <div
                      key={c.ticketId}
                      onClick={() => handleInspectComplaint(c)}
                      className="charcoal-glass rounded-2xl p-4.5 border border-white/15 hover:border-white/40 transition-all cursor-pointer space-y-3 shadow-xl group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-3 w-3">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                              severity === 'CRITICAL' ? 'bg-red-400' : 'bg-amber-400'
                            } opacity-75`}></span>
                            <span className={`relative inline-flex rounded-full h-3 w-3 ${
                              severity === 'CRITICAL' ? 'bg-red-600 shadow-[0_0_6px_#ef4444]' : 'bg-amber-500 shadow-[0_0_6px_#f59e0b]'
                            }`}></span>
                          </span>
                          <span className="font-mono font-bold text-xs text-white">
                            {c.ticketId}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${
                          severity === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {severity} ({c.aiAnalysis?.riskScore || 50}/100)
                        </span>
                      </div>

                      <div>
                        <h5 className="text-xs font-bold text-white line-clamp-1 group-hover:text-zinc-200 transition-colors">
                          {c.title}
                        </h5>
                        <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">
                          {c.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                        <span className="truncate max-w-[170px]">📍 {c.location?.ward}</span>
                        <span className="text-white font-bold group-hover:underline flex items-center gap-1">
                          <span>Inspect Defect</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI VISION & DEFECT DETECTION */}
        {activeTab === 'cv-inspector' && (
          <div className="space-y-6">
            <div className="charcoal-glass rounded-2xl p-4 border border-white/15 space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 block">
                Select Guntur Defect Sample for AI Neural Vision Scan:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {sampleHazards.map((hazard) => (
                  <button
                    key={hazard.id}
                    type="button"
                    onClick={() => {
                      setSelectedSample(hazard);
                      runInspection(hazard);
                    }}
                    className={`p-3 rounded-xl text-left border transition-all text-xs flex flex-col justify-between cursor-pointer ${
                      selectedSample.id === hazard.id
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7">
                <AIVisionInspectorCanvas
                  imageUrl={selectedSample.imageUrl}
                  visionDefects={inspectionResult?.visionDefects}
                  pavementConditionIndex={inspectionResult?.pavementConditionIndex}
                  onReScan={() => runInspection(selectedSample)}
                  isScanning={isScanning}
                />
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="charcoal-glass rounded-3xl p-6 border border-white/20 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">
                      Composite Risk Index
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-red-950 text-red-300 border border-red-800">
                      {inspectionResult?.severity || 'CRITICAL'} SEVERITY
                    </span>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-extrabold font-mono text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
                      {inspectionResult?.compositeRiskScore || 94}
                    </span>
                    <span className="text-sm font-mono text-zinc-400">/ 100 Risk Score</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-zinc-400">Structural Anomaly (35%):</span>
                        <span className="font-mono text-white">{inspectionResult?.multiFactorBreakdown?.structuralSeverity || 95}/100</span>
                      </div>
                      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-white/10">
                        <div className="bg-red-500 h-full rounded-full" style={{ width: '95%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-zinc-400">Traffic Exposure (25%):</span>
                        <span className="font-mono text-white">{inspectionResult?.multiFactorBreakdown?.trafficExposure || 92}/100</span>
                      </div>
                      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-white/10">
                        <div className="bg-orange-500 h-full rounded-full" style={{ width: '92%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-zinc-400">Weather / Rain Runoff (15%):</span>
                        <span className="font-mono text-white">{inspectionResult?.multiFactorBreakdown?.weatherVulnerability || 88}/100</span>
                      </div>
                      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-white/10">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: '88%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="charcoal-glass rounded-3xl p-6 border border-white/20 space-y-3 shadow-2xl text-xs">
                  <span className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider block">
                    Engineering Action & BOQ
                  </span>
                  <p className="text-zinc-300">
                    <strong>Recommended:</strong> {inspectionResult?.engineeringRecommendations?.recommendedAction || 'Emergency Asphalt Resurfacing'}
                  </p>
                  <p className="text-white font-mono font-bold text-sm">
                    Estimated Cost: ${inspectionResult?.engineeringRecommendations?.estimatedCostUSD || 872}.00 USD
                  </p>
                  <button
                    type="button"
                    onClick={() => setDossierModalOpen(true)}
                    className="white-gloss-btn w-full py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <FileCheck className="w-4 h-4 text-black" />
                    <span>View Statutory Dossier</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RESOURCE-AWARE PRIORITIZATION PLANNER */}
        {activeTab === 'prioritize' && (
          <div className="text-zinc-100">
            <MaintenancePrioritizer
              onSelectComplaint={(c) => {
                selectComplaint(c);
                setSelectedTicket(c);
                setDossierModalOpen(true);
              }}
            />
          </div>
        )}

        {/* TAB 4: MAINTENANCE HISTORY RETRIEVAL */}
        {activeTab === 'history' && (
          <div className="text-zinc-100">
            <MaintenanceHistoryDrawer activeAssetId="ASSET-RD-GNT-04" />
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

      <Footer />
    </div>
  );
};

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
import { inspectInfrastructureAI, runVisionInspection } from '../services/api';
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
  const topRef = React.useRef(null);

  // Auto-locate the logged-in officer and surface the nearest open grievance
  const [userLocation, setUserLocation] = useState(null);
  const [nearestTicketId, setNearestTicketId] = useState(null);
  const autoLocatedRef = React.useRef(false);

  const haversineKm = (a, b) => {
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const lat1 = (a.lat * Math.PI) / 180;
    const lat2 = (b.lat * Math.PI) / 180;
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  };

  React.useEffect(() => {
    if (autoLocatedRef.current) return;
    if (!currentUser) return;
    if (!('geolocation' in navigator)) return;
    autoLocatedRef.current = true;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => console.warn('Geolocation denied/unavailable:', err.message),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }, [currentUser]);

  React.useEffect(() => {
    if (!userLocation || !complaints || complaints.length === 0) return;
    let best = null;
    let bestDist = Infinity;
    complaints.forEach((c) => {
      const lat = Number(c.location?.latitude);
      const lng = Number(c.location?.longitude);
      if (!lat || !lng) return;
      if (c.status === 'RESOLVED') return;
      const d = haversineKm(userLocation, { lat, lng });
      if (d < bestDist) {
        bestDist = d;
        best = c;
      }
    });
    if (best) {
      setNearestTicketId(best.ticketId);
      setSelectedTicket(best);
      if (typeof selectComplaint === 'function') selectComplaint(best);
    }
  }, [userLocation, complaints]);

  // Live computer-vision defect detection via NVIDIA NIM (backend proxied)
  const [visionResult, setVisionResult] = useState(null);
  const [visionLoading, setVisionLoading] = useState(false);
  const visionKeyRef = React.useRef(null);

  const runVision = React.useCallback(async (item) => {
    if (!item?.imageUrl) return;
    setVisionLoading(true);
    try {
      const res = await runVisionInspection({
        imageUrl: item.imageUrl,
        title: item.title,
        description: item.description,
        category: item.category
      });
      if (res.success && res.data) setVisionResult(res.data);
    } catch (err) {
      console.error('Vision inspection failed:', err);
    } finally {
      setVisionLoading(false);
    }
  }, []);

  const getActiveComplaintForDossier = () => {
    if (selectedTicket) {
      return selectedTicket;
    }
    if (selectedComplaint) {
      return selectedComplaint;
    }
    if (complaints && complaints.length > 0) {
      return complaints[0];
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
    return sampleHazards[0] || {};
  };

  const activeComplaintItem = getActiveComplaintForDossier();

  // Reset scroll once when the tab changes — no repeated timers, so an
  // in-progress inspection animation can't keep yanking the view to the top.
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }, [activeTab]);

  // Run (or re-run) NVIDIA vision detection whenever the CV tab is opened for a
  // new complaint image.
  React.useEffect(() => {
    if (activeTab !== 'cv-inspector') return;
    const key = activeComplaintItem?.imageUrl || null;
    if (!key || visionKeyRef.current === key) return;
    visionKeyRef.current = key;
    setVisionResult(null);
    runVision(activeComplaintItem);
  }, [activeTab, activeComplaintItem, runVision]);

  const handleOpenAiVisionDirect = (c) => {
    if (c) {
      if (typeof selectComplaint === 'function') selectComplaint(c);
      else if (typeof setSelectedComplaint === 'function') setSelectedComplaint(c);
      setSelectedTicket(c);
    }
    setAnalysisModalOpen(false);
    setActiveTab('cv-inspector');
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

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

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col bg-obsidian-rock text-zinc-100 relative">
      <div ref={topRef} className="absolute top-0 left-0 h-0 w-0 pointer-events-none" />
      <Header />

      <main className="flex-1 min-h-0 max-w-[1440px] mx-auto px-4 sm:px-8 py-4 flex flex-col space-y-4 w-full overflow-hidden">
        {/* Top Control Bar with Glassy White Light Border */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/15 flex-shrink-0">
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
        </div>

        {/* Master Cockpit Bounding Card (Enclosing Tabs, Evidence Feed & Satellite Map) */}
        <div className="charcoal-glass rounded-[2rem] p-4 sm:p-6 border border-white/15 shadow-2xl flex flex-col flex-1 min-h-0 relative overflow-hidden space-y-4">
          {/* Top Specular White Light Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

          {/* Workspace Navigation Tabs Header inside the box */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10 text-xs flex-shrink-0">
            <div className="flex flex-wrap gap-2">
              {/* Position 1: Aerial Satellite */}
              <button
                type="button"
                onClick={() => setActiveTab('satellite-map')}
                className={`px-4 py-2.5 rounded-xl font-black transition-all flex items-center gap-2 text-xs cursor-pointer ${activeTab === 'satellite-map'
                    ? 'white-gloss-btn shadow-lg'
                    : 'text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
              >
                <span>🛰️ Aerial Satellite (Red Dots)</span>
              </button>

              {/* Position 2: AI Vision & Defect Detection (NVIDIA NIM) */}
              <button
                type="button"
                onClick={() => setActiveTab('cv-inspector')}
                className={`px-4 py-2.5 rounded-xl font-black transition-all flex items-center gap-2 text-xs cursor-pointer ${activeTab === 'cv-inspector'
                    ? 'white-gloss-btn shadow-lg'
                    : 'text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
              >
                <Scan className="w-3.5 h-3.5" />
                <span>AI Vision & Defect Detection</span>
              </button>

              {/* Position 3: Asset Maintenance History */}
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2.5 rounded-xl font-black transition-all flex items-center gap-2 text-xs cursor-pointer ${activeTab === 'history'
                    ? 'white-gloss-btn shadow-lg'
                    : 'text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Asset Maintenance History</span>
              </button>

              {/* Position 4: Resource-Aware Prioritization */}
              <button
                type="button"
                onClick={() => setActiveTab('prioritizer')}
                className={`px-4 py-2.5 rounded-xl font-black transition-all flex items-center gap-2 text-xs cursor-pointer ${activeTab === 'prioritizer'
                    ? 'white-gloss-btn shadow-lg'
                    : 'text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Resource-Aware Prioritization</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-zinc-400 font-mono text-[11px]">
              <span>GUNTUR MUNICIPAL CORPORATION (GMC)</span>
            </div>
          </div>

          {/* TAB 1: REAL-LIFE SATELLITE MAP WITH EVIDENCE FEED (1ST POSITION) */}
          {activeTab === 'satellite-map' && (
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0 overflow-hidden">
              {/* Left Column: Live Registered Citizen Complaints Feed */}
              <div className="lg:col-span-5 xl:col-span-4 h-full min-h-0 flex flex-col charcoal-glass rounded-2xl p-2.5 border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-zinc-300" />
                    <h3 className="text-xs font-mono font-bold text-white tracking-wider">
                      REGISTERED CITIZEN GRIEVANCES ({complaints.length})
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white font-bold animate-pulse">
                    LIVE FEED
                  </span>
                </div>

                {nearestTicketId && (
                  <div className="mb-2 flex-shrink-0 rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-3 py-2 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="text-[11px] font-mono text-emerald-200">
                      Nearest open issue to your location: <strong className="text-white">{nearestTicketId}</strong>
                    </span>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar min-h-0">
                  {complaints.length === 0 ? (
                    <div className="charcoal-glass-card rounded-xl border border-white/10 p-4 text-center space-y-2 mt-2">
                      <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto" />
                      <p className="text-xs text-zinc-300 font-semibold">No grievances loaded</p>
                      <p className="text-[11px] text-zinc-500 leading-relaxed">
                        The municipal API is unreachable. Start the backend:
                      </p>
                      <pre className="text-left text-[10px] font-mono bg-black/60 border border-white/10 rounded-lg p-2 text-emerald-300 overflow-x-auto">
node backend/server.js
                      </pre>
                    </div>
                  ) : (
                    complaints.map((c) => (
                      <AlertDefectCard
                        key={c._id || c.id || c.ticketId}
                        complaint={c}
                        onInspect={handleInspectComplaint}
                        isSelected={selectedTicket?.ticketId === c.ticketId}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Right Column: Real-Life Satellite Map with Pulsing Red Dots */}
              <div className="lg:col-span-7 xl:col-span-8 h-full min-h-0 flex flex-col">
                <RealLifeSatelliteMap
                  complaints={complaints}
                  onSelectComplaint={handleInspectComplaint}
                  onOpenAiVision={handleOpenAiVisionDirect}
                  selectedComplaintId={nearestTicketId || selectedTicket?.ticketId}
                  userLocation={userLocation}
                  height="100%"
                />
              </div>
            </div>
          )}

          {/* TAB 2: 8-STAGE AI INFRASTRUCTURE INSPECTION (NVIDIA NIM vision model) */}
          {activeTab === 'cv-inspector' && (
            <div className="flex-1 w-full min-h-0 overflow-y-auto custom-scrollbar pr-1">
              <AIVisionInspectorCanvas
                imageUrl={activeComplaintItem?.imageUrl}
                report={visionResult}
                pavementConditionIndex={visionResult?.pavementConditionIndex || activeComplaintItem?.aiAnalysis?.pavementConditionIndex || 42}
                onReScan={() => runVision(activeComplaintItem)}
                isScanning={visionLoading}
              />
            </div>
          )}

          {/* TAB 3: ASSET MAINTENANCE HISTORY (3RD POSITION) */}
          {activeTab === 'history' && (
            <div className="text-zinc-100 flex-1 overflow-y-auto custom-scrollbar min-h-0 pr-1">
              <MaintenanceHistoryDrawer
                activeAssetId={selectedAssetId}
                activeComplaint={activeComplaintItem}
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
            <div className="text-zinc-100 flex-1 overflow-y-auto custom-scrollbar min-h-0 pr-1">
              <MaintenancePrioritizer
                activeComplaint={activeComplaintItem}
                complaints={complaints}
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
        </div>
      </main>

      {/* Modals */}
      {activeComplaintItem && (
        <>
          <AIAnalysisModal
            complaint={activeComplaintItem}
            isOpen={analysisModalOpen}
            onClose={() => setAnalysisModalOpen(false)}
            onOpenDispatch={(c) => {
              if (c) setSelectedTicket(c);
              setAnalysisModalOpen(false);
              setDispatchModalOpen(true);
            }}
            onDispatchCrew={(c) => {
              if (c) setSelectedTicket(c);
              setAnalysisModalOpen(false);
              setDispatchModalOpen(true);
            }}
            onOpenWorkOrder={(c) => {
              if (c) setSelectedTicket(c);
              setAnalysisModalOpen(false);
              setWorkOrderModalOpen(true);
            }}
            onCreateWorkOrder={(c) => {
              if (c) setSelectedTicket(c);
              setAnalysisModalOpen(false);
              setWorkOrderModalOpen(true);
            }}
            onOpenCvTab={handleOpenAiVisionDirect}
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
    </div>
  );
};


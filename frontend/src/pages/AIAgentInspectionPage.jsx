import React, { useState, useEffect } from 'react';
import { useGrievance } from '../context/GrievanceContext';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { AIVisionInspectorCanvas } from '../components/agent/AIVisionInspectorCanvas';
import { MaintenancePrioritizer } from '../components/agent/MaintenancePrioritizer';
import { MaintenanceHistoryDrawer } from '../components/agent/MaintenanceHistoryDrawer';
import { RealLifeSatelliteMap } from '../components/agent/RealLifeSatelliteMap';
import { EngineeringDossierModal } from '../components/agent/EngineeringDossierModal';
import { inspectInfrastructureAI } from '../services/api';
import { sampleHazards } from '../services/sampleHazards';
import { ROUTES } from '../config/routes';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Scan,
  Layers,
  Sliders,
  History,
  FileCheck,
  MapPin,
  AlertTriangle,
  TrendingUp,
  Building2,
  CheckCircle2,
  BarChart3,
  Cpu,
  RefreshCw,
  Eye,
  ArrowLeft
} from 'lucide-react';

export const AIAgentInspectionPage = () => {
  const { user } = useAuth();
  const { complaints, selectComplaint, setSelectedComplaint, selectedComplaint } = useGrievance();

  const [activeTab, setActiveTab] = useState('inspector'); // 'inspector' | 'prioritize' | 'history' | 'gis'
  const [selectedSample, setSelectedSample] = useState(sampleHazards[0]);
  const [inspectionResult, setInspectionResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [dossierOpen, setDossierOpen] = useState(false);

  useEffect(() => {
    runInspection(selectedSample);
  }, [selectedSample]);

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
      console.error('Inspection agent failed:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const activeComplaint = selectedComplaint || complaints[0] || {
    ticketId: 'CP-2026-9812',
    title: selectedSample.title,
    category: selectedSample.category,
    imageUrl: selectedSample.imageUrl,
    location: {
      ward: selectedSample.ward,
      address: selectedSample.address,
      latitude: selectedSample.latitude,
      longitude: selectedSample.longitude
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans">
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Banner with Ambient Top Specular Light */}
        <div className="charcoal-glass p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden text-zinc-100">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link
                  to={ROUTES.HOME}
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-mono transition-colors mr-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Home</span>
                </Link>
                <span className="text-zinc-600">/</span>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full charcoal-pill text-white text-xs font-mono font-semibold">
                  <Cpu className="w-3.5 h-3.5 text-white animate-pulse" />
                  <span>AI INFRASTRUCTURE INSPECTION AGENT</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
                Autonomous Infrastructure Inspection & Maintenance Engine
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-3xl leading-relaxed">
                Combines visual evidence (Computer Vision), multimodal citizen reports, Guntur GIS telemetry, and asset maintenance history to detect defects, rank composite risks, and generate resource-aware maintenance plans.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDossierOpen(true)}
                className="white-gloss-btn px-4 py-3 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <FileCheck className="w-4 h-4 text-black" />
                <span>Generate Engineering Dossier</span>
              </button>
            </div>
          </div>

          {/* Prototype Tabs */}
          <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-white/10 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('inspector')}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'inspector'
                  ? 'white-gloss-btn shadow-md'
                  : 'charcoal-pill text-zinc-300 hover:text-white'
              }`}
            >
              <Scan className="w-4 h-4" />
              <span>1. Image Defect Detection & Multimodal Analysis</span>
            </button>

            <button
              onClick={() => setActiveTab('prioritize')}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'prioritize'
                  ? 'white-gloss-btn shadow-md'
                  : 'charcoal-pill text-zinc-300 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>2. Resource-Aware Prioritization</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'history'
                  ? 'white-gloss-btn shadow-md'
                  : 'charcoal-pill text-zinc-300 hover:text-white'
              }`}
            >
              <History className="w-4 h-4" />
              <span>3. Maintenance History Retrieval</span>
            </button>

            <button
              onClick={() => setActiveTab('gis')}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'gis'
                  ? 'white-gloss-btn shadow-md'
                  : 'charcoal-pill text-zinc-300 hover:text-white'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>4. Guntur GIS Satellite & Defect Map</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Image-based Defect Detection & Multimodal Analysis */}
        {activeTab === 'inspector' && (
          <div className="space-y-6">
            {/* Sample Preset Selector */}
            <div className="charcoal-glass rounded-3xl p-5 border border-white/15 space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 block">
                Select Infrastructure Defect Sample (Guntur Municipal Assets):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {sampleHazards.map((hazard) => (
                  <button
                    key={hazard.id}
                    type="button"
                    onClick={() => setSelectedSample(hazard)}
                    className={`p-3 rounded-2xl text-left border transition-all text-xs flex flex-col justify-between cursor-pointer ${
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

            {/* Grid: Computer Vision Canvas + Multimodal Triage Scorecard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: Interactive Computer Vision Canvas */}
              <div className="lg:col-span-7">
                <AIVisionInspectorCanvas
                  imageUrl={selectedSample.imageUrl}
                  visionDefects={inspectionResult?.visionDefects}
                  pavementConditionIndex={inspectionResult?.pavementConditionIndex}
                  onReScan={() => runInspection(selectedSample)}
                  isScanning={isScanning}
                />
              </div>

              {/* Right: Multimodal Fusion & Multi-Factor Risk Scorecard */}
              <div className="lg:col-span-5 space-y-4">
                {/* Multi-Factor Composite Risk Score */}
                <div className="charcoal-glass rounded-3xl p-6 border border-white/20 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                      Composite AI Risk Index
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

                  {/* Breakdown bars */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-zinc-400">Structural Anomaly Severity (35%):</span>
                        <span className="font-mono text-white">
                          {inspectionResult?.multiFactorBreakdown?.structuralSeverity || 95}/100
                        </span>
                      </div>
                      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-white/10">
                        <div className="bg-red-500 h-full rounded-full" style={{ width: '95%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-zinc-400">Traffic & Pedestrian Exposure (25%):</span>
                        <span className="font-mono text-white">
                          {inspectionResult?.multiFactorBreakdown?.trafficExposure || 92}/100
                        </span>
                      </div>
                      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-white/10">
                        <div className="bg-orange-500 h-full rounded-full" style={{ width: '92%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-zinc-400">Monsoon Rain Inundation Multiplier (15%):</span>
                        <span className="font-mono text-white">
                          {inspectionResult?.multiFactorBreakdown?.weatherVulnerability || 88}/100
                        </span>
                      </div>
                      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-white/10">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: '88%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-zinc-400">Historical Recurrence Rate (15%):</span>
                        <span className="font-mono text-white">
                          {inspectionResult?.multiFactorBreakdown?.historicalRecurrence || 95}/100
                        </span>
                      </div>
                      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-white/10">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: '95%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Engineering Recommendations */}
                <div className="charcoal-glass rounded-3xl p-6 border border-white/20 space-y-3 shadow-2xl text-xs">
                  <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider block">
                    AI Statutory Maintenance Guidance
                  </span>

                  <p className="text-zinc-200">
                    <strong>Prescribed Action:</strong> {inspectionResult?.engineeringRecommendations?.recommendedAction || 'Emergency Asphalt Resurfacing & GSB Replacement'}
                  </p>

                  <div className="p-3 rounded-2xl charcoal-glass-card border border-white/10 space-y-1 font-mono text-[11px]">
                    <p className="text-white font-bold">
                      Estimated Budget: ${inspectionResult?.engineeringRecommendations?.estimatedCostUSD || 872}.00 USD
                    </p>
                    <p className="text-zinc-400">
                      Statutory SLA: {inspectionResult?.engineeringRecommendations?.statutorySLA || '4 Hours'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDossierOpen(true)}
                    className="white-gloss-btn w-full py-2.5 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <FileCheck className="w-4 h-4 text-black" />
                    <span>View Evidence-Linked Engineering Dossier</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Resource-Aware Maintenance Prioritization Planner */}
        {activeTab === 'prioritize' && (
          <div className="space-y-4">
            <MaintenancePrioritizer
              onSelectComplaint={(c) => {
                selectComplaint(c);
                setDossierOpen(true);
              }}
            />
          </div>
        )}

        {/* TAB 3: Maintenance History Retrieval */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <MaintenanceHistoryDrawer activeAssetId="ASSET-RD-GNT-04" />
          </div>
        )}

        {/* TAB 4: Guntur GIS Infrastructure Map */}
        {activeTab === 'gis' && (
          <div className="space-y-4">
            <RealLifeSatelliteMap
              complaints={complaints}
              onSelectComplaint={(c) => {
                selectComplaint(c);
                setDossierOpen(true);
              }}
              height="550px"
            />
          </div>
        )}
      </main>

      {/* Evidence-Linked Engineering Dossier Modal */}
      <EngineeringDossierModal
        complaint={activeComplaint}
        inspectionData={inspectionResult}
        isOpen={dossierOpen}
        onClose={() => setDossierOpen(false)}
      />

      <Footer />
    </div>
  );
};

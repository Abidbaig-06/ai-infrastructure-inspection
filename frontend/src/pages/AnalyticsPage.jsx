import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MetricCard } from '../components/common/MetricCard';
import { SeverityDonutChart } from '../components/charts/SeverityDonutChart';
import { IncidentTrendChart } from '../components/charts/IncidentTrendChart';
import { WardRiskBarChart } from '../components/charts/WardRiskBarChart';
import { useGrievance } from '../context/GrievanceContext';
import { ROUTES } from '../config/routes';
import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, ShieldCheck, Clock, CheckCircle2, ArrowLeft, Download } from 'lucide-react';

export const AnalyticsPage = () => {
  const { analytics, complaints } = useGrievance();

  const ai = analytics?.aiMetrics || {
    modelTriageAccuracy: '98.4%',
    avgTriageLatencySeconds: '0.42s',
    falsePositiveRate: '1.2%',
    autoSlaComplianceRate: '94.8%',
    activeFieldCrews: 14,
    avgResolutionHours: '18.2h'
  };

  return (
    <div className="min-h-screen flex flex-col bg-obsidian-rock text-zinc-100 relative">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
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
                EXECUTIVE TELEMETRY
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold font-display text-white drop-shadow-sm">
              Municipal Intelligence & SLA Analytics
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Citywide Infrastructure Defect Trends & AI Model Telemetry
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="white-gloss-btn inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-black" />
            <span>Print Executive Brief</span>
          </button>
        </div>

        {/* Key SLA Metrics in Charcoal Glass */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="AI Triage Accuracy"
            value={ai.modelTriageAccuracy}
            subtitle="Computer Vision Model"
            icon={ShieldCheck}
            colorScheme="blue"
            trend="up"
            trendLabel="+0.4% precision"
          />
          <MetricCard
            title="SLA Compliance Rate"
            value={ai.autoSlaComplianceRate}
            subtitle="Statutory Standard"
            icon={CheckCircle2}
            colorScheme="green"
            trend="up"
            trendLabel="Target > 90%"
          />
          <MetricCard
            title="Average Resolution Time"
            value={ai.avgResolutionHours}
            subtitle="Submit to Completion"
            icon={Clock}
            colorScheme="purple"
            trend="down"
            trendLabel="2.4h faster"
          />
          <MetricCard
            title="Triage Latency"
            value={ai.avgTriageLatencySeconds}
            subtitle="Neural Inference"
            icon={TrendingUp}
            colorScheme="amber"
            trend="up"
            trendLabel="Real-time async"
          />
        </div>

        {/* Charts Row 1: Incident Trend & Ward Risk Hotspots */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 charcoal-glass rounded-3xl p-6 border border-white/15 shadow-2xl space-y-4">
            <div>
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                Incoming Citizen Grievances vs Field Crew Resolutions
              </span>
              <p className="text-[11px] text-zinc-400">Weekly workload throughput & SLA adherence</p>
            </div>
            <IncidentTrendChart />
          </div>

          <div className="lg:col-span-5 charcoal-glass rounded-3xl p-6 border border-white/15 shadow-2xl space-y-4">
            <div>
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                Severity Breakdown
              </span>
              <p className="text-[11px] text-zinc-400">Distribution of active hazards by risk tier</p>
            </div>
            <SeverityDonutChart />
          </div>
        </div>

        {/* Ward Risk Bar Chart */}
        <div className="charcoal-glass rounded-3xl p-6 border border-white/15 shadow-2xl space-y-4">
          <div>
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
              GMC Ward Risk Hotspots & Pavement Condition Index (PCI)
            </span>
            <p className="text-[11px] text-zinc-400">Prioritized structural hazard clusters across Guntur divisions</p>
          </div>
          <WardRiskBarChart />
        </div>
      </main>

      <Footer />
    </div>
  );
};

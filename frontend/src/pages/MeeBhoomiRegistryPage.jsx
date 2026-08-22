import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ROUTES } from '../config/routes';
import { GMC_WARDS } from '../services/gmcWards';
import {
  MapPin,
  Search,
  Layers,
  Database,
  Shield,
  ArrowRight,
  TrendingUp,
  Compass,
  FileText,
  ExternalLink,
  CheckCircle,
  Building,
  Activity
} from 'lucide-react';

export const MeeBhoomiRegistryPage = () => {
  const [assets, setAssets] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedWard, setSelectedWard] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceStatus, setSourceStatus] = useState('');
  const [expandedAdangalId, setExpandedAdangalId] = useState(null);

  useEffect(() => {
    fetchLandAssets();
  }, [selectedType, selectedWard, searchQuery]);

  const fetchLandAssets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedType !== 'ALL') params.append('type', selectedType);
      if (selectedWard !== 'ALL') params.append('ward', selectedWard);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`http://localhost:5000/api/land-assets?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setAssets(json.data || []);
        setSummary(json.summary || null);
        setSourceStatus(json.source || 'MEE_BHOOMI_DATABASE');
      }
    } catch (err) {
      console.error('Error fetching land assets:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadge = (type) => {
    switch (type) {
      case 'ROAD':
        return { label: 'Road Corridor (Raste)', icon: '🚧', color: 'bg-blue-950/80 text-blue-300 border-blue-500/40' };
      case 'BRIDGE':
        return { label: 'Bridge / Flyover (Vanthena)', icon: '🌉', color: 'bg-purple-950/80 text-purple-300 border-purple-500/40' };
      case 'DRAINAGE':
        return { label: 'Drainage Channel (Kaluva)', icon: '🌊', color: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40' };
      case 'PUBLIC_LAND':
        return { label: 'Public Utility (Sarkari)', icon: '🏛️', color: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' };
      default:
        return { label: type, icon: '📍', color: 'bg-zinc-800 text-zinc-300 border-zinc-600' };
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-obsidian-rock text-zinc-100 selection:bg-white selection:text-black">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="obsidian-pill-glass px-2.5 py-0.5 text-[10px] font-mono text-zinc-300 flex items-center gap-1.5">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>STATE REVENUE DATABASE: MEE BHOOMI AP (GUNTUR DISTRICT)</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold">
                {sourceStatus === 'SUPABASE_POSTGRESQL' ? '🟢 Supabase Live' : '⚡ Supabase Synced'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              🏛️ Guntur Land, Roads, Bridges & Drainage Registry
            </h1>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Authentic revenue records with survey numbers, town survey parcels, exact square foot extents, and Poramboke classifications.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={ROUTES.COMPLAINT_APP_URL}
              className="white-gloss-btn px-4 py-2 text-xs font-bold rounded-full flex items-center gap-2 shadow-lg"
            >
              <span>File Defect on Survey Plot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Aggregate KPI Cards */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="charcoal-glass p-4 rounded-2xl border border-white/15">
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">
                Total Surveyed Extent (Sq.Ft)
              </span>
              <p className="text-xl sm:text-2xl font-black text-white font-mono mt-1">
                {summary.totalExtentSqFt.toLocaleString()} <span className="text-xs font-normal text-zinc-400">sq.ft</span>
              </p>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                <span>{summary.totalExtentAcres} Total Acres</span>
              </span>
            </div>

            <div className="charcoal-glass p-4 rounded-2xl border border-white/15">
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">
                Municipal Road Parcels
              </span>
              <p className="text-xl sm:text-2xl font-black text-blue-300 font-mono mt-1">
                {summary.categoriesCount.roads} <span className="text-xs font-normal text-zinc-400">Corridors</span>
              </p>
              <span className="text-[10px] font-mono text-zinc-400">Raste Poramboke</span>
            </div>

            <div className="charcoal-glass p-4 rounded-2xl border border-white/15">
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">
                Bridges & Flyovers
              </span>
              <p className="text-xl sm:text-2xl font-black text-purple-300 font-mono mt-1">
                {summary.categoriesCount.bridges} <span className="text-xs font-normal text-zinc-400">Structures</span>
              </p>
              <span className="text-[10px] font-mono text-zinc-400">Vanthena / Setu Poramboke</span>
            </div>

            <div className="charcoal-glass p-4 rounded-2xl border border-white/15">
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">
                Drainage & Canals
              </span>
              <p className="text-xl sm:text-2xl font-black text-cyan-300 font-mono mt-1">
                {summary.categoriesCount.drainage} <span className="text-xs font-normal text-zinc-400">Channels</span>
              </p>
              <span className="text-[10px] font-mono text-zinc-400">Kaluva Poramboke</span>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="charcoal-glass p-4 rounded-2xl border border-white/15 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search Survey No (e.g. Sy-No-284/1A), TS No, or Asset..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="charcoal-glass-input w-full pl-9 pr-4 py-2 text-xs rounded-xl text-white placeholder:text-zinc-500 focus:outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="charcoal-glass-input w-full px-3 py-2 text-xs rounded-xl text-white focus:outline-none"
              >
                <option value="ALL" className="bg-zinc-950 text-white">All Infrastructure Categories</option>
                <option value="ROAD" className="bg-zinc-950 text-white">🚧 Roads (Raste Poramboke)</option>
                <option value="BRIDGE" className="bg-zinc-950 text-white">🌉 Bridges & Flyovers (Vanthena)</option>
                <option value="DRAINAGE" className="bg-zinc-950 text-white">🌊 Drainage Channels (Kaluva)</option>
                <option value="PUBLIC_LAND" className="bg-zinc-950 text-white">🏛️ Public Utility Land (Sarkari)</option>
              </select>
            </div>

            {/* Ward Filter */}
            <div className="sm:col-span-4">
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="charcoal-glass-input w-full px-3 py-2 text-xs rounded-xl text-white focus:outline-none"
              >
                <option value="ALL" className="bg-zinc-950 text-white">All GMC Municipal Wards (1-57)</option>
                {GMC_WARDS.map((w) => (
                  <option key={w.id} value={w.id} className="bg-zinc-950 text-white">
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Real Records Table / Cards */}
        {loading ? (
          <div className="py-12 text-center text-zinc-400 font-mono text-xs">
            Loading Mee Bhoomi records from database...
          </div>
        ) : assets.length === 0 ? (
          <div className="py-12 text-center charcoal-glass rounded-2xl border border-white/10 p-8 space-y-2">
            <p className="text-sm font-bold text-white">No Mee Bhoomi records found for the selected criteria.</p>
            <p className="text-xs text-zinc-400 font-mono">Try clearing your search or selecting "All Infrastructure Categories".</p>
          </div>
        ) : (
          <div className="space-y-3">
            {assets.map((asset) => {
              const badge = getCategoryBadge(asset.infrastructureType);
              const isExpanded = expandedAdangalId === asset.id;

              return (
                <div
                  key={asset.id}
                  className="charcoal-glass p-4 sm:p-5 rounded-2xl border border-white/15 hover:border-white/30 transition-all text-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`px-2.5 py-1 rounded-full border text-[11px] font-mono font-bold flex items-center gap-1.5 ${badge.color}`}>
                        <span>{badge.icon}</span>
                        <span>{badge.label}</span>
                      </span>
                      <span className="obsidian-pill-glass px-2.5 py-1 text-[11px] font-mono font-bold text-white">
                        {asset.surveyNumber}
                      </span>
                      {asset.townSurveyNumber && (
                        <span className="text-[10px] font-mono text-zinc-400 hidden sm:inline">
                          TS: {asset.townSurveyNumber}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-zinc-400">Extent:</span>
                      <span className="text-emerald-300 font-bold">
                        {asset.extentSqFt.toLocaleString()} sq.ft
                      </span>
                      <span className="text-zinc-500">
                        ({asset.extentAcres} Acres / {asset.extentCents} Cents)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
                    <div className="md:col-span-7 space-y-1">
                      <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                        {asset.assetName}
                      </h3>
                      <p className="text-zinc-300 font-mono text-[11px]">
                        📍 {asset.villageRevenueWard} ({asset.mandal})
                      </p>
                      <p className="text-zinc-400 text-[11px]">
                        📐 {asset.plotDimensions}
                      </p>
                    </div>

                    <div className="md:col-span-5 flex flex-col justify-between items-start md:items-end space-y-2">
                      <div className="text-left md:text-right font-mono text-[10px] text-zinc-400">
                        <div>Custodian: <span className="text-zinc-200">{asset.custodianDepartment}</span></div>
                        <div>Revenue Classification: <span className="text-amber-300 font-semibold">{asset.meeBhoomiClassification}</span></div>
                        <div>Condition (PCI): <span className="text-white font-bold">{asset.pavementConditionIndex}/100</span> | Status: <span className="text-emerald-400 font-bold">{asset.encroachmentStatus}</span></div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setExpandedAdangalId(isExpanded ? null : asset.id)}
                          className="obsidian-pill-glass px-2.5 py-1 text-[10px] font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
                        >
                          {isExpanded ? 'Hide Mee Bhoomi Adangal' : 'View Mee Bhoomi Adangal (1B)'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Mee Bhoomi Adangal JSON Metadata */}
                  {isExpanded && asset.rawAdangal && (
                    <div className="mt-3 p-3.5 rounded-xl bg-black/80 border border-white/10 font-mono text-[11px] text-zinc-300 space-y-1.5 animate-fade-in">
                      <div className="flex items-center justify-between pb-1 border-b border-white/10 text-white font-bold text-xs">
                        <span>📜 Mee Bhoomi Certified Adangal Data (meebhoomi.ap.gov.in)</span>
                        <span className="text-[10px] text-zinc-400">Audit Year: 2025</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[10px]">
                        <div>Pattadar: <span className="text-white">{asset.rawAdangal.pattadar}</span></div>
                        <div>Occupant: <span className="text-white">{asset.rawAdangal.occupant}</span></div>
                        <div>Nature: <span className="text-white">{asset.rawAdangal.nature}</span></div>
                        {asset.rawAdangal.soilType && <div>Soil Subgrade: <span className="text-white">{asset.rawAdangal.soilType}</span></div>}
                        {asset.rawAdangal.loadCapacity && <div>Load Rating: <span className="text-white">{asset.rawAdangal.loadCapacity}</span></div>}
                        {asset.rawAdangal.dischargeCapacity && <div>Discharge: <span className="text-white">{asset.rawAdangal.dischargeCapacity}</span></div>}
                        <div>Khata: <span className="text-white">{asset.khataNumber}</span></div>
                        <div>GPS: <span className="text-white">{asset.latitude}, {asset.longitude}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

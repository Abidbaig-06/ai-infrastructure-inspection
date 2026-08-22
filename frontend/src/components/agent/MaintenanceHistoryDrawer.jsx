import React, { useState, useEffect } from 'react';
import { fetchAssetHistory, fetchAllAssets } from '../../services/api';
import {
  History,
  Building2,
  Calendar,
  AlertTriangle,
  CheckCircle,
  FileText,
  DollarSign,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const MaintenanceHistoryDrawer = ({ activeAssetId = 'ASSET-RD-GNT-04' }) => {
  const [selectedAssetId, setSelectedAssetId] = useState(activeAssetId);
  const [assetData, setAssetData] = useState(null);
  const [allAssets, setAllAssets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllAssets()
      .then(res => {
        if (res.success && res.data) setAllAssets(res.data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedAssetId) {
      setLoading(true);
      fetchAssetHistory(selectedAssetId)
        .then(res => {
          if (res.success && res.data) setAssetData(res.data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [selectedAssetId]);

  return (
    <div className="charcoal-glass rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8 space-y-6 text-zinc-100 relative overflow-hidden">
      {/* Top Specular White Light Beam */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center font-bold shadow-inner">
            <History className="w-4 h-4 drop-shadow-[0_0_6px_#ffffff]" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-white">
              Infrastructure Asset Maintenance History Engine
            </h3>
            <p className="text-xs text-zinc-400">
              Retrieves past contractor interventions, recurring failure rates, and warranty status
            </p>
          </div>
        </div>

        {/* Asset Quick Selector */}
        <select
          value={selectedAssetId}
          onChange={(e) => setSelectedAssetId(e.target.value)}
          className="charcoal-glass-input px-3.5 py-2 text-xs rounded-xl font-bold text-white focus:outline-none"
        >
          {allAssets.map((ast) => (
            <option key={ast.assetId} value={ast.assetId} className="bg-zinc-950 text-white">
              {ast.assetId} - {ast.assetName.split('(')[0]}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-zinc-400 font-mono">
          Retrieving historical maintenance logs from GMC infrastructure registry...
        </div>
      ) : assetData ? (
        <div className="space-y-5 text-xs">
          {/* Asset Metadata Hero in Charcoal Glass */}
          <div className="charcoal-glass-card rounded-2xl p-5 border border-white/15 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 font-mono">
                  ASSET IDENTIFIER: {assetData.assetId}
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">
                  {assetData.assetName}
                </h4>
                <p className="text-xs text-zinc-300">
                  🏛️ {assetData.ward} • Category: {assetData.category}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-zinc-400 uppercase font-mono font-bold block">
                  Pavement Condition (PCI)
                </span>
                <span className="text-2xl font-extrabold font-mono text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                  {assetData.pavementConditionIndex}/100
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10 text-[11px] text-zinc-300 font-mono">
              <div>
                <span className="text-zinc-400 block text-[10px]">Surface Specification:</span>
                <strong className="text-white">{assetData.surfaceType}</strong>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px]">Construction Year:</span>
                <strong className="text-white">{assetData.constructionYear}</strong>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px]">Traffic Daily Load:</span>
                <strong className="text-white">{assetData.trafficDailyLoad || 'Moderate Load'}</strong>
              </div>
            </div>
          </div>

          {/* Chronic Recurrence Alert */}
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-200 space-y-1 backdrop-blur-md">
            <div className="flex items-center gap-2 font-bold text-xs font-mono">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>Chronic Defect Recurrence Rating: {assetData.recurrenceRating}</span>
            </div>
            <p className="text-[11px] text-red-300">
              Key Failure Vectors: {assetData.vulnerabilityFactors?.join(' • ')}
            </p>
          </div>

          {/* Past Interventions Audit Log */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider block">
              Historical Contractor Interventions & Repair Records
            </span>

            <div className="space-y-2.5">
              {assetData.pastInterventions?.map((record, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl charcoal-glass-card border border-white/10 space-y-2 hover:border-white/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{record.type}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded charcoal-pill font-mono font-semibold text-zinc-300">
                        {record.date}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-white text-sm">
                      ${record.costUSD}.00 USD
                    </span>
                  </div>

                  <p className="text-zinc-300 text-[11px]">
                    Contractor: <strong className="text-white">{record.contractor}</strong> • Warranty: <strong className="text-zinc-200">{record.warrantyStatus}</strong>
                  </p>

                  <p className="text-zinc-400 text-[11px] bg-black/40 p-2.5 rounded-xl border border-white/10">
                    <strong className="text-zinc-200">Post-Repair Assessment:</strong> {record.result}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

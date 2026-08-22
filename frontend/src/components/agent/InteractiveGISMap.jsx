import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { SeverityBadge, StatusBadge } from '../common/StatusBadge';
import { ShieldAlert, Truck, Sparkles, MapPin, ExternalLink, Filter } from 'lucide-react';

// Marker icon generator with custom SVG colors
const createCustomMarker = (severity, status) => {
  let color = '#3b82f6'; // default blue
  if (status === 'RESOLVED') {
    color = '#10b981'; // emerald green
  } else if (severity === 'CRITICAL') {
    color = '#ef4444'; // red
  } else if (severity === 'HIGH') {
    color = '#f97316'; // orange
  } else if (severity === 'MEDIUM') {
    color = '#eab308'; // yellow
  }

  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `;

  return L.divIcon({
    className: 'custom-map-marker',
    html: svgIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30]
  });
};

export const InteractiveGISMap = ({
  complaints = [],
  onSelectComplaint,
  onDispatch,
  height = '500px'
}) => {
  const [mapSeverityFilter, setMapSeverityFilter] = useState('ALL');

  const filteredComplaints = complaints.filter((c) => {
    if (mapSeverityFilter === 'ALL') return true;
    return c.aiAnalysis?.severity === mapSeverityFilter;
  });

  // Calculate default center (Defaults to Guntur city center)
  const defaultCenter = complaints.length > 0 && complaints[0]?.location?.latitude
    ? [complaints[0].location.latitude, complaints[0].location.longitude]
    : [16.3067, 80.4365];

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
      {/* Map Control Overlay */}
      <div className="absolute top-3 left-3 z-[400] bg-white/95 backdrop-blur-md rounded-xl p-2.5 shadow-md border border-slate-200 flex flex-wrap items-center gap-2 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-700 mr-1">
          <Filter className="w-3.5 h-3.5 text-civic-600" />
          <span>GIS Layer:</span>
        </div>

        {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
          <button
            key={sev}
            type="button"
            onClick={() => setMapSeverityFilter(sev)}
            className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
              mapSeverityFilter === sev
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {sev} ({sev === 'ALL' ? complaints.length : complaints.filter((c) => c.aiAnalysis?.severity === sev).length})
          </button>
        ))}
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-3 left-3 z-[400] bg-slate-900/90 backdrop-blur-md text-white rounded-xl p-3 shadow-lg border border-slate-800 text-[11px] hidden sm:block">
        <span className="font-bold text-slate-300 block mb-1.5 uppercase tracking-wider text-[10px]">
          Risk Severity Index
        </span>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>Critical (85-100)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span>High Risk (65-84)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <span>Medium Risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Resolved</span>
          </div>
        </div>
      </div>

      {/* Leaflet Map */}
      <div style={{ height }}>
        <MapContainer
          center={defaultCenter}
          zoom={13}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredComplaints.map((c) => {
            const lat = c.location?.latitude || 40.7128;
            const lng = c.location?.longitude || -74.0060;
            const icon = createCustomMarker(c.aiAnalysis?.severity, c.status);

            return (
              <Marker key={c._id || c.ticketId} position={[lat, lng]} icon={icon}>
                <Popup className="custom-leaflet-popup" maxWidth={300}>
                  <div className="p-1 space-y-2 text-slate-800">
                    <div className="flex items-center justify-between gap-2 border-b pb-1.5">
                      <span className="font-mono text-xs font-bold text-civic-800">
                        {c.ticketId}
                      </span>
                      <SeverityBadge severity={c.aiAnalysis?.severity} size="sm" />
                    </div>

                    {c.imageUrl && (
                      <img
                        src={c.imageUrl}
                        alt={c.title}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    )}

                    <h4 className="font-bold text-xs line-clamp-2 leading-tight">
                      {c.title}
                    </h4>

                    <div className="text-[11px] text-slate-500 space-y-0.5">
                      <p className="truncate">📍 {c.location?.address}</p>
                      <p className="truncate">🏛️ {c.location?.ward}</p>
                      <div className="flex justify-between font-mono font-semibold pt-1">
                        <span>Risk: {c.aiAnalysis?.riskScore || 50}/100</span>
                        <span>SLA: {c.aiAnalysis?.slaHours || 48}h</span>
                      </div>
                    </div>

                    <div className="flex gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => onSelectComplaint(c)}
                        className="flex-1 py-1 px-2 text-[11px] font-semibold bg-civic-50 text-civic-700 hover:bg-civic-100 rounded border border-civic-200"
                      >
                        AI Report
                      </button>

                      {c.status !== 'RESOLVED' && onDispatch && (
                        <button
                          type="button"
                          onClick={() => onDispatch(c)}
                          className="py-1 px-2 text-[11px] font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded flex items-center gap-1"
                        >
                          <Truck className="w-3 h-3" />
                          <span>Dispatch</span>
                        </button>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

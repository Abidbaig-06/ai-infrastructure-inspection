import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Layers,
  MapPin,
  AlertTriangle,
  Sparkles,
  Truck,
  Building2,
  Eye,
  Scan,
  CheckCircle2,
  Navigation,
  Maximize2
} from 'lucide-react';

// Custom Pulsing Red Dot for Complaints with White Light Rim
const createPulsingRedDotIcon = (severity, isSelected) => {
  const isCritical = severity === 'CRITICAL';
  const colorBg = isCritical ? 'bg-red-600' : severity === 'HIGH' ? 'bg-orange-500' : 'bg-amber-500';
  const colorPing = isCritical ? 'bg-red-400' : severity === 'HIGH' ? 'bg-orange-300' : 'bg-amber-300';
  const ring = isSelected ? 'ring-4 ring-white ring-offset-2 ring-offset-black scale-125' : '';

  return L.divIcon({
    className: 'custom-red-dot-marker',
    html: `
      <div class="relative flex items-center justify-center w-8 h-8 transition-transform duration-300 ${ring}">
        <span class="animate-ping absolute inline-flex h-7 w-7 rounded-full ${colorPing} opacity-75"></span>
        <span class="relative inline-flex items-center justify-center rounded-full h-5 w-5 ${colorBg} border-2 border-white shadow-[0_0_10px_#ffffff] text-[9px] font-black text-white">
          !
        </span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 15, { animate: true, duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

export const RealLifeSatelliteMap = ({
  complaints = [],
  onSelectComplaint,
  selectedComplaintId,
  height = '560px'
}) => {
  const [mapType, setMapType] = useState('satellite');
  const [activeComplaint, setActiveComplaint] = useState(null);

  const gunturCenter = [16.3067, 80.4365];

  const mapTileUrls = {
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    streets: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  };

  const attributions = {
    satellite: '&copy; Esri, Maxar, Earthstar Geographics, CNES/Airbus DS',
    streets: '&copy; <a href="https://carto.com/">CARTO</a>',
    osm: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  };

  const currentCenter = selectedComplaintId
    ? (() => {
        const found = complaints.find(c => (c.ticketId === selectedComplaintId || c._id === selectedComplaintId));
        return found?.location?.latitude ? [found.location.latitude, found.location.longitude] : gunturCenter;
      })()
    : gunturCenter;

  return (
    <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-black">
      {/* Map Control Bar Overlay in Charcoal Glass */}
      <div className="absolute top-3 left-3 z-[400] charcoal-glass rounded-2xl p-2 shadow-2xl border border-white/20 flex flex-wrap items-center gap-2 text-xs text-white">
        <div className="flex items-center gap-1.5 font-bold text-white px-2 font-mono">
          <Layers className="w-4 h-4 text-white drop-shadow-[0_0_6px_#ffffff]" />
          <span>Real-Life Map View:</span>
        </div>

        <div className="flex items-center bg-black/60 p-1 rounded-xl border border-white/10 gap-1">
          <button
            type="button"
            onClick={() => setMapType('satellite')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 text-xs ${
              mapType === 'satellite'
                ? 'white-gloss-btn text-black shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>🛰️ Aerial Satellite</span>
          </button>

          <button
            type="button"
            onClick={() => setMapType('streets')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs ${
              mapType === 'streets'
                ? 'white-gloss-btn text-black shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>🗺️ Streets</span>
          </button>

          <button
            type="button"
            onClick={() => setMapType('osm')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs ${
              mapType === 'osm'
                ? 'white-gloss-btn text-black shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>🏙️ OpenStreetMap</span>
          </button>
        </div>
      </div>

      {/* Live Active Red Dots Count Badge */}
      <div className="absolute top-3 right-3 z-[400] charcoal-glass rounded-2xl px-3.5 py-2 shadow-2xl border border-white/20 flex items-center gap-2.5 text-xs text-white">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600 shadow-[0_0_8px_#ef4444]"></span>
        </span>
        <span className="font-mono font-bold text-red-400">
          {complaints.filter(c => c.status !== 'RESOLVED').length} Active Red Dots Pinned
        </span>
      </div>

      {/* Leaflet Map */}
      <div style={{ height }}>
        <MapContainer
          center={currentCenter}
          zoom={14}
          scrollWheelZoom={true}
          className="h-full w-full z-10"
        >
          <TileLayer
            key={mapType}
            attribution={attributions[mapType]}
            url={mapTileUrls[mapType]}
            maxZoom={19}
          />

          <MapRecenter center={currentCenter} zoom={15} />

          {complaints.map((c) => {
            if (!c.location?.latitude || !c.location?.longitude) return null;
            const isSelected = selectedComplaintId === c.ticketId || selectedComplaintId === c._id;
            const severity = c.aiAnalysis?.severity || 'MEDIUM';

            return (
              <Marker
                key={c.ticketId || c._id}
                position={[c.location.latitude, c.location.longitude]}
                icon={createPulsingRedDotIcon(severity, isSelected)}
                eventHandlers={{
                  click: () => {
                    setActiveComplaint(c);
                    if (onSelectComplaint) onSelectComplaint(c);
                  }
                }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-1 max-w-xs space-y-2 text-xs">
                    {c.imageUrl && (
                      <img
                        src={c.imageUrl}
                        alt="Hazard"
                        className="w-full h-28 object-cover rounded-xl border border-slate-200"
                      />
                    )}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-zinc-900 text-[11px]">{c.ticketId}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          severity === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {severity} ({c.aiAnalysis?.riskScore || 50}/100)
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 line-clamp-1 mt-1">{c.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{c.description}</p>
                    </div>

                    <div className="text-[10px] text-slate-600 border-t pt-1.5 font-mono">
                      📍 {c.location.address || c.location.ward}
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectComplaint && onSelectComplaint(c)}
                      className="w-full py-2 white-gloss-btn text-black font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <Scan className="w-3.5 h-3.5 text-black" />
                      <span>AI Vision & Defect Detection</span>
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Bottom Coordinates & Guntur Status Bar */}
      <div className="p-3 bg-black/90 border-t border-white/15 text-zinc-300 text-[11px] font-mono flex flex-wrap items-center justify-between gap-3 px-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-white" />
          <span>GUNTUR CITY GIS • LAT: 16.3067° N, LNG: 80.4365° E • RESOLUTION: 0.3m/px</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-zinc-400">Click any <strong className="text-red-400 font-bold">Red Dot</strong> to inspect structural defect</span>
        </div>
      </div>
    </div>
  );
};

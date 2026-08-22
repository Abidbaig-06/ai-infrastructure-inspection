/**
 * AI Infrastructure Inspection & Maintenance Agent
 * Module: Historical Asset Retrieval & Recurrence Engine
 * Domain: Guntur Municipal Corporation (GMC)
 */

const assetMaintenanceHistory = {
  'ASSET-RD-GNT-04': {
    assetId: 'ASSET-RD-GNT-04',
    assetName: 'Lakshmipuram Main Arterial Road (Chainage 0.0 to 3.8 km)',
    category: 'Roads & Highways',
    ward: 'Ward 04 - Lakshmipuram',
    constructionYear: 2019,
    surfaceType: 'Dense Bituminous Macadam (DBM) + Bituminous Concrete',
    pavementConditionIndex: 42, // Poor (0-100)
    trafficDailyLoad: '28,500 PCU/day (Heavy Two-Wheeler & Bus Corridor)',
    pastInterventions: [
      {
        date: '2025-06-12',
        type: 'Cold Patching & Surface Dressing',
        contractor: 'GMC Quick-Fix Team',
        costUSD: 450,
        result: 'Temporary fix failed after monsoon rain ingress (Recurrence detected)',
        warrantyStatus: 'Expired'
      },
      {
        date: '2024-02-18',
        type: 'Utility Trench Backfill & Asphalt Top-up',
        contractor: 'Apex Pipeworks Ltd',
        costUSD: 1200,
        result: 'Sub-base settling caused longitudinal depression',
        warrantyStatus: 'Expired'
      }
    ],
    recurrenceRating: 'HIGH (3 failures in 24 months)',
    vulnerabilityFactors: ['Sub-surface water seepage from stormwater drain', 'Heavy transit bus axle loading']
  },
  'ASSET-WT-GNT-02': {
    assetId: 'ASSET-WT-GNT-02',
    assetName: 'Brodipet 4th Line Cast-Iron Water Feeder Grid',
    category: 'Water & Pipeline Network',
    ward: 'Ward 02 - Brodipet',
    constructionYear: 2014,
    surfaceType: '300mm Ductile Iron Main (DI K-9)',
    pavementConditionIndex: 38,
    trafficDailyLoad: 'Commercial Hub (High Footfall & Shop Access)',
    pastInterventions: [
      {
        date: '2025-11-04',
        type: 'Sleeve Clamp Joint Seal',
        contractor: 'GMC Water Supply Wing',
        costUSD: 600,
        result: 'Corrosion at joint 14 caused adjacent secondary rupture',
        warrantyStatus: 'Active (Violated)'
      }
    ],
    recurrenceRating: 'CRITICAL (Aging pipe segment prone to burst surges)',
    vulnerabilityFactors: ['Surge pressure during morning water supply cycles', 'High soil salinity']
  },
  'ASSET-EL-GNT-01': {
    assetId: 'ASSET-EL-GNT-01',
    assetName: 'Arundelpet 11kV/440V Overhead Distribution Feeder 3B',
    category: 'Power & Electrical Grid',
    ward: 'Ward 01 - Arundelpet Central',
    constructionYear: 2016,
    surfaceType: 'ACSR Conductor on PSC Poles',
    pavementConditionIndex: 55,
    trafficDailyLoad: 'Dense Market & High School Corridor',
    pastInterventions: [
      {
        date: '2025-08-20',
        type: 'Insulator Replacement & Tree Trimming',
        contractor: 'APCPDCL Line Unit',
        costUSD: 350,
        result: 'Pole 12 cross-arm bent under storm loading',
        warrantyStatus: 'Expired'
      }
    ],
    recurrenceRating: 'MODERATE',
    vulnerabilityFactors: ['Overgrown avenue trees', 'Proximity to high-density vegetable market']
  },
  'ASSET-SW-GNT-08': {
    assetId: 'ASSET-SW-GNT-08',
    assetName: 'Old Guntur Jinnah Tower Sanitation & Drainage Culvert',
    category: 'Sanitation & Solid Waste',
    ward: 'Ward 08 - Old Guntur',
    constructionYear: 2018,
    surfaceType: 'RCC Box Culvert & Open Masonry Channel',
    pavementConditionIndex: 50,
    trafficDailyLoad: 'Wholesale Market & Bus Transit Corridor',
    pastInterventions: [
      {
        date: '2026-01-10',
        type: 'Silt Clearance & Bio-Enzymatic Deodorization',
        contractor: 'GMC Sanitation Unit',
        costUSD: 280,
        result: 'Debris accumulation recurring due to commercial dumping',
        warrantyStatus: 'Operational'
      }
    ],
    recurrenceRating: 'HIGH (Continuous illegal dumping hotspot)',
    vulnerabilityFactors: ['Commercial wholesale packing debris', 'Narrow culvert inlet']
  },
  'ASSET-LT-GNT-05': {
    assetId: 'ASSET-LT-GNT-05',
    assetName: 'Pattabhipuram NTR Stadium Ring Road Illumination Sector',
    category: 'Public Street Lighting',
    ward: 'Ward 05 - Pattabhipuram',
    constructionYear: 2021,
    surfaceType: 'Octagonal Galvanized Poles with 150W LED Luminaires',
    pavementConditionIndex: 78,
    pastInterventions: [
      {
        date: '2025-05-14',
        type: 'Feeder Pillar Fuse Replacement',
        contractor: 'GMC Electrical Maintenance',
        costUSD: 180,
        result: 'Circuit restored to 45 Lux average',
        warrantyStatus: 'Under AMC'
      }
    ],
    recurrenceRating: 'LOW',
    vulnerabilityFactors: ['Voltage fluctuations during stadium events']
  }
};

const getAssetHistoryById = (assetId) => {
  return assetMaintenanceHistory[assetId] || assetMaintenanceHistory['ASSET-RD-GNT-04'];
};

const getAllAssetsList = () => {
  return Object.values(assetMaintenanceHistory);
};

module.exports = {
  assetMaintenanceHistory,
  getAssetHistoryById,
  getAllAssetsList
};

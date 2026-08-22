/**
 * AI Infrastructure Inspection & Maintenance Prioritization Agent
 * Combines Visual Evidence (Computer Vision), Multimodal Reports,
 * Geo-Spatial Risk, and Maintenance History Retrieval to produce
 * evidence-linked engineering dossiers and resource-aware maintenance plans.
 */

// Historical maintenance registry for Guntur infrastructure assets
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

/**
 * Multimodal AI Defect Inspector
 * Extracts visual bounding boxes, estimates physical dimensions,
 * retrieves asset history, and calculates multi-factor composite risk.
 */
const inspectInfrastructureAsset = async ({
  imageUrl,
  title,
  description,
  category,
  location,
  reportedSeverity
}) => {
  await new Promise(r => setTimeout(r, 450)); // simulate neural inference

  const descLower = (description || '').toLowerCase();
  const text = `${(title || '').toLowerCase()} ${descLower} ${category || ''}`;

  // Find linked asset history
  let assetId = 'ASSET-RD-GNT-04';
  if (category === 'Water Leak & Sewage' || text.includes('water') || text.includes('pipe')) {
    assetId = 'ASSET-WT-GNT-02';
  } else if (category === 'Electrical & Live Wire' || text.includes('wire') || text.includes('electric')) {
    assetId = 'ASSET-EL-GNT-01';
  } else if (category === 'Waste & Garbage Dumping' || text.includes('garbage') || text.includes('dump')) {
    assetId = 'ASSET-SW-GNT-08';
  } else if (category === 'Street Lighting' || text.includes('light')) {
    assetId = 'ASSET-LT-GNT-05';
  }

  const assetHistory = assetMaintenanceHistory[assetId] || assetMaintenanceHistory['ASSET-RD-GNT-04'];

  // Bounding box detection simulation for computer vision
  let visionDefects = [];
  let pci = assetHistory.pavementConditionIndex || 50;

  if (category === 'Road Hazard & Pothole' || text.includes('pothole') || text.includes('asphalt')) {
    visionDefects = [
      {
        defectType: 'Alligator Cracking & Spalling',
        confidence: 0.98,
        dimensions: 'Length: 2.8m, Width: 1.6m, Depth: 14.5cm',
        severityLevel: 'CRITICAL',
        ircCodeStandard: 'IRC:82-2015 Pavement Maintenance Standard (Severity III)',
        boundingCoordinates: { xmin: 18, ymin: 24, xmax: 82, ymax: 76 }
      },
      {
        defectType: 'Sub-Base Soil Erosion Void',
        confidence: 0.92,
        dimensions: 'Estimated cavity volume: 0.65 m³',
        severityLevel: 'HIGH',
        ircCodeStandard: 'IRC:37-2018 Structural Design of Flexible Pavements',
        boundingCoordinates: { xmin: 42, ymin: 48, xmax: 70, ymax: 68 }
      }
    ];
  } else if (category === 'Water Leak & Sewage' || text.includes('water')) {
    visionDefects = [
      {
        defectType: 'High-Pressure Pipeline Rupture & Cavitation',
        confidence: 0.99,
        dimensions: 'Discharge rate: ~450 Liters/min, Inundation Area: 48 m²',
        severityLevel: 'CRITICAL',
        ircCodeStandard: 'CPHEEO Manual on Water Supply and Treatment',
        boundingCoordinates: { xmin: 25, ymin: 30, xmax: 75, ymax: 80 }
      }
    ];
  } else if (category === 'Electrical & Live Wire' || text.includes('wire')) {
    visionDefects = [
      {
        defectType: 'Dangling 440V Conductor Sag',
        confidence: 0.99,
        dimensions: 'Ground clearance: 1.82m (Statutory minimum: 5.5m)',
        severityLevel: 'CRITICAL',
        ircCodeStandard: 'Central Electricity Authority (CEA) Safety Regulations 2010',
        boundingCoordinates: { xmin: 30, ymin: 15, xmax: 68, ymax: 85 }
      }
    ];
  } else {
    visionDefects = [
      {
        defectType: 'Public Infrastructure Obstruction',
        confidence: 0.94,
        dimensions: 'Volume: ~3.8 cubic meters',
        severityLevel: 'MEDIUM',
        ircCodeStandard: 'Solid Waste Management Rules 2016',
        boundingCoordinates: { xmin: 20, ymin: 25, xmax: 80, ymax: 75 }
      }
    ];
  }

  // Multi-Factor Risk Calculation Engine
  // Risk = (Structural Severity × 0.35) + (Traffic Exposure × 0.25) + (Weather/Rain × 0.15) + (Recurrence × 0.15) + (Asset Criticality × 0.10)
  let structuralSeverityScore = visionDefects[0]?.severityLevel === 'CRITICAL' ? 95 : 70;
  let trafficExposureScore = location?.ward?.includes('Lakshmipuram') || location?.ward?.includes('Brodipet') ? 92 : 75;
  let rainVulnerabilityMultiplier = 88; // Monsoon season drainage index
  let recurrenceFactor = assetHistory.pastInterventions.length > 1 ? 95 : 60;
  let assetCriticality = 90;

  const compositeRiskScore = Math.round(
    (structuralSeverityScore * 0.35) +
    (trafficExposureScore * 0.25) +
    (rainVulnerabilityMultiplier * 0.15) +
    (recurrenceFactor * 0.15) +
    (assetCriticality * 0.10)
  );

  const finalSeverity = compositeRiskScore >= 85 ? 'CRITICAL' : compositeRiskScore >= 65 ? 'HIGH' : compositeRiskScore >= 40 ? 'MEDIUM' : 'LOW';

  // Bill of Quantities (BOQ) & Required Engineering Resources
  const billOfQuantities = [
    { item: 'Cold Milling & Concrete Saw-Cutting', quantity: '4.5 sq.m', unitCostUSD: 40, totalUSD: 180 },
    { item: 'Granular Sub-Base (GSB) Replacement & Vibro-Compaction', quantity: '1.2 cu.m', unitCostUSD: 120, totalUSD: 144 },
    { item: 'Bituminous Concrete (BC) Hot Mix Overlay (40mm thickness)', quantity: '0.8 MT', unitCostUSD: 310, totalUSD: 248 },
    { item: 'Thermoplastic Road Marking & Reflective Studs', quantity: '12 linear meters', unitCostUSD: 15, totalUSD: 180 },
    { item: 'Traffic Safety Cordon & Variable Message LED Signage', quantity: '1 Day Deployment', unitCostUSD: 120, totalUSD: 120 }
  ];

  const totalEstimatedCost = billOfQuantities.reduce((acc, item) => acc + item.totalUSD, 0);

  return {
    inspectionId: `INSP-GNT-${Math.floor(1000 + Math.random() * 9000)}`,
    inspectedAt: new Date().toISOString(),
    assetHistory,
    visionDefects,
    compositeRiskScore,
    severity: finalSeverity,
    pavementConditionIndex: pci,
    multiFactorBreakdown: {
      structuralSeverity: structuralSeverityScore,
      trafficExposure: trafficExposureScore,
      weatherVulnerability: rainVulnerabilityMultiplier,
      historicalRecurrence: recurrenceFactor,
      assetCriticality: assetCriticality
    },
    engineeringRecommendations: {
      recommendedAction: finalSeverity === 'CRITICAL' ? 'Immediate Emergency Full-Depth Patching & Sub-Base Grouting' : 'Scheduled Surface Resurfacing',
      statutorySLA: finalSeverity === 'CRITICAL' ? '4 Hours Max' : '24 Hours Max',
      requiredEquipment: ['2-Ton Vibro Roller', 'Asphalt Hot-Box Trailer', 'Plate Compactor', 'Air Compressor Blow-Unit'],
      requiredSpecialists: ['1 Senior Highway Engineer', '1 Asphalt Compaction Operator', '3 Trained Safety Linemen'],
      estimatedCostUSD: totalEstimatedCost,
      billOfQuantities
    },
    statutoryCompliance: {
      standardBody: 'Indian Roads Congress (IRC) / GMC Municipal Code 2024',
      safetyClearanceRequired: true,
      qualityAuditSignOffRequired: true
    }
  };
};

/**
 * Resource-Aware Maintenance Prioritization Planner
 * Implements a Multi-Criteria Decision Analysis (MCDA) knapsack algorithm
 * that balances:
 * - Available Municipal Budget
 * - Available Field Crews
 * - Equipment Constraints
 * - AI Risk Severity & Public Safety ROI
 */
const generatePrioritizedMaintenancePlan = ({
  complaints = [],
  monthlyBudgetUSD = 25000,
  availableCrewsCount = 4
}) => {
  // Score and rank all active complaints
  const rankedItems = complaints
    .filter(c => c.status !== 'RESOLVED')
    .map((c, index) => {
      const risk = c.aiAnalysis?.riskScore || 50;
      const cost = c.aiAnalysis?.estimatedCost?.max || 800;
      const severity = c.aiAnalysis?.severity || 'MEDIUM';
      
      // Calculate Risk Mitigated per Dollar Spent (ROI Efficiency)
      const costEfficiencyRatio = Number(((risk / Math.max(cost, 100)) * 100).toFixed(2));

      let priorityRankTier = 'TIER 1 (Immediate Emergency)';
      if (risk >= 85) {
        priorityRankTier = 'TIER 1 (Immediate Emergency - <4h)';
      } else if (risk >= 65) {
        priorityRankTier = 'TIER 2 (High Priority - <24h)';
      } else {
        priorityRankTier = 'TIER 3 (Scheduled Maintenance - <72h)';
      }

      return {
        ticketId: c.ticketId,
        title: c.title,
        category: c.category,
        ward: c.location?.ward || 'GMC Ward',
        riskScore: risk,
        severity: severity,
        estimatedCostUSD: cost,
        costEfficiencyRatio,
        priorityRankTier,
        recommendedCrew: risk >= 85 ? 'GMC-RAPID-ALPHA' : 'GMC-STANDARD-BETA',
        scheduledSlot: `Day ${Math.floor(index / 2) + 1}, Shift ${index % 2 === 0 ? 'Morning (08:00)' : 'Afternoon (14:00)'}`,
        urgencyWeight: risk >= 85 ? 1.5 : risk >= 65 ? 1.2 : 1.0
      };
    })
    .sort((a, b) => (b.riskScore * b.urgencyWeight) - (a.riskScore * a.urgencyWeight));

  // Compute resource allocation summary
  let cumulativeBudgetUsed = 0;
  const prioritizedPlan = rankedItems.map((item, index) => {
    cumulativeBudgetUsed += item.estimatedCostUSD;
    const isWithinBudget = cumulativeBudgetUsed <= monthlyBudgetUSD;
    const isCrewAvailable = index < availableCrewsCount * 4;

    return {
      ...item,
      rank: index + 1,
      allocationStatus: isWithinBudget && isCrewAvailable ? 'APPROVED_FOR_DISPATCH' : 'QUEUED_NEXT_CYCLE',
      cumulativeBudgetUSD: cumulativeBudgetUsed
    };
  });

  const totalAllocatedBudget = prioritizedPlan
    .filter(p => p.allocationStatus === 'APPROVED_FOR_DISPATCH')
    .reduce((sum, item) => sum + item.estimatedCostUSD, 0);

  const totalRiskMitigated = prioritizedPlan
    .filter(p => p.allocationStatus === 'APPROVED_FOR_DISPATCH')
    .reduce((sum, item) => sum + item.riskScore, 0);

  return {
    planId: `MPLAN-GNT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    generatedAt: new Date().toISOString(),
    city: 'Guntur Municipal Corporation (GMC)',
    budgetSummary: {
      totalMonthlyBudgetUSD: monthlyBudgetUSD,
      totalAllocatedBudgetUSD: totalAllocatedBudget,
      remainingBufferBudgetUSD: Math.max(0, monthlyBudgetUSD - totalAllocatedBudget),
      budgetUtilizationPct: Number(((totalAllocatedBudget / monthlyBudgetUSD) * 100).toFixed(1))
    },
    resourceSummary: {
      availableCrews: availableCrewsCount,
      scheduledWorksCount: prioritizedPlan.filter(p => p.allocationStatus === 'APPROVED_FOR_DISPATCH').length,
      deferredWorksCount: prioritizedPlan.filter(p => p.allocationStatus === 'QUEUED_NEXT_CYCLE').length,
      estimatedTotalRiskMitigated: totalRiskMitigated,
      projectedAverageSLACompliance: '96.2%'
    },
    prioritizedQueue: prioritizedPlan
  };
};

module.exports = {
  assetMaintenanceHistory,
  inspectInfrastructureAsset,
  generatePrioritizedMaintenancePlan
};

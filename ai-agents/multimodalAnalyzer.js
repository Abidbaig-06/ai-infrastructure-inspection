/**
 * AI Infrastructure Inspection & Maintenance Agent
 * Module: Multimodal Neural Fusion & Multi-Factor Risk Scorer
 */

const { detectVisionDefects } = require('./visionDefectDetector');
const { getAssetHistoryById } = require('./historicalAssetRetrieval');

const performMultimodalInspection = async ({
  imageUrl,
  title,
  description,
  category,
  location,
  reportedSeverity
}) => {
  // Simulate neural latency
  await new Promise(r => setTimeout(r, 350));

  const text = `${(title || '').toLowerCase()} ${(description || '').toLowerCase()} ${(category || '').toLowerCase()}`;

  // Link asset history
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

  const assetHistory = getAssetHistoryById(assetId);
  const visionDefects = detectVisionDefects({ category, textDescription: text });

  // Composite Risk Index:
  // Risk = (Structural Severity × 0.35) + (Traffic Exposure × 0.25) + (Weather Vulnerability × 0.15) + (Recurrence × 0.15) + (Asset Criticality × 0.10)
  let structuralSeverityScore = visionDefects[0]?.severityLevel === 'CRITICAL' ? 95 : 70;
  let trafficExposureScore = location?.ward?.includes('Lakshmipuram') || location?.ward?.includes('Brodipet') ? 92 : 75;
  let rainVulnerabilityMultiplier = 88;
  let recurrenceFactor = assetHistory.pastInterventions?.length > 1 ? 95 : 60;
  let assetCriticality = 90;

  const compositeRiskScore = Math.round(
    (structuralSeverityScore * 0.35) +
    (trafficExposureScore * 0.25) +
    (rainVulnerabilityMultiplier * 0.15) +
    (recurrenceFactor * 0.15) +
    (assetCriticality * 0.10)
  );

  const finalSeverity = compositeRiskScore >= 85 ? 'CRITICAL' : compositeRiskScore >= 65 ? 'HIGH' : compositeRiskScore >= 40 ? 'MEDIUM' : 'LOW';

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
    pavementConditionIndex: assetHistory.pavementConditionIndex || 42,
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

module.exports = {
  performMultimodalInspection
};

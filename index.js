/**
 * 🏛️ AI Infrastructure Inspection & Maintenance Prioritization Agent
 * Master Entry Point (Guntur Municipal Corporation - GMC)
 */

const {
  detectVisionDefects,
  performMultimodalInspection,
  optimizeMaintenancePlan,
  assetMaintenanceHistory,
  getAssetHistoryById,
  getAllAssetsList
} = require('./ai-agents');

const { seedComplaints } = require('./database/seed/seedData');

async function runAutonomousInspectionDemo() {
  console.log('================================================================================');
  console.log('🏛️  CIVICPULSE AI — AUTONOMOUS INFRASTRUCTURE INSPECTION & PRIORITIZATION AGENT');
  console.log('    Deployment City: Guntur Municipal Corporation (GMC), Andhra Pradesh');
  console.log('    Coordinates: 16.3067° N, 80.4365° E | Standard: IRC:82-2015 & IRC:37-2018');
  console.log('================================================================================\n');

  // Sample inspection payload
  const sampleHazard = {
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800',
    title: 'Severe Arterial Road Asphalt Cratering & Base Cavity',
    description: 'Deep alligator cracking with 14.5cm sub-base void and standing water seepage',
    category: 'Road Hazard & Pothole',
    location: {
      ward: 'Ward 04 - Lakshmipuram',
      landmark: 'Near Old Bus Stand Junction',
      latitude: 16.3125,
      longitude: 80.4280
    },
    reportedSeverity: 'CRITICAL'
  };

  console.log('🔍 [STEP 1/4] Running Multimodal AI Inspection on Infrastructure Defect...');
  console.log(`   Target Asset: ${sampleHazard.title}`);
  console.log(`   Location:     ${sampleHazard.location.ward} (${sampleHazard.location.latitude}, ${sampleHazard.location.longitude})`);
  console.log(`   Category:     ${sampleHazard.category}\n`);

  const inspectionResult = await performMultimodalInspection(sampleHazard);

  console.log('--------------------------------------------------------------------------------');
  console.log('📊 MULTIMODAL INSPECTION & RISK ASSESSMENT REPORT');
  console.log('--------------------------------------------------------------------------------');
  console.log(`  • Inspection ID:             ${inspectionResult.inspectionId}`);
  console.log(`  • Inspected At:              ${inspectionResult.inspectedAt}`);
  console.log(`  • Composite Risk Score:      ${inspectionResult.compositeRiskScore} / 100`);
  console.log(`  • Severity Classification:   [ ${inspectionResult.severity} ]`);
  console.log(`  • Pavement Condition (PCI):  ${inspectionResult.pavementConditionIndex} / 100 (Sub-standard)`);
  console.log(`  • Statutory SLA Limit:       ${inspectionResult.engineeringRecommendations.statutorySLA}`);
  console.log(`  • Recommended Action:        ${inspectionResult.engineeringRecommendations.recommendedAction}`);
  console.log(`  • Estimated Repair Cost:     $${inspectionResult.engineeringRecommendations.estimatedCostUSD} USD\n`);

  console.log('📷 [STEP 2/4] Computer Vision Defect Localization & Standards Mapping:');
  inspectionResult.visionDefects.forEach((defect, idx) => {
    console.log(`   [Defect ${idx + 1}] ${defect.defectType}`);
    console.log(`     - Confidence:     ${(defect.confidence * 100).toFixed(1)}%`);
    console.log(`     - Dimensions:     ${defect.dimensions}`);
    console.log(`     - Severity:       ${defect.severityLevel}`);
    console.log(`     - Standard Code:  ${defect.ircCodeStandard}`);
    console.log(`     - Bounding Box:   [X: ${defect.boundingCoordinates.xmin}%-${defect.boundingCoordinates.xmax}%, Y: ${defect.boundingCoordinates.ymin}%-${defect.boundingCoordinates.ymax}%]`);
  });
  console.log('');

  console.log('📜 [STEP 3/4] Historical Asset & Chronic Recurrence Retrieval:');
  const history = inspectionResult.assetHistory;
  console.log(`   Asset ID:          ${history.assetId} (${history.assetName})`);
  console.log(`   Construction Year: ${history.constructionYear} | Surface: ${history.surfaceType}`);
  console.log(`   Daily Traffic:     ${history.trafficDailyLoad}`);
  console.log(`   Recurrence Rating: ${history.recurrenceRating}`);
  console.log(`   Vulnerability:     ${history.vulnerabilityFactors.join(', ')}`);
  console.log('   Past Interventions:');
  history.pastInterventions.forEach((p, i) => {
    console.log(`     ${i + 1}. [${p.date}] ${p.type} by ${p.contractor} ($${p.costUSD}) -> Status: ${p.warrantyStatus}`);
  });
  console.log('');

  console.log('⚙️ [STEP 4/4] Resource-Aware Maintenance Prioritization Optimization:');
  const monthlyBudgetUSD = 25000;
  const availableCrewsCount = 4;
  console.log(`   Input Parameters: Budget = $${monthlyBudgetUSD} USD | Crews = ${availableCrewsCount} Teams`);

  const plan = optimizeMaintenancePlan({
    complaints: seedComplaints,
    monthlyBudgetUSD,
    availableCrewsCount
  });

  console.log('\n--------------------------------------------------------------------------------');
  console.log('📋 OPTIMIZED MUNICIPAL DISPATCH QUEUE (MCDA Knapsack Allocation)');
  console.log('--------------------------------------------------------------------------------');
  console.log(`  Plan ID:              ${plan.planId}`);
  console.log(`  City Jurisdiction:    ${plan.city}`);
  console.log(`  Budget Allocated:     $${plan.budgetSummary.totalAllocatedBudgetUSD} / $${plan.budgetSummary.totalMonthlyBudgetUSD} (${plan.budgetSummary.budgetUtilizationPct}% utilized)`);
  console.log(`  Remaining Buffer:     $${plan.budgetSummary.remainingBufferBudgetUSD}`);
  console.log(`  Scheduled Tasks:      ${plan.resourceSummary.scheduledWorksCount} Approved | ${plan.resourceSummary.deferredWorksCount} Queued next cycle`);
  console.log(`  Risk Points Mitigated:${plan.resourceSummary.estimatedTotalRiskMitigated} points`);
  console.log(`  Projected SLA:        ${plan.resourceSummary.projectedAverageSLACompliance}\n`);

  console.log('Top Priority Dispatches:');
  plan.prioritizedQueue.forEach(item => {
    const statusIcon = item.allocationStatus === 'APPROVED_FOR_DISPATCH' ? '✅' : '⏳';
    console.log(`   ${statusIcon} Rank #${item.rank} [${item.ticketId}] Risk: ${item.riskScore}/100 | Cost: $${item.estimatedCostUSD} | Crew: ${item.recommendedCrew}`);
    console.log(`      Title:  ${item.title}`);
    console.log(`      Ward:   ${item.ward} | Tier: ${item.priorityRankTier}`);
    console.log(`      Slot:   ${item.scheduledSlot} | Status: ${item.allocationStatus}\n`);
  });

  console.log('================================================================================');
  console.log('✨ AI INSPECTION & PRIORITIZATION RUN COMPLETED SUCCESSFULLY!');
  console.log('   To launch the Web Dashboard & API Server:');
  console.log('   1. Backend API:  node backend/server.js  (http://localhost:5000)');
  console.log('   2. Frontend UI:  npm run dev --prefix frontend (http://localhost:5173)');
  console.log('================================================================================');
}

// If executed directly via `node index.js`
if (require.main === module) {
  runAutonomousInspectionDemo().catch(err => {
    console.error('Execution Error:', err);
    process.exit(1);
  });
}

module.exports = {
  runAutonomousInspectionDemo,
  detectVisionDefects,
  performMultimodalInspection,
  optimizeMaintenancePlan,
  assetMaintenanceHistory,
  getAssetHistoryById,
  getAllAssetsList
};

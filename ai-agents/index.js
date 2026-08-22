/**
 * AI Infrastructure Inspection & Maintenance Prioritization Agent
 * Master Agent Interface
 */

const { detectVisionDefects } = require('./visionDefectDetector');
const { performMultimodalInspection } = require('./multimodalAnalyzer');
const { optimizeMaintenancePlan } = require('./riskPrioritizationPlanner');
const {
  assetMaintenanceHistory,
  getAssetHistoryById,
  getAllAssetsList
} = require('./historicalAssetRetrieval');

module.exports = {
  detectVisionDefects,
  performMultimodalInspection,
  optimizeMaintenancePlan,
  assetMaintenanceHistory,
  getAssetHistoryById,
  getAllAssetsList
};

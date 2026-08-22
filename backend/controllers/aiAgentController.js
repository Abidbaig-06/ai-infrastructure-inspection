const {
  performMultimodalInspection,
  optimizeMaintenancePlan,
  getAssetHistoryById,
  getAllAssetsList,
  assetMaintenanceHistory
} = require('../../ai-agents');
const Complaint = require('../../database/models/Complaint');
const { isUsingMongo, getMemoryDb } = require('../../database/connection');
const { seedComplaints } = require('../../database/seed/seedData');

// @desc Run Multimodal Inspection on an Image + Report
exports.inspectAsset = async (req, res) => {
  try {
    const { imageUrl, title, description, category, location, reportedSeverity } = req.body;

    const inspectionResult = await performMultimodalInspection({
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
      title: title || 'Pavement Structural Breakdown',
      description: description || 'Severe asphalt cratering and base erosion observed on arterial road',
      category: category || 'Road Hazard & Pothole',
      location: location || { ward: 'Ward 04 - Lakshmipuram', latitude: 16.3125, longitude: 80.4280 },
      reportedSeverity
    });

    return res.json({
      success: true,
      data: inspectionResult
    });
  } catch (err) {
    console.error('Error during asset inspection:', err);
    res.status(500).json({ success: false, message: 'Inspection analysis failed' });
  }
};

// @desc Generate Resource-Aware Maintenance Prioritization Plan
exports.getPrioritizedPlan = async (req, res) => {
  try {
    const { monthlyBudgetUSD = 25000, availableCrewsCount = 4 } = req.query;

    let complaints = [];
    if (isUsingMongo()) {
      complaints = await Complaint.find();
    } else {
      const db = getMemoryDb();
      complaints = db.complaints && db.complaints.length > 0 ? db.complaints : seedComplaints;
    }

    const plan = optimizeMaintenancePlan({
      complaints,
      monthlyBudgetUSD: Number(monthlyBudgetUSD),
      availableCrewsCount: Number(availableCrewsCount)
    });

    return res.json({
      success: true,
      data: plan
    });
  } catch (err) {
    console.error('Error generating prioritized maintenance plan:', err);
    res.status(500).json({ success: false, message: 'Maintenance planning failed' });
  }
};

// @desc Retrieve Maintenance History for an Infrastructure Asset
exports.getAssetHistory = async (req, res) => {
  try {
    const { assetId } = req.params;
    const history = getAssetHistoryById(assetId);
    return res.json({
      success: true,
      data: history
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving asset history' });
  }
};

// @desc Get list of all Guntur Infrastructure Assets
exports.getAllAssets = async (req, res) => {
  try {
    const assets = getAllAssetsList();
    return res.json({
      success: true,
      data: assets
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving assets' });
  }
};

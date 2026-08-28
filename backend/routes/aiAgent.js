const express = require('express');
const router = express.Router();
const {
  inspectAsset,
  visionInspect,
  getPrioritizedPlan,
  getAssetHistory,
  getAllAssets
} = require('../controllers/aiAgentController');

router.post('/inspect', inspectAsset);
router.post('/inspect-defect', inspectAsset);
router.post('/vision', visionInspect);
router.get('/prioritize', getPrioritizedPlan);
router.get('/prioritize-repairs', getPrioritizedPlan);
router.get('/history/:assetId', getAssetHistory);
router.get('/assets', getAllAssets);

module.exports = router;

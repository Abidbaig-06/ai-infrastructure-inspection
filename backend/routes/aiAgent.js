const express = require('express');
const router = express.Router();
const {
  inspectAsset,
  getPrioritizedPlan,
  getAssetHistory,
  getAllAssets
} = require('../controllers/aiAgentController');

router.post('/inspect', inspectAsset);
router.get('/prioritize', getPrioritizedPlan);
router.get('/history/:assetId', getAssetHistory);
router.get('/assets', getAllAssets);

module.exports = router;

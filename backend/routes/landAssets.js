const express = require('express');
const router = express.Router();
const {
  getAllLandAssets,
  getLandAssetBySurveyNumber,
  getCategoryStats
} = require('../controllers/landAssetController');

router.get('/', getAllLandAssets);
router.get('/stats', getCategoryStats);
router.get('/survey/:surveyNumber(*)', getLandAssetBySurveyNumber);

module.exports = router;

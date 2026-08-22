const { supabase, isSupabaseActive, loadLocalMeeBhoomiData } = require('../services/supabaseClient');

// Helper to fetch land assets (either from Supabase or local fallback)
const getAssetsData = async (query = {}) => {
  if (isSupabaseActive() && supabase) {
    try {
      let sbQuery = supabase.from('guntur_land_assets').select('*');
      if (query.type) sbQuery = sbQuery.eq('infrastructure_type', query.type.toUpperCase());
      if (query.ward) sbQuery = sbQuery.eq('ward_number', query.ward);
      if (query.surveyNumber) sbQuery = sbQuery.ilike('survey_number', `%${query.surveyNumber}%`);

      const { data, error } = await sbQuery;
      if (!error && data && data.length > 0) {
        return data.map(r => ({
          id: r.id,
          surveyNumber: r.survey_number,
          townSurveyNumber: r.town_survey_number,
          khataNumber: r.khata_number,
          mandal: r.mandal,
          villageRevenueWard: r.village_revenue_ward,
          wardNumber: r.ward_number,
          assetName: r.asset_name,
          infrastructureType: r.infrastructure_type,
          meeBhoomiClassification: r.mee_bhoomi_classification,
          extentAcres: Number(r.extent_acres),
          extentCents: Number(r.extent_cents),
          extentSqFt: Number(r.extent_sq_ft),
          plotDimensions: r.plot_dimensions,
          carriagewayWidthMeters: r.carriageway_width_meters ? Number(r.carriageway_width_meters) : null,
          latitude: Number(r.latitude),
          longitude: Number(r.longitude),
          custodianDepartment: r.custodian_department,
          pavementConditionIndex: r.pavement_condition_index,
          encroachmentStatus: r.encroachment_status,
          rawAdangal: r.raw_adangal_json
        }));
      }
    } catch (err) {
      console.warn('[Supabase] Query fallback to local dataset:', err.message);
    }
  }

  // Local dataset fallback
  let list = loadLocalMeeBhoomiData();
  if (query.type && query.type !== 'ALL') {
    list = list.filter(a => a.infrastructureType?.toUpperCase() === query.type.toUpperCase());
  }
  if (query.ward && query.ward !== 'ALL') {
    list = list.filter(a => a.wardNumber === query.ward || a.villageRevenueWard?.includes(query.ward));
  }
  if (query.surveyNumber) {
    list = list.filter(a =>
      a.surveyNumber?.toLowerCase().includes(query.surveyNumber.toLowerCase()) ||
      a.townSurveyNumber?.toLowerCase().includes(query.surveyNumber.toLowerCase())
    );
  }
  if (query.search) {
    const s = query.search.toLowerCase();
    list = list.filter(a =>
      a.assetName?.toLowerCase().includes(s) ||
      a.surveyNumber?.toLowerCase().includes(s) ||
      a.townSurveyNumber?.toLowerCase().includes(s) ||
      a.villageRevenueWard?.toLowerCase().includes(s) ||
      a.meeBhoomiClassification?.toLowerCase().includes(s)
    );
  }

  return list;
};

// @desc Get all Guntur Land & Infrastructure Records from Mee Bhoomi
exports.getAllLandAssets = async (req, res) => {
  try {
    const { type, ward, surveyNumber, search } = req.query;
    const assets = await getAssetsData({ type, ward, surveyNumber, search });

    // Aggregate statistics
    const totalSqFt = assets.reduce((sum, a) => sum + (Number(a.extentSqFt) || 0), 0);
    const totalAcres = assets.reduce((sum, a) => sum + (Number(a.extentAcres) || 0), 0);

    return res.json({
      success: true,
      count: assets.length,
      source: isSupabaseActive() ? 'SUPABASE_POSTGRESQL' : 'MEE_BHOOMI_LOCAL_STORE',
      district: 'Guntur (Andhra Pradesh)',
      summary: {
        totalAssets: assets.length,
        totalExtentSqFt: totalSqFt,
        totalExtentAcres: Number(totalAcres.toFixed(2)),
        categoriesCount: {
          roads: assets.filter(a => a.infrastructureType === 'ROAD').length,
          bridges: assets.filter(a => a.infrastructureType === 'BRIDGE').length,
          drainage: assets.filter(a => a.infrastructureType === 'DRAINAGE').length,
          publicLand: assets.filter(a => a.infrastructureType === 'PUBLIC_LAND').length
        }
      },
      data: assets
    });
  } catch (err) {
    console.error('Error retrieving land assets:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve land assets' });
  }
};

// @desc Get specific Land Asset by Survey Number
exports.getLandAssetBySurveyNumber = async (req, res) => {
  try {
    const { surveyNumber } = req.params;
    const assets = await getAssetsData();
    const found = assets.find(
      a =>
        a.surveyNumber?.toLowerCase() === surveyNumber.toLowerCase() ||
        a.townSurveyNumber?.toLowerCase() === surveyNumber.toLowerCase()
    );

    if (!found) {
      return res.status(404).json({
        success: false,
        message: `No Mee Bhoomi record found for Survey Number "${surveyNumber}" in Guntur.`
      });
    }

    return res.json({
      success: true,
      source: isSupabaseActive() ? 'SUPABASE_POSTGRESQL' : 'MEE_BHOOMI_LOCAL_STORE',
      data: found
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving survey record' });
  }
};

// @desc Get Summary Aggregates by Infrastructure Category
exports.getCategoryStats = async (req, res) => {
  try {
    const assets = await getAssetsData();
    const categories = ['ROAD', 'BRIDGE', 'DRAINAGE', 'PUBLIC_LAND'];

    const breakdown = categories.map(cat => {
      const filtered = assets.filter(a => a.infrastructureType === cat);
      const sqFt = filtered.reduce((sum, a) => sum + (Number(a.extentSqFt) || 0), 0);
      const acres = filtered.reduce((sum, a) => sum + (Number(a.extentAcres) || 0), 0);
      const avgPci = filtered.length > 0
        ? Math.round(filtered.reduce((sum, a) => sum + (a.pavementConditionIndex || 50), 0) / filtered.length)
        : 0;

      return {
        category: cat,
        count: filtered.length,
        totalExtentSqFt: sqFt,
        totalExtentAcres: Number(acres.toFixed(2)),
        averageConditionIndex: avgPci
      };
    });

    return res.json({
      success: true,
      data: breakdown
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error computing category statistics' });
  }
};

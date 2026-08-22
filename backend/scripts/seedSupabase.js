/**
 * 🏛️ Mee Bhoomi Guntur Real Records Seeder for Supabase
 * Usage: node backend/scripts/seedSupabase.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

async function seedMeeBhoomiToSupabase() {
  console.log('================================================================================');
  console.log('🏛️  MEE BHOOMI AP — GUNTUR LAND & INFRASTRUCTURE SUPABASE SEEDER');
  console.log('================================================================================\n');

  if (!supabaseUrl || !supabaseKey) {
    console.log('⚠️  SUPABASE_URL or SUPABASE_KEY is missing in your environment.');
    console.log('   Please set SUPABASE_URL and SUPABASE_KEY in backend/.env to push directly to live Supabase.');
    console.log('   Alternatively, copy and run the SQL migration in:');
    console.log(`   👉 ${path.resolve(__dirname, '..', '..', 'database', 'supabase_schema.sql')}\n`);
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  console.log(`🔗 Connecting to Supabase Project: ${supabaseUrl}...`);

  const dataPath = path.join(__dirname, '..', '..', 'database', 'meeBhoomiData.json');
  const records = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  console.log(`📦 Loaded ${records.length} real Mee Bhoomi records from local dataset.`);

  // Transform records to PostgreSQL snake_case column names
  const dbRows = records.map(r => ({
    survey_number: r.surveyNumber,
    town_survey_number: r.townSurveyNumber,
    khata_number: r.khataNumber,
    mandal: r.mandal,
    village_revenue_ward: r.villageRevenueWard,
    ward_number: r.wardNumber,
    asset_name: r.assetName,
    infrastructure_type: r.infrastructureType,
    mee_bhoomi_classification: r.meeBhoomiClassification,
    extent_acres: r.extentAcres,
    extent_cents: r.extentCents,
    extent_sq_ft: r.extentSqFt,
    plot_dimensions: r.plotDimensions,
    carriageway_width_meters: r.carriagewayWidthMeters,
    latitude: r.latitude,
    longitude: r.longitude,
    custodian_department: r.custodianDepartment,
    pavement_condition_index: r.pavementConditionIndex,
    encroachment_status: r.encroachmentStatus,
    last_revenue_audit_year: r.lastRevenueAuditYear || 2025,
    raw_adangal_json: r.rawAdangal || {}
  }));

  console.log('🚀 Upserting records into table "public.guntur_land_assets"...');

  const { data, error } = await supabase
    .from('guntur_land_assets')
    .upsert(dbRows, { onConflict: 'survey_number' });

  if (error) {
    console.error('❌ Supabase Insertion Error:', error.message);
    console.log('\n💡 Tip: Make sure you have executed the schema migration script in Supabase SQL Editor:');
    console.log(`   ${path.resolve(__dirname, '..', '..', 'database', 'supabase_schema.sql')}`);
  } else {
    console.log('✅ Successfully seeded all Mee Bhoomi Guntur records into Supabase!');
    console.log(`   Total Records Active: ${records.length}`);
    console.log('   Categories: ROADS, BRIDGES, DRAINAGE, PUBLIC UTILITY LAND');
  }
}

if (require.main === module) {
  seedMeeBhoomiToSupabase().catch(console.error);
}

module.exports = { seedMeeBhoomiToSupabase };

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || '';

let supabase = null;
let isSupabaseActive = false;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    isSupabaseActive = true;
    console.log(`[Supabase] Initialized client for ${supabaseUrl}`);
  } catch (err) {
    console.error('[Supabase] Initialization error:', err.message);
    supabase = null;
    isSupabaseActive = false;
  }
} else {
  console.log('[Supabase] No SUPABASE_URL / SUPABASE_KEY set in environment. Running with local Mee Bhoomi JSON store.');
}

// Fallback local dataset loader
const loadLocalMeeBhoomiData = () => {
  try {
    const dataPath = path.join(__dirname, '..', '..', 'database', 'meeBhoomiData.json');
    if (fs.existsSync(dataPath)) {
      return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    }
  } catch (err) {
    console.error('[Mee Bhoomi] Error reading local data:', err.message);
  }
  return [];
};

module.exports = {
  supabase,
  isSupabaseActive: () => isSupabaseActive,
  loadLocalMeeBhoomiData
};

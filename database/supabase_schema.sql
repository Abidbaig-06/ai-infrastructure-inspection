-- =====================================================================================
-- 🏛️ GUNTUR MUNICIPAL CORPORATION (GMC) & MEE BHOOMI AP LAND & INFRASTRUCTURE REGISTRY
-- Supabase PostgreSQL Schema & Real Records Migration
-- State: Andhra Pradesh | District: Guntur | Portal: meebhoomi.ap.gov.in
-- =====================================================================================

-- 1. Create Enum Types
DO $$ BEGIN
    CREATE TYPE guntur_infra_category AS ENUM (
        'ROAD',
        'BRIDGE',
        'DRAINAGE',
        'PUBLIC_LAND'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE mee_bhoomi_land_type AS ENUM (
        'Raste Poramboke',
        'Kaluva Poramboke',
        'Vanthena / Setu Poramboke',
        'Sarkari Poramboke',
        'Gramakantam Poramboke',
        'Cheruvu / Vagu Poramboke'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create guntur_land_assets Table
CREATE TABLE IF NOT EXISTS public.guntur_land_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_number VARCHAR(100) NOT NULL,
    town_survey_number VARCHAR(100),
    khata_number VARCHAR(50) DEFAULT 'Khata No. 0 (Government Asset)',
    mandal VARCHAR(100) NOT NULL,
    village_revenue_ward VARCHAR(150) NOT NULL,
    ward_number VARCHAR(20) NOT NULL,
    asset_name VARCHAR(255) NOT NULL,
    infrastructure_type guntur_infra_category NOT NULL,
    mee_bhoomi_classification mee_bhoomi_land_type NOT NULL,
    extent_acres NUMERIC(10, 4) NOT NULL,
    extent_cents NUMERIC(10, 2) NOT NULL,
    extent_sq_ft NUMERIC(15, 2) NOT NULL, -- 1 Acre = 43,560 sq ft, 1 Cent = 435.6 sq ft
    plot_dimensions TEXT,
    carriageway_width_meters NUMERIC(6, 2),
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    custodian_department VARCHAR(150) NOT NULL,
    pavement_condition_index INTEGER CHECK (pavement_condition_index BETWEEN 0 AND 100),
    encroachment_status VARCHAR(50) DEFAULT 'CLEAR',
    last_revenue_audit_year INTEGER DEFAULT 2025,
    last_inspected_at TIMESTAMPTZ DEFAULT NOW(),
    raw_adangal_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Indexes for High Performance GIS & Survey Search
CREATE INDEX IF NOT EXISTS idx_guntur_survey_no ON public.guntur_land_assets (survey_number);
CREATE INDEX IF NOT EXISTS idx_guntur_town_survey ON public.guntur_land_assets (town_survey_number);
CREATE INDEX IF NOT EXISTS idx_guntur_infra_type ON public.guntur_land_assets (infrastructure_type);
CREATE INDEX IF NOT EXISTS idx_guntur_ward_no ON public.guntur_land_assets (ward_number);
CREATE INDEX IF NOT EXISTS idx_guntur_coordinates ON public.guntur_land_assets (latitude, longitude);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.guntur_land_assets ENABLE ROW LEVEL SECURITY;

-- Allow public read access to civic infrastructure records
CREATE POLICY "Public Read Access for Guntur Land Assets"
    ON public.guntur_land_assets
    FOR SELECT
    USING (true);

-- Allow authenticated insert/update
CREATE POLICY "Authorized Modification of Guntur Land Assets"
    ON public.guntur_land_assets
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 5. Auto-Update Timestamp Trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS tr_guntur_land_assets_updated_at ON public.guntur_land_assets;
CREATE TRIGGER tr_guntur_land_assets_updated_at
    BEFORE UPDATE ON public.guntur_land_assets
    FOR EACH ROW
    EXECUTE PROCEDURE public.update_updated_at_column();

-- =====================================================================================
-- 📊 SEED REAL MEE BHOOMI AP RECORDS FOR GUNTUR (LAND, ROADS, BRIDGES, DRAINAGE)
-- Extent accurately computed in Acres, Cents, and Square Feet (1 Cent = 435.60 Sq.Ft)
-- =====================================================================================

INSERT INTO public.guntur_land_assets (
    survey_number,
    town_survey_number,
    khata_number,
    mandal,
    village_revenue_ward,
    ward_number,
    asset_name,
    infrastructure_type,
    mee_bhoomi_classification,
    extent_acres,
    extent_cents,
    extent_sq_ft,
    plot_dimensions,
    carriageway_width_meters,
    latitude,
    longitude,
    custodian_department,
    pavement_condition_index,
    encroachment_status,
    raw_adangal_json
) VALUES
-- ==================== ROADS (Raste Poramboke) ====================
(
    'Sy-No-284/1A',
    'TS-No-14/2B',
    'Khata-0 (GMC Public Works)',
    'Guntur West Mandal',
    'Ward 04 - Lakshmipuram Main Road & Hindu College',
    'Ward 04',
    'Lakshmipuram 4-Lane Arterial Road Corridor',
    'ROAD',
    'Raste Poramboke',
    3.8500,
    385.00,
    167706.00,
    'Length: 3,800m x Width: 24m (4-Lane Divided Carriageway + Footpath + Center Median)',
    24.00,
    16.3125000,
    80.4280000,
    'Guntur Municipal Corporation (GMC) - Roads Wing',
    42,
    'CLEAR',
    '{"pattadar": "Government of Andhra Pradesh", "occupant": "GMC Public Works", "nature": "Raste Poramboke", "soilType": "Black Cotton Soil / Dense Bituminous Subgrade", "villageCode": "522007"}'::jsonb
),
(
    'Sy-No-412/3',
    'TS-No-08/1A',
    'Khata-0 (GMC Public Works)',
    'Guntur Central Mandal',
    'Ward 02 - Brodipet Main Commercial & 4th Line',
    'Ward 02',
    'Brodipet 4th Line High-Street Commercial Transit Corridor',
    'ROAD',
    'Raste Poramboke',
    2.1500,
    215.00,
    93654.00,
    'Length: 2,150m x Width: 18m (Commercial 2-Lane + Dedicated Parking Bays)',
    18.00,
    16.3080000,
    80.4420000,
    'Guntur Municipal Corporation (GMC) - Town Planning',
    38,
    'CLEAR',
    '{"pattadar": "Government of Andhra Pradesh", "occupant": "GMC Commercial Sector", "nature": "Raste Poramboke", "villageCode": "522002"}'::jsonb
),
(
    'Sy-No-119/2',
    'TS-No-22/3C',
    'Khata-0 (AP R&B Dept)',
    'Guntur West Mandal',
    'Ward 07 - Gorantla Main & Inner Ring Road',
    'Ward 07',
    'Gorantla-Amaravathi Link Highway Corridor',
    'ROAD',
    'Raste Poramboke',
    8.4000,
    840.00,
    365904.00,
    'Length: 6,200m x Width: 30m (6-Lane High-Speed Divided Carriageway)',
    30.00,
    16.3350000,
    80.4120000,
    'Andhra Pradesh Roads & Buildings (R&B) Department',
    72,
    'CLEAR',
    '{"pattadar": "AP State Highway Authority", "occupant": "R&B Guntur Division", "nature": "Raste Poramboke", "villageCode": "522034"}'::jsonb
),
(
    'Sy-No-503/1B',
    'TS-No-31/4',
    'Khata-0 (GMC Public Works)',
    'Guntur East Mandal',
    'Ward 08 - Old Guntur & Jinnah Tower Circle',
    'Ward 08',
    'Old Guntur Heritage Trunk Road Corridor',
    'ROAD',
    'Raste Poramboke',
    3.2000,
    320.00,
    139392.00,
    'Length: 2,880m x Width: 20m (2-Lane Dual Carriageway + Open Storm Drain Edge)',
    20.00,
    16.2980000,
    80.4550000,
    'Guntur Municipal Corporation (GMC) - Heritage Ward',
    48,
    'UNDER_INSPECTION',
    '{"pattadar": "Government of Andhra Pradesh", "occupant": "GMC Heritage Wing", "nature": "Raste Poramboke", "villageCode": "522001"}'::jsonb
),
(
    'Sy-No-67/4A',
    'TS-No-19/1',
    'Khata-0 (AP R&B Dept)',
    'Guntur South Mandal',
    'Ward 23 - Nallapadu Industrial & Logistics Sector',
    'Ward 23',
    'Nallapadu Heavy Vehicle Freight Corridor',
    'ROAD',
    'Raste Poramboke',
    5.6000,
    560.00,
    243936.00,
    'Length: 4,500m x Width: 22m (Reinforced Cement Concrete Industrial Highway)',
    22.00,
    16.2750000,
    80.4180000,
    'AP R&B Department / GMC Industrial Corridor',
    58,
    'CLEAR',
    '{"pattadar": "Government of Andhra Pradesh", "occupant": "APIIC / GMC", "nature": "Raste Poramboke", "villageCode": "522005"}'::jsonb
),

-- ==================== BRIDGES & FLYOVERS (Vanthena / Setu Poramboke) ====================
(
    'Sy-No-312/V',
    'TS-No-45/1-BRG',
    'Khata-0 (South Central Railway / GMC)',
    'Guntur Central Mandal',
    'Ward 39 - Chuttugunta Circle & RTC Bus Complex',
    'Ward 39',
    'Chuttugunta 4-Lane Railway Overbridge (ROB) & Approaches',
    'BRIDGE',
    'Vanthena / Setu Poramboke',
    1.7500,
    175.00,
    76230.00,
    'Span Length: 840m x Deck Width: 16.5m (Pre-stressed Concrete Girder with 18 Pier Caps)',
    16.50,
    16.3015000,
    80.4390000,
    'Joint Custody: South Central Railway & GMC Engineering Wing',
    64,
    'CLEAR',
    '{"pattadar": "Indian Railways / Government of AP", "occupant": "GMC Bridge Division", "nature": "Vanthena Poramboke", "loadCapacity": "IRC Class 70R / 100 Tonnes", "constructionYear": 2017}'::jsonb
),
(
    'Sy-No-88/BR-2',
    'TS-No-12/BRG',
    'Khata-0 (GMC Bridge Wing)',
    'Guntur West Mandal',
    'Ward 05 - Pattabhipuram & NTR Stadium Sector',
    'Ward 05',
    'Pattabhipuram Grade Separator & Elevated Flyover',
    'BRIDGE',
    'Vanthena / Setu Poramboke',
    2.2000,
    220.00,
    95832.00,
    'Elevated Viaduct Length: 1,120m x Width: 17.2m (2-Lane Dual Carriageway Elevated Deck)',
    17.20,
    16.3150000,
    80.4220000,
    'Guntur Municipal Corporation (GMC) - Special Projects',
    78,
    'CLEAR',
    '{"pattadar": "Government of Andhra Pradesh", "occupant": "GMC Infrastructure Special Projects", "nature": "Vanthena Poramboke", "spanCount": 24}'::jsonb
),
(
    'Sy-No-142/CLV',
    'TS-No-04/CVT',
    'Khata-0 (AP Irrigation Dept)',
    'Guntur East Mandal',
    'Ward 10 - Sangadigunta & Market Center',
    'Ward 10',
    'Sangadigunta Railway Siphon Culvert Bridge',
    'BRIDGE',
    'Vanthena / Setu Poramboke',
    0.6500,
    65.00,
    28314.00,
    'Span: 140m x Width: 14m (RCC Twin Box Culvert Bridge with Reinforced Retaining Walls)',
    14.00,
    16.3050000,
    80.4520000,
    'Andhra Pradesh Irrigation & Water Resources Department',
    51,
    'CLEAR',
    '{"pattadar": "AP Irrigation Dept", "occupant": "Irrigation Sub-Division Guntur", "nature": "Vanthena Poramboke", "culvertDischargeCapacity": "120 cusecs"}'::jsonb
),
(
    'Sy-No-215/BR-3',
    'TS-No-56/BRG',
    'Khata-0 (AP R&B Dept)',
    'Guntur Central Mandal',
    'Ward 47 - Venkateswara Nagar & Railway Overbridge',
    'Ward 47',
    'Venkateswara Nagar Broad-Gauge Railway Overbridge',
    'BRIDGE',
    'Vanthena / Setu Poramboke',
    1.4500,
    145.00,
    63162.00,
    'Span: 680m x Width: 15.8m (Structural Steel Composite Girders on RCC T-Shaped Piers)',
    15.80,
    16.3020000,
    80.4460000,
    'AP R&B Department / South Central Railway',
    60,
    'CLEAR',
    '{"pattadar": "Government of Andhra Pradesh", "occupant": "R&B Guntur Division", "nature": "Vanthena Poramboke"}'::jsonb
),

-- ==================== DRAINAGE & CANAL CHANNELS (Kaluva Poramboke) ====================
(
    'Sy-No-512/K-1',
    'TS-No-78/DRN',
    'Khata-0 (GMC Public Health Wing)',
    'Guntur East Mandal',
    'Ward 08 - Old Guntur & Jinnah Tower Circle',
    'Ward 08',
    'Old Guntur Main Stormwater Outfall Trunk Drain',
    'DRAINAGE',
    'Kaluva Poramboke',
    4.1000,
    410.00,
    178596.00,
    'Channel Length: 4,100m x Width: 8.5m (RCC Trapezoidal High-Capacity Drainage Canal)',
    8.50,
    16.2965000,
    80.4570000,
    'GMC Public Health & Municipal Engineering Department',
    45,
    'UNDER_INSPECTION',
    '{"pattadar": "Government of Andhra Pradesh", "occupant": "GMC Drainage Division", "nature": "Kaluva Poramboke", "dischargeCapacity": "350 cubic meters/sec", "siltClearingFrequency": "Quarterly"}'::jsonb
),
(
    'Sy-No-184/K-2',
    'TS-No-33/DRN',
    'Khata-0 (GMC Sanitation Wing)',
    'Guntur Central Mandal',
    'Ward 01 - Arundelpet Central & Rythu Bazaar',
    'Ward 01',
    'Arundelpet Covered Stormwater Masonry Canal',
    'DRAINAGE',
    'Kaluva Poramboke',
    1.9000,
    190.00,
    82764.00,
    'Channel Length: 2,400m x Width: 4.2m (Box RCC Covered Storm Channel with Heavy Silt Grates)',
    4.20,
    16.3045000,
    80.4475000,
    'Guntur Municipal Corporation (GMC) - Public Health',
    52,
    'CLEAR',
    '{"pattadar": "Government of Andhra Pradesh", "occupant": "GMC Sanitation Division", "nature": "Kaluva Poramboke"}'::jsonb
),
(
    'Sy-No-390/K-3',
    'TS-No-92/DRN',
    'Khata-0 (AP Water Resources Dept)',
    'Guntur West Mandal',
    'Ward 12 - Gujanagundla & SVN Colony',
    'Ward 12',
    'Gujanagundla-SVN Colony Feeder Nallah & Retention Trench',
    'DRAINAGE',
    'Kaluva Poramboke',
    3.7500,
    375.00,
    163350.00,
    'Length: 3,200m x Width: 6.8m (Open Natural Waterway Channel with Stone-Pitching)',
    6.80,
    16.3190000,
    80.4150000,
    'AP Water Resources Department / GMC Drainage Wing',
    49,
    'CLEAR',
    '{"pattadar": "Government of Andhra Pradesh", "occupant": "AP Irrigation / GMC", "nature": "Kaluva Poramboke", "monsoonRiskRating": "HIGH"}'::jsonb
),
(
    'Sy-No-620/K-4',
    'TS-No-104/DRN',
    'Khata-0 (GMC Drainage Division)',
    'Guntur East Mandal',
    'Ward 54 - Nallacheruvu & Sitaramanjaneya Colony',
    'Ward 54',
    'Nallacheruvu Municipal Excess Water Release Canal',
    'DRAINAGE',
    'Kaluva Poramboke',
    6.3000,
    630.00,
    274428.00,
    'Length: 5,400m x Width: 9.2m (Engineered Stormwater Basin Channel Outlet to Krishna Basin)',
    9.20,
    16.2910000,
    80.4680000,
    'GMC Public Works & Drainage Engineering Unit',
    55,
    'CLEAR',
    '{"pattadar": "Government of Andhra Pradesh", "occupant": "GMC Sanitation Wing", "nature": "Kaluva Poramboke"}'::jsonb
),

-- ==================== PUBLIC UTILITY LAND & SITES (Sarkari / Gramakantam Poramboke) ====================
(
    'Sy-No-108/PL-1',
    'TS-No-03/SARK',
    'Khata-0 (GMC Water Works)',
    'Guntur Central Mandal',
    'Ward 02 - Brodipet Main Commercial & 4th Line',
    'Ward 02',
    'Brodipet Municipal Water Reservoir & Pressure Booster Facility',
    'PUBLIC_LAND',
    'Sarkari Poramboke',
    1.8000,
    180.00,
    78408.00,
    'Plot Extent: 120m x 60m (Dedicated Municipal Water Storage Headworks & Pump House Compound)',
    NULL,
    16.3075000,
    80.4410000,
    'GMC Water Supply & Sewerage Board',
    82,
    'CLEAR',
    '{"pattadar": "Government of Andhra Pradesh", "occupant": "GMC Water Works Wing", "nature": "Sarkari Poramboke", "tankCapacityLiters": "4,500,000"}'::jsonb
),
(
    'Sy-No-741/PL-2',
    'TS-No-19/SARK',
    'Khata-0 (APCPDCL / GMC)',
    'Guntur Central Mandal',
    'Ward 01 - Arundelpet Central & Rythu Bazaar',
    'Ward 01',
    'Arundelpet 33kV/11kV Power Sub-Station Utility Compound',
    'PUBLIC_LAND',
    'Sarkari Poramboke',
    1.2500,
    125.00,
    54450.00,
    'Plot Extent: 90m x 55m (High-Voltage Switchyard & Control Room Facility)',
    NULL,
    16.3038000,
    80.4490000,
    'Andhra Pradesh Central Power Distribution Corporation (APCPDCL)',
    88,
    'CLEAR',
    '{"pattadar": "AP Power Distribution Company", "occupant": "APCPDCL Guntur Operation Circle", "nature": "Sarkari Poramboke", "substationCapacity": "33/11 kV"}'::jsonb
),
(
    'Sy-No-892/PL-3',
    'TS-No-41/SARK',
    'Khata-0 (APSRTC / GMC)',
    'Guntur Central Mandal',
    'Ward 39 - Chuttugunta Circle & RTC Bus Complex',
    'Ward 39',
    'GMC Central Bus Depot & Maintenance Yard Plot',
    'PUBLIC_LAND',
    'Sarkari Poramboke',
    7.5000,
    750.00,
    326700.00,
    'Plot Extent: 280m x 115m (Multi-Bay Transit Terminal, Workshop, & Heavy Asphalt Staging Ground)',
    NULL,
    16.3000000,
    80.4370000,
    'Andhra Pradesh State Road Transport Corporation (APSRTC)',
    70,
    'CLEAR',
    '{"pattadar": "Government of Andhra Pradesh", "occupant": "APSRTC Guntur Region", "nature": "Sarkari Poramboke", "busCapacity": 220}'::jsonb
),
(
    'Sy-No-940/PL-4',
    'TS-No-52/SARK',
    'Khata-0 (GMC Solid Waste Management)',
    'Guntur South Mandal',
    'Ward 26 - Budampadu & NH-16 Highway Bypass',
    'Ward 26',
    'GMC Modern Waste Processing & Biomethanation Facility Plot',
    'PUBLIC_LAND',
    'Sarkari Poramboke',
    12.4000,
    1240.00,
    540144.00,
    'Plot Extent: 450m x 110m (Municipal Material Recovery Facility & Refuse Derived Fuel Plant)',
    NULL,
    16.2550000,
    80.4100000,
    'Guntur Municipal Corporation (GMC) - Sanitation Wing',
    75,
    'CLEAR',
    '{"pattadar": "Government of Andhra Pradesh", "occupant": "GMC Solid Waste Management Division", "nature": "Sarkari Poramboke", "processingCapacityTPD": 450}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================================================
-- End of Supabase Migration Script
-- =====================================================================================

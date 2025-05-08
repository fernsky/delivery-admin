-- Creating the ward wise household possessions table
CREATE TABLE IF NOT EXISTS ward_wise_household_possessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_id TEXT NOT NULL,
    ward_number INTEGER,
    households INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Creating the ACME table version for fallback data
CREATE TABLE IF NOT EXISTS acme_ward_wise_household_land_possessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_number INTEGER NOT NULL,
    households INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ward_wise_household_possessions_ward_id ON ward_wise_household_possessions(ward_id);
CREATE INDEX IF NOT EXISTS idx_ward_wise_household_possessions_ward_number ON ward_wise_household_possessions(ward_number);
CREATE INDEX IF NOT EXISTS idx_acme_ward_wise_household_land_possessions_ward_number ON acme_ward_wise_household_land_possessions(ward_number);

-- DUMMY DATA SECTION BEGINS
-- Insert dummy data for main table
INSERT INTO ward_wise_household_possessions (id, ward_id, ward_number, households)
VALUES
  (gen_random_uuid(), 'ward-123', 1, 250),
  (gen_random_uuid(), 'ward-124', 2, 320),
  (gen_random_uuid(), 'ward-125', 3, 180),
  (gen_random_uuid(), 'ward-126', 4, 420),
  (gen_random_uuid(), 'ward-127', 5, 290);

-- Insert dummy data for ACME table (fallback data)
INSERT INTO acme_ward_wise_household_land_possessions (id, ward_number, households)
VALUES
  (gen_random_uuid(), 1, 230),
  (gen_random_uuid(), 2, 310),
  (gen_random_uuid(), 3, 175),
  (gen_random_uuid(), 4, 400);
-- DUMMY DATA SECTION ENDS

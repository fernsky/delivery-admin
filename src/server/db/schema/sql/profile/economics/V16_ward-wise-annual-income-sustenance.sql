-- Creating the months_sustained enum type
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'months_sustained') THEN
        CREATE TYPE months_sustained AS ENUM (
            'UPTO_THREE_MONTHS',    -- Up to 3 months of sustenance (३ महिना सम्म)
            'THREE_TO_SIX_MONTHS',  -- 3-6 months of sustenance (३ देखि ६ महिना)
            'SIX_TO_NINE_MONTHS',   -- 6-9 months of sustenance (६ देखि ९ महिना)
            'TWELVE_MONTHS'         -- Year-round sustenance (बर्षैभरी)
        );
    END IF;
END $$;

-- Creating the ward-wise-annual-income-sustenance table
CREATE TABLE IF NOT EXISTS ward_wise_annual_income_sustenance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_id TEXT NOT NULL,
    ward_number INTEGER,
    months_sustained months_sustained NOT NULL,
    households INTEGER NOT NULL DEFAULT 0 CHECK (households >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Creating the ACME table version for fallback data
CREATE TABLE IF NOT EXISTS acme_ward_wise_annual_income_sustenance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_number INTEGER NOT NULL,
    months_sustained months_sustained NOT NULL,
    households INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ward_wise_annual_income_sustenance_ward_id ON ward_wise_annual_income_sustenance(ward_id);
CREATE INDEX IF NOT EXISTS idx_ward_wise_annual_income_sustenance_months_sustained ON ward_wise_annual_income_sustenance(months_sustained);
CREATE INDEX IF NOT EXISTS idx_acme_ward_wise_annual_income_sustenance_ward_number ON acme_ward_wise_annual_income_sustenance(ward_number);

-- DUMMY DATA SECTION BEGINS
-- Insert dummy data for main table
INSERT INTO ward_wise_annual_income_sustenance (id, ward_id, ward_number, months_sustained, households)
VALUES
  -- Ward 1 dummy data
  ('a1111111-1111-1111-1111-111111111111', '1', 1, 'UPTO_THREE_MONTHS', 120),
  ('a2222222-2222-2222-2222-222222222222', '1', 1, 'THREE_TO_SIX_MONTHS', 85),
  ('a3333333-3333-3333-3333-333333333333', '1', 1, 'SIX_TO_NINE_MONTHS', 65),
  ('a4444444-4444-4444-4444-444444444444', '1', 1, 'TWELVE_MONTHS', 95),
  
  -- Ward 2 dummy data
  ('b1111111-1111-1111-1111-111111111111', '2', 2, 'UPTO_THREE_MONTHS', 130),
  ('b2222222-2222-2222-2222-222222222222', '2', 2, 'THREE_TO_SIX_MONTHS', 90),
  ('b3333333-3333-3333-3333-333333333333', '2', 2, 'SIX_TO_NINE_MONTHS', 75),
  ('b4444444-4444-4444-4444-444444444444', '2', 2, 'TWELVE_MONTHS', 100),
  
  -- Ward 3 dummy data
  ('c1111111-1111-1111-1111-111111111111', '3', 3, 'UPTO_THREE_MONTHS', 110),
  ('c2222222-2222-2222-2222-222222222222', '3', 3, 'THREE_TO_SIX_MONTHS', 95),
  ('c3333333-3333-3333-3333-333333333333', '3', 3, 'SIX_TO_NINE_MONTHS', 70),
  ('c4444444-4444-4444-4444-444444444444', '3', 3, 'TWELVE_MONTHS', 105);

-- Insert dummy data for ACME table (fallback data)
INSERT INTO acme_ward_wise_annual_income_sustenance (ward_number, months_sustained, households)
VALUES
  -- Ward 4 dummy data (only in ACME table for testing fallback)
  (4, 'UPTO_THREE_MONTHS', 125),
  (4, 'THREE_TO_SIX_MONTHS', 80),
  (4, 'SIX_TO_NINE_MONTHS', 60),
  (4, 'TWELVE_MONTHS', 90);
-- DUMMY DATA SECTION ENDS

-- Creating the ward-wise-household-income-source table
CREATE TABLE IF NOT EXISTS ward_wise_household_income_source (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_id TEXT NOT NULL,
    ward_number INTEGER,
    income_source TEXT NOT NULL CHECK (income_source IN (
        'JOB', 
        'AGRICULTURE', 
        'BUSINESS', 
        'INDUSTRY', 
        'FOREIGN_EMPLOYMENT', 
        'LABOUR', 
        'OTHER'
    )),
    households INTEGER NOT NULL DEFAULT 0 CHECK (households >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Creating the ACME table version if needed for fallback data
CREATE TABLE IF NOT EXISTS acme_ward_wise_household_income_source (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_number INTEGER NOT NULL,
    income_source TEXT NOT NULL,
    households INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ward_wise_household_income_source_ward_id ON ward_wise_household_income_source(ward_id);
CREATE INDEX IF NOT EXISTS idx_ward_wise_household_income_source_income_source ON ward_wise_household_income_source(income_source);
CREATE INDEX IF NOT EXISTS idx_acme_ward_wise_household_income_source_ward_number ON acme_ward_wise_household_income_source(ward_number);

-- DUMMY DATA SECTION BEGINS
-- Insert dummy data for main table
INSERT INTO ward_wise_household_income_source (id, ward_id, ward_number, income_source, households)
VALUES
  -- Ward 1 dummy data
  ('e1111111-1111-1111-1111-111111111111', '1', 1, 'JOB', 145),
  ('e2222222-2222-2222-2222-222222222222', '1', 1, 'AGRICULTURE', 275),
  ('e3333333-3333-3333-3333-333333333333', '1', 1, 'BUSINESS', 120),
  ('e4444444-4444-4444-4444-444444444444', '1', 1, 'INDUSTRY', 65),
  ('e5555555-5555-5555-5555-555555555555', '1', 1, 'FOREIGN_EMPLOYMENT', 85),
  ('e6666666-6666-6666-6666-666666666666', '1', 1, 'LABOUR', 110),
  ('e7777777-7777-7777-7777-777777777777', '1', 1, 'OTHER', 35),
  
  -- Ward 2 dummy data
  ('f1111111-1111-1111-1111-111111111111', '2', 2, 'JOB', 155),
  ('f2222222-2222-2222-2222-222222222222', '2', 2, 'AGRICULTURE', 240),
  ('f3333333-3333-3333-3333-333333333333', '2', 2, 'BUSINESS', 135),
  ('f4444444-4444-4444-4444-444444444444', '2', 2, 'INDUSTRY', 75),
  ('f5555555-5555-5555-5555-555555555555', '2', 2, 'FOREIGN_EMPLOYMENT', 95),
  ('f6666666-6666-6666-6666-666666666666', '2', 2, 'LABOUR', 100),
  ('f7777777-7777-7777-7777-777777777777', '2', 2, 'OTHER', 45),
  
  -- Ward 3 dummy data
  ('g1111111-1111-1111-1111-111111111111', '3', 3, 'JOB', 135),
  ('g2222222-2222-2222-2222-222222222222', '3', 3, 'AGRICULTURE', 290),
  ('g3333333-3333-3333-3333-333333333333', '3', 3, 'BUSINESS', 115),
  ('g4444444-4444-4444-4444-444444444444', '3', 3, 'INDUSTRY', 55),
  ('g5555555-5555-5555-5555-555555555555', '3', 3, 'FOREIGN_EMPLOYMENT', 80),
  ('g6666666-6666-6666-6666-666666666666', '3', 3, 'LABOUR', 105),
  ('g7777777-7777-7777-7777-777777777777', '3', 3, 'OTHER', 30);

-- Insert dummy data for ACME table (fallback data)
INSERT INTO acme_ward_wise_household_income_source (ward_number, income_source, households)
VALUES
  -- Ward 4 dummy data (only in ACME table for testing fallback)
  (4, 'JOB', 140),
  (4, 'AGRICULTURE', 260),
  (4, 'BUSINESS', 125),
  (4, 'INDUSTRY', 60),
  (4, 'FOREIGN_EMPLOYMENT', 90),
  (4, 'LABOUR', 115),
  (4, 'OTHER', 40);
-- DUMMY DATA SECTION ENDS

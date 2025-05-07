-- Creating the ward-time-wise-household-chores table
CREATE TABLE IF NOT EXISTS ward_time_wise_household_chores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_id TEXT NOT NULL,
    ward_number INTEGER,
    time_spent TEXT NOT NULL CHECK (time_spent IN (
        'LESS_THAN_1_HOUR', 
        'HOURS_1_TO_3', 
        'HOURS_4_TO_6', 
        'HOURS_7_TO_9', 
        'HOURS_10_TO_12', 
        'MORE_THAN_12_HOURS'
    )),
    population INTEGER NOT NULL DEFAULT 0 CHECK (population >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Creating the ACME table version if needed for fallback data
CREATE TABLE IF NOT EXISTS acme_ward_time_wise_household_chores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_number INTEGER NOT NULL,
    time_spent TEXT NOT NULL,
    population INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ward_time_wise_household_chores_ward_id ON ward_time_wise_household_chores(ward_id);
CREATE INDEX IF NOT EXISTS idx_ward_time_wise_household_chores_time_spent ON ward_time_wise_household_chores(time_spent);
CREATE INDEX IF NOT EXISTS idx_acme_ward_time_wise_household_chores_ward_number ON acme_ward_time_wise_household_chores(ward_number);

-- DUMMY DATA SECTION BEGINS
-- Insert dummy data for main table
INSERT INTO ward_time_wise_household_chores (id, ward_id, ward_number, time_spent, population)
VALUES
  -- Ward 1 dummy data
  ('a1111111-1111-1111-1111-111111111111', '1', 1, 'LESS_THAN_1_HOUR', 180),
  ('a2222222-2222-2222-2222-222222222222', '1', 1, 'HOURS_1_TO_3', 320),
  ('a3333333-3333-3333-3333-333333333333', '1', 1, 'HOURS_4_TO_6', 250),
  ('a4444444-4444-4444-4444-444444444444', '1', 1, 'HOURS_7_TO_9', 150),
  ('a5555555-5555-5555-5555-555555555555', '1', 1, 'HOURS_10_TO_12', 90),
  ('a6666666-6666-6666-6666-666666666666', '1', 1, 'MORE_THAN_12_HOURS', 45),
  
  -- Ward 2 dummy data
  ('b1111111-1111-1111-1111-111111111111', '2', 2, 'LESS_THAN_1_HOUR', 210),
  ('b2222222-2222-2222-2222-222222222222', '2', 2, 'HOURS_1_TO_3', 340),
  ('b3333333-3333-3333-3333-333333333333', '2', 2, 'HOURS_4_TO_6', 275),
  ('b4444444-4444-4444-4444-444444444444', '2', 2, 'HOURS_7_TO_9', 160),
  ('b5555555-5555-5555-5555-555555555555', '2', 2, 'HOURS_10_TO_12', 105),
  ('b6666666-6666-6666-6666-666666666666', '2', 2, 'MORE_THAN_12_HOURS', 60),
  
  -- Ward 3 dummy data
  ('c1111111-1111-1111-1111-111111111111', '3', 3, 'LESS_THAN_1_HOUR', 195),
  ('c2222222-2222-2222-2222-222222222222', '3', 3, 'HOURS_1_TO_3', 305),
  ('c3333333-3333-3333-3333-333333333333', '3', 3, 'HOURS_4_TO_6', 235),
  ('c4444444-4444-4444-4444-444444444444', '3', 3, 'HOURS_7_TO_9', 145),
  ('c5555555-5555-5555-5555-555555555555', '3', 3, 'HOURS_10_TO_12', 85),
  ('c6666666-6666-6666-6666-666666666666', '3', 3, 'MORE_THAN_12_HOURS', 40);

-- Insert dummy data for ACME table (fallback data)
INSERT INTO acme_ward_time_wise_household_chores (ward_number, time_spent, population)
VALUES
  -- Ward 4 dummy data (only in ACME table for testing fallback)
  (4, 'LESS_THAN_1_HOUR', 165),
  (4, 'HOURS_1_TO_3', 290),
  (4, 'HOURS_4_TO_6', 220),
  (4, 'HOURS_7_TO_9', 130),
  (4, 'HOURS_10_TO_12', 75),
  (4, 'MORE_THAN_12_HOURS', 35);
-- DUMMY DATA SECTION ENDS

-- Creating the ward-wise-households-on-loan table
CREATE TABLE IF NOT EXISTS ward_wise_households_on_loan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_id TEXT NOT NULL,
    ward_number INTEGER,
    households INTEGER NOT NULL DEFAULT 0 CHECK (households >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Creating the ACME table version for fallback data
CREATE TABLE IF NOT EXISTS acme_ward_wise_households_on_loan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_number INTEGER NOT NULL,
    households INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ward_wise_households_on_loan_ward_id ON ward_wise_households_on_loan(ward_id);
CREATE INDEX IF NOT EXISTS idx_acme_ward_wise_households_on_loan_ward_number ON acme_ward_wise_households_on_loan(ward_number);

-- DUMMY DATA SECTION BEGINS
-- Insert dummy data for main table
INSERT INTO ward_wise_households_on_loan (id, ward_id, ward_number, households)
VALUES
  -- Ward 1 dummy data
  ('a5555555-5555-5555-5555-555555555555', '1', 1, 75),
  
  -- Ward 2 dummy data
  ('b5555555-5555-5555-5555-555555555555', '2', 2, 63),
  
  -- Ward 3 dummy data
  ('c5555555-5555-5555-5555-555555555555', '3', 3, 82);

-- Insert dummy data for ACME table (fallback data)
INSERT INTO acme_ward_wise_households_on_loan (ward_number, households)
VALUES
  -- Ward 4 dummy data (only in ACME table for testing fallback)
  (4, 45),
  
  -- Ward 5 dummy data (only in ACME table for testing fallback)
  (5, 37);
-- DUMMY DATA SECTION ENDS

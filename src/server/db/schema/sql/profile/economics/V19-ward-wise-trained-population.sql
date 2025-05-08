-- Creating the ward-wise-trained-population table
CREATE TABLE IF NOT EXISTS ward_wise_trained_population (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_id TEXT NOT NULL,
    ward_number INTEGER,
    trained_population INTEGER NOT NULL DEFAULT 0 CHECK (trained_population >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Creating the ACME table version for fallback data
CREATE TABLE IF NOT EXISTS acme_ward_wise_trained_population (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_number INTEGER NOT NULL,
    trained_population INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ward_wise_trained_population_ward_id ON ward_wise_trained_population(ward_id);
CREATE INDEX IF NOT EXISTS idx_acme_ward_wise_trained_population_ward_number ON acme_ward_wise_trained_population(ward_number);

-- DUMMY DATA SECTION BEGINS
-- Insert dummy data for main table
INSERT INTO ward_wise_trained_population (ward_id, ward_number, trained_population)
VALUES
  -- Ward 1 dummy data
  ('1', 1, 45),
  
  -- Ward 2 dummy data
  ('2', 2, 38),
  
  -- Ward 3 dummy data
  ('3', 3, 52);

-- Insert dummy data for ACME table (fallback data)
INSERT INTO acme_ward_wise_trained_population (ward_number, trained_population)
VALUES
  -- Ward 4 dummy data (only in ACME table for testing fallback)
  (4, 30),
  
  -- Ward 5 dummy data (only in ACME table for testing fallback)
  (5, 27);
-- DUMMY DATA SECTION ENDS

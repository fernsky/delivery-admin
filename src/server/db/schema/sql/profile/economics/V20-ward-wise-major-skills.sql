-- Creating the ward-wise-major-skills table
CREATE TABLE IF NOT EXISTS ward_wise_major_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_id TEXT NOT NULL,
    ward_number INTEGER,
    skill TEXT NOT NULL,
    population INTEGER NOT NULL DEFAULT 0 CHECK (population >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Creating the ACME table version for fallback data
CREATE TABLE IF NOT EXISTS acme_ward_wise_major_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_number INTEGER NOT NULL,
    skill TEXT NOT NULL,
    population INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ward_wise_major_skills_ward_id ON ward_wise_major_skills(ward_id);
CREATE INDEX IF NOT EXISTS idx_acme_ward_wise_major_skills_ward_number ON acme_ward_wise_major_skills(ward_number);

-- DUMMY DATA SECTION BEGINS
-- Insert dummy data for main table
INSERT INTO ward_wise_major_skills (ward_id, ward_number, skill, population)
VALUES
  -- Ward 1 dummy data
  ('1', 1, 'TEACHING_RELATED', 50),
  ('1', 1, 'PHOTOGRAPHY_RELATED', 20),
  
  -- Ward 2 dummy data
  ('2', 2, 'HANDICRAFT_RELATED', 35),
  ('2', 2, 'MUSIC_DRAMA_RELATED', 15),
  
  -- Ward 3 dummy data
  ('3', 3, 'CARPENTERY_RELATED', 40),
  ('3', 3, 'PLUMBING', 25);

-- Insert dummy data for ACME table (fallback data)
INSERT INTO acme_ward_wise_major_skills (ward_number, skill, population)
VALUES
  -- Ward 4 dummy data (only in ACME table for testing fallback)
  (4, 'ELECTRICITY_INSTALLMENT_RELATED', 30),
  (4, 'HOTEL_RESTAURANT_RELATED', 20),
  
  -- Ward 5 dummy data (only in ACME table for testing fallback)
  (5, 'AGRICULTURE_RELATED', 45),
  (5, 'DRIVING_RELATED', 10);
-- DUMMY DATA SECTION ENDS

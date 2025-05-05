-- Creating the ward-wise-major-occupation table
CREATE TABLE IF NOT EXISTS ward_wise_major_occupation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_id TEXT NOT NULL,
    ward_number INTEGER,
    occupation TEXT NOT NULL CHECK (occupation IN (
        'GOVERNMENTAL_JOB', 
        'NON_GOVERNMENTAL_JOB', 
        'LABOUR', 
        'FOREIGN_EMPLOYMENT', 
        'BUSINESS', 
        'OTHER_EMPLOYMENT', 
        'STUDENT', 
        'HOUSEHOLDER', 
        'OTHER_UNEMPLOYMENT', 
        'INDUSTRY', 
        'ANIMAL_HUSBANDRY', 
        'OTHER_SELF_EMPLOYMENT'
    )),
    population INTEGER NOT NULL CHECK (population >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Creating the ACME table version if needed for fallback data
CREATE TABLE IF NOT EXISTS acme_ward_wise_major_occupation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_number INTEGER NOT NULL,
    occupation TEXT NOT NULL,
    population INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ward_wise_major_occupation_ward_id ON ward_wise_major_occupation(ward_id);
CREATE INDEX IF NOT EXISTS idx_ward_wise_major_occupation_occupation ON ward_wise_major_occupation(occupation);
CREATE INDEX IF NOT EXISTS idx_acme_ward_wise_major_occupation_ward_number ON acme_ward_wise_major_occupation(ward_number);

-- Insert dummy data for main table
INSERT INTO ward_wise_major_occupation (id, ward_id, ward_number, occupation, population)
VALUES
  -- Ward 1 data
  ('a1111111-1111-1111-1111-111111111111', '1', 1, 'GOVERNMENTAL_JOB', 120),
  ('a2222222-2222-2222-2222-222222222222', '1', 1, 'NON_GOVERNMENTAL_JOB', 180),
  ('a3333333-3333-3333-3333-333333333333', '1', 1, 'LABOUR', 310),
  ('a4444444-4444-4444-4444-444444444444', '1', 1, 'FOREIGN_EMPLOYMENT', 95),
  ('a5555555-5555-5555-5555-555555555555', '1', 1, 'BUSINESS', 215),
  ('a6666666-6666-6666-6666-666666666666', '1', 1, 'OTHER_EMPLOYMENT', 45),
  ('a7777777-7777-7777-7777-777777777777', '1', 1, 'STUDENT', 320),
  ('a8888888-8888-8888-8888-888888888888', '1', 1, 'HOUSEHOLDER', 280),
  ('a9999999-9999-9999-9999-999999999999', '1', 1, 'OTHER_UNEMPLOYMENT', 75),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa11', '1', 1, 'INDUSTRY', 110),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb11', '1', 1, 'ANIMAL_HUSBANDRY', 130),
  ('cccccccc-cccc-cccc-cccc-cccccccccc11', '1', 1, 'OTHER_SELF_EMPLOYMENT', 50),
  
  -- Ward 2 data
  ('a1111111-1111-1111-1111-111111111112', '2', 2, 'GOVERNMENTAL_JOB', 135),
  ('a2222222-2222-2222-2222-222222222223', '2', 2, 'NON_GOVERNMENTAL_JOB', 195),
  ('a3333333-3333-3333-3333-333333333334', '2', 2, 'LABOUR', 290),
  ('a4444444-4444-4444-4444-444444444445', '2', 2, 'FOREIGN_EMPLOYMENT', 110),
  ('a5555555-5555-5555-5555-555555555556', '2', 2, 'BUSINESS', 230),
  ('a6666666-6666-6666-6666-666666666667', '2', 2, 'OTHER_EMPLOYMENT', 55),
  ('a7777777-7777-7777-7777-777777777778', '2', 2, 'STUDENT', 340),
  ('a8888888-8888-8888-8888-888888888889', '2', 2, 'HOUSEHOLDER', 300),
  ('a9999999-9999-9999-9999-99999999990a', '2', 2, 'OTHER_UNEMPLOYMENT', 80),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa12', '2', 2, 'INDUSTRY', 125),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb13', '2', 2, 'ANIMAL_HUSBANDRY', 145),
  ('cccccccc-cccc-cccc-cccc-cccccccccc14', '2', 2, 'OTHER_SELF_EMPLOYMENT', 60),
  
  -- Ward 3 data
  ('a1111111-1111-1111-1111-111111111113', '3', 3, 'GOVERNMENTAL_JOB', 150),
  ('a2222222-2222-2222-2222-222222222224', '3', 3, 'NON_GOVERNMENTAL_JOB', 210),
  ('a3333333-3333-3333-3333-333333333335', '3', 3, 'LABOUR', 270),
  ('a4444444-4444-4444-4444-444444444446', '3', 3, 'FOREIGN_EMPLOYMENT', 125),
  ('a5555555-5555-5555-5555-555555555557', '3', 3, 'BUSINESS', 245),
  ('a6666666-6666-6666-6666-666666666668', '3', 3, 'OTHER_EMPLOYMENT', 65),
  ('a7777777-7777-7777-7777-777777777779', '3', 3, 'STUDENT', 360),
  ('a8888888-8888-8888-8888-88888888890a', '3', 3, 'HOUSEHOLDER', 320),
  ('a9999999-9999-9999-9999-99999999991b', '3', 3, 'OTHER_UNEMPLOYMENT', 85),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa13', '3', 3, 'INDUSTRY', 140),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb14', '3', 3, 'ANIMAL_HUSBANDRY', 160),
  ('cccccccc-cccc-cccc-cccc-cccccccccc15', '3', 3, 'OTHER_SELF_EMPLOYMENT', 70);

-- Insert dummy data for ACME table
INSERT INTO acme_ward_wise_major_occupation (ward_number, occupation, population)
VALUES
  -- Ward 4 data (only in ACME table for testing fallback)
  (4, 'GOVERNMENTAL_JOB', 105),
  (4, 'NON_GOVERNMENTAL_JOB', 165),
  (4, 'LABOUR', 250),
  (4, 'FOREIGN_EMPLOYMENT', 85),
  (4, 'BUSINESS', 200),
  (4, 'OTHER_EMPLOYMENT', 40),
  (4, 'STUDENT', 300),
  (4, 'HOUSEHOLDER', 260),
  (4, 'OTHER_UNEMPLOYMENT', 70),
  (4, 'INDUSTRY', 100),
  (4, 'ANIMAL_HUSBANDRY', 120),
  (4, 'OTHER_SELF_EMPLOYMENT', 45);

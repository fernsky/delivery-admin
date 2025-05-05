-- Creating the ward-age-gender-wise-economically-active-population table
CREATE TABLE IF NOT EXISTS ward_age_gender_wise_economically_active_population (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_id TEXT NOT NULL,
    ward_number INTEGER,
    age_group TEXT NOT NULL CHECK (age_group IN ('AGE_0_TO_14', 'AGE_15_TO_59', 'AGE_60_PLUS')),
    gender TEXT NOT NULL CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),
    population INTEGER NOT NULL CHECK (population >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Creating the ACME table version if needed for fallback data
CREATE TABLE IF NOT EXISTS acme_ward_age_gender_wise_economically_active_population (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_number INTEGER NOT NULL,
    age_group TEXT NOT NULL,
    gender TEXT NOT NULL,
    population INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ward_age_gender_eap_ward_id ON ward_age_gender_wise_economically_active_population(ward_id);
CREATE INDEX IF NOT EXISTS idx_ward_age_gender_eap_age_group ON ward_age_gender_wise_economically_active_population(age_group);
CREATE INDEX IF NOT EXISTS idx_ward_age_gender_eap_gender ON ward_age_gender_wise_economically_active_population(gender);
CREATE INDEX IF NOT EXISTS idx_acme_ward_age_gender_eap_ward_number ON acme_ward_age_gender_wise_economically_active_population(ward_number);

-- Insert dummy data for main table
INSERT INTO ward_age_gender_wise_economically_active_population (id, ward_id, ward_number, age_group, gender, population)
VALUES
  -- Ward 1 data
  ('11111111-1111-1111-1111-111111111111', '1', 1, 'AGE_0_TO_14', 'MALE', 150),
  ('22222222-2222-2222-2222-222222222222', '1', 1, 'AGE_0_TO_14', 'FEMALE', 145),
  ('33333333-3333-3333-3333-333333333333', '1', 1, 'AGE_0_TO_14', 'OTHER', 5),
  ('44444444-4444-4444-4444-444444444444', '1', 1, 'AGE_15_TO_59', 'MALE', 450),
  ('55555555-5555-5555-5555-555555555555', '1', 1, 'AGE_15_TO_59', 'FEMALE', 425),
  ('66666666-6666-6666-6666-666666666666', '1', 1, 'AGE_15_TO_59', 'OTHER', 15),
  ('77777777-7777-7777-7777-777777777777', '1', 1, 'AGE_60_PLUS', 'MALE', 85),
  ('88888888-8888-8888-8888-888888888888', '1', 1, 'AGE_60_PLUS', 'FEMALE', 95),
  ('99999999-9999-9999-9999-999999999999', '1', 1, 'AGE_60_PLUS', 'OTHER', 5),
  
  -- Ward 2 data
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2', 2, 'AGE_0_TO_14', 'MALE', 180),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2', 2, 'AGE_0_TO_14', 'FEMALE', 175),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '2', 2, 'AGE_0_TO_14', 'OTHER', 8),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '2', 2, 'AGE_15_TO_59', 'MALE', 520),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '2', 2, 'AGE_15_TO_59', 'FEMALE', 510),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', '2', 2, 'AGE_15_TO_59', 'OTHER', 20),
  ('11111111-1111-1111-1111-111111111112', '2', 2, 'AGE_60_PLUS', 'MALE', 95),
  ('22222222-2222-2222-2222-222222222223', '2', 2, 'AGE_60_PLUS', 'FEMALE', 105),
  ('33333333-3333-3333-3333-333333333334', '2', 2, 'AGE_60_PLUS', 'OTHER', 7),
  
  -- Ward 3 data
  ('44444444-4444-4444-4444-444444444445', '3', 3, 'AGE_0_TO_14', 'MALE', 165),
  ('55555555-5555-5555-5555-555555555556', '3', 3, 'AGE_0_TO_14', 'FEMALE', 160),
  ('66666666-6666-6666-6666-666666666667', '3', 3, 'AGE_0_TO_14', 'OTHER', 6),
  ('77777777-7777-7777-7777-777777777778', '3', 3, 'AGE_15_TO_59', 'MALE', 480),
  ('88888888-8888-8888-8888-888888888889', '3', 3, 'AGE_15_TO_59', 'FEMALE', 465),
  ('99999999-9999-9999-9999-99999999990a', '3', 3, 'AGE_15_TO_59', 'OTHER', 18),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '3', 3, 'AGE_60_PLUS', 'MALE', 90),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', '3', 3, 'AGE_60_PLUS', 'FEMALE', 100),
  ('cccccccc-cccc-cccc-cccc-ccccccccccc3', '3', 3, 'AGE_60_PLUS', 'OTHER', 6);

-- Insert dummy data for ACME table
INSERT INTO acme_ward_age_gender_wise_economically_active_population (ward_number, age_group, gender, population)
VALUES
  -- Ward 4 data (only in ACME table for testing fallback)
  (4, 'AGE_0_TO_14', 'MALE', 140),
  (4, 'AGE_0_TO_14', 'FEMALE', 135),
  (4, 'AGE_0_TO_14', 'OTHER', 4),
  (4, 'AGE_15_TO_59', 'MALE', 410),
  (4, 'AGE_15_TO_59', 'FEMALE', 390),
  (4, 'AGE_15_TO_59', 'OTHER', 12),
  (4, 'AGE_60_PLUS', 'MALE', 80),
  (4, 'AGE_60_PLUS', 'FEMALE', 90),
  (4, 'AGE_60_PLUS', 'OTHER', 3);

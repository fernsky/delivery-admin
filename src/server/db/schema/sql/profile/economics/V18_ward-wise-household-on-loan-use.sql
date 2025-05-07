-- Creating the ward-wise-households-loan-use table
CREATE TABLE IF NOT EXISTS ward_wise_households_loan_use (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_id TEXT NOT NULL,
    ward_number INTEGER,
    loan_use TEXT NOT NULL,
    households INTEGER NOT NULL DEFAULT 0 CHECK (households >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Creating the ACME table version for fallback data
CREATE TABLE IF NOT EXISTS acme_ward_wise_households_loan_use (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_number INTEGER NOT NULL,
    loan_use TEXT NOT NULL,
    households INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ward_wise_households_loan_use_ward_id ON ward_wise_households_loan_use(ward_id);
CREATE INDEX IF NOT EXISTS idx_ward_wise_households_loan_use_loan_use ON ward_wise_households_loan_use(loan_use);
CREATE INDEX IF NOT EXISTS idx_acme_ward_wise_households_loan_use_ward_number ON acme_ward_wise_households_loan_use(ward_number);
CREATE INDEX IF NOT EXISTS idx_acme_ward_wise_households_loan_use_loan_use ON acme_ward_wise_households_loan_use(loan_use);

-- DUMMY DATA SECTION BEGINS
-- Insert dummy data for main table
INSERT INTO ward_wise_households_loan_use (ward_id, ward_number, loan_use, households)
VALUES
  -- Ward 1 dummy data
  ('1', 1, 'agriculture', 18),
  ('1', 1, 'business', 12),
  ('1', 1, 'householdExpenses', 15),
  ('1', 1, 'education', 7),
  ('1', 1, 'healthTreatment', 10),
  ('1', 1, 'housingConstruction', 13),
  
  -- Ward 2 dummy data
  ('2', 2, 'agriculture', 14),
  ('2', 2, 'business', 10),
  ('2', 2, 'foreignEmployment', 9),
  ('2', 2, 'vehiclePurchase', 8),
  ('2', 2, 'landPurchase', 12),
  ('2', 2, 'other', 10),
  
  -- Ward 3 dummy data
  ('3', 3, 'agriculture', 20),
  ('3', 3, 'interestPayment', 15),
  ('3', 3, 'marriageCeremony', 11),
  ('3', 3, 'householdExpenses', 19),
  ('3', 3, 'healthTreatment', 17);

-- Insert dummy data for ACME table (fallback data)
INSERT INTO acme_ward_wise_households_loan_use (ward_number, loan_use, households)
VALUES
  -- Ward 4 dummy data (only in ACME table for testing fallback)
  (4, 'agriculture', 12),
  (4, 'business', 9),
  (4, 'householdExpenses', 10),
  (4, 'education', 8),
  (4, 'healthTreatment', 6),
  
  -- Ward 5 dummy data (only in ACME table for testing fallback)
  (5, 'agriculture', 8),
  (5, 'business', 7),
  (5, 'foreignEmployment', 6),
  (5, 'housingConstruction', 9),
  (5, 'other', 7);
-- DUMMY DATA SECTION ENDS

-- Creating the ward-wise-remittance-expenses table
CREATE TABLE IF NOT EXISTS ward_wise_remittance_expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_id TEXT NOT NULL,
    ward_number INTEGER,
    remittance_expense TEXT NOT NULL CHECK (remittance_expense IN (
        'EDUCATION',
        'HEALTH',
        'HOUSEHOLD_USE',
        'FESTIVALS',
        'LOAN_PAYMENT',
        'LOANED_OTHERS',
        'SAVING',
        'HOUSE_CONSTRUCTION',
        'LAND_OWNERSHIP',
        'JEWELRY_PURCHASE',
        'GOODS_PURCHASE',
        'BUSINESS_INVESTMENT',
        'OTHER',
        'UNKNOWN'
    )),
    households INTEGER NOT NULL DEFAULT 0 CHECK (households >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Creating the ACME table version if needed for fallback data
CREATE TABLE IF NOT EXISTS acme_ward_wise_remittance_expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_number INTEGER NOT NULL,
    remittance_expense TEXT NOT NULL,
    households INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ward_wise_remittance_expenses_ward_id ON ward_wise_remittance_expenses(ward_id);
CREATE INDEX IF NOT EXISTS idx_ward_wise_remittance_expenses_remittance_expense ON ward_wise_remittance_expenses(remittance_expense);
CREATE INDEX IF NOT EXISTS idx_acme_ward_wise_remittance_expenses_ward_number ON acme_ward_wise_remittance_expenses(ward_number);

-- DUMMY DATA SECTION BEGINS
-- Insert dummy data for main table
INSERT INTO ward_wise_remittance_expenses (id, ward_id, ward_number, remittance_expense, households)
VALUES
  -- Ward 1 dummy data
  ('h1111111-1111-1111-1111-111111111111', '1', 1, 'EDUCATION', 120),
  ('h2222222-2222-2222-2222-222222222222', '1', 1, 'HEALTH', 85),
  ('h3333333-3333-3333-3333-333333333333', '1', 1, 'HOUSEHOLD_USE', 145),
  ('h4444444-4444-4444-4444-444444444444', '1', 1, 'FESTIVALS', 95),
  ('h5555555-5555-5555-5555-555555555555', '1', 1, 'LOAN_PAYMENT', 75),
  ('h6666666-6666-6666-6666-666666666666', '1', 1, 'SAVING', 110),
  ('h7777777-7777-7777-7777-777777777777', '1', 1, 'HOUSE_CONSTRUCTION', 60),
  
  -- Ward 2 dummy data
  ('i1111111-1111-1111-1111-111111111111', '2', 2, 'EDUCATION', 130),
  ('i2222222-2222-2222-2222-222222222222', '2', 2, 'HEALTH', 90),
  ('i3333333-3333-3333-3333-333333333333', '2', 2, 'HOUSEHOLD_USE', 155),
  ('i4444444-4444-4444-4444-444444444444', '2', 2, 'FESTIVALS', 100),
  ('i5555555-5555-5555-5555-555555555555', '2', 2, 'LAND_OWNERSHIP', 45),
  ('i6666666-6666-6666-6666-666666666666', '2', 2, 'JEWELRY_PURCHASE', 30),
  ('i7777777-7777-7777-7777-777777777777', '2', 2, 'BUSINESS_INVESTMENT', 65),
  
  -- Ward 3 dummy data
  ('j1111111-1111-1111-1111-111111111111', '3', 3, 'EDUCATION', 125),
  ('j2222222-2222-2222-2222-222222222222', '3', 3, 'HEALTH', 80),
  ('j3333333-3333-3333-3333-333333333333', '3', 3, 'LOANED_OTHERS', 35),
  ('j4444444-4444-4444-4444-444444444444', '3', 3, 'GOODS_PURCHASE', 50),
  ('j5555555-5555-5555-5555-555555555555', '3', 3, 'BUSINESS_INVESTMENT', 70),
  ('j6666666-6666-6666-6666-666666666666', '3', 3, 'OTHER', 40),
  ('j7777777-7777-7777-7777-777777777777', '3', 3, 'UNKNOWN', 15);

-- Insert dummy data for ACME table (fallback data)
INSERT INTO acme_ward_wise_remittance_expenses (ward_number, remittance_expense, households)
VALUES
  -- Ward 4 dummy data (only in ACME table for testing fallback)
  (4, 'EDUCATION', 135),
  (4, 'HEALTH', 95),
  (4, 'HOUSEHOLD_USE', 150),
  (4, 'FESTIVALS', 105),
  (4, 'LOAN_PAYMENT', 70),
  (4, 'SAVING', 115),
  (4, 'HOUSE_CONSTRUCTION', 55);
-- DUMMY DATA SECTION ENDS

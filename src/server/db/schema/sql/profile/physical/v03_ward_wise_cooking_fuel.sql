-- Check if acme_ward_wise_cooking_fuel table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_cooking_fuel'
    ) THEN
        CREATE TABLE acme_ward_wise_cooking_fuel (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            cooking_fuel VARCHAR(100) NOT NULL,
            households INTEGER NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_cooking_fuel) THEN
--         INSERT INTO acme_ward_wise_cooking_fuel (
--             id, ward_number, cooking_fuel, households
--         )
--         VALUES
--         -- Ward 1
--         (gen_random_uuid(), 1, 'LP_GAS', 452),
--         (gen_random_uuid(), 1, 'WOOD', 128),
--         (gen_random_uuid(), 1, 'ELECTRICITY', 87),
--         (gen_random_uuid(), 1, 'BIOGAS', 45),
--         (gen_random_uuid(), 1, 'KEROSENE', 28),
--         (gen_random_uuid(), 1, 'DUNGCAKE', 15),
--         (gen_random_uuid(), 1, 'OTHER', 9),
--         -- Ward 2
--         (gen_random_uuid(), 2, 'LP_GAS', 485),
--         (gen_random_uuid(), 2, 'WOOD', 112),
--         (gen_random_uuid(), 2, 'ELECTRICITY', 95),
--         (gen_random_uuid(), 2, 'BIOGAS', 52),
--         (gen_random_uuid(), 2, 'KEROSENE', 24),
--         (gen_random_uuid(), 2, 'DUNGCAKE', 12),
--         (gen_random_uuid(), 2, 'OTHER', 7),
--         -- Ward 3
--         (gen_random_uuid(), 3, 'LP_GAS', 378),
--         (gen_random_uuid(), 3, 'WOOD', 170),
--         (gen_random_uuid(), 3, 'ELECTRICITY', 65),
--         (gen_random_uuid(), 3, 'BIOGAS', 40),
--         (gen_random_uuid(), 3, 'KEROSENE', 35),
--         (gen_random_uuid(), 3, 'DUNGCAKE', 28),
--         (gen_random_uuid(), 3, 'OTHER', 12),
--         -- Ward 4
--         (gen_random_uuid(), 4, 'LP_GAS', 425),
--         (gen_random_uuid(), 4, 'WOOD', 135),
--         (gen_random_uuid(), 4, 'ELECTRICITY', 78),
--         (gen_random_uuid(), 4, 'BIOGAS', 48),
--         (gen_random_uuid(), 4, 'KEROSENE', 30),
--         (gen_random_uuid(), 4, 'DUNGCAKE', 18),
--         (gen_random_uuid(), 4, 'OTHER', 10),
--         -- Ward 5
--         (gen_random_uuid(), 5, 'LP_GAS', 395),
--         (gen_random_uuid(), 5, 'WOOD', 155),
--         (gen_random_uuid(), 5, 'ELECTRICITY', 72),
--         (gen_random_uuid(), 5, 'BIOGAS', 42),
--         (gen_random_uuid(), 5, 'KEROSENE', 32),
--         (gen_random_uuid(), 5, 'DUNGCAKE', 20),
--         (gen_random_uuid(), 5, 'OTHER', 11);
--     END IF;
-- END
-- $$;
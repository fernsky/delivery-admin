-- Check if acme_ward_wise_electricity_source table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_electricity_source'
    ) THEN
        CREATE TABLE acme_ward_wise_electricity_source (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            electricity_source VARCHAR(100) NOT NULL,
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
--     IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_electricity_source) THEN
--         INSERT INTO acme_ward_wise_electricity_source (
--             id, ward_number, electricity_source, households
--         )
--         VALUES
--         -- Ward 1
--         (gen_random_uuid(), 1, 'ELECTRICITY', 545),
--         (gen_random_uuid(), 1, 'SOLAR', 78),
--         (gen_random_uuid(), 1, 'KEROSENE', 32),
--         (gen_random_uuid(), 1, 'BIOGAS', 18),
--         (gen_random_uuid(), 1, 'OTHER', 12),
--         -- Ward 2
--         (gen_random_uuid(), 2, 'ELECTRICITY', 560),
--         (gen_random_uuid(), 2, 'SOLAR', 85),
--         (gen_random_uuid(), 2, 'KEROSENE', 25),
--         (gen_random_uuid(), 2, 'BIOGAS', 20),
--         (gen_random_uuid(), 2, 'OTHER', 10),
--         -- Ward 3
--         (gen_random_uuid(), 3, 'ELECTRICITY', 498),
--         (gen_random_uuid(), 3, 'SOLAR', 105),
--         (gen_random_uuid(), 3, 'KEROSENE', 45),
--         (gen_random_uuid(), 3, 'BIOGAS', 15),
--         (gen_random_uuid(), 3, 'OTHER', 18),
--         -- Ward 4
--         (gen_random_uuid(), 4, 'ELECTRICITY', 525),
--         (gen_random_uuid(), 4, 'SOLAR', 90),
--         (gen_random_uuid(), 4, 'KEROSENE', 28),
--         (gen_random_uuid(), 4, 'BIOGAS', 22),
--         (gen_random_uuid(), 4, 'OTHER', 15),
--         -- Ward 5
--         (gen_random_uuid(), 5, 'ELECTRICITY', 510),
--         (gen_random_uuid(), 5, 'SOLAR', 95),
--         (gen_random_uuid(), 5, 'KEROSENE', 38),
--         (gen_random_uuid(), 5, 'BIOGAS', 16),
--         (gen_random_uuid(), 5, 'OTHER', 14);
--     END IF;
-- END
-- $$;
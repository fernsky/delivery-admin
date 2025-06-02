-- Check if acme_ward_wise_water_purification table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_water_purification'
    ) THEN
        CREATE TABLE acme_ward_wise_water_purification (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            water_purification VARCHAR(100) NOT NULL,
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
--     IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_water_purification) THEN
--         INSERT INTO acme_ward_wise_water_purification (
--             id, ward_number, water_purification, households
--         )
--         VALUES
--         -- Ward 1
--         (gen_random_uuid(), 1, 'BOILING', 210),
--         (gen_random_uuid(), 1, 'FILTERING', 175),
--         (gen_random_uuid(), 1, 'CHEMICAL_PIYUSH', 45),
--         (gen_random_uuid(), 1, 'NO_ANY_FILTERING', 260),
--         (gen_random_uuid(), 1, 'OTHER', 10),
--         -- Ward 2
--         (gen_random_uuid(), 2, 'BOILING', 195),
--         (gen_random_uuid(), 2, 'FILTERING', 185),
--         (gen_random_uuid(), 2, 'CHEMICAL_PIYUSH', 38),
--         (gen_random_uuid(), 2, 'NO_ANY_FILTERING', 272),
--         (gen_random_uuid(), 2, 'OTHER', 12),
--         -- Ward 3
--         (gen_random_uuid(), 3, 'BOILING', 230),
--         (gen_random_uuid(), 3, 'FILTERING', 160),
--         (gen_random_uuid(), 3, 'CHEMICAL_PIYUSH', 55),
--         (gen_random_uuid(), 3, 'NO_ANY_FILTERING', 245),
--         (gen_random_uuid(), 3, 'OTHER', 15),
--         -- Ward 4
--         (gen_random_uuid(), 4, 'BOILING', 205),
--         (gen_random_uuid(), 4, 'FILTERING', 170),
--         (gen_random_uuid(), 4, 'CHEMICAL_PIYUSH', 42),
--         (gen_random_uuid(), 4, 'NO_ANY_FILTERING', 265),
--         (gen_random_uuid(), 4, 'OTHER', 16),
--         -- Ward 5
--         (gen_random_uuid(), 5, 'BOILING', 215),
--         (gen_random_uuid(), 5, 'FILTERING', 180),
--         (gen_random_uuid(), 5, 'CHEMICAL_PIYUSH', 48),
--         (gen_random_uuid(), 5, 'NO_ANY_FILTERING', 252),
--         (gen_random_uuid(), 5, 'OTHER', 11);
--     END IF;
-- END
-- $$;
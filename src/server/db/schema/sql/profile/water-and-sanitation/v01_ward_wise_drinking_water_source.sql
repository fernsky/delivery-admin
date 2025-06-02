-- Check if acme_ward_wise_drinking_water_source table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_drinking_water_source'
    ) THEN
        CREATE TABLE acme_ward_wise_drinking_water_source (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            drinking_water_source VARCHAR(100) NOT NULL,
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
--     IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_drinking_water_source) THEN
--         INSERT INTO acme_ward_wise_drinking_water_source (
--             id, ward_number, drinking_water_source, households
--         )
--         VALUES
--         -- Ward 1
--         (gen_random_uuid(), 1, 'TAP_INSIDE_HOUSE', 325),
--         (gen_random_uuid(), 1, 'TAP_OUTSIDE_HOUSE', 185),
--         (gen_random_uuid(), 1, 'TUBEWELL', 65),
--         (gen_random_uuid(), 1, 'COVERED_WELL', 38),
--         (gen_random_uuid(), 1, 'OPEN_WELL', 15),
--         (gen_random_uuid(), 1, 'AQUIFIER_MOOL', 12),
--         (gen_random_uuid(), 1, 'RIVER', 8),
--         (gen_random_uuid(), 1, 'JAR', 42),
--         (gen_random_uuid(), 1, 'OTHER', 10),
--         -- Ward 2
--         (gen_random_uuid(), 2, 'TAP_INSIDE_HOUSE', 342),
--         (gen_random_uuid(), 2, 'TAP_OUTSIDE_HOUSE', 176),
--         (gen_random_uuid(), 2, 'TUBEWELL', 58),
--         (gen_random_uuid(), 2, 'COVERED_WELL', 32),
--         (gen_random_uuid(), 2, 'OPEN_WELL', 18),
--         (gen_random_uuid(), 2, 'AQUIFIER_MOOL', 14),
--         (gen_random_uuid(), 2, 'RIVER', 6),
--         (gen_random_uuid(), 2, 'JAR', 38),
--         (gen_random_uuid(), 2, 'OTHER', 8),
--         -- Ward 3
--         (gen_random_uuid(), 3, 'TAP_INSIDE_HOUSE', 298),
--         (gen_random_uuid(), 3, 'TAP_OUTSIDE_HOUSE', 195),
--         (gen_random_uuid(), 3, 'TUBEWELL', 75),
--         (gen_random_uuid(), 3, 'COVERED_WELL', 45),
--         (gen_random_uuid(), 3, 'OPEN_WELL', 22),
--         (gen_random_uuid(), 3, 'AQUIFIER_MOOL', 18),
--         (gen_random_uuid(), 3, 'RIVER', 12),
--         (gen_random_uuid(), 3, 'JAR', 36),
--         (gen_random_uuid(), 3, 'OTHER', 14),
--         -- Ward 4
--         (gen_random_uuid(), 4, 'TAP_INSIDE_HOUSE', 335),
--         (gen_random_uuid(), 4, 'TAP_OUTSIDE_HOUSE', 180),
--         (gen_random_uuid(), 4, 'TUBEWELL', 62),
--         (gen_random_uuid(), 4, 'COVERED_WELL', 36),
--         (gen_random_uuid(), 4, 'OPEN_WELL', 16),
--         (gen_random_uuid(), 4, 'AQUIFIER_MOOL', 13),
--         (gen_random_uuid(), 4, 'RIVER', 7),
--         (gen_random_uuid(), 4, 'JAR', 40),
--         (gen_random_uuid(), 4, 'OTHER', 9),
--         -- Ward 5
--         (gen_random_uuid(), 5, 'TAP_INSIDE_HOUSE', 310),
--         (gen_random_uuid(), 5, 'TAP_OUTSIDE_HOUSE', 190),
--         (gen_random_uuid(), 5, 'TUBEWELL', 68),
--         (gen_random_uuid(), 5, 'COVERED_WELL', 42),
--         (gen_random_uuid(), 5, 'OPEN_WELL', 20),
--         (gen_random_uuid(), 5, 'AQUIFIER_MOOL', 15),
--         (gen_random_uuid(), 5, 'RIVER', 10),
--         (gen_random_uuid(), 5, 'JAR', 39),
--         (gen_random_uuid(), 5, 'OTHER', 12);
--     END IF;
-- END
-- $$;
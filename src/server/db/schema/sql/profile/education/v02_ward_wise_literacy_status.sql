-- Check if acme_ward_wise_literacy_status table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_literacy_status'
    ) THEN
        CREATE TABLE acme_ward_wise_literacy_status (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            literacy_type VARCHAR(100) NOT NULL,
            population INTEGER NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_literacy_status) THEN
--         INSERT INTO acme_ward_wise_literacy_status (
--             id, ward_number, literacy_type, population
--         )
--         VALUES
--         -- Ward 1
--         (gen_random_uuid(), 1, 'BOTH_READING_AND_WRITING', 3850),
--         (gen_random_uuid(), 1, 'READING_ONLY', 420),
--         (gen_random_uuid(), 1, 'ILLITERATE', 842),
--         -- Ward 2
--         (gen_random_uuid(), 2, 'BOTH_READING_AND_WRITING', 4270),
--         (gen_random_uuid(), 2, 'READING_ONLY', 395),
--         (gen_random_uuid(), 2, 'ILLITERATE', 758),
--         -- Ward 3
--         (gen_random_uuid(), 3, 'BOTH_READING_AND_WRITING', 3950),
--         (gen_random_uuid(), 3, 'READING_ONLY', 368),
--         (gen_random_uuid(), 3, 'ILLITERATE', 845),
--         -- Ward 4
--         (gen_random_uuid(), 4, 'BOTH_READING_AND_WRITING', 4325),
--         (gen_random_uuid(), 4, 'READING_ONLY', 402),
--         (gen_random_uuid(), 4, 'ILLITERATE', 723),
--         -- Ward 5
--         (gen_random_uuid(), 5, 'BOTH_READING_AND_WRITING', 3755),
--         (gen_random_uuid(), 5, 'READING_ONLY', 358),
--         (gen_random_uuid(), 5, 'ILLITERATE', 910),
--         -- Ward 6
--         (gen_random_uuid(), 6, 'BOTH_READING_AND_WRITING', 4150),
--         (gen_random_uuid(), 6, 'READING_ONLY', 378),
--         (gen_random_uuid(), 6, 'ILLITERATE', 675),
--         -- Ward 7
--         (gen_random_uuid(), 7, 'BOTH_READING_AND_WRITING', 3925),
--         (gen_random_uuid(), 7, 'READING_ONLY', 345),
--         (gen_random_uuid(), 7, 'ILLITERATE', 820);
--     END IF;
-- END
-- $$;
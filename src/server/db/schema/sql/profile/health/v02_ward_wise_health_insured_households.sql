-- Check if acme_ward_wise_health_insured_households table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_health_insured_households'
    ) THEN
        CREATE TABLE acme_ward_wise_health_insured_households (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL UNIQUE,
            insured_households INTEGER NOT NULL,
            non_insured_households INTEGER NOT NULL DEFAULT 0,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    ELSE
        -- Add non_insured_households column if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name='acme_ward_wise_health_insured_households' AND column_name='non_insured_households'
        ) THEN
            ALTER TABLE acme_ward_wise_health_insured_households
            ADD COLUMN non_insured_households INTEGER NOT NULL DEFAULT 0;
        END IF;
    END IF;
END
$$;

-- Insert seed data if table is empty
-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_health_insured_households) THEN
--         INSERT INTO acme_ward_wise_health_insured_households (
--             id, ward_number, insured_households, non_insured_households
--         )
--         VALUES
--         -- Ward 1 to 5 data
--         (gen_random_uuid(), 1, 275, 125),
--         (gen_random_uuid(), 2, 312, 188),
--         (gen_random_uuid(), 3, 245, 155),
--         (gen_random_uuid(), 4, 298, 202),
--         (gen_random_uuid(), 5, 267, 133);
--     END IF;
-- END
-- $$;
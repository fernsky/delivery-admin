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
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_health_insured_households) THEN
        INSERT INTO acme_ward_wise_health_insured_households (
            id, ward_number, insured_households
        )
        VALUES
        -- Ward 1 to 5 data
        (gen_random_uuid(), 1, 275),
        (gen_random_uuid(), 2, 312),
        (gen_random_uuid(), 3, 245),
        (gen_random_uuid(), 4, 298),
        (gen_random_uuid(), 5, 267);
    END IF;
END
$$;
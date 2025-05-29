-- Check if acme_ward_wise_birth_certificate_population table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_birth_certificate_population'
    ) THEN
        CREATE TABLE acme_ward_wise_birth_certificate_population (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            birth_certificate_holders_below_5years INTEGER NOT NULL CHECK (birth_certificate_holders_below_5years >= 0),
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_birth_certificate_population) THEN
        INSERT INTO acme_ward_wise_birth_certificate_population (
            id, ward_number, birth_certificate_holders_below_5years
        )
        VALUES
        -- Sample data for each ward
        (gen_random_uuid(), 1, 123),
        (gen_random_uuid(), 2, 156),
        (gen_random_uuid(), 3, 178),
        (gen_random_uuid(), 4, 92),
        (gen_random_uuid(), 5, 88),
        (gen_random_uuid(), 6, 145),
        (gen_random_uuid(), 7, 79),
        (gen_random_uuid(), 8, 112);
    END IF;
END
$$;

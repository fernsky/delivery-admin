-- Check if acme_ward_wise_birthplace_households table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_birthplace_households'
    ) THEN
        CREATE TABLE acme_ward_wise_birthplace_households (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            birth_place VARCHAR(100) NOT NULL,
            households INTEGER NOT NULL CHECK (households >= 0),
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert updated seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_birthplace_households) THEN
        INSERT INTO acme_ward_wise_birthplace_households (
            id, ward_number, birth_place, households
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'SAME_MUNICIPALITY', 320),
        (gen_random_uuid(), 1, 'SAME_DISTRICT_ANOTHER_MUNICIPALITY', 45),
        (gen_random_uuid(), 1, 'ANOTHER_DISTRICT', 78),
        (gen_random_uuid(), 1, 'ABROAD', 12),

        -- Ward 2
        (gen_random_uuid(), 2, 'SAME_MUNICIPALITY', 412),
        (gen_random_uuid(), 2, 'SAME_DISTRICT_ANOTHER_MUNICIPALITY', 67),
        (gen_random_uuid(), 2, 'ANOTHER_DISTRICT', 103),
        (gen_random_uuid(), 2, 'ABROAD', 18),

        -- Ward 3
        (gen_random_uuid(), 3, 'SAME_MUNICIPALITY', 287),
        (gen_random_uuid(), 3, 'SAME_DISTRICT_ANOTHER_MUNICIPALITY', 52),
        (gen_random_uuid(), 3, 'ANOTHER_DISTRICT', 91),
        (gen_random_uuid(), 3, 'ABROAD', 9),

        -- Ward 4
        (gen_random_uuid(), 4, 'SAME_MUNICIPALITY', 356),
        (gen_random_uuid(), 4, 'SAME_DISTRICT_ANOTHER_MUNICIPALITY', 49),
        (gen_random_uuid(), 4, 'ANOTHER_DISTRICT', 83),
        (gen_random_uuid(), 4, 'ABROAD', 15),

        -- Ward 5
        (gen_random_uuid(), 5, 'SAME_MUNICIPALITY', 199),
        (gen_random_uuid(), 5, 'SAME_DISTRICT_ANOTHER_MUNICIPALITY', 36),
        (gen_random_uuid(), 5, 'ANOTHER_DISTRICT', 62),
        (gen_random_uuid(), 5, 'ABROAD', 7),

        -- Ward 6
        (gen_random_uuid(), 6, 'SAME_MUNICIPALITY', 378),
        (gen_random_uuid(), 6, 'SAME_DISTRICT_ANOTHER_MUNICIPALITY', 59),
        (gen_random_uuid(), 6, 'ANOTHER_DISTRICT', 89),
        (gen_random_uuid(), 6, 'ABROAD', 13),

        -- Ward 7
        (gen_random_uuid(), 7, 'SAME_MUNICIPALITY', 275),
        (gen_random_uuid(), 7, 'SAME_DISTRICT_ANOTHER_MUNICIPALITY', 41),
        (gen_random_uuid(), 7, 'ANOTHER_DISTRICT', 77),
        (gen_random_uuid(), 7, 'ABROAD', 11),

        -- Ward 8
        (gen_random_uuid(), 8, 'SAME_MUNICIPALITY', 310),
        (gen_random_uuid(), 8, 'SAME_DISTRICT_ANOTHER_MUNICIPALITY', 47),
        (gen_random_uuid(), 8, 'ANOTHER_DISTRICT', 72),
        (gen_random_uuid(), 8, 'ABROAD', 9);
    END IF;
END
$$;

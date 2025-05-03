-- Check if acme_ward_wise_mother_tongue_population table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_mother_tongue_population'
    ) THEN
        CREATE TABLE acme_ward_wise_mother_tongue_population (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            language_type VARCHAR(100) NOT NULL,
            population INTEGER,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_mother_tongue_population) THEN
        INSERT INTO acme_ward_wise_mother_tongue_population (
            id, ward_number, language_type, population
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'नेपाली', 4016),
        (gen_random_uuid(), 1, 'थारु', 6),
        (gen_random_uuid(), 1, 'मगर', 58),
        (gen_random_uuid(), 1, 'हिन्दी', 27),
        (gen_random_uuid(), 1, 'अन्य', 5),

        -- Ward 2
        (gen_random_uuid(), 2, 'नेपाली', 10112),
        (gen_random_uuid(), 2, 'अवधी', 39),
        (gen_random_uuid(), 2, 'थारु', 93),
        (gen_random_uuid(), 2, 'मगर', 158),
        (gen_random_uuid(), 2, 'तामाङ', 35),
        (gen_random_uuid(), 2, 'अन्य', 107),

        -- Ward 3
        (gen_random_uuid(), 3, 'नेपाली', 8212),
        (gen_random_uuid(), 3, 'अवधी', 154),
        (gen_random_uuid(), 3, 'थारु', 30),
        (gen_random_uuid(), 3, 'मगर', 12),
        (gen_random_uuid(), 3, 'हिन्दी', 30),
        (gen_random_uuid(), 3, 'उर्दु', 8),
        (gen_random_uuid(), 3, 'तामाङ', 17),
        (gen_random_uuid(), 3, 'अन्य', 18),

        -- Ward 4
        (gen_random_uuid(), 4, 'नेपाली', 6910),
        (gen_random_uuid(), 4, 'अवधी', 168),
        (gen_random_uuid(), 4, 'थारु', 14),
        (gen_random_uuid(), 4, 'मगर', 7),
        (gen_random_uuid(), 4, 'खस', 12),
        (gen_random_uuid(), 4, 'उर्दु', 28),
        (gen_random_uuid(), 4, 'अन्य', 8),

        -- Ward 5
        (gen_random_uuid(), 5, 'नेपाली', 728),
        (gen_random_uuid(), 5, 'अवधी', 6776),
        (gen_random_uuid(), 5, 'थारु', 6),
        (gen_random_uuid(), 5, 'उर्दु', 8),
        (gen_random_uuid(), 5, 'अन्य', 4),

        -- Ward 6
        (gen_random_uuid(), 6, 'नेपाली', 5209),
        (gen_random_uuid(), 6, 'अवधी', 2829),
        (gen_random_uuid(), 6, 'थारु', 105),
        (gen_random_uuid(), 6, 'मगर', 32),
        (gen_random_uuid(), 6, 'खस', 60),
        (gen_random_uuid(), 6, 'उर्दु', 4),
        (gen_random_uuid(), 6, 'अन्य', 42),

        -- Ward 7
        (gen_random_uuid(), 7, 'नेपाली', 2566),
        (gen_random_uuid(), 7, 'अवधी', 7881),
        (gen_random_uuid(), 7, 'थारु', 84),
        (gen_random_uuid(), 7, 'मगर', 12),
        (gen_random_uuid(), 7, 'हिन्दी', 16),
        (gen_random_uuid(), 7, 'उर्दु', 22),
        (gen_random_uuid(), 7, 'अन्य', 5),

        -- Ward 8
        (gen_random_uuid(), 8, 'नेपाली', 3933),
        (gen_random_uuid(), 8, 'अवधी', 3687),
        (gen_random_uuid(), 8, 'थारु', 577),
        (gen_random_uuid(), 8, 'मगर', 10),
        (gen_random_uuid(), 8, 'खस', 7),
        (gen_random_uuid(), 8, 'अन्य', 21);
    END IF;
END
$$;

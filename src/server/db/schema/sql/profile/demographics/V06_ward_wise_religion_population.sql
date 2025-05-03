-- Check if acme_ward_wise_religion_population table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_religion_population'
    ) THEN
        CREATE TABLE acme_ward_wise_religion_population (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            religion_type VARCHAR(100) NOT NULL,
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
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_religion_population) THEN
        INSERT INTO acme_ward_wise_religion_population (
            id, ward_number, religion_type, population
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'हिन्दु', 3950),
        (gen_random_uuid(), 1, 'ईस्लाम', 0),
        (gen_random_uuid(), 1, 'क्रिश्चियन', 111),
        (gen_random_uuid(), 1, 'बौद्ध मार्गी', 48),
        (gen_random_uuid(), 1, 'शिख', 0),
        (gen_random_uuid(), 1, 'उल्लेख नभएको', 3),

        -- Ward 2
        (gen_random_uuid(), 2, 'हिन्दु', 9795),
        (gen_random_uuid(), 2, 'ईस्लाम', 34),
        (gen_random_uuid(), 2, 'क्रिश्चियन', 453),
        (gen_random_uuid(), 2, 'बौद्ध मार्गी', 212),
        (gen_random_uuid(), 2, 'शिख', 43),
        (gen_random_uuid(), 2, 'उल्लेख नभएको', 7),

        -- Ward 3
        (gen_random_uuid(), 3, 'हिन्दु', 8024),
        (gen_random_uuid(), 3, 'ईस्लाम', 123),
        (gen_random_uuid(), 3, 'क्रिश्चियन', 285),
        (gen_random_uuid(), 3, 'बौद्ध मार्गी', 47),
        (gen_random_uuid(), 3, 'शिख', 0),
        (gen_random_uuid(), 3, 'उल्लेख नभएको', 2),

        -- Ward 4
        (gen_random_uuid(), 4, 'हिन्दु', 6620),
        (gen_random_uuid(), 4, 'ईस्लाम', 177),
        (gen_random_uuid(), 4, 'क्रिश्चियन', 329),
        (gen_random_uuid(), 4, 'बौद्ध मार्गी', 21),
        (gen_random_uuid(), 4, 'शिख', 0),
        (gen_random_uuid(), 4, 'उल्लेख नभएको', 0),

        -- Ward 5
        (gen_random_uuid(), 5, 'हिन्दु', 4493),
        (gen_random_uuid(), 5, 'ईस्लाम', 3000),
        (gen_random_uuid(), 5, 'क्रिश्चियन', 9),
        (gen_random_uuid(), 5, 'बौद्ध मार्गी', 17),
        (gen_random_uuid(), 5, 'शिख', 0),
        (gen_random_uuid(), 5, 'उल्लेख नभएको', 3),

        -- Ward 6
        (gen_random_uuid(), 6, 'हिन्दु', 4980),
        (gen_random_uuid(), 6, 'ईस्लाम', 2237),
        (gen_random_uuid(), 6, 'क्रिश्चियन', 1051),
        (gen_random_uuid(), 6, 'बौद्ध मार्गी', 12),
        (gen_random_uuid(), 6, 'शिख', 0),
        (gen_random_uuid(), 6, 'उल्लेख नभएको', 1),

        -- Ward 7
        (gen_random_uuid(), 7, 'हिन्दु', 5847),
        (gen_random_uuid(), 7, 'ईस्लाम', 4574),
        (gen_random_uuid(), 7, 'क्रिश्चियन', 93),
        (gen_random_uuid(), 7, 'बौद्ध मार्गी', 61),
        (gen_random_uuid(), 7, 'शिख', 9),
        (gen_random_uuid(), 7, 'उल्लेख नभएको', 2),

        -- Ward 8
        (gen_random_uuid(), 8, 'हिन्दु', 3425),
        (gen_random_uuid(), 8, 'ईस्लाम', 4725),
        (gen_random_uuid(), 8, 'क्रिश्चियन', 85),
        (gen_random_uuid(), 8, 'बौद्ध मार्गी', 0),
        (gen_random_uuid(), 8, 'शिख', 0),
        (gen_random_uuid(), 8, 'उल्लेख नभएको', 0);
    END IF;
END
$$;

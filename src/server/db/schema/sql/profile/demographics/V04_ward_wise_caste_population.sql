-- Check if ward_wise_caste_population table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_caste_population'
    ) THEN
        CREATE TABLE acme_ward_wise_caste_population (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            caste_type VARCHAR(100) NOT NULL,
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
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_caste_population) THEN
        INSERT INTO acme_ward_wise_caste_population (
            id, ward_number, caste_type, population
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'क्षेत्री', 438),
        (gen_random_uuid(), 1, 'कामी', 766),
        (gen_random_uuid(), 1, 'मगर', 1997),
        (gen_random_uuid(), 1, 'ब्राह्मण', 55),
        (gen_random_uuid(), 1, 'ठकुरी', 229),
        (gen_random_uuid(), 1, 'यादव', 3),
        (gen_random_uuid(), 1, 'थारु', 14),
        (gen_random_uuid(), 1, 'गुरुङ', 402),
        (gen_random_uuid(), 1, 'दमाई/ढोली', 32),
        (gen_random_uuid(), 1, 'मुसलमान', 0),
        (gen_random_uuid(), 1, 'अन्य जातजाति', 176),

        -- Ward 2
        (gen_random_uuid(), 2, 'क्षेत्री', 3346),
        (gen_random_uuid(), 2, 'कामी', 2226),
        (gen_random_uuid(), 2, 'मगर', 1370),
        (gen_random_uuid(), 2, 'ब्राह्मण', 656),
        (gen_random_uuid(), 2, 'ठकुरी', 886),
        (gen_random_uuid(), 2, 'यादव', 9),
        (gen_random_uuid(), 2, 'थारु', 232),
        (gen_random_uuid(), 2, 'गुरुङ', 265),
        (gen_random_uuid(), 2, 'दमाई/ढोली', 213),
        (gen_random_uuid(), 2, 'मुसलमान', 17),
        (gen_random_uuid(), 2, 'अन्य जातजाति', 1324),

        -- Ward 3
        (gen_random_uuid(), 3, 'क्षेत्री', 2589),
        (gen_random_uuid(), 3, 'कामी', 859),
        (gen_random_uuid(), 3, 'मगर', 1752),
        (gen_random_uuid(), 3, 'ब्राह्मण', 1413),
        (gen_random_uuid(), 3, 'ठकुरी', 321),
        (gen_random_uuid(), 3, 'यादव', 27),
        (gen_random_uuid(), 3, 'थारु', 150),
        (gen_random_uuid(), 3, 'गुरुङ', 225),
        (gen_random_uuid(), 3, 'दमाई/ढोली', 140),
        (gen_random_uuid(), 3, 'मुसलमान', 133),
        (gen_random_uuid(), 3, 'अन्य जातजाति', 872),

        -- Ward 4
        (gen_random_uuid(), 4, 'क्षेत्री', 3189),
        (gen_random_uuid(), 4, 'कामी', 1361),
        (gen_random_uuid(), 4, 'मगर', 831),
        (gen_random_uuid(), 4, 'ब्राह्मण', 326),
        (gen_random_uuid(), 4, 'ठकुरी', 230),
        (gen_random_uuid(), 4, 'यादव', 6),
        (gen_random_uuid(), 4, 'थारु', 55),
        (gen_random_uuid(), 4, 'गुरुङ', 111),
        (gen_random_uuid(), 4, 'दमाई/ढोली', 31),
        (gen_random_uuid(), 4, 'मुसलमान', 189),
        (gen_random_uuid(), 4, 'अन्य जातजाति', 818),

        -- Ward 5
        (gen_random_uuid(), 5, 'क्षेत्री', 277),
        (gen_random_uuid(), 5, 'कामी', 9),
        (gen_random_uuid(), 5, 'मगर', 75),
        (gen_random_uuid(), 5, 'ब्राह्मण', 106),
        (gen_random_uuid(), 5, 'ठकुरी', 12),
        (gen_random_uuid(), 5, 'यादव', 1196),
        (gen_random_uuid(), 5, 'थारु', 12),
        (gen_random_uuid(), 5, 'गुरुङ', 13),
        (gen_random_uuid(), 5, 'दमाई/ढोली', 0),
        (gen_random_uuid(), 5, 'मुसलमान', 2991),
        (gen_random_uuid(), 5, 'अन्य जातजाति', 2831),

        -- Ward 6
        (gen_random_uuid(), 6, 'क्षेत्री', 912),
        (gen_random_uuid(), 6, 'कामी', 1809),
        (gen_random_uuid(), 6, 'मगर', 626),
        (gen_random_uuid(), 6, 'ब्राह्मण', 25),
        (gen_random_uuid(), 6, 'ठकुरी', 309),
        (gen_random_uuid(), 6, 'यादव', 41),
        (gen_random_uuid(), 6, 'थारु', 325),
        (gen_random_uuid(), 6, 'गुरुङ', 38),
        (gen_random_uuid(), 6, 'दमाई/ढोली', 428),
        (gen_random_uuid(), 6, 'मुसलमान', 2234),
        (gen_random_uuid(), 6, 'अन्य जातजाति', 1534),

        -- Ward 7
        (gen_random_uuid(), 7, 'क्षेत्री', 635),
        (gen_random_uuid(), 7, 'कामी', 78),
        (gen_random_uuid(), 7, 'मगर', 447),
        (gen_random_uuid(), 7, 'ब्राह्मण', 282),
        (gen_random_uuid(), 7, 'ठकुरी', 107),
        (gen_random_uuid(), 7, 'यादव', 955),
        (gen_random_uuid(), 7, 'थारु', 88),
        (gen_random_uuid(), 7, 'गुरुङ', 268),
        (gen_random_uuid(), 7, 'दमाई/ढोली', 99),
        (gen_random_uuid(), 7, 'मुसलमान', 3859),
        (gen_random_uuid(), 7, 'अन्य जातजाति', 3768),

        -- Ward 8
        (gen_random_uuid(), 8, 'क्षेत्री', 1015),
        (gen_random_uuid(), 8, 'कामी', 394),
        (gen_random_uuid(), 8, 'मगर', 156),
        (gen_random_uuid(), 8, 'ब्राह्मण', 270),
        (gen_random_uuid(), 8, 'ठकुरी', 234),
        (gen_random_uuid(), 8, 'यादव', 89),
        (gen_random_uuid(), 8, 'थारु', 831),
        (gen_random_uuid(), 8, 'गुरुङ', 0),
        (gen_random_uuid(), 8, 'दमाई/ढोली', 46),
        (gen_random_uuid(), 8, 'मुसलमान', 4771),
        (gen_random_uuid(), 8, 'अन्य जातजाति', 429);
    END IF;
END
$$;

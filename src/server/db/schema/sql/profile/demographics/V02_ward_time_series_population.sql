-- Check if ward_time_series_population table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_time_series_population'
    ) THEN
        CREATE TABLE acme_ward_time_series_population (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            ward_name TEXT,
            year INTEGER NOT NULL,
            total_population INTEGER,
            male_population INTEGER,
            female_population INTEGER,
            other_population INTEGER,
            total_households INTEGER,
            average_household_size DECIMAL,
            population_0_to_14 INTEGER,
            population_15_to_59 INTEGER,
            population_60_and_above INTEGER,
            literacy_rate DECIMAL,
            male_literacy_rate DECIMAL,
            female_literacy_rate DECIMAL,
            growth_rate DECIMAL,
            area_sq_km DECIMAL,
            population_density DECIMAL,
            sex_ratio DECIMAL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_time_series_population) THEN
        INSERT INTO acme_ward_time_series_population (
            id, ward_number, ward_name, year, total_population, area_sq_km
        )
        VALUES
        -- Ward 1 - Rajapur
        (gen_random_uuid(), 1, 'राजापुर (१-१)', 2068, 3355, 6.37),
        (gen_random_uuid(), 1, 'राजापुर (१-१)', 2078, 3730, 6.37),
        (gen_random_uuid(), 1, 'राजापुर (१-१)', 2081, 4112, 6.37),

        -- Ward 2 - Sitaapur
        (gen_random_uuid(), 2, 'सीतापुर (१-२)', 2068, 9696, 18.19),
        (gen_random_uuid(), 2, 'सीतापुर (१-२)', 2078, 10124, 18.19),
        (gen_random_uuid(), 2, 'सीतापुर (१-२)', 2081, 10544, 18.19),

        -- Ward 3 - Bageshwari (१-३, ५)
        (gen_random_uuid(), 3, 'बागेश्वरी (१-३, ५)', 2068, 6115, 12.65),
        (gen_random_uuid(), 3, 'बागेश्वरी (१-३, ५)', 2078, 6533, 12.65),
        (gen_random_uuid(), 3, 'बागेश्वरी (१-३, ५)', 2081, 6784, 12.65),

        -- Ward 4 - Bageshwari (४, ६-७)
        (gen_random_uuid(), 4, 'बागेश्वरी (४, ६-७)', 2068, 5547, 12.14),
        (gen_random_uuid(), 4, 'बागेश्वरी (४, ६-७)', 2078, 6036, 12.14),
        (gen_random_uuid(), 4, 'बागेश्वरी (४, ६-७)', 2081, 6397, 12.14),

        -- Ward 5 - Udhrapur (१, ३-५, ७, ९)
        (gen_random_uuid(), 5, 'उधपुर (१, ३-५, ७, ९)', 2068, 5095, 7.56),
        (gen_random_uuid(), 5, 'उधपुर (१, ३-५, ७, ९)', 2078, 5738, 7.56),
        (gen_random_uuid(), 5, 'उधपुर (१, ३-५, ७, ९)', 2081, 6063, 7.56),

        -- Ward 6 - Udhrapur (२, ६, ८)
        (gen_random_uuid(), 6, 'उधपुर (२, ६, ८)', 2068, 4856, 8.29),
        (gen_random_uuid(), 6, 'उधपुर (२, ६, ८)', 2078, 5460, 8.29),
        (gen_random_uuid(), 6, 'उधपुर (२, ६, ८)', 2081, 5781, 8.29),

        -- Ward 7 - Sonpur
        (gen_random_uuid(), 7, 'सोनपुर (१-१)', 2068, 6948, 14.78),
        (gen_random_uuid(), 7, 'सोनपुर (१-१)', 2078, 7638, 14.78),
        (gen_random_uuid(), 7, 'सोनपुर (१-१)', 2081, 7980, 14.78),

        -- Ward 8 - Raniyapur
        (gen_random_uuid(), 8, 'रनियापुर (१-१)', 2068, 6142, 21.35),
        (gen_random_uuid(), 8, 'रनियापुर (१-१)', 2078, 6908, 21.35),
        (gen_random_uuid(), 8, 'रनियापुर (१-१)', 2081, 7267, 21.35);
    END IF;
END
$$;

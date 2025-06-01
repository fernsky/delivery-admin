-- Check if acme_municipality_wide_irrigation_source table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_municipality_wide_irrigation_source'
    ) THEN
        CREATE TABLE acme_municipality_wide_irrigation_source (
            id VARCHAR(36) PRIMARY KEY,
            irrigation_source VARCHAR(100) NOT NULL,
            coverage_in_hectares DECIMAL(10, 2) NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Delete existing data to ensure clean insertion
DO $$
BEGIN
    DELETE FROM acme_municipality_wide_irrigation_source;
END
$$;

-- Insert data from the provided table
DO $$
BEGIN
    -- Lake or Reservoir
    INSERT INTO acme_municipality_wide_irrigation_source (id, irrigation_source, coverage_in_hectares, percentage)
    VALUES
        (gen_random_uuid(), 'LAKE_OR_RESERVOIR', 577.49, 80.76);

    -- Irrigation Canal
    INSERT INTO acme_municipality_wide_irrigation_source (id, irrigation_source, coverage_in_hectares, percentage)
    VALUES
        (gen_random_uuid(), 'IRRIGATION_CANAL', 46.65, 6.52);

    -- Rainwater Collection
    INSERT INTO acme_municipality_wide_irrigation_source (id, irrigation_source, coverage_in_hectares, percentage)
    VALUES
        (gen_random_uuid(), 'RAINWATER_COLLECTION', 7.97, 1.11);

    -- Electric Lift Irrigation
    INSERT INTO acme_municipality_wide_irrigation_source (id, irrigation_source, coverage_in_hectares, percentage)
    VALUES
        (gen_random_uuid(), 'ELECTRIC_LIFT_IRRIGATION', 7.97, 1.11);

    -- Canal
    INSERT INTO acme_municipality_wide_irrigation_source (id, irrigation_source, coverage_in_hectares, percentage)
    VALUES
        (gen_random_uuid(), 'CANAL', 2.51, 0.35);

    -- Pumping Set
    INSERT INTO acme_municipality_wide_irrigation_source (id, irrigation_source, coverage_in_hectares, percentage)
    VALUES
        (gen_random_uuid(), 'PUMPING_SET', 5.79, 0.81);

    -- Underground Irrigation
    INSERT INTO acme_municipality_wide_irrigation_source (id, irrigation_source, coverage_in_hectares, percentage)
    VALUES
        (gen_random_uuid(), 'UNDERGROUND_IRRIGATION', 0.68, 0.10);

    -- Other
    INSERT INTO acme_municipality_wide_irrigation_source (id, irrigation_source, coverage_in_hectares, percentage)
    VALUES
        (gen_random_uuid(), 'OTHER', 65.99, 9.23);

    
END
$$;
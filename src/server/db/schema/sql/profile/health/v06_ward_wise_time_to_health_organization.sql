-- Check if acme_ward_wise_time_to_health_organization table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_time_to_health_organization'
    ) THEN
        CREATE TABLE acme_ward_wise_time_to_health_organization (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            time_to_health_organization VARCHAR(100) NOT NULL,
            households INTEGER NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_time_to_health_organization) THEN
--         INSERT INTO acme_ward_wise_time_to_health_organization (
--             id, ward_number, time_to_health_organization, households
--         )
--         VALUES
--         -- Ward 1
--         (gen_random_uuid(), 1, 'UNDER_15_MIN', 395),
--         (gen_random_uuid(), 1, 'UNDER_30_MIN', 148),
--         (gen_random_uuid(), 1, 'UNDER_1_HOUR', 58),
--         (gen_random_uuid(), 1, '1_HOUR_OR_MORE', 14),
--         -- Ward 2
--         (gen_random_uuid(), 2, 'UNDER_15_MIN', 420),
--         (gen_random_uuid(), 2, 'UNDER_30_MIN', 138),
--         (gen_random_uuid(), 2, 'UNDER_1_HOUR', 45),
--         (gen_random_uuid(), 2, '1_HOUR_OR_MORE', 10),
--         -- Ward 3
--         (gen_random_uuid(), 3, 'UNDER_15_MIN', 315),
--         (gen_random_uuid(), 3, 'UNDER_30_MIN', 192),
--         (gen_random_uuid(), 3, 'UNDER_1_HOUR', 75),
--         (gen_random_uuid(), 3, 'HOUR_OR_MORE', 28),
--         -- Ward 4
--         (gen_random_uuid(), 4, 'UNDER_15_MIN', 388),
--         (gen_random_uuid(), 4, 'UNDER_30_MIN', 158),
--         (gen_random_uuid(), 4, 'UNDER_1_HOUR', 52),
--         (gen_random_uuid(), 4, '1_HOUR_OR_MORE', 18),
--         -- Ward 5
--         (gen_random_uuid(), 5, 'UNDER_15_MIN', 345),
--         (gen_random_uuid(), 5, 'UNDER_30_MIN', 178),
--         (gen_random_uuid(), 5, 'UNDER_1_HOUR', 62),
--         (gen_random_uuid(), 5, '1_HOUR_OR_MORE', 25);
--     END IF;
-- END
-- $$;
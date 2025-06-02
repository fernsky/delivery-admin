-- Check if acme_ward_wise_time_to_public_transport table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_time_to_public_transport'
    ) THEN
        CREATE TABLE acme_ward_wise_time_to_public_transport (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            time_to_public_transport VARCHAR(100) NOT NULL,
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
--     IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_time_to_public_transport) THEN
--         INSERT INTO acme_ward_wise_time_to_public_transport (
--             id, ward_number, time_to_public_transport, households
--         )
--         VALUES
--         -- Ward 1
--         (gen_random_uuid(), 1, 'UNDER_15_MIN', 382),
--         (gen_random_uuid(), 1, 'UNDER_30_MIN', 156),
--         (gen_random_uuid(), 1, 'UNDER_1_HOUR', 63),
--         (gen_random_uuid(), 1, '1_HOUR_OR_MORE', 18),
--         -- Ward 2
--         (gen_random_uuid(), 2, 'UNDER_15_MIN', 415),
--         (gen_random_uuid(), 2, 'UNDER_30_MIN', 142),
--         (gen_random_uuid(), 2, 'UNDER_1_HOUR', 48),
--         (gen_random_uuid(), 2, '1_HOUR_OR_MORE', 12),
--         -- Ward 3
--         (gen_random_uuid(), 3, 'UNDER_15_MIN', 328),
--         (gen_random_uuid(), 3, 'UNDER_30_MIN', 187),
--         (gen_random_uuid(), 3, 'UNDER_1_HOUR', 72),
--         (gen_random_uuid(), 3, '1_HOUR_OR_MORE', 24),
--         -- Ward 4
--         (gen_random_uuid(), 4, 'UNDER_15_MIN', 396),
--         (gen_random_uuid(), 4, 'UNDER_30_MIN', 163),
--         (gen_random_uuid(), 4, 'UNDER_1_HOUR', 54),
--         (gen_random_uuid(), 4, '1_HOUR_OR_MORE', 15),
--         -- Ward 5
--         (gen_random_uuid(), 5, 'UNDER_15_MIN', 352),
--         (gen_random_uuid(), 5, 'UNDER_30_MIN', 175),
--         (gen_random_uuid(), 5, 'UNDER_1_HOUR', 68),
--         (gen_random_uuid(), 5, '1_HOUR_OR_MORE', 21);
--     END IF;
-- END
-- $$;
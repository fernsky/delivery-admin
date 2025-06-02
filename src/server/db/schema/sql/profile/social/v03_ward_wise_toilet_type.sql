-- Check if acme_ward_wise_toilet_type table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_toilet_type'
    ) THEN
        CREATE TABLE acme_ward_wise_toilet_type (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            toilet_type VARCHAR(100) NOT NULL,
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
--     IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_toilet_type) THEN
--         INSERT INTO acme_ward_wise_toilet_type (
--             id, ward_number, toilet_type, households
--         )
--         VALUES
--         -- Ward 1
--         (gen_random_uuid(), 1, 'FLUSH_WITH_SEPTIC_TANK', 290),
--         (gen_random_uuid(), 1, 'NORMAL', 320),
--         (gen_random_uuid(), 1, 'PUBLIC_EILANI', 45),
--         (gen_random_uuid(), 1, 'NO_TOILET', 30),
--         (gen_random_uuid(), 1, 'OTHER', 15),
--         -- Ward 2
--         (gen_random_uuid(), 2, 'FLUSH_WITH_SEPTIC_TANK', 310),
--         (gen_random_uuid(), 2, 'NORMAL', 305),
--         (gen_random_uuid(), 2, 'PUBLIC_EILANI', 52),
--         (gen_random_uuid(), 2, 'NO_TOILET', 22),
--         (gen_random_uuid(), 2, 'OTHER', 13),
--         -- Ward 3
--         (gen_random_uuid(), 3, 'FLUSH_WITH_SEPTIC_TANK', 275),
--         (gen_random_uuid(), 3, 'NORMAL', 345),
--         (gen_random_uuid(), 3, 'PUBLIC_EILANI', 60),
--         (gen_random_uuid(), 3, 'NO_TOILET', 35),
--         (gen_random_uuid(), 3, 'OTHER', 20),
--         -- Ward 4
--         (gen_random_uuid(), 4, 'FLUSH_WITH_SEPTIC_TANK', 295),
--         (gen_random_uuid(), 4, 'NORMAL', 325),
--         (gen_random_uuid(), 4, 'PUBLIC_EILANI', 50),
--         (gen_random_uuid(), 4, 'NO_TOILET', 25),
--         (gen_random_uuid(), 4, 'OTHER', 18),
--         -- Ward 5
--         (gen_random_uuid(), 5, 'FLUSH_WITH_SEPTIC_TANK', 285),
--         (gen_random_uuid(), 5, 'NORMAL', 335),
--         (gen_random_uuid(), 5, 'PUBLIC_EILANI', 55),
--         (gen_random_uuid(), 5, 'NO_TOILET', 28),
--         (gen_random_uuid(), 5, 'OTHER', 17);
--     END IF;
-- END
-- $$;
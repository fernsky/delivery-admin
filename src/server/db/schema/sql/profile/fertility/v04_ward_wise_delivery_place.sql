-- Check if acme_ward_wise_delivery_places table exists, if not create it
DO $$
BEGIN
    -- First create the enum type if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'delivery_place_type'
    ) THEN
        CREATE TYPE delivery_place_type AS ENUM (
            'HOUSE',
            'GOVERNMENTAL_HEALTH_INSTITUTION',
            'PRIVATE_HEALTH_INSTITUTION',
            'OTHER'
        );
    END IF;

    -- Then create the table if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_delivery_places'
    ) THEN
        CREATE TABLE acme_ward_wise_delivery_places (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            delivery_place delivery_place_type NOT NULL,
            population INTEGER NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_delivery_places) THEN
--         INSERT INTO acme_ward_wise_delivery_places (
--             id, ward_number, delivery_place, population
--         )
--         VALUES
--         -- Ward 1 data
--         (gen_random_uuid(), 1, 'HOUSE', 24),
--         (gen_random_uuid(), 1, 'GOVERNMENTAL_HEALTH_INSTITUTION', 157),
--         (gen_random_uuid(), 1, 'PRIVATE_HEALTH_INSTITUTION', 42),
--         (gen_random_uuid(), 1, 'OTHER', 5),
--         -- Ward 2 data
--         (gen_random_uuid(), 2, 'HOUSE', 18),
--         (gen_random_uuid(), 2, 'GOVERNMENTAL_HEALTH_INSTITUTION', 134),
--         (gen_random_uuid(), 2, 'PRIVATE_HEALTH_INSTITUTION', 51),
--         (gen_random_uuid(), 2, 'OTHER', 3),
--         -- Ward 3 data
--         (gen_random_uuid(), 3, 'HOUSE', 32),
--         (gen_random_uuid(), 3, 'GOVERNMENTAL_HEALTH_INSTITUTION', 144),
--         (gen_random_uuid(), 3, 'PRIVATE_HEALTH_INSTITUTION', 36),
--         (gen_random_uuid(), 3, 'OTHER', 6),
--         -- Ward 4 data
--         (gen_random_uuid(), 4, 'HOUSE', 19),
--         (gen_random_uuid(), 4, 'GOVERNMENTAL_HEALTH_INSTITUTION', 168),
--         (gen_random_uuid(), 4, 'PRIVATE_HEALTH_INSTITUTION', 45),
--         (gen_random_uuid(), 4, 'OTHER', 4),
--         -- Ward 5 data
--         (gen_random_uuid(), 5, 'HOUSE', 15),
--         (gen_random_uuid(), 5, 'GOVERNMENTAL_HEALTH_INSTITUTION', 172),
--         (gen_random_uuid(), 5, 'PRIVATE_HEALTH_INSTITUTION', 53),
--         (gen_random_uuid(), 5, 'OTHER', 2),
--         -- Ward 6 data
--         (gen_random_uuid(), 6, 'HOUSE', 28),
--         (gen_random_uuid(), 6, 'GOVERNMENTAL_HEALTH_INSTITUTION', 139),
--         (gen_random_uuid(), 6, 'PRIVATE_HEALTH_INSTITUTION', 38),
--         (gen_random_uuid(), 6, 'OTHER', 7),
--         -- Ward 7 data
--         (gen_random_uuid(), 7, 'HOUSE', 21),
--         (gen_random_uuid(), 7, 'GOVERNMENTAL_HEALTH_INSTITUTION', 165),
--         (gen_random_uuid(), 7, 'PRIVATE_HEALTH_INSTITUTION', 44),
--         (gen_random_uuid(), 7, 'OTHER', 4),
--         -- Ward 8 data
--         (gen_random_uuid(), 8, 'HOUSE', 17),
--         (gen_random_uuid(), 8, 'GOVERNMENTAL_HEALTH_INSTITUTION', 175),
--         (gen_random_uuid(), 8, 'PRIVATE_HEALTH_INSTITUTION', 49),
--         (gen_random_uuid(), 8, 'OTHER', 3),
--         -- Ward 9 data
--         (gen_random_uuid(), 9, 'HOUSE', 26),
--         (gen_random_uuid(), 9, 'GOVERNMENTAL_HEALTH_INSTITUTION', 150),
--         (gen_random_uuid(), 9, 'PRIVATE_HEALTH_INSTITUTION', 41),
--         (gen_random_uuid(), 9, 'OTHER', 5),
--         -- Ward 10 data
--         (gen_random_uuid(), 10, 'HOUSE', 22),
--         (gen_random_uuid(), 10, 'GOVERNMENTAL_HEALTH_INSTITUTION', 158),
--         (gen_random_uuid(), 10, 'PRIVATE_HEALTH_INSTITUTION', 39),
--         (gen_random_uuid(), 10, 'OTHER', 4),
--         -- Ward 11 data
--         (gen_random_uuid(), 11, 'HOUSE', 29),
--         (gen_random_uuid(), 11, 'GOVERNMENTAL_HEALTH_INSTITUTION', 142),
--         (gen_random_uuid(), 11, 'PRIVATE_HEALTH_INSTITUTION', 37),
--         (gen_random_uuid(), 11, 'OTHER', 6),
--         -- Ward 12 data
--         (gen_random_uuid(), 12, 'HOUSE', 14),
--         (gen_random_uuid(), 12, 'GOVERNMENTAL_HEALTH_INSTITUTION', 183),
--         (gen_random_uuid(), 12, 'PRIVATE_HEALTH_INSTITUTION', 52),
--         (gen_random_uuid(), 12, 'OTHER', 3);
--     END IF;
-- END
-- $$;
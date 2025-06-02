-- Check if acme_ward_wise_solid_waste_management table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_solid_waste_management'
    ) THEN
        CREATE TABLE acme_ward_wise_solid_waste_management (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            solid_waste_management VARCHAR(100) NOT NULL,
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
--     IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_solid_waste_management) THEN
--         INSERT INTO acme_ward_wise_solid_waste_management (
--             id, ward_number, solid_waste_management, households
--         )
--         VALUES
--         -- Ward 1
--         (gen_random_uuid(), 1, 'HOME_COLLECTION', 285),
--         (gen_random_uuid(), 1, 'WASTE_COLLECTING_PLACE', 165),
--         (gen_random_uuid(), 1, 'BURNING', 95),
--         (gen_random_uuid(), 1, 'DIGGING', 52),
--         (gen_random_uuid(), 1, 'RIVER', 18),
--         (gen_random_uuid(), 1, 'ROAD_OR_PUBLIC_PLACE', 25),
--         (gen_random_uuid(), 1, 'COMPOST_MANURE', 48),
--         (gen_random_uuid(), 1, 'OTHER', 12),
--         -- Ward 2
--         (gen_random_uuid(), 2, 'HOME_COLLECTION', 312),
--         (gen_random_uuid(), 2, 'WASTE_COLLECTING_PLACE', 146),
--         (gen_random_uuid(), 2, 'BURNING', 88),
--         (gen_random_uuid(), 2, 'DIGGING', 45),
--         (gen_random_uuid(), 2, 'RIVER', 15),
--         (gen_random_uuid(), 2, 'ROAD_OR_PUBLIC_PLACE', 22),
--         (gen_random_uuid(), 2, 'COMPOST_MANURE', 52),
--         (gen_random_uuid(), 2, 'OTHER', 10),
--         -- Ward 3
--         (gen_random_uuid(), 3, 'HOME_COLLECTION', 268),
--         (gen_random_uuid(), 3, 'WASTE_COLLECTING_PLACE', 175),
--         (gen_random_uuid(), 3, 'BURNING', 105),
--         (gen_random_uuid(), 3, 'DIGGING', 60),
--         (gen_random_uuid(), 3, 'RIVER', 25),
--         (gen_random_uuid(), 3, 'ROAD_OR_PUBLIC_PLACE', 35),
--         (gen_random_uuid(), 3, 'COMPOST_MANURE', 42),
--         (gen_random_uuid(), 3, 'OTHER', 15),
--         -- Ward 4
--         (gen_random_uuid(), 4, 'HOME_COLLECTION', 295),
--         (gen_random_uuid(), 4, 'WASTE_COLLECTING_PLACE', 155),
--         (gen_random_uuid(), 4, 'BURNING', 90),
--         (gen_random_uuid(), 4, 'DIGGING', 48),
--         (gen_random_uuid(), 4, 'RIVER', 16),
--         (gen_random_uuid(), 4, 'ROAD_OR_PUBLIC_PLACE', 24),
--         (gen_random_uuid(), 4, 'COMPOST_MANURE', 50),
--         (gen_random_uuid(), 4, 'OTHER', 11),
--         -- Ward 5
--         (gen_random_uuid(), 5, 'HOME_COLLECTION', 275),
--         (gen_random_uuid(), 5, 'WASTE_COLLECTING_PLACE', 162),
--         (gen_random_uuid(), 5, 'BURNING', 98),
--         (gen_random_uuid(), 5, 'DIGGING', 55),
--         (gen_random_uuid(), 5, 'RIVER', 22),
--         (gen_random_uuid(), 5, 'ROAD_OR_PUBLIC_PLACE', 30),
--         (gen_random_uuid(), 5, 'COMPOST_MANURE', 45),
--         (gen_random_uuid(), 5, 'OTHER', 13);
--     END IF;
-- END
-- $$;
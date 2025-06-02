-- Check if acme_ward_wise_facilities table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_facilities'
    ) THEN
        CREATE TABLE acme_ward_wise_facilities (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            facility VARCHAR(100) NOT NULL,
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
--     IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_facilities) THEN
--         INSERT INTO acme_ward_wise_facilities (
--             id, ward_number, facility, households
--         )
--         VALUES
--         -- Ward 1
--         (gen_random_uuid(), 1, 'RADIO', 285),
--         (gen_random_uuid(), 1, 'TELEVISION', 485),
--         (gen_random_uuid(), 1, 'COMPUTER', 320),
--         (gen_random_uuid(), 1, 'INTERNET', 380),
--         (gen_random_uuid(), 1, 'MOBILE_PHONE', 530),
--         (gen_random_uuid(), 1, 'CAR_JEEP', 110),
--         (gen_random_uuid(), 1, 'MOTORCYCLE', 250),
--         (gen_random_uuid(), 1, 'BICYCLE', 270),
--         (gen_random_uuid(), 1, 'REFRIGERATOR', 345),
--         (gen_random_uuid(), 1, 'WASHING_MACHINE', 195),
--         (gen_random_uuid(), 1, 'AIR_CONDITIONER', 85),
--         (gen_random_uuid(), 1, 'ELECTRICAL_FAN', 430),
--         (gen_random_uuid(), 1, 'MICROWAVE_OVEN', 150),
--         (gen_random_uuid(), 1, 'DAILY_NATIONAL_NEWSPAPER_ACCESS', 210),
--         (gen_random_uuid(), 1, 'NONE', 40),
--         -- Ward 2
--         (gen_random_uuid(), 2, 'RADIO', 260),
--         (gen_random_uuid(), 2, 'TELEVISION', 510),
--         (gen_random_uuid(), 2, 'COMPUTER', 350),
--         (gen_random_uuid(), 2, 'INTERNET', 420),
--         (gen_random_uuid(), 2, 'MOBILE_PHONE', 560),
--         (gen_random_uuid(), 2, 'CAR_JEEP', 125),
--         (gen_random_uuid(), 2, 'MOTORCYCLE', 280),
--         (gen_random_uuid(), 2, 'BICYCLE', 240),
--         (gen_random_uuid(), 2, 'REFRIGERATOR', 380),
--         (gen_random_uuid(), 2, 'WASHING_MACHINE', 220),
--         (gen_random_uuid(), 2, 'AIR_CONDITIONER', 95),
--         (gen_random_uuid(), 2, 'ELECTRICAL_FAN', 460),
--         (gen_random_uuid(), 2, 'MICROWAVE_OVEN', 175),
--         (gen_random_uuid(), 2, 'DAILY_NATIONAL_NEWSPAPER_ACCESS', 230),
--         (gen_random_uuid(), 2, 'NONE', 30),
--         -- Ward 3
--         (gen_random_uuid(), 3, 'RADIO', 240),
--         (gen_random_uuid(), 3, 'TELEVISION', 460),
--         (gen_random_uuid(), 3, 'COMPUTER', 290),
--         (gen_random_uuid(), 3, 'INTERNET', 350),
--         (gen_random_uuid(), 3, 'MOBILE_PHONE', 510),
--         (gen_random_uuid(), 3, 'CAR_JEEP', 95),
--         (gen_random_uuid(), 3, 'MOTORCYCLE', 230),
--         (gen_random_uuid(), 3, 'BICYCLE', 280),
--         (gen_random_uuid(), 3, 'REFRIGERATOR', 320),
--         (gen_random_uuid(), 3, 'WASHING_MACHINE', 180),
--         (gen_random_uuid(), 3, 'AIR_CONDITIONER', 70),
--         (gen_random_uuid(), 3, 'ELECTRICAL_FAN', 390),
--         (gen_random_uuid(), 3, 'MICROWAVE_OVEN', 130),
--         (gen_random_uuid(), 3, 'DAILY_NATIONAL_NEWSPAPER_ACCESS', 190),
--         (gen_random_uuid(), 3, 'NONE', 55),
--         -- Ward 4
--         (gen_random_uuid(), 4, 'RADIO', 270),
--         (gen_random_uuid(), 4, 'TELEVISION', 500),
--         (gen_random_uuid(), 4, 'COMPUTER', 330),
--         (gen_random_uuid(), 4, 'INTERNET', 400),
--         (gen_random_uuid(), 4, 'MOBILE_PHONE', 545),
--         (gen_random_uuid(), 4, 'CAR_JEEP', 120),
--         (gen_random_uuid(), 4, 'MOTORCYCLE', 265),
--         (gen_random_uuid(), 4, 'BICYCLE', 250),
--         (gen_random_uuid(), 4, 'REFRIGERATOR', 360),
--         (gen_random_uuid(), 4, 'WASHING_MACHINE', 210),
--         (gen_random_uuid(), 4, 'AIR_CONDITIONER', 90),
--         (gen_random_uuid(), 4, 'ELECTRICAL_FAN', 445),
--         (gen_random_uuid(), 4, 'MICROWAVE_OVEN', 165),
--         (gen_random_uuid(), 4, 'DAILY_NATIONAL_NEWSPAPER_ACCESS', 220),
--         (gen_random_uuid(), 4, 'NONE', 35),
--         -- Ward 5
--         (gen_random_uuid(), 5, 'RADIO', 250),
--         (gen_random_uuid(), 5, 'TELEVISION', 475),
--         (gen_random_uuid(), 5, 'COMPUTER', 310),
--         (gen_random_uuid(), 5, 'INTERNET', 370),
--         (gen_random_uuid(), 5, 'MOBILE_PHONE', 520),
--         (gen_random_uuid(), 5, 'CAR_JEEP', 105),
--         (gen_random_uuid(), 5, 'MOTORCYCLE', 245),
--         (gen_random_uuid(), 5, 'BICYCLE', 260),
--         (gen_random_uuid(), 5, 'REFRIGERATOR', 335),
--         (gen_random_uuid(), 5, 'WASHING_MACHINE', 190),
--         (gen_random_uuid(), 5, 'AIR_CONDITIONER', 80),
--         (gen_random_uuid(), 5, 'ELECTRICAL_FAN', 420),
--         (gen_random_uuid(), 5, 'MICROWAVE_OVEN', 145),
--         (gen_random_uuid(), 5, 'DAILY_NATIONAL_NEWSPAPER_ACCESS', 200),
--         (gen_random_uuid(), 5, 'NONE', 45);
--     END IF;
-- END
-- $$;
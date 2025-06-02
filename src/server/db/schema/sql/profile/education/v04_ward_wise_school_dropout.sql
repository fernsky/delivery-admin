-- Check if acme_ward_wise_school_dropout table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_school_dropout'
    ) THEN
        CREATE TABLE acme_ward_wise_school_dropout (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            cause VARCHAR(100) NOT NULL,
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
--     IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_school_dropout) THEN
--         INSERT INTO acme_ward_wise_school_dropout (
--             id, ward_number, cause, population
--         )
--         VALUES
--         -- Ward 1
--         (gen_random_uuid(), 1, 'BUSINESS', 85),
--         (gen_random_uuid(), 1, 'PRIVATE_JOB', 120),
--         (gen_random_uuid(), 1, 'GOVERNMENTAL_JOB', 45),
--         (gen_random_uuid(), 1, 'STUDY', 65),
--         (gen_random_uuid(), 1, 'WORK', 150),
--         (gen_random_uuid(), 1, 'DEPENDENT', 35),
--         (gen_random_uuid(), 1, 'CONFLICT', 12),
--         (gen_random_uuid(), 1, 'OTHER', 28),
--         (gen_random_uuid(), 1, 'UNKNOWN', 18),
--         -- Ward 2
--         (gen_random_uuid(), 2, 'BUSINESS', 92),
--         (gen_random_uuid(), 2, 'PRIVATE_JOB', 135),
--         (gen_random_uuid(), 2, 'GOVERNMENTAL_JOB', 58),
--         (gen_random_uuid(), 2, 'STUDY', 72),
--         (gen_random_uuid(), 2, 'WORK', 165),
--         (gen_random_uuid(), 2, 'DEPENDENT', 42),
--         (gen_random_uuid(), 2, 'CONFLICT', 15),
--         (gen_random_uuid(), 2, 'OTHER', 32),
--         (gen_random_uuid(), 2, 'UNKNOWN', 25),
--         -- Ward 3
--         (gen_random_uuid(), 3, 'BUSINESS', 78),
--         (gen_random_uuid(), 3, 'PRIVATE_JOB', 110),
--         (gen_random_uuid(), 3, 'GOVERNMENTAL_JOB', 38),
--         (gen_random_uuid(), 3, 'STUDY', 57),
--         (gen_random_uuid(), 3, 'WORK', 142),
--         (gen_random_uuid(), 3, 'DEPENDENT', 30),
--         (gen_random_uuid(), 3, 'CONFLICT', 9),
--         (gen_random_uuid(), 3, 'OTHER', 24),
--         (gen_random_uuid(), 3, 'UNKNOWN', 15),
--         -- Ward 4
--         (gen_random_uuid(), 4, 'BUSINESS', 82),
--         (gen_random_uuid(), 4, 'PRIVATE_JOB', 118),
--         (gen_random_uuid(), 4, 'GOVERNMENTAL_JOB', 42),
--         (gen_random_uuid(), 4, 'STUDY', 60),
--         (gen_random_uuid(), 4, 'WORK', 155),
--         (gen_random_uuid(), 4, 'DEPENDENT', 32),
--         (gen_random_uuid(), 4, 'CONFLICT', 11),
--         (gen_random_uuid(), 4, 'OTHER', 26),
--         (gen_random_uuid(), 4, 'UNKNOWN', 19),
--         -- Ward 5
--         (gen_random_uuid(), 5, 'BUSINESS', 70),
--         (gen_random_uuid(), 5, 'PRIVATE_JOB', 95),
--         (gen_random_uuid(), 5, 'GOVERNMENTAL_JOB', 32),
--         (gen_random_uuid(), 5, 'STUDY', 48),
--         (gen_random_uuid(), 5, 'WORK', 130),
--         (gen_random_uuid(), 5, 'DEPENDENT', 25),
--         (gen_random_uuid(), 5, 'CONFLICT', 8),
--         (gen_random_uuid(), 5, 'OTHER', 20),
--         (gen_random_uuid(), 5, 'UNKNOWN', 12);
--     END IF;
-- END
-- $$;
-- Check if acme_ward_wise_educational_level table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_educational_level'
    ) THEN
        CREATE TABLE acme_ward_wise_educational_level (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            educational_level_type VARCHAR(100) NOT NULL,
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
--     IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_educational_level) THEN
--         INSERT INTO acme_ward_wise_educational_level (
--             id, ward_number, educational_level_type, population
--         )
--         VALUES
--         -- Ward 1
--         (gen_random_uuid(), 1, 'CHILD_DEVELOPMENT_CENTER', 120),
--         (gen_random_uuid(), 1, 'NURSERY', 135),
--         (gen_random_uuid(), 1, 'GRADE_1', 142),
--         (gen_random_uuid(), 1, 'GRADE_2', 138),
--         (gen_random_uuid(), 1, 'GRADE_3', 145),
--         (gen_random_uuid(), 1, 'GRADE_4', 140),
--         (gen_random_uuid(), 1, 'GRADE_5', 152),
--         (gen_random_uuid(), 1, 'GRADE_6', 148),
--         (gen_random_uuid(), 1, 'GRADE_7', 156),
--         (gen_random_uuid(), 1, 'GRADE_8', 150),
--         (gen_random_uuid(), 1, 'GRADE_9', 162),
--         (gen_random_uuid(), 1, 'GRADE_10', 155),
--         (gen_random_uuid(), 1, 'SLC_LEVEL', 220),
--         (gen_random_uuid(), 1, 'CLASS_12_LEVEL', 180),
--         (gen_random_uuid(), 1, 'BACHELOR_LEVEL', 120),
--         (gen_random_uuid(), 1, 'MASTERS_LEVEL', 65),
--         (gen_random_uuid(), 1, 'PHD_LEVEL', 12),
--         (gen_random_uuid(), 1, 'INFORMAL_EDUCATION', 85),
--         (gen_random_uuid(), 1, 'OTHER', 30),
--         (gen_random_uuid(), 1, 'EDUCATED', 240),
--         (gen_random_uuid(), 1, 'UNKNOWN', 35),
--         -- Ward 2
--         (gen_random_uuid(), 2, 'CHILD_DEVELOPMENT_CENTER', 105),
--         (gen_random_uuid(), 2, 'NURSERY', 125),
--         (gen_random_uuid(), 2, 'GRADE_1', 130),
--         (gen_random_uuid(), 2, 'GRADE_2', 126),
--         (gen_random_uuid(), 2, 'GRADE_3', 132),
--         (gen_random_uuid(), 2, 'GRADE_4', 128),
--         (gen_random_uuid(), 2, 'GRADE_5', 138),
--         (gen_random_uuid(), 2, 'GRADE_6', 142),
--         (gen_random_uuid(), 2, 'GRADE_7', 135),
--         (gen_random_uuid(), 2, 'GRADE_8', 145),
--         (gen_random_uuid(), 2, 'GRADE_9', 152),
--         (gen_random_uuid(), 2, 'GRADE_10', 148),
--         (gen_random_uuid(), 2, 'SLC_LEVEL', 195),
--         (gen_random_uuid(), 2, 'CLASS_12_LEVEL', 165),
--         (gen_random_uuid(), 2, 'BACHELOR_LEVEL', 108),
--         (gen_random_uuid(), 2, 'MASTERS_LEVEL', 58),
--         (gen_random_uuid(), 2, 'PHD_LEVEL', 10),
--         (gen_random_uuid(), 2, 'INFORMAL_EDUCATION', 75),
--         (gen_random_uuid(), 2, 'OTHER', 25),
--         (gen_random_uuid(), 2, 'EDUCATED', 215),
--         (gen_random_uuid(), 2, 'UNKNOWN', 28),
--         -- Ward 3
--         (gen_random_uuid(), 3, 'CHILD_DEVELOPMENT_CENTER', 95),
--         (gen_random_uuid(), 3, 'NURSERY', 112),
--         (gen_random_uuid(), 3, 'GRADE_1', 118),
--         (gen_random_uuid(), 3, 'GRADE_2', 115),
--         (gen_random_uuid(), 3, 'GRADE_3', 122),
--         (gen_random_uuid(), 3, 'GRADE_4', 117),
--         (gen_random_uuid(), 3, 'GRADE_5', 125),
--         (gen_random_uuid(), 3, 'GRADE_6', 120),
--         (gen_random_uuid(), 3, 'GRADE_7', 128),
--         (gen_random_uuid(), 3, 'GRADE_8', 124),
--         (gen_random_uuid(), 3, 'GRADE_9', 132),
--         (gen_random_uuid(), 3, 'GRADE_10', 126),
--         (gen_random_uuid(), 3, 'SLC_LEVEL', 185),
--         (gen_random_uuid(), 3, 'CLASS_12_LEVEL', 145),
--         (gen_random_uuid(), 3, 'BACHELOR_LEVEL', 95),
--         (gen_random_uuid(), 3, 'MASTERS_LEVEL', 48),
--         (gen_random_uuid(), 3, 'PHD_LEVEL', 8),
--         (gen_random_uuid(), 3, 'INFORMAL_EDUCATION', 68),
--         (gen_random_uuid(), 3, 'OTHER', 22),
--         (gen_random_uuid(), 3, 'EDUCATED', 190),
--         (gen_random_uuid(), 3, 'UNKNOWN', 24);
--     END IF;
-- END
-- $$;
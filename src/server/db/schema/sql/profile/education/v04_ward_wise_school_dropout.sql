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
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_school_dropout) THEN
        INSERT INTO acme_ward_wise_school_dropout (
            id, ward_number, cause, population
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'MARRIAGE', 155),
        (gen_random_uuid(), 1, 'HOUSEHOLD_WORK', 41),
        (gen_random_uuid(), 1, 'WORK_JOB', 49),
        (gen_random_uuid(), 1, 'PARENTS_UNWILLING', 6),
        (gen_random_uuid(), 1, 'COMPLETED_DESIRED_EDUCATION', 105),
        (gen_random_uuid(), 1, 'TOO_EXPENSIVE', 2),
        (gen_random_uuid(), 1, 'OTHER', 65),
        
        -- Ward 2
        (gen_random_uuid(), 2, 'MARRIAGE', 416),
        (gen_random_uuid(), 2, 'HOUSEHOLD_WORK', 105),
        (gen_random_uuid(), 2, 'WORK_JOB', 203),
        (gen_random_uuid(), 2, 'PARENTS_UNWILLING', 2),
        (gen_random_uuid(), 2, 'COMPLETED_DESIRED_EDUCATION', 53),
        (gen_random_uuid(), 2, 'TOO_EXPENSIVE', 28),
        (gen_random_uuid(), 2, 'TOO_FAR', 4),
        (gen_random_uuid(), 2, 'OTHER', 128),
        
        -- Ward 3
        (gen_random_uuid(), 3, 'MARRIAGE', 273),
        (gen_random_uuid(), 3, 'HOUSEHOLD_WORK', 43),
        (gen_random_uuid(), 3, 'WORK_JOB', 188),
        (gen_random_uuid(), 3, 'PARENTS_UNWILLING', 3),
        (gen_random_uuid(), 3, 'COMPLETED_DESIRED_EDUCATION', 91),
        (gen_random_uuid(), 3, 'TOO_EXPENSIVE', 6),
        (gen_random_uuid(), 3, 'TOO_FAR', 3),
        (gen_random_uuid(), 3, 'NO_OTHER_SCHOOL', 2),
        (gen_random_uuid(), 3, 'OTHER', 184),
        
        -- Ward 4
        (gen_random_uuid(), 4, 'MARRIAGE', 290),
        (gen_random_uuid(), 4, 'HOUSEHOLD_WORK', 44),
        (gen_random_uuid(), 4, 'WORK_JOB', 117),
        (gen_random_uuid(), 4, 'PARENTS_UNWILLING', 13),
        (gen_random_uuid(), 4, 'COMPLETED_DESIRED_EDUCATION', 75),
        (gen_random_uuid(), 4, 'TOO_EXPENSIVE', 5),
        (gen_random_uuid(), 4, 'NO_OTHER_SCHOOL', 4),
        (gen_random_uuid(), 4, 'OTHER', 136),
        
        -- Ward 5
        (gen_random_uuid(), 5, 'MARRIAGE', 144),
        (gen_random_uuid(), 5, 'HOUSEHOLD_WORK', 121),
        (gen_random_uuid(), 5, 'WORK_JOB', 295),
        (gen_random_uuid(), 5, 'PARENTS_UNWILLING', 44),
        (gen_random_uuid(), 5, 'COMPLETED_DESIRED_EDUCATION', 2),
        (gen_random_uuid(), 5, 'TOO_EXPENSIVE', 10),
        (gen_random_uuid(), 5, 'TOO_FAR', 2),
        (gen_random_uuid(), 5, 'NO_OTHER_SCHOOL', 1),
        (gen_random_uuid(), 5, 'OTHER', 732),
        
        -- Ward 6
        (gen_random_uuid(), 6, 'MARRIAGE', 382),
        (gen_random_uuid(), 6, 'HOUSEHOLD_WORK', 416),
        (gen_random_uuid(), 6, 'WORK_JOB', 12),
        (gen_random_uuid(), 6, 'PARENTS_UNWILLING', 34),
        (gen_random_uuid(), 6, 'COMPLETED_DESIRED_EDUCATION', 14),
        (gen_random_uuid(), 6, 'TOO_EXPENSIVE', 25),
        (gen_random_uuid(), 6, 'TOO_FAR', 4),
        (gen_random_uuid(), 6, 'NO_OTHER_SCHOOL', 2),
        (gen_random_uuid(), 6, 'OTHER', 433),
        
        -- Ward 7
        (gen_random_uuid(), 7, 'MARRIAGE', 161),
        (gen_random_uuid(), 7, 'HOUSEHOLD_WORK', 174),
        (gen_random_uuid(), 7, 'WORK_JOB', 89),
        (gen_random_uuid(), 7, 'PARENTS_UNWILLING', 108),
        (gen_random_uuid(), 7, 'COMPLETED_DESIRED_EDUCATION', 54),
        (gen_random_uuid(), 7, 'TOO_EXPENSIVE', 91),
        (gen_random_uuid(), 7, 'TOO_FAR', 6),
        (gen_random_uuid(), 7, 'OTHER', 1497),
        
        -- Ward 8
        (gen_random_uuid(), 8, 'MARRIAGE', 448),
        (gen_random_uuid(), 8, 'HOUSEHOLD_WORK', 350),
        (gen_random_uuid(), 8, 'WORK_JOB', 27),
        (gen_random_uuid(), 8, 'PARENTS_UNWILLING', 287),
        (gen_random_uuid(), 8, 'COMPLETED_DESIRED_EDUCATION', 78),
        (gen_random_uuid(), 8, 'TOO_EXPENSIVE', 58),
        (gen_random_uuid(), 8, 'TOO_FAR', 76),
        (gen_random_uuid(), 8, 'NO_OTHER_SCHOOL', 6),
        (gen_random_uuid(), 8, 'OTHER', 700);
    END IF;
END
$$;
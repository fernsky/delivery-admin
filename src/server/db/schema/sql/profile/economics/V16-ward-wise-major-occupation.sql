-- Check if acme_ward_wise_major_occupation table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_major_occupation'
    ) THEN
        CREATE TABLE acme_ward_wise_major_occupation (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            ward_number INTEGER NOT NULL,
            occupation TEXT NOT NULL,
            population INTEGER NOT NULL DEFAULT 0 CHECK (population >= 0),
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_major_occupation) THEN
        INSERT INTO acme_ward_wise_major_occupation (
            ward_number, occupation, population
        )
        VALUES
        -- Ward 1
        (1, 'AGRICULTURE', 180),
        (1, 'BUSINESS', 95),
        (1, 'GOVERNMENT_SERVICE', 68),
        (1, 'NON_GOVERNMENT_SERVICE', 42),
        (1, 'HOUSEHOLD_WORK', 120),
        (1, 'INDUSTRY_WORK', 35),
        (1, 'DAILY_WAGE', 58),
        (1, 'STUDENT', 145),
        (1, 'FOREIGN_EMPLOYMENT', 72),
        (1, 'RETIRED', 45),
        (1, 'OTHERS', 25),
        
        -- Ward 2
        (2, 'AGRICULTURE', 210),
        (2, 'BUSINESS', 110),
        (2, 'GOVERNMENT_SERVICE', 80),
        (2, 'NON_GOVERNMENT_SERVICE', 50),
        (2, 'HOUSEHOLD_WORK', 140),
        (2, 'INDUSTRY_WORK', 45),
        (2, 'DAILY_WAGE', 68),
        (2, 'STUDENT', 165),
        (2, 'FOREIGN_EMPLOYMENT', 85),
        (2, 'RETIRED', 55),
        (2, 'OTHERS', 30),
        
        -- Ward 3
        (3, 'AGRICULTURE', 160),
        (3, 'BUSINESS', 85),
        (3, 'GOVERNMENT_SERVICE', 60),
        (3, 'NON_GOVERNMENT_SERVICE', 38),
        (3, 'HOUSEHOLD_WORK', 105),
        (3, 'INDUSTRY_WORK', 30),
        (3, 'DAILY_WAGE', 50),
        (3, 'STUDENT', 130),
        (3, 'FOREIGN_EMPLOYMENT', 65),
        (3, 'RETIRED', 40),
        (3, 'OTHERS', 22),
        
        -- Ward 4
        (4, 'AGRICULTURE', 195),
        (4, 'BUSINESS', 100),
        (4, 'GOVERNMENT_SERVICE', 72),
        (4, 'NON_GOVERNMENT_SERVICE', 45),
        (4, 'HOUSEHOLD_WORK', 130),
        (4, 'INDUSTRY_WORK', 40),
        (4, 'DAILY_WAGE', 62),
        (4, 'STUDENT', 155),
        (4, 'FOREIGN_EMPLOYMENT', 78),
        (4, 'RETIRED', 50),
        (4, 'OTHERS', 28),
        
        -- Ward 5
        (5, 'AGRICULTURE', 175),
        (5, 'BUSINESS', 90),
        (5, 'GOVERNMENT_SERVICE', 65),
        (5, 'NON_GOVERNMENT_SERVICE', 40),
        (5, 'HOUSEHOLD_WORK', 115),
        (5, 'INDUSTRY_WORK', 32),
        (5, 'DAILY_WAGE', 55),
        (5, 'STUDENT', 135),
        (5, 'FOREIGN_EMPLOYMENT', 70),
        (5, 'RETIRED', 42),
        (5, 'OTHERS', 24);
    END IF;
END
$$;
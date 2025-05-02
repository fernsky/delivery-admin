-- Set UTF-8 encoding for this script
SET client_encoding = 'UTF8';

-- Create age_group enum type if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'age_group') THEN
        CREATE TYPE age_group AS ENUM (
            'AGE_0_4',
            'AGE_5_9',
            'AGE_10_14',
            'AGE_15_19',
            'AGE_20_24',
            'AGE_25_29',
            'AGE_30_34',
            'AGE_35_39',
            'AGE_40_44',
            'AGE_45_49',
            'AGE_50_54',
            'AGE_55_59',
            'AGE_60_64',
            'AGE_65_69',
            'AGE_70_74',
            'AGE_75_AND_ABOVE'
        );
    END IF;
END
$$;

-- Use gender enum type from V03_ward_wise_househead_gender.sql

-- Create ward_age_wise_population table if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_age_wise_population') THEN
        CREATE TABLE acme_ward_age_wise_population (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            age_group age_group NOT NULL,
            gender gender NOT NULL,
            population INTEGER NOT NULL DEFAULT 0,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
        
        -- Create indexes for faster lookups
        CREATE INDEX idx_ward_age_gender ON acme_ward_age_wise_population(ward_number, age_group, gender);
    END IF;
END
$$;

-- Sample data insertion for Ward 1
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_age_wise_population WHERE ward_number = 1 LIMIT 1) THEN
        -- Ward 1 data
        -- Male population by age group
        INSERT INTO acme_ward_age_wise_population (id, ward_number, age_group, gender, population)
        VALUES
            (gen_random_uuid(), 1, 'AGE_0_4', 'MALE', 128),
            (gen_random_uuid(), 1, 'AGE_5_9', 'MALE', 143),
            (gen_random_uuid(), 1, 'AGE_10_14', 'MALE', 152),
            (gen_random_uuid(), 1, 'AGE_15_19', 'MALE', 145),
            (gen_random_uuid(), 1, 'AGE_20_24', 'MALE', 129),
            (gen_random_uuid(), 1, 'AGE_25_29', 'MALE', 112),
            (gen_random_uuid(), 1, 'AGE_30_34', 'MALE', 98),
            (gen_random_uuid(), 1, 'AGE_35_39', 'MALE', 87),
            (gen_random_uuid(), 1, 'AGE_40_44', 'MALE', 75),
            (gen_random_uuid(), 1, 'AGE_45_49', 'MALE', 68),
            (gen_random_uuid(), 1, 'AGE_50_54', 'MALE', 58),
            (gen_random_uuid(), 1, 'AGE_55_59', 'MALE', 45),
            (gen_random_uuid(), 1, 'AGE_60_64', 'MALE', 38),
            (gen_random_uuid(), 1, 'AGE_65_69', 'MALE', 29),
            (gen_random_uuid(), 1, 'AGE_70_74', 'MALE', 22),
            (gen_random_uuid(), 1, 'AGE_75_AND_ABOVE', 'MALE', 18);
            
        -- Female population by age group
        INSERT INTO acme_ward_age_wise_population (id, ward_number, age_group, gender, population)
        VALUES
            (gen_random_uuid(), 1, 'AGE_0_4', 'FEMALE', 135),
            (gen_random_uuid(), 1, 'AGE_5_9', 'FEMALE', 148),
            (gen_random_uuid(), 1, 'AGE_10_14', 'FEMALE', 157),
            (gen_random_uuid(), 1, 'AGE_15_19', 'FEMALE', 150),
            (gen_random_uuid(), 1, 'AGE_20_24', 'FEMALE', 142),
            (gen_random_uuid(), 1, 'AGE_25_29', 'FEMALE', 127),
            (gen_random_uuid(), 1, 'AGE_30_34', 'FEMALE', 108),
            (gen_random_uuid(), 1, 'AGE_35_39', 'FEMALE', 92),
            (gen_random_uuid(), 1, 'AGE_40_44', 'FEMALE', 82),
            (gen_random_uuid(), 1, 'AGE_45_49', 'FEMALE', 72),
            (gen_random_uuid(), 1, 'AGE_50_54', 'FEMALE', 63),
            (gen_random_uuid(), 1, 'AGE_55_59', 'FEMALE', 50),
            (gen_random_uuid(), 1, 'AGE_60_64', 'FEMALE', 42),
            (gen_random_uuid(), 1, 'AGE_65_69', 'FEMALE', 34),
            (gen_random_uuid(), 1, 'AGE_70_74', 'FEMALE', 25),
            (gen_random_uuid(), 1, 'AGE_75_AND_ABOVE', 'FEMALE', 20);
            
        -- Ward 2 data
        -- Male population by age group
        INSERT INTO acme_ward_age_wise_population (id, ward_number, age_group, gender, population)
        VALUES
            (gen_random_uuid(), 2, 'AGE_0_4', 'MALE', 215),
            (gen_random_uuid(), 2, 'AGE_5_9', 'MALE', 239),
            (gen_random_uuid(), 2, 'AGE_10_14', 'MALE', 274),
            (gen_random_uuid(), 2, 'AGE_15_19', 'MALE', 252),
            (gen_random_uuid(), 2, 'AGE_20_24', 'MALE', 228),
            (gen_random_uuid(), 2, 'AGE_25_29', 'MALE', 201),
            (gen_random_uuid(), 2, 'AGE_30_34', 'MALE', 187),
            (gen_random_uuid(), 2, 'AGE_35_39', 'MALE', 165),
            (gen_random_uuid(), 2, 'AGE_40_44', 'MALE', 143),
            (gen_random_uuid(), 2, 'AGE_45_49', 'MALE', 128),
            (gen_random_uuid(), 2, 'AGE_50_54', 'MALE', 109),
            (gen_random_uuid(), 2, 'AGE_55_59', 'MALE', 92),
            (gen_random_uuid(), 2, 'AGE_60_64', 'MALE', 78),
            (gen_random_uuid(), 2, 'AGE_65_69', 'MALE', 62),
            (gen_random_uuid(), 2, 'AGE_70_74', 'MALE', 43),
            (gen_random_uuid(), 2, 'AGE_75_AND_ABOVE', 'MALE', 28);
            
        -- Female population by age group
        INSERT INTO acme_ward_age_wise_population (id, ward_number, age_group, gender, population)
        VALUES
            (gen_random_uuid(), 2, 'AGE_0_4', 'FEMALE', 207),
            (gen_random_uuid(), 2, 'AGE_5_9', 'FEMALE', 230),
            (gen_random_uuid(), 2, 'AGE_10_14', 'FEMALE', 267),
            (gen_random_uuid(), 2, 'AGE_15_19', 'FEMALE', 250),
            (gen_random_uuid(), 2, 'AGE_20_24', 'FEMALE', 225),
            (gen_random_uuid(), 2, 'AGE_25_29', 'FEMALE', 199),
            (gen_random_uuid(), 2, 'AGE_30_34', 'FEMALE', 179),
            (gen_random_uuid(), 2, 'AGE_35_39', 'FEMALE', 161),
            (gen_random_uuid(), 2, 'AGE_40_44', 'FEMALE', 147),
            (gen_random_uuid(), 2, 'AGE_45_49', 'FEMALE', 132),
            (gen_random_uuid(), 2, 'AGE_50_54', 'FEMALE', 115),
            (gen_random_uuid(), 2, 'AGE_55_59', 'FEMALE', 97),
            (gen_random_uuid(), 2, 'AGE_60_64', 'FEMALE', 83),
            (gen_random_uuid(), 2, 'AGE_65_69', 'FEMALE', 67),
            (gen_random_uuid(), 2, 'AGE_70_74', 'FEMALE', 48),
            (gen_random_uuid(), 2, 'AGE_75_AND_ABOVE', 'FEMALE', 34);
            
        RAISE NOTICE 'Ward age-wise population data inserted successfully';
    ELSE
        RAISE NOTICE 'Ward age-wise population data already exists, skipping insertion';
    END IF;
END
$$;

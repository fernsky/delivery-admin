-- Check if acme_safe_motherhood_indicators table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_safe_motherhood_indicators'
    ) THEN
        CREATE TABLE acme_safe_motherhood_indicators (
            id VARCHAR(36) PRIMARY KEY,
            indicator VARCHAR(100) NOT NULL,
            year INTEGER NOT NULL,
            value REAL NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_safe_motherhood_indicators) THEN
        INSERT INTO acme_safe_motherhood_indicators (
            id, indicator, year, value
        )
        VALUES
        -- 2022 Newborn Care Data
        (gen_random_uuid(), 'KMC_HYPOTHERMIA', 2022, 42.5),
        (gen_random_uuid(), 'KMC_PRETERM', 2022, 61.8),
        (gen_random_uuid(), 'LOW_BIRTH_WEIGHT', 2022, 12.4),
        (gen_random_uuid(), 'TOTAL_SICK_ADMITTED', 2022, 2145),
        (gen_random_uuid(), 'ASPHYXIA', 2022, 8.7),
        (gen_random_uuid(), 'HYPOTHERMIA', 2022, 15.2),
        (gen_random_uuid(), 'SEPSIS', 2022, 7.9),
        
        -- 2022 Nutrition Data
        (gen_random_uuid(), 'NUTRITION_NEW_UNDER_6_MONTHS', 2022, 318),
        (gen_random_uuid(), 'NUTRITION_NEW_6_23_MONTHS', 2022, 642),
        (gen_random_uuid(), 'NUTRITION_NEW_24_59_MONTHS', 2022, 487),
        (gen_random_uuid(), 'NUTRITION_ADMIT_WEIGHT_3SD', 2022, 9.2),
        (gen_random_uuid(), 'NUTRITION_DISCHARGED_UNDER_6_MONTHS', 2022, 301),
        
        -- 2022 CBIMCI Data
        (gen_random_uuid(), 'CBIMCI_UNDER_2M_TOTAL', 2022, 3245),
        (gen_random_uuid(), 'CBIMCI_UNDER_2M_PSBI', 2022, 5.8),
        (gen_random_uuid(), 'CBIMCI_2_59M_PNEUMONIA', 2022, 14.2),
        (gen_random_uuid(), 'CBIMCI_2_59M_TOTAL_SICK', 2022, 8764),
        (gen_random_uuid(), 'CBIMCI_2_59M_ORS_ZINC', 2022, 87.3),
        
        -- 2023 Newborn Care Data
        (gen_random_uuid(), 'KMC_HYPOTHERMIA', 2023, 45.1),
        (gen_random_uuid(), 'KMC_PRETERM', 2023, 64.2),
        (gen_random_uuid(), 'LOW_BIRTH_WEIGHT', 2023, 11.8),
        (gen_random_uuid(), 'TOTAL_SICK_ADMITTED', 2023, 2289),
        (gen_random_uuid(), 'ASPHYXIA', 2023, 8.2),
        (gen_random_uuid(), 'HYPOTHERMIA', 2023, 14.7),
        (gen_random_uuid(), 'SEPSIS', 2023, 7.5),
        
        -- 2023 Nutrition Data
        (gen_random_uuid(), 'NUTRITION_NEW_UNDER_6_MONTHS', 2023, 345),
        (gen_random_uuid(), 'NUTRITION_NEW_6_23_MONTHS', 2023, 678),
        (gen_random_uuid(), 'NUTRITION_NEW_24_59_MONTHS', 2023, 512),
        (gen_random_uuid(), 'NUTRITION_ADMIT_WEIGHT_3SD', 2023, 8.7),
        (gen_random_uuid(), 'NUTRITION_DISCHARGED_UNDER_6_MONTHS', 2023, 327),
        
        -- 2023 CBIMCI Data
        (gen_random_uuid(), 'CBIMCI_UNDER_2M_TOTAL', 2023, 3412),
        (gen_random_uuid(), 'CBIMCI_UNDER_2M_PSBI', 2023, 5.5),
        (gen_random_uuid(), 'CBIMCI_2_59M_PNEUMONIA', 2023, 13.8),
        (gen_random_uuid(), 'CBIMCI_2_59M_TOTAL_SICK', 2023, 9128),
        (gen_random_uuid(), 'CBIMCI_2_59M_ORS_ZINC', 2023, 88.9),
        
        -- 2023 IYCF Data
        (gen_random_uuid(), 'IYCF_EXCLUSIVE_BREASTFEEDING', 2023, 71.3),
        (gen_random_uuid(), 'IYCF_COMPLEMENTARY_FEEDING', 2023, 66.8),
        
        -- 2024 Newborn Care Data
        (gen_random_uuid(), 'KMC_HYPOTHERMIA', 2024, 47.3),
        (gen_random_uuid(), 'KMC_PRETERM', 2024, 66.7),
        (gen_random_uuid(), 'LOW_BIRTH_WEIGHT', 2024, 11.2),
        (gen_random_uuid(), 'TOTAL_SICK_ADMITTED', 2024, 2356),
        (gen_random_uuid(), 'ASPHYXIA', 2024, 7.9),
        (gen_random_uuid(), 'HYPOTHERMIA', 2024, 14.1),
        (gen_random_uuid(), 'SEPSIS', 2024, 7.2),
        
        -- 2024 Nutrition Data
        (gen_random_uuid(), 'NUTRITION_NEW_UNDER_6_MONTHS', 2024, 362),
        (gen_random_uuid(), 'NUTRITION_NEW_6_23_MONTHS', 2024, 705),
        (gen_random_uuid(), 'NUTRITION_NEW_24_59_MONTHS', 2024, 534),
        (gen_random_uuid(), 'NUTRITION_ADMIT_WEIGHT_3SD', 2024, 8.3),
        (gen_random_uuid(), 'NUTRITION_DISCHARGED_UNDER_6_MONTHS', 2024, 345),
        
        -- 2024 CBIMCI Data
        (gen_random_uuid(), 'CBIMCI_UNDER_2M_TOTAL', 2024, 3560),
        (gen_random_uuid(), 'CBIMCI_UNDER_2M_PSBI', 2024, 5.2),
        (gen_random_uuid(), 'CBIMCI_2_59M_PNEUMONIA', 2024, 13.3),
        (gen_random_uuid(), 'CBIMCI_2_59M_TOTAL_SICK', 2024, 9463),
        (gen_random_uuid(), 'CBIMCI_2_59M_ORS_ZINC', 2024, 90.2),
        
        -- 2024 IYCF Data
        (gen_random_uuid(), 'IYCF_EXCLUSIVE_BREASTFEEDING', 2024, 72.8),
        (gen_random_uuid(), 'IYCF_COMPLEMENTARY_FEEDING', 2024, 68.5),
        (gen_random_uuid(), 'IYCF_FORTIFIED_FLOUR_CHILDREN', 2024, 54.2),
        (gen_random_uuid(), 'IYCF_FORTIFIED_FLOUR_PREGNANT', 2024, 62.3);
    END IF;
END
$$;
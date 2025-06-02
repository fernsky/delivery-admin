DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'immunization_fiscal_year') THEN
        CREATE TYPE immunization_fiscal_year AS ENUM (
            'FY_2079_2080',
            'FY_2080_2081',
            'FY_2081_2082',
            'FY_2082_2083',
            'FY_2083_2084',
            'FY_2084_2085',
            'FY_2085_2086'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'immunization_indicator') THEN
        CREATE TYPE immunization_indicator AS ENUM (
            'DPT_HEPB_HIB1_COVERAGE',
            'OPV1_COVERAGE',
            'PCV1_COVERAGE',
            'ROTA1_COVERAGE',
            'DPT_HEPB_HIB3_COVERAGE',
            'OPV3_COVERAGE',
            'ROTA2_COVERAGE',
            'PLANNED_IMMUNIZATION_SESSIONS_CONDUCTED',
            'PLANNED_IMMUNIZATION_CLINICS_CONDUCTED',
            'HYGIENE_PROMOTION_SESSION_AMONG_ROUTINE_IMMUNIZATION',
            'PCV3_COVERAGE',
            'MEASLES_RUBELLA1_COVERAGE',
            'MEASLES_RUBELLA2_COVERAGE',
            'FULLY_IMMUNIZED_NIP_SCHEDULE',
            'BCG_COVERAGE',
            'TCV_COVERAGE',
            'JE_COVERAGE',
            'FIPV1_COVERAGE',
            'TD2_TD2PLUS_COMPLETED_PREGNANT_WOMEN',
            'VACCINE_WASTAGE_BCG',
            'TD2PLUS_PREGNANT_WOMEN',
            'FIPV2_COVERAGE',
            'TD2_PREGNANT_WOMEN',
            'VACCINE_WASTAGE_JE',
            'VACCINE_WASTAGE_MR',
            'VACCINE_WASTAGE_FIPV',
            'VACCINE_WASTAGE_TCV',
            'MEASLES_INCIDENCE_RATE',
            'VACCINE_WASTAGE_TD',
            'VACCINE_WASTAGE_OPV',
            'VACCINE_WASTAGE_DPT_HEPB_HIB',
            'DPT_HEPB_HIB1_VS_MR2_DROPOUT',
            'PCV_DROPOUT',
            'VACCINE_WASTAGE_PCV',
            'DPT_HEPB_HIB_DROPOUT',
            'VACCINE_WASTAGE_ROTA',
            'HPV1_COVERAGE',
            'HPV2_COVERAGE',
            'MEASLES_RUBELLA_DROPOUT',
            'SERIOUS_AEFI_PERCENT',
            'AES_RATE',
            'NEONATAL_TETANUS_RATE',
            'HPV_DROPOUT'
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'acme_immunization_indicators'
    ) THEN
        CREATE TABLE acme_immunization_indicators (
            id VARCHAR(36) PRIMARY KEY,
            fiscal_year immunization_fiscal_year NOT NULL,
            indicator immunization_indicator NOT NULL,
            value DOUBLE PRECISION,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

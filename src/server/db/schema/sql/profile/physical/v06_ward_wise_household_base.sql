-- Check if acme_ward_wise_household_base table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_household_base'
    ) THEN
        CREATE TABLE acme_ward_wise_household_base (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            base_type VARCHAR(100) NOT NULL,
            households INTEGER NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_household_base) THEN
        INSERT INTO acme_ward_wise_household_base (
            id, ward_number, base_type, households
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'CONCRETE_PILLAR', 320),
        (gen_random_uuid(), 1, 'CEMENT_JOINED', 185),
        (gen_random_uuid(), 1, 'MUD_JOINED', 95),
        (gen_random_uuid(), 1, 'WOOD_POLE', 65),
        (gen_random_uuid(), 1, 'OTHER', 25),
        
        -- Ward 2
        (gen_random_uuid(), 2, 'CONCRETE_PILLAR', 345),
        (gen_random_uuid(), 2, 'CEMENT_JOINED', 200),
        (gen_random_uuid(), 2, 'MUD_JOINED', 80),
        (gen_random_uuid(), 2, 'WOOD_POLE', 55),
        (gen_random_uuid(), 2, 'OTHER', 20),
        
        -- Ward 3
        (gen_random_uuid(), 3, 'CONCRETE_PILLAR', 280),
        (gen_random_uuid(), 3, 'CEMENT_JOINED', 175),
        (gen_random_uuid(), 3, 'MUD_JOINED', 120),
        (gen_random_uuid(), 3, 'WOOD_POLE', 85),
        (gen_random_uuid(), 3, 'OTHER', 30),
        
        -- Ward 4
        (gen_random_uuid(), 4, 'CONCRETE_PILLAR', 310),
        (gen_random_uuid(), 4, 'CEMENT_JOINED', 190),
        (gen_random_uuid(), 4, 'MUD_JOINED', 100),
        (gen_random_uuid(), 4, 'WOOD_POLE', 70),
        (gen_random_uuid(), 4, 'OTHER', 22),
        
        -- Ward 5
        (gen_random_uuid(), 5, 'CONCRETE_PILLAR', 300),
        (gen_random_uuid(), 5, 'CEMENT_JOINED', 180),
        (gen_random_uuid(), 5, 'MUD_JOINED', 110),
        (gen_random_uuid(), 5, 'WOOD_POLE', 75),
        (gen_random_uuid(), 5, 'OTHER', 28);
    END IF;
END
$$;
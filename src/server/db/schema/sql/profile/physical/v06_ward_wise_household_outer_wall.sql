-- Check if acme_ward_wise_household_outer_wall table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_household_outer_wall'
    ) THEN
        CREATE TABLE acme_ward_wise_household_outer_wall (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            wall_type VARCHAR(100) NOT NULL,
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
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_household_outer_wall) THEN
        INSERT INTO acme_ward_wise_household_outer_wall (
            id, ward_number, wall_type, households
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'CEMENT_JOINED', 425),
        (gen_random_uuid(), 1, 'UNBAKED_BRICK', 65),
        (gen_random_uuid(), 1, 'MUD_JOINED', 92),
        (gen_random_uuid(), 1, 'TIN', 48),
        (gen_random_uuid(), 1, 'BAMBOO', 35),
        (gen_random_uuid(), 1, 'WOOD', 22),
        (gen_random_uuid(), 1, 'PREFAB', 18),
        (gen_random_uuid(), 1, 'OTHER', 15),
        
        -- Ward 2
        (gen_random_uuid(), 2, 'CEMENT_JOINED', 445),
        (gen_random_uuid(), 2, 'UNBAKED_BRICK', 58),
        (gen_random_uuid(), 2, 'MUD_JOINED', 85),
        (gen_random_uuid(), 2, 'TIN', 52),
        (gen_random_uuid(), 2, 'BAMBOO', 32),
        (gen_random_uuid(), 2, 'WOOD', 25),
        (gen_random_uuid(), 2, 'PREFAB', 20),
        (gen_random_uuid(), 2, 'OTHER', 12),
        
        -- Ward 3
        (gen_random_uuid(), 3, 'CEMENT_JOINED', 380),
        (gen_random_uuid(), 3, 'UNBAKED_BRICK', 78),
        (gen_random_uuid(), 3, 'MUD_JOINED', 110),
        (gen_random_uuid(), 3, 'TIN', 60),
        (gen_random_uuid(), 3, 'BAMBOO', 45),
        (gen_random_uuid(), 3, 'WOOD', 30),
        (gen_random_uuid(), 3, 'PREFAB', 15),
        (gen_random_uuid(), 3, 'OTHER', 20),
        
        -- Ward 4
        (gen_random_uuid(), 4, 'CEMENT_JOINED', 410),
        (gen_random_uuid(), 4, 'UNBAKED_BRICK', 70),
        (gen_random_uuid(), 4, 'MUD_JOINED', 95),
        (gen_random_uuid(), 4, 'TIN', 50),
        (gen_random_uuid(), 4, 'BAMBOO', 38),
        (gen_random_uuid(), 4, 'WOOD', 27),
        (gen_random_uuid(), 4, 'PREFAB', 19),
        (gen_random_uuid(), 4, 'OTHER', 14),
        
        -- Ward 5
        (gen_random_uuid(), 5, 'CEMENT_JOINED', 395),
        (gen_random_uuid(), 5, 'UNBAKED_BRICK', 72),
        (gen_random_uuid(), 5, 'MUD_JOINED', 105),
        (gen_random_uuid(), 5, 'TIN', 55),
        (gen_random_uuid(), 5, 'BAMBOO', 42),
        (gen_random_uuid(), 5, 'WOOD', 24),
        (gen_random_uuid(), 5, 'PREFAB', 16),
        (gen_random_uuid(), 5, 'OTHER', 18);
    END IF;
END
$$;
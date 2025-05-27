-- Generated SQL script
-- Date: 2025-05-27 12:59:46

-- Create religion type enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'religion_type_enum') THEN
        CREATE TYPE religion_type_enum AS ENUM (
            'HINDU', 'ISLAM', 'CHRISTIAN', 'BUDDHIST', 'SIKH', 'BAHAI', 'BON',
            'JAIN', 'KIRANT', 'NATURE', 'OTHER'
        );
    END IF;
END
$$;

-- Check if acme_ward_wise_religion_population table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_religion_population'
    ) THEN
        CREATE TABLE acme_ward_wise_religion_population (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            religion_type religion_type_enum NOT NULL,
            population INTEGER,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert data only if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_religion_population) THEN
        -- Ward 1
        INSERT INTO acme_ward_wise_religion_population 
        (id, ward_number, religion_type, population, updated_at, created_at)
        VALUES 
        ('fd5f3dc8-7fb6-478e-ac0e-c8a7cc03592b', 1, 'BUDDHIST', 48, NOW(), NOW()),
        ('0c130d74-bbac-4b2b-97dd-e7d8db57dadc', 1, 'CHRISTIAN', 111, NOW(), NOW()),
        ('b47ec1d5-707e-4719-ac68-3e006bfd8a13', 1, 'HINDU', 3950, NOW(), NOW()),
        ('bff2c4b6-7e5e-40c3-b017-33dbeab7ba33', 1, 'OTHER', 3, NOW(), NOW()),
        ('ea835842-6c52-4185-aa8c-e8ac9f78e5e3', 1, 'SIKH', 0, NOW(), NOW()),

        -- Ward 2
        ('468613f9-f8b3-4d3b-b812-ac5ce428d5f1', 2, 'BAHAI', 5, NOW(), NOW()),
        ('26d1b68a-b345-4cf7-a646-e20f9c73aa16', 2, 'BON', 1, NOW(), NOW()),
        ('86ea4551-3aa9-4172-aba1-d5948ac082b1', 2, 'BUDDHIST', 212, NOW(), NOW()),
        ('58209bbf-fd63-432e-8025-e81024be82bb', 2, 'CHRISTIAN', 453, NOW(), NOW()),
        ('983d3c71-8752-459d-b226-bf9860628328', 2, 'HINDU', 9795, NOW(), NOW()),
        ('0ac5e43d-f4e8-4b29-8285-fb6c1f42af4c', 2, 'ISLAM', 34, NOW(), NOW()),
        ('0f2c4351-34ac-453d-b7e4-12ab6534af31', 2, 'JAIN', 1, NOW(), NOW()),
        ('f1947a1b-688e-4ed9-80e9-1d8e8096b2af', 2, 'OTHER', 7, NOW(), NOW()),
        ('fafbfcc9-6f7f-49e8-beaa-a1c9cb0000ce', 2, 'SIKH', 43, NOW(), NOW()),

        -- Ward 3
        ('ad64ac36-044a-4268-a2b3-578172614d0a', 3, 'BAHAI', 1, NOW(), NOW()),
        ('6dd3b0e4-ce0d-4a00-ace2-2468e791a9ee', 3, 'BON', 1, NOW(), NOW()),
        ('37944e3b-6b22-471d-b4c8-b70e7f0c9e9c', 3, 'BUDDHIST', 47, NOW(), NOW()),
        ('f9749068-91c7-4403-8f3b-33af659b24bf', 3, 'CHRISTIAN', 285, NOW(), NOW()),
        ('8539def0-5aef-47c2-a281-1dd6b115bb3d', 3, 'HINDU', 8024, NOW(), NOW()),
        ('895cba84-4225-455e-b92a-6554ac3a91d5', 3, 'ISLAM', 123, NOW(), NOW()),
        ('d9a06909-32cc-4619-b798-c64fbc94d743', 3, 'OTHER', 2, NOW(), NOW()),

        -- Ward 4
        ('063d1a71-eff2-4e57-b51f-fe8c9f8b549d', 4, 'BUDDHIST', 21, NOW(), NOW()),
        ('88e2a5a5-48c4-459d-84d4-d2773cd077b6', 4, 'CHRISTIAN', 329, NOW(), NOW()),
        ('374c1818-7971-4577-838f-29493c074735', 4, 'HINDU', 6620, NOW(), NOW()),
        ('0d3f756e-1f9a-4269-b968-115227c8de1b', 4, 'ISLAM', 177, NOW(), NOW()),

        -- Ward 5
        ('2ee94a13-a622-4447-b6b9-d8d3af62704a', 5, 'BUDDHIST', 17, NOW(), NOW()),
        ('f2553d34-67d7-4040-802d-fcf841101e4f', 5, 'CHRISTIAN', 9, NOW(), NOW()),
        ('24251f52-c10e-4b76-ad91-cac24734e324', 5, 'HINDU', 4493, NOW(), NOW()),
        ('2747e572-c122-41f2-a798-58574b54a679', 5, 'ISLAM', 3000, NOW(), NOW()),
        ('7dd38e3b-8dc4-4f66-8460-46a85a8d47dc', 5, 'NATURE', 3, NOW(), NOW()),

        -- Ward 6
        ('2bcd52aa-7eb9-45f6-b1c0-e7e30276fe85', 6, 'BAHAI', 1, NOW(), NOW()),
        ('f58afd4f-e094-42f7-886a-a233f5c53b3e', 6, 'BUDDHIST', 12, NOW(), NOW()),
        ('8b26fbff-a382-49eb-a742-0b5431ab3e4f', 6, 'CHRISTIAN', 1051, NOW(), NOW()),
        ('01782013-8281-4b3f-a169-1d08d7e2509e', 6, 'HINDU', 4980, NOW(), NOW()),
        ('55d842de-0c0e-4212-ab89-72bba97cb13e', 6, 'ISLAM', 2237, NOW(), NOW()),
        ('095a4ea7-4ff5-45a9-bc86-34f8ead9dfd3', 6, 'KIRANT', 1, NOW(), NOW()),
        ('8a750263-1b54-4591-9a4a-bb8462c9d452', 6, 'OTHER', 1, NOW(), NOW()),

        -- Ward 7
        ('36cd4e2d-2ea9-4abd-aa20-2b693f3e9ed3', 7, 'BON', 1, NOW(), NOW()),
        ('d00dc28e-c717-477e-9b57-6dad11d25963', 7, 'BUDDHIST', 61, NOW(), NOW()),
        ('815b0ebf-a4d0-4b65-bcab-ce846f557905', 7, 'CHRISTIAN', 93, NOW(), NOW()),
        ('8b6ba7e4-97ae-4b25-b98c-f890211af350', 7, 'HINDU', 5847, NOW(), NOW()),
        ('70e485de-5229-4234-aad6-d8d9ae5ab1de', 7, 'ISLAM', 4574, NOW(), NOW()),
        ('3979190b-46cb-446a-ab7a-8be5fa278cbc', 7, 'OTHER', 2, NOW(), NOW()),
        ('3e8008d5-170b-4972-97e0-0b6128babb02', 7, 'SIKH', 9, NOW(), NOW()),

        -- Ward 8
        ('74c76a1c-0106-46ce-b618-9f39a0aa4a46', 8, 'CHRISTIAN', 85, NOW(), NOW()),
        ('fb36739a-4419-48b5-8e4f-76789ec8a76f', 8, 'HINDU', 3425, NOW(), NOW()),
        ('692b48d6-6e2f-4902-bd68-a6eb25d867a3', 8, 'ISLAM', 4725, NOW(), NOW()),
        ('3979190b-46cb-446a-ab7a-8be5fa278cbc', 8, 'OTHER', 0, NOW(), NOW()),
        ('3e8008d5-170b-4972-97e0-0b6128babb02', 8, 'SIKH', 0, NOW(), NOW());
    END IF;
END
$$;

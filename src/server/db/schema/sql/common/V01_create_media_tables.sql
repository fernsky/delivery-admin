-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Create media_type enum
DO $$ 
BEGIN
  CREATE TYPE media_type AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT', 'OTHER');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
-- Create entity_type enum with PARKING_FACILITY, PUBLIC_TRANSPORT, and PETROL_PUMP
DO $$ 
BEGIN
  CREATE TYPE entity_type AS ENUM (
    'LOCATION', 'WARD', 'SETTLEMENT', 'SQUATTER_AREA',
    'ROAD', 'AGRICULTURAL_AREA', 'BUSINESS_AREA', 'INDUSTRIAL_AREA', 
    'PARKING_FACILITY', 'PUBLIC_TRANSPORT', 'PETROL_PUMP'
  );
EXCEPTION
  WHEN duplicate_object THEN 
    -- If the type already exists, try to add the new values safely
    BEGIN
      -- Check and add PARKING_FACILITY if not exists
      IF NOT EXISTS (
        SELECT 1 
        FROM pg_enum 
        WHERE enumlabel = 'PARKING_FACILITY' 
          AND enumtypid = 'entity_type'::regtype
      ) THEN
        ALTER TYPE entity_type ADD VALUE 'PARKING_FACILITY';
      END IF;
      
      -- Check and add PUBLIC_TRANSPORT if not exists
      IF NOT EXISTS (
        SELECT 1 
        FROM pg_enum 
        WHERE enumlabel = 'PUBLIC_TRANSPORT' 
          AND enumtypid = 'entity_type'::regtype
      ) THEN
        ALTER TYPE entity_type ADD VALUE 'PUBLIC_TRANSPORT';
      END IF;
      
      -- Check and add PETROL_PUMP if not exists
      IF NOT EXISTS (
        SELECT 1 
        FROM pg_enum 
        WHERE enumlabel = 'PETROL_PUMP' 
          AND enumtypid = 'entity_type'::regtype
      ) THEN
        ALTER TYPE entity_type ADD VALUE 'PETROL_PUMP';
      END IF;
    EXCEPTION
      WHEN others THEN null;
    END;
END $$;

-- Create media table with additional file_url field
CREATE TABLE IF NOT EXISTS acme_media (
    id VARCHAR(36) PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(1024) NOT NULL,
    file_url VARCHAR(1024), -- Added file_url field for direct URL access
    file_size INTEGER,
    mime_type VARCHAR(255),
    type media_type NOT NULL,
    title TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

-- Create entity_media table for relationships - fix reference to acme_media
CREATE TABLE IF NOT EXISTS acme_entity_media (
    id VARCHAR(36) PRIMARY KEY,
    entity_id VARCHAR(36) NOT NULL,
    entity_type entity_type NOT NULL,
    media_id VARCHAR(36) NOT NULL REFERENCES acme_media(id) ON DELETE CASCADE, -- Fixed reference to acme_media
    is_primary BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    UNIQUE(entity_id, entity_type, media_id)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_media_type ON acme_media(type);
CREATE INDEX IF NOT EXISTS idx_entity_media_lookup ON acme_entity_media(entity_id, entity_type);
CREATE INDEX IF NOT EXISTS idx_primary_media ON acme_entity_media(entity_id, entity_type, is_primary) 
WHERE is_primary = true;

-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Create media_type enum
DO $$ 
BEGIN
  CREATE TYPE media_type AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT', 'OTHER');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create entity_type enum
DO $$ 
BEGIN
  CREATE TYPE entity_type AS ENUM (
    'LOCATION', 'WARD', 'SETTLEMENT', 'SQUATTER_AREA',
    'ROAD', 'AGRICULTURAL_AREA', 'BUSINESS_AREA', 'INDUSTRIAL_AREA'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create media table
CREATE TABLE IF NOT EXISTS acme_media (
    id VARCHAR(36) PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(1024) NOT NULL,
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

-- Create entity_media table for relationships
CREATE TABLE IF NOT EXISTS acme_entity_media (
    id VARCHAR(36) PRIMARY KEY,
    entity_id VARCHAR(36) NOT NULL,
    entity_type entity_type NOT NULL,
    media_id VARCHAR(36) NOT NULL REFERENCES media(id) ON DELETE CASCADE,
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

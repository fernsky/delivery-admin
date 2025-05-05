-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create location_type enum
DO $$ 
BEGIN
  CREATE TYPE location_type AS ENUM ('VILLAGE', 'SETTLEMENT', 'TOLE', 'WARD', 'SQUATTER_AREA');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the location table
CREATE TABLE IF NOT EXISTS location (
    id VARCHAR(36) PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type location_type NOT NULL,
    is_new_settlement BOOLEAN DEFAULT false,
    is_town_planned BOOLEAN DEFAULT false,
    point_geometry GEOMETRY(Point, 4326),
    polygon_geometry GEOMETRY(Polygon, 4326),
    parent_id VARCHAR(36) REFERENCES location(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

-- Create spatial indexes for faster geospatial queries
CREATE INDEX IF NOT EXISTS idx_location_point_geometry ON location USING GIST (point_geometry);
CREATE INDEX IF NOT EXISTS idx_location_polygon_geometry ON location USING GIST (polygon_geometry);

-- Create indexes for other common lookups
CREATE INDEX IF NOT EXISTS idx_location_type ON location(type);
CREATE INDEX IF NOT EXISTS idx_location_name ON location(name);
CREATE INDEX IF NOT EXISTS idx_location_parent ON location(parent_id);

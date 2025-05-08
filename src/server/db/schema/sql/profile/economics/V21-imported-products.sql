-- Creating the imported products table
CREATE TABLE IF NOT EXISTS imported_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Creating the ACME table version for fallback data
CREATE TABLE IF NOT EXISTS acme_imported_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_imported_products_product_name ON imported_products(product_name);
CREATE INDEX IF NOT EXISTS idx_acme_imported_products_product_name ON acme_imported_products(product_name);

-- DUMMY DATA SECTION BEGINS
-- Insert dummy data for main table
INSERT INTO imported_products (id, product_name)
VALUES
  (gen_random_uuid(), 'Rice'),
  (gen_random_uuid(), 'Electronics'),
  (gen_random_uuid(), 'Clothing'),
  (gen_random_uuid(), 'Vehicles'),
  (gen_random_uuid(), 'Petroleum Products');

-- Insert dummy data for ACME table (fallback data)
INSERT INTO acme_imported_products (id, product_name)
VALUES
  (gen_random_uuid(), 'Machinery'),
  (gen_random_uuid(), 'Fertilizers'),
  (gen_random_uuid(), 'Pharmaceutical Products'),
  (gen_random_uuid(), 'Plastic Products');
-- DUMMY DATA SECTION ENDS

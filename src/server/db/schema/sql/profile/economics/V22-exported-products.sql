-- Creating the exported products table
CREATE TABLE IF NOT EXISTS exported_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Creating the ACME table version for fallback data
CREATE TABLE IF NOT EXISTS acme_exported_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_exported_products_product_name ON exported_products(product_name);
CREATE INDEX IF NOT EXISTS idx_acme_exported_products_product_name ON acme_exported_products(product_name);

-- DUMMY DATA SECTION BEGINS
-- Insert dummy data for main table
INSERT INTO exported_products (id, product_name)
VALUES
  (gen_random_uuid(), 'Tea'),
  (gen_random_uuid(), 'Coffee'),
  (gen_random_uuid(), 'Textiles'),
  (gen_random_uuid(), 'Handicrafts'),
  (gen_random_uuid(), 'Spices');

-- Insert dummy data for ACME table (fallback data)
INSERT INTO acme_exported_products (id, product_name)
VALUES
  (gen_random_uuid(), 'Software Services'),
  (gen_random_uuid(), 'Agricultural Products'),
  (gen_random_uuid(), 'Leather Goods'),
  (gen_random_uuid(), 'Processed Foods');
-- DUMMY DATA SECTION ENDS

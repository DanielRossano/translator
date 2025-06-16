-- Initialization script for PostgreSQL database
-- This script will be executed when the container starts for the first time

-- Create database if it doesn't exist
SELECT 'CREATE DATABASE translation_db' 
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'translation_db');

-- Connect to the translation_db
\c translation_db;

-- Create the translations table (TypeORM will handle this, but we can ensure the structure)
-- This is optional since TypeORM synchronize=true will create the table
-- But it's good to have for reference

-- CREATE TABLE IF NOT EXISTS translations (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     text TEXT NOT NULL,
--     translated_text TEXT,
--     source_lang VARCHAR(10) NOT NULL,
--     target_lang VARCHAR(10) NOT NULL,
--     status VARCHAR(20) DEFAULT 'pending',
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- Create indexes for better performance
-- CREATE INDEX IF NOT EXISTS idx_translations_status ON translations(status);
-- CREATE INDEX IF NOT EXISTS idx_translations_created_at ON translations(created_at);

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE translation_db TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

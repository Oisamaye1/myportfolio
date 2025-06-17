-- Add Experience table to the database schema

-- Experience table
CREATE TABLE IF NOT EXISTS experience (
    id SERIAL PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    start_date VARCHAR(100) NOT NULL,
    end_date VARCHAR(100),
    is_current BOOLEAN NOT NULL DEFAULT false,
    description TEXT,
    responsibilities TEXT[],
    technologies TEXT[],
    achievements TEXT[],
    company_logo VARCHAR(500),
    company_website VARCHAR(500),
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_experience_active_order ON experience(is_active, order_index);
CREATE INDEX IF NOT EXISTS idx_experience_current ON experience(is_current);

-- Create trigger for updated_at
CREATE TRIGGER update_experience_updated_at BEFORE UPDATE ON experience FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

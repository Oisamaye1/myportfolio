-- Add featured_image column to articles table
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS featured_image TEXT;

-- Add avatar_url column to testimonials table if it doesn't exist
ALTER TABLE testimonials 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Update existing records to have empty image fields if needed
UPDATE articles SET featured_image = '' WHERE featured_image IS NULL;
UPDATE testimonials SET avatar_url = '' WHERE avatar_url IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN articles.featured_image IS 'URL to the featured image for the article';
COMMENT ON COLUMN testimonials.avatar_url IS 'URL to the avatar image for the testimonial author';
COMMENT ON COLUMN projects.image_url IS 'URL to the project preview image';

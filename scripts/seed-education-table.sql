-- First check if the education table exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'education') THEN
    CREATE TABLE education (
      id SERIAL PRIMARY KEY,
      degree VARCHAR(255) NOT NULL,
      institution VARCHAR(255) NOT NULL,
      years VARCHAR(100) NOT NULL,
      description TEXT,
      icon VARCHAR(100) NOT NULL,
      order_index INTEGER NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Create trigger for updated_at
    CREATE OR REPLACE FUNCTION update_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    
    CREATE TRIGGER update_education_timestamp
    BEFORE UPDATE ON education
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
  END IF;
END
$$;

-- Clear existing data
TRUNCATE TABLE education RESTART IDENTITY;

-- Insert sample education data
INSERT INTO education (degree, institution, years, description, icon, order_index, is_active)
VALUES 
  ('Master of Science in Computer Science', 'University of Technology', '2020 - 2022', 'Specialization in Web Technologies and Artificial Intelligence. Thesis on AI-driven UI generation and optimization.', 'GraduationCap', 1, true),
  ('Bachelor of Science in Software Engineering', 'State University', '2016 - 2020', 'Graduated with Honors. Focused on algorithms, data structures, object-oriented programming, and software design patterns.', 'GraduationCap', 2, true),
  ('Full Stack Web Development Bootcamp', 'Code Academy', '2020', 'Intensive 12-week program covering MERN stack, modern web practices, RESTful APIs, and cloud deployment strategies.', 'Laptop', 3, true),
  ('Certified Kubernetes Administrator (CKA)', 'Cloud Native Computing Foundation', '2023', 'Certification demonstrating proficiency in Kubernetes administration, including deployment, scaling, and troubleshooting.', 'Award', 4, true),
  ('Advanced React & Redux Course', 'Udemy (Online Course)', '2021', 'Deep dive into advanced React concepts, state management with Redux Toolkit, and performance optimization techniques.', 'BookOpen', 5, true);

-- Verify data was inserted
SELECT * FROM education;

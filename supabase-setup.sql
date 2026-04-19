-- Supabase Database Setup for Tattoo Portfolio
-- Run these queries in your Supabase SQL Editor

-- Create tattoos table
CREATE TABLE IF NOT EXISTS tattoos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  image_path TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('realismo', 'arteSacra', 'blackwork', 'outros')),
  alt TEXT,
  price DECIMAL(10,2),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_tattoos_category ON tattoos(category);
CREATE INDEX IF NOT EXISTS idx_tattoos_created_at ON tattoos(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE tattoos ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on tattoos" ON tattoos
  FOR SELECT USING (true);

-- Create policies for authenticated users (you can modify these based on your auth setup)
CREATE POLICY "Allow authenticated users to insert tattoos" ON tattoos
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update tattoos" ON tattoos
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete tattoos" ON tattoos
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create storage bucket for tattoo images
INSERT INTO storage.buckets (id, name, public)
VALUES ('tattoo-images', 'tattoo-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the bucket
CREATE POLICY "Allow public read access on tattoo images" ON storage.objects
  FOR SELECT USING (bucket_id = 'tattoo-images');

CREATE POLICY "Allow authenticated users to upload tattoo images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'tattoo-images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update tattoo images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'tattoo-images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete tattoo images" ON storage.objects
  FOR DELETE USING (bucket_id = 'tattoo-images' AND auth.role() = 'authenticated');

-- Optional: Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tattoos_updated_at
  BEFORE UPDATE ON tattoos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
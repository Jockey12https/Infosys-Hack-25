/*
  # Create users and guides tables for VillageStay platform

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `phone` (text)
      - `avatar_url` (text)
      - `user_type` (enum: traveler, guide, admin)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `guides`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `village` (text)
      - `district` (text)
      - `state` (text)
      - `pincode` (text)
      - `specialties` (text array)
      - `languages` (text array)
      - `gender` (text)
      - `years_experience` (text)
      - `description` (text)
      - `hourly_rate` (integer)
      - `availability` (text array)
      - `is_verified` (boolean)
      - `is_active` (boolean)
      - `rating` (decimal)
      - `total_reviews` (integer)
      - `total_bookings` (integer)
      - `gallery_images` (text array)
      - `certifications` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `bookings`
      - `id` (uuid, primary key)
      - `traveler_id` (uuid, references profiles)
      - `guide_id` (uuid, references guides)
      - `booking_date` (date)
      - `booking_time` (time)
      - `duration_hours` (integer)
      - `number_of_guests` (integer)
      - `experience_type` (text)
      - `special_requests` (text)
      - `total_amount` (integer)
      - `status` (enum: pending, confirmed, completed, cancelled)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for guides to manage their profiles and bookings
</*/

-- Create enum types
CREATE TYPE user_type AS ENUM ('traveler', 'guide', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  phone text,
  avatar_url text,
  user_type user_type DEFAULT 'traveler',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create guides table
CREATE TABLE IF NOT EXISTS guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  village text NOT NULL,
  district text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  specialties text[] DEFAULT '{}',
  languages text[] DEFAULT '{}',
  gender text,
  years_experience text,
  description text,
  hourly_rate integer DEFAULT 0,
  availability text[] DEFAULT '{}',
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  rating decimal(3,2) DEFAULT 0.0,
  total_reviews integer DEFAULT 0,
  total_bookings integer DEFAULT 0,
  gallery_images text[] DEFAULT '{}',
  certifications text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  traveler_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  guide_id uuid REFERENCES guides(id) ON DELETE CASCADE,
  booking_date date NOT NULL,
  booking_time time NOT NULL,
  duration_hours integer DEFAULT 3,
  number_of_guests integer DEFAULT 1,
  experience_type text,
  special_requests text,
  total_amount integer NOT NULL,
  status booking_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Guides policies
CREATE POLICY "Anyone can read active guides"
  ON guides
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Guides can manage own profile"
  ON guides
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Bookings policies
CREATE POLICY "Users can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (
    traveler_id = auth.uid() OR 
    guide_id IN (SELECT id FROM guides WHERE user_id = auth.uid())
  );

CREATE POLICY "Travelers can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (traveler_id = auth.uid());

CREATE POLICY "Users can update own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (
    traveler_id = auth.uid() OR 
    guide_id IN (SELECT id FROM guides WHERE user_id = auth.uid())
  );

-- Create function to handle user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_guides_location ON guides(state, district, village);
CREATE INDEX IF NOT EXISTS idx_guides_specialties ON guides USING GIN(specialties);
CREATE INDEX IF NOT EXISTS idx_guides_languages ON guides USING GIN(languages);
CREATE INDEX IF NOT EXISTS idx_guides_rating ON guides(rating DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
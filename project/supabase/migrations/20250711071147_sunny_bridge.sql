/*
  # Fix RLS policies for guides table

  1. Security
    - Update RLS policies to allow public read access for active guides
    - Ensure guides can be viewed without authentication for browsing
    - Maintain write restrictions for guide owners only

  2. Changes
    - Allow anonymous users to read active guides
    - Keep existing policies for authenticated operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read active guides" ON guides;
DROP POLICY IF EXISTS "Guides can manage own profile" ON guides;

-- Create new policies that allow public read access
CREATE POLICY "Public can read active guides"
  ON guides
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can read all guides"
  ON guides
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Guides can manage own profile"
  ON guides
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Also ensure profiles can be read publicly for guide information
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;

CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Public can read guide profiles"
  ON profiles
  FOR SELECT
  TO public
  USING (
    id IN (
      SELECT user_id FROM guides WHERE is_active = true
    )
  );
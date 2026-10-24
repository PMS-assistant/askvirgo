/*
  # Create Vzir Pilot Signups Table

  1. New Tables
    - `vzir_pilot_signups`
      - `id` (uuid, primary key) - unique identifier for each signup
      - `name` (text, not null) - full name of the person signing up
      - `email` (text, unique, not null) - email address, must be unique to prevent duplicates
      - `hotel_name` (text) - optional hotel name
      - `message` (text) - optional message from the applicant
      - `created_at` (timestamptz) - timestamp of when the signup was created

  2. Security
    - Enable RLS on `vzir_pilot_signups` table
    - Add INSERT policy allowing anonymous users to submit signups (public form)
    - No SELECT/UPDATE/DELETE policies for public access (admin only via service role)
*/

CREATE TABLE IF NOT EXISTS vzir_pilot_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  email text UNIQUE NOT NULL,
  hotel_name text DEFAULT '',
  message text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vzir_pilot_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a pilot signup"
  ON vzir_pilot_signups
  FOR INSERT
  TO anon
  WITH CHECK (
    email IS NOT NULL AND email <> ''
  );

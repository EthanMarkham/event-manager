-- Fastbreak Event Dashboard Database Schema
-- Run this SQL in your Supabase SQL Editor
--
-- This schema is designed to work with the app's RLS-first model:
-- - Application code always queries data for the current auth.uid()
-- - Ownership is enforced by Postgres Row Level Security policies

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  name TEXT NOT NULL,
  sport_type TEXT NOT NULL CHECK (sport_type IN ('Soccer', 'Basketball', 'Tennis')),
  starts_at TIMESTAMPTZ NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create event_venues table
CREATE TABLE IF NOT EXISTS event_venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index on event_id for faster joins
CREATE INDEX IF NOT EXISTS idx_event_venues_event_id ON event_venues(event_id);

-- Create index on starts_at for faster sorting/filtering
CREATE INDEX IF NOT EXISTS idx_events_starts_at ON events(starts_at);

-- Create index on sport_type for faster filtering
CREATE INDEX IF NOT EXISTS idx_events_sport_type ON events(sport_type);

-- Create index on user_id for faster ownership queries
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at on events table
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
-- Policies enforce ownership: users can only modify their own events

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_venues ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read their own events
DROP POLICY IF EXISTS "Allow authenticated users to read events" ON events;
DROP POLICY IF EXISTS "Users can read their own events" ON events;
CREATE POLICY "Users can read their own events"
  ON events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Allow authenticated users to insert their own events
CREATE POLICY "Allow authenticated users to insert events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Allow authenticated users to update their own events
CREATE POLICY "Allow authenticated users to update events"
  ON events FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Allow authenticated users to delete their own events
CREATE POLICY "Allow authenticated users to delete events"
  ON events FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- event_venues should be restricted to venues belonging to events the user owns.
-- Note: we leverage a join back to events(user_id) so venues are protected without duplicating user_id on event_venues.
DROP POLICY IF EXISTS "Allow authenticated users to read event venues" ON event_venues;
DROP POLICY IF EXISTS "Allow authenticated users to insert event venues" ON event_venues;
DROP POLICY IF EXISTS "Allow authenticated users to update event venues" ON event_venues;
DROP POLICY IF EXISTS "Allow authenticated users to delete event venues" ON event_venues;

CREATE POLICY "Users can read venues for their events"
  ON event_venues FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM events e
      WHERE e.id = event_venues.event_id
        AND e.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert venues for their events"
  ON event_venues FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM events e
      WHERE e.id = event_venues.event_id
        AND e.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update venues for their events"
  ON event_venues FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM events e
      WHERE e.id = event_venues.event_id
        AND e.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM events e
      WHERE e.id = event_venues.event_id
        AND e.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete venues for their events"
  ON event_venues FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM events e
      WHERE e.id = event_venues.event_id
        AND e.user_id = auth.uid()
    )
  );

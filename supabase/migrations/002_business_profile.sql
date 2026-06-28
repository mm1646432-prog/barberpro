-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 002: Business profile table
-- One row per deployment. Generic enough for salon, clinic, restaurant, etc.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS business_profile (
  id                     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity
  name                   TEXT        NOT NULL,
  slug                   TEXT        UNIQUE NOT NULL,
  tagline                TEXT,
  description            TEXT,

  -- Contact
  address                TEXT,
  city                   TEXT,
  country                TEXT,
  phone                  TEXT,
  email                  TEXT,
  website                TEXT,

  -- Media
  logo_url               TEXT,
  cover_url              TEXT,

  -- Map
  maps_embed             TEXT,

  -- Social links (generic — not barber-specific)
  social_instagram       TEXT,
  social_facebook        TEXT,
  social_tiktok          TEXT,
  social_twitter         TEXT,
  social_youtube         TEXT,

  -- Booking configuration
  slot_duration_minutes  SMALLINT    NOT NULL DEFAULT 30
                           CHECK (slot_duration_minutes IN (15, 20, 30, 45, 60)),
  buffer_minutes         SMALLINT    NOT NULL DEFAULT 0
                           CHECK (buffer_minutes >= 0 AND buffer_minutes <= 60),
  cancellation_hours     SMALLINT    NOT NULL DEFAULT 24
                           CHECK (cancellation_hours >= 1 AND cancellation_hours <= 168),
  reminder_hours         SMALLINT[]  NOT NULL DEFAULT '{24,1}',
  max_advance_days       SMALLINT    NOT NULL DEFAULT 60
                           CHECK (max_advance_days >= 1 AND max_advance_days <= 365),

  -- Locale
  default_locale         TEXT        NOT NULL DEFAULT 'en-US',
  default_currency       TEXT        NOT NULL DEFAULT 'USD',
  default_timezone       TEXT        NOT NULL DEFAULT 'America/New_York',

  -- Timestamps
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger: auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER business_profile_updated_at
  BEFORE UPDATE ON business_profile
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Index: slug lookup
CREATE INDEX IF NOT EXISTS idx_business_profile_slug
  ON business_profile (slug);
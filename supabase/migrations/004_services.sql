-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 004: Services table
-- Generic "bookable service" — haircut, treatment, consultation, dish, etc.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS services (
  id             UUID           PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity
  name           TEXT           NOT NULL,
  slug           TEXT           UNIQUE NOT NULL,
  category       TEXT,
  description    TEXT,

  -- Booking
  duration_min   SMALLINT       NOT NULL
                   CHECK (duration_min >= 5 AND duration_min <= 480),

  -- Pricing
  price          NUMERIC(10, 2) NOT NULL
                   CHECK (price >= 0),

  -- Display
  is_visible     BOOLEAN        NOT NULL DEFAULT true,
  display_order  SMALLINT       NOT NULL DEFAULT 0,

  -- Timestamps
  created_at     TIMESTAMPTZ    NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_services_slug
  ON services (slug);

CREATE INDEX IF NOT EXISTS idx_services_category
  ON services (category);

CREATE INDEX IF NOT EXISTS idx_services_is_visible
  ON services (is_visible);

CREATE INDEX IF NOT EXISTS idx_services_display_order
  ON services (display_order);
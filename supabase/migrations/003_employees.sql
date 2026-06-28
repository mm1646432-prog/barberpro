-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 003: Employees table
-- Generic "staff member" — works for barbers, doctors, stylists, waiters, etc.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS employees (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity
  name           TEXT        NOT NULL,
  slug           TEXT        UNIQUE NOT NULL,
  bio            TEXT,
  avatar_url     TEXT,

  -- Contact (internal — not exposed publicly)
  phone          TEXT,
  email          TEXT,

  -- Display
  color_tag      TEXT        NOT NULL DEFAULT '#6366f1'
                   CHECK (color_tag ~ '^#[0-9A-Fa-f]{6}$'),
  specialties    TEXT[]      NOT NULL DEFAULT '{}',
  display_order  SMALLINT    NOT NULL DEFAULT 0,

  -- Status
  is_active      BOOLEAN     NOT NULL DEFAULT true,

  -- Timestamps
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_employees_slug
  ON employees (slug);

CREATE INDEX IF NOT EXISTS idx_employees_is_active
  ON employees (is_active);

CREATE INDEX IF NOT EXISTS idx_employees_display_order
  ON employees (display_order);
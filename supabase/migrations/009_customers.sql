-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 009: Customers table
-- Created automatically on first booking — no self-registration required.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS customers (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL UNIQUE,
  phone       TEXT,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_customers_email
  ON customers (email);

-- Trigram index for fast name/email search in admin customer table
CREATE INDEX IF NOT EXISTS idx_customers_name_trgm
  ON customers USING GIN (name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_customers_email_trgm
  ON customers USING GIN (email gin_trgm_ops);
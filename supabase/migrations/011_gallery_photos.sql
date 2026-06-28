-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 011: Gallery photos
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS gallery_photos (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path   TEXT        NOT NULL,
  public_url     TEXT        NOT NULL,
  caption        TEXT,
  employee_id    UUID        REFERENCES employees (id) ON DELETE SET NULL,
  display_order  SMALLINT    NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_gallery_photos_employee_id
  ON gallery_photos (employee_id);

CREATE INDEX IF NOT EXISTS idx_gallery_photos_display_order
  ON gallery_photos (display_order);
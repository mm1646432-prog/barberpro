-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 006: Shop-wide opening hours
-- One row per day of week (0 = Sunday … 6 = Saturday).
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS shop_hours (
  id           UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week  SMALLINT NOT NULL UNIQUE
                 CHECK (day_of_week BETWEEN 0 AND 6),
  open_time    TIME,
  close_time   TIME,
  is_closed    BOOLEAN  NOT NULL DEFAULT false,

  CONSTRAINT shop_hours_times_required
    CHECK (
      is_closed = true
      OR (open_time IS NOT NULL AND close_time IS NOT NULL)
    ),

  CONSTRAINT shop_hours_valid_range
    CHECK (
      is_closed = true
      OR open_time < close_time
    )
);

-- Index: day lookups
CREATE INDEX IF NOT EXISTS idx_shop_hours_day_of_week
  ON shop_hours (day_of_week);
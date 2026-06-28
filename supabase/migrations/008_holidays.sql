-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 008: Holidays and time-off
-- NULL employee_id = shop-wide closure.
-- Non-NULL employee_id = personal time-off for that staff member.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS holidays (
  id           UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id  UUID  REFERENCES employees (id) ON DELETE CASCADE,
  date         DATE  NOT NULL,
  note         TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Prevent duplicate entries for same employee+date (or shop-wide+date)
  UNIQUE NULLS NOT DISTINCT (employee_id, date)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_holidays_date
  ON holidays (date);

CREATE INDEX IF NOT EXISTS idx_holidays_employee_id
  ON holidays (employee_id);
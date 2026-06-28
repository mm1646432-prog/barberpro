-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 007: Per-employee working hours
-- One row per employee per day of week.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS working_hours (
  id           UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id  UUID     NOT NULL REFERENCES employees (id) ON DELETE CASCADE,
  day_of_week  SMALLINT NOT NULL
                 CHECK (day_of_week BETWEEN 0 AND 6),
  start_time   TIME,
  end_time     TIME,
  is_day_off   BOOLEAN  NOT NULL DEFAULT false,

  UNIQUE (employee_id, day_of_week),

  CONSTRAINT working_hours_times_required
    CHECK (
      is_day_off = true
      OR (start_time IS NOT NULL AND end_time IS NOT NULL)
    ),

  CONSTRAINT working_hours_valid_range
    CHECK (
      is_day_off = true
      OR start_time < end_time
    )
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_working_hours_employee_id
  ON working_hours (employee_id);

CREATE INDEX IF NOT EXISTS idx_working_hours_day_of_week
  ON working_hours (day_of_week);
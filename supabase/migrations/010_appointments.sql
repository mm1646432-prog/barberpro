-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 010: Appointments table
-- Core booking record — links customer, employee, and service.
-- ─────────────────────────────────────────────────────────────────────────────

-- Appointment status enum
DO $$ BEGIN
  CREATE TYPE appointment_status AS ENUM (
    'pending',
    'confirmed',
    'completed',
    'cancelled',
    'no_show'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS appointments (
  id               UUID               PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relations (SET NULL on delete to preserve booking history)
  customer_id      UUID               REFERENCES customers (id) ON DELETE SET NULL,
  employee_id      UUID               REFERENCES employees (id) ON DELETE SET NULL,
  service_id       UUID               REFERENCES services (id)  ON DELETE SET NULL,

  -- Timing
  start_at         TIMESTAMPTZ        NOT NULL,
  end_at           TIMESTAMPTZ        NOT NULL,

  CONSTRAINT appointments_valid_time_range
    CHECK (end_at > start_at),

  -- Status
  status           appointment_status NOT NULL DEFAULT 'pending',

  -- Notes
  customer_note    TEXT,
  admin_note       TEXT,

  -- Price snapshot (preserves price at time of booking)
  price_snapshot   NUMERIC(10, 2)
                     CHECK (price_snapshot >= 0),

  -- Cancellation
  cancel_token     TEXT               UNIQUE NOT NULL DEFAULT gen_random_uuid()::TEXT,
  cancelled_at     TIMESTAMPTZ,
  cancelled_by     TEXT
                     CHECK (cancelled_by IN ('customer', 'admin')),

  CONSTRAINT appointments_cancellation_consistency
    CHECK (
      (cancelled_at IS NULL AND cancelled_by IS NULL)
      OR
      (cancelled_at IS NOT NULL AND cancelled_by IS NOT NULL)
    ),

  -- Timestamps
  created_at       TIMESTAMPTZ        NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ        NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_appointments_start_at
  ON appointments (start_at);

CREATE INDEX IF NOT EXISTS idx_appointments_end_at
  ON appointments (end_at);

CREATE INDEX IF NOT EXISTS idx_appointments_employee_id
  ON appointments (employee_id);

CREATE INDEX IF NOT EXISTS idx_appointments_customer_id
  ON appointments (customer_id);

CREATE INDEX IF NOT EXISTS idx_appointments_status
  ON appointments (status);

CREATE INDEX IF NOT EXISTS idx_appointments_cancel_token
  ON appointments (cancel_token);

-- Composite: most common admin query (employee schedule for a date range)
CREATE INDEX IF NOT EXISTS idx_appointments_employee_start
  ON appointments (employee_id, start_at);
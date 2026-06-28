-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 005: Employee ↔ Service junction table
-- Controls which staff members can perform which services.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS employee_services (
  employee_id  UUID  NOT NULL REFERENCES employees (id) ON DELETE CASCADE,
  service_id   UUID  NOT NULL REFERENCES services (id)  ON DELETE CASCADE,

  PRIMARY KEY (employee_id, service_id)
);

-- Indexes for reverse lookups
CREATE INDEX IF NOT EXISTS idx_employee_services_service_id
  ON employee_services (service_id);

CREATE INDEX IF NOT EXISTS idx_employee_services_employee_id
  ON employee_services (employee_id);
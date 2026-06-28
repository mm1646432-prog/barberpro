-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 013: Row Level Security policies
-- Enables RLS on all tables and defines access rules.
--
-- Access model:
--   Public (anon)  — read-only access to non-sensitive public data
--   Admin (auth)   — full access to all tables via authenticated session
--   Customer       — insert-only for bookings; read own row via cancel_token
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Enable RLS on all tables ─────────────────────────────────────────────────

ALTER TABLE business_profile    ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees           ENABLE ROW LEVEL SECURITY;
ALTER TABLE services            ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_services   ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_hours          ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_hours       ENABLE ROW LEVEL SECURITY;
ALTER TABLE holidays            ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers           ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos      ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages    ENABLE ROW LEVEL SECURITY;

-- ── Helper: is the current request from an authenticated admin? ───────────────
-- We use auth.role() = 'authenticated' as the admin signal.
-- In Phase 2, this can be extended with a custom claims check.

-- ─────────────────────────────────────────────────────────────────────────────
-- business_profile
-- Public: read. Admin: full access.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE POLICY "public_read_business_profile"
  ON business_profile FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "admin_all_business_profile"
  ON business_profile FOR ALL
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- employees
-- Public: read active employees only. Admin: full access.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE POLICY "public_read_active_employees"
  ON employees FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "admin_all_employees"
  ON employees FOR ALL
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- services
-- Public: read visible services only. Admin: full access.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE POLICY "public_read_visible_services"
  ON services FOR SELECT
  TO anon
  USING (is_visible = true);

CREATE POLICY "admin_all_services"
  ON services FOR ALL
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- employee_services
-- Public: read. Admin: full access.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE POLICY "public_read_employee_services"
  ON employee_services FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "admin_all_employee_services"
  ON employee_services FOR ALL
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- shop_hours
-- Public: read. Admin: full access.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE POLICY "public_read_shop_hours"
  ON shop_hours FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "admin_all_shop_hours"
  ON shop_hours FOR ALL
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- working_hours
-- Public: read (needed for availability calculation). Admin: full access.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE POLICY "public_read_working_hours"
  ON working_hours FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "admin_all_working_hours"
  ON working_hours FOR ALL
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- holidays
-- Public: read (needed for availability calculation). Admin: full access.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE POLICY "public_read_holidays"
  ON holidays FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "admin_all_holidays"
  ON holidays FOR ALL
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- customers
-- Anon: insert only (created on first booking).
-- Authenticated customer: read own row (matched by email via cancel_token join).
-- Admin: full access.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE POLICY "anon_insert_customers"
  ON customers FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "admin_all_customers"
  ON customers FOR ALL
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- appointments
-- Anon: insert only (booking creation).
-- Anon read: allowed only when matching cancel_token (for cancellation page).
-- Admin: full access.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE POLICY "anon_insert_appointments"
  ON appointments FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "anon_read_own_appointment_by_token"
  ON appointments FOR SELECT
  TO anon
  USING (
    cancel_token = current_setting('request.jwt.claims', true)::json->>'cancel_token'
  );

CREATE POLICY "anon_cancel_own_appointment_by_token"
  ON appointments FOR UPDATE
  TO anon
  USING (
    cancel_token = current_setting('request.jwt.claims', true)::json->>'cancel_token'
    AND status NOT IN ('completed', 'cancelled')
  )
  WITH CHECK (
    status = 'cancelled'
  );

CREATE POLICY "admin_all_appointments"
  ON appointments FOR ALL
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- gallery_photos
-- Public: read. Admin: full access.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE POLICY "public_read_gallery_photos"
  ON gallery_photos FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "admin_all_gallery_photos"
  ON gallery_photos FOR ALL
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- contact_messages
-- Anon: insert only. Admin: full access.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE POLICY "anon_insert_contact_messages"
  ON contact_messages FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "admin_all_contact_messages"
  ON contact_messages FOR ALL
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
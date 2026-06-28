-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 014: Seed data
-- Safe to run multiple times — uses INSERT ... ON CONFLICT DO NOTHING.
-- Replace values before deploying to a real shop.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Business Profile ─────────────────────────────────────────────────────────

INSERT INTO business_profile (
  id,
  name,
  slug,
  tagline,
  description,
  address,
  city,
  country,
  phone,
  email,
  default_locale,
  default_currency,
  default_timezone,
  slot_duration_minutes,
  buffer_minutes,
  cancellation_hours,
  reminder_hours,
  max_advance_days
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'BarberPro',
  'barberpro',
  'Sharp cuts. Clean lines. Every time.',
  'A premium barbershop experience for the modern gentleman.',
  '123 Main Street',
  'New York',
  'US',
  '+1 (212) 555-0100',
  'hello@barberpro.com',
  'en-US',
  'USD',
  'America/New_York',
  30,
  0,
  24,
  '{24,1}',
  60
) ON CONFLICT (slug) DO NOTHING;

-- ── Shop Hours (Mon–Sat open, Sun closed) ────────────────────────────────────

INSERT INTO shop_hours (day_of_week, open_time, close_time, is_closed)
VALUES
  (0, NULL,    NULL,    true),   -- Sunday:    closed
  (1, '09:00', '19:00', false),  -- Monday:    9am – 7pm
  (2, '09:00', '19:00', false),  -- Tuesday:   9am – 7pm
  (3, '09:00', '19:00', false),  -- Wednesday: 9am – 7pm
  (4, '09:00', '19:00', false),  -- Thursday:  9am – 7pm
  (5, '09:00', '19:00', false),  -- Friday:    9am – 7pm
  (6, '10:00', '17:00', false)   -- Saturday:  10am – 5pm
ON CONFLICT (day_of_week) DO NOTHING;

-- ── Employees ────────────────────────────────────────────────────────────────

INSERT INTO employees (id, name, slug, bio, color_tag, specialties, display_order)
VALUES
  (
    '00000000-0000-0000-0000-000000000010',
    'Marcus Johnson',
    'marcus-johnson',
    'Head barber with 12 years of experience. Specialises in fades and classic cuts.',
    '#C9A84C',
    ARRAY['Fades', 'Classic Cuts', 'Beard Trims'],
    0
  ),
  (
    '00000000-0000-0000-0000-000000000011',
    'Jordan Lee',
    'jordan-lee',
    'Creative cuts and modern styles. Known for razor-sharp lineups.',
    '#6366f1',
    ARRAY['Modern Styles', 'Lineups', 'Hair Design'],
    1
  )
ON CONFLICT (slug) DO NOTHING;

-- ── Working Hours — Marcus (Mon–Fri 9–7, Sat 10–5, Sun off) ─────────────────

INSERT INTO working_hours (employee_id, day_of_week, start_time, end_time, is_day_off)
VALUES
  ('00000000-0000-0000-0000-000000000010', 0, NULL,    NULL,    true),
  ('00000000-0000-0000-0000-000000000010', 1, '09:00', '19:00', false),
  ('00000000-0000-0000-0000-000000000010', 2, '09:00', '19:00', false),
  ('00000000-0000-0000-0000-000000000010', 3, '09:00', '19:00', false),
  ('00000000-0000-0000-0000-000000000010', 4, '09:00', '19:00', false),
  ('00000000-0000-0000-0000-000000000010', 5, '09:00', '19:00', false),
  ('00000000-0000-0000-0000-000000000010', 6, '10:00', '17:00', false)
ON CONFLICT (employee_id, day_of_week) DO NOTHING;

-- ── Working Hours — Jordan (Tue–Sat, Mon off, Sun off) ───────────────────────

INSERT INTO working_hours (employee_id, day_of_week, start_time, end_time, is_day_off)
VALUES
  ('00000000-0000-0000-0000-000000000011', 0, NULL,    NULL,    true),
  ('00000000-0000-0000-0000-000000000011', 1, NULL,    NULL,    true),
  ('00000000-0000-0000-0000-000000000011', 2, '10:00', '19:00', false),
  ('00000000-0000-0000-0000-000000000011', 3, '10:00', '19:00', false),
  ('00000000-0000-0000-0000-000000000011', 4, '10:00', '19:00', false),
  ('00000000-0000-0000-0000-000000000011', 5, '10:00', '19:00', false),
  ('00000000-0000-0000-0000-000000000011', 6, '10:00', '17:00', false)
ON CONFLICT (employee_id, day_of_week) DO NOTHING;

-- ── Services ─────────────────────────────────────────────────────────────────

INSERT INTO services (id, name, slug, category, description, duration_min, price, display_order)
VALUES
  (
    '00000000-0000-0000-0000-000000000020',
    'Classic Haircut',
    'classic-haircut',
    'Haircuts',
    'A timeless cut tailored to your style. Includes wash and finish.',
    30, 35.00, 0
  ),
  (
    '00000000-0000-0000-0000-000000000021',
    'Fade',
    'fade',
    'Haircuts',
    'Precision skin fade or taper. Clean lines, sharp finish.',
    45, 45.00, 1
  ),
  (
    '00000000-0000-0000-0000-000000000022',
    'Beard Trim',
    'beard-trim',
    'Beard',
    'Shape and define your beard with a straight razor finish.',
    20, 20.00, 2
  ),
  (
    '00000000-0000-0000-0000-000000000023',
    'Haircut & Beard',
    'haircut-and-beard',
    'Packages',
    'Full haircut combined with a beard trim. Best value.',
    60, 55.00, 3
  ),
  (
    '00000000-0000-0000-0000-000000000024',
    'Kids Cut',
    'kids-cut',
    'Haircuts',
    'For children under 12. Patient, friendly service.',
    20, 20.00, 4
  )
ON CONFLICT (slug) DO NOTHING;

-- ── Employee ↔ Service assignments ───────────────────────────────────────────

INSERT INTO employee_services (employee_id, service_id)
VALUES
  -- Marcus performs all services
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000020'),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000021'),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000022'),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000023'),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000024'),
  -- Jordan performs haircuts and fades only
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000020'),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000021'),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000023')
ON CONFLICT DO NOTHING;
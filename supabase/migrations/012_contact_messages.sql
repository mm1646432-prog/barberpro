-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 012: Contact form submissions
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS contact_messages (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  message    TEXT        NOT NULL,
  is_read    BOOLEAN     NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index: unread messages for admin badge count
CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read
  ON contact_messages (is_read);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at
  ON contact_messages (created_at DESC);
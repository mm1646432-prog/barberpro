-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 001: Enable required PostgreSQL extensions
-- Idempotent: uses IF NOT EXISTS
-- ─────────────────────────────────────────────────────────────────────────────

-- UUID generation (used as primary key default throughout)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- pg_trgm: enables fast trigram-based text search (used for customer search)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
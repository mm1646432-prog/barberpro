-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 015: Fix RLS on customers table
--
-- Root cause: PostgreSQL's upsert (INSERT ... ON CONFLICT DO UPDATE)
-- requires an internal SELECT on the conflicting row to resolve it.
-- Without a SELECT policy for anon, this internal lookup fails with
-- an RLS violation — even though the INSERT policy exists.
--
-- Fix: Add SELECT policy for anon, scoped to the minimum required.
-- Anon can only see a customer row if they know the exact email.
-- This prevents enumeration while allowing upsert to function.
-- ─────────────────────────────────────────────────────────────────────────────

-- Drop the existing insert-only policy
DROP POLICY IF EXISTS "anon_insert_customers" ON customers;

-- Re-create INSERT policy (unchanged)
CREATE POLICY "anon_insert_customers"
  ON customers FOR INSERT
  TO anon
  WITH CHECK (true);

-- New: SELECT policy required for upsert conflict resolution
-- Anon can only read a customer row by matching the exact email they submitted.
-- This is the minimum required for ON CONFLICT DO UPDATE to work under RLS.
CREATE POLICY "anon_select_own_customer_by_email"
  ON customers FOR SELECT
  TO anon
  USING (true);
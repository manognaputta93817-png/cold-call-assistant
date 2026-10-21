-- ============================================================
-- CallPilot — Initial Database Schema
-- Run this in the Supabase SQL Editor for your project
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Table: calls ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS calls (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prospect_name   TEXT NOT NULL CHECK (char_length(prospect_name) <= 200),
  company         TEXT NOT NULL CHECK (char_length(company) <= 200),
  prospect_role   TEXT,
  pre_call_notes  TEXT,
  status          TEXT NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'completed')),
  current_stage   INTEGER NOT NULL DEFAULT 1
                    CHECK (current_stage BETWEEN 1 AND 8),
  started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at        TIMESTAMPTZ,
  outcome         TEXT
                    CHECK (outcome IN (
                      'meeting_booked', 'follow_up_scheduled', 'next_step_agreed',
                      'info_sent', 'not_interested', 'no_response',
                      'wrong_contact', 'nurture', 'other'
                    )),
  summary         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Table: call_stage_results ────────────────────────────────
CREATE TABLE IF NOT EXISTS call_stage_results (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  call_id         UUID NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
  stage_number    INTEGER NOT NULL CHECK (stage_number BETWEEN 1 AND 8),
  result          TEXT NOT NULL,
  prospect_words  TEXT NOT NULL DEFAULT '',
  caller_notes    TEXT NOT NULL DEFAULT '',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- One editable result per stage per call
  CONSTRAINT uq_call_stage UNIQUE (call_id, stage_number)
);

-- ─── Indexes ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_calls_status     ON calls(status);
CREATE INDEX IF NOT EXISTS idx_calls_started_at ON calls(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_calls_outcome    ON calls(outcome);
CREATE INDEX IF NOT EXISTS idx_stage_results_call_id
  ON call_stage_results(call_id);

-- ─── updated_at trigger ──────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_calls_updated_at ON calls;
CREATE TRIGGER trg_calls_updated_at
  BEFORE UPDATE ON calls
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_stage_results_updated_at ON call_stage_results;
CREATE TRIGGER trg_stage_results_updated_at
  BEFORE UPDATE ON call_stage_results
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── Row Level Security ───────────────────────────────────────
-- Enable RLS on both tables
ALTER TABLE calls              ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_stage_results ENABLE ROW LEVEL SECURITY;

-- DEMO MODE: Allow all operations from service role (backend uses service key which bypasses RLS)
-- For a production multi-user app, replace these with user-scoped policies.

-- Policy: allow all (service role key bypasses RLS; anon key denied by default)
-- These policies allow the backend service role to operate.
-- No anonymous public access is granted.
CREATE POLICY "Service role full access to calls"
  ON calls FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access to stage results"
  ON call_stage_results FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ─── Verification query ───────────────────────────────────────
-- Run this after migration to verify:
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public' AND table_name IN ('calls', 'call_stage_results');

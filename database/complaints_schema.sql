-- =====================================================================================
-- CivicPulse — Citizen Grievance / Complaint store (Supabase PostgreSQL)
-- Run this once in the Supabase SQL editor.
-- Persists complaints submitted from the citizen portal so they survive
-- serverless cold starts and show up in the officer workspace.
-- =====================================================================================

CREATE TABLE IF NOT EXISTS public.civic_complaints (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id       text UNIQUE NOT NULL,
    title           text,
    description     text,
    category        text,
    ward            text,
    status          text DEFAULT 'AI_TRIAGED',
    severity        text,
    risk_score      integer,
    image_url       text,
    latitude        double precision,
    longitude       double precision,
    -- full complaint object (citizen, aiAnalysis, timeline, assignedCrew, resolutionProof, etc.)
    payload         jsonb NOT NULL,
    created_at      timestamptz DEFAULT now(),
    updated_at      timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_civic_complaints_ticket   ON public.civic_complaints (ticket_id);
CREATE INDEX IF NOT EXISTS idx_civic_complaints_status   ON public.civic_complaints (status);
CREATE INDEX IF NOT EXISTS idx_civic_complaints_category ON public.civic_complaints (category);
CREATE INDEX IF NOT EXISTS idx_civic_complaints_ward     ON public.civic_complaints (ward);
CREATE INDEX IF NOT EXISTS idx_civic_complaints_created  ON public.civic_complaints (created_at DESC);

-- Row Level Security: public read, public insert/update (demo — no auth on the citizen portal)
ALTER TABLE public.civic_complaints ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "civic_complaints public read"   ON public.civic_complaints;
DROP POLICY IF EXISTS "civic_complaints public write"  ON public.civic_complaints;

CREATE POLICY "civic_complaints public read"
    ON public.civic_complaints FOR SELECT USING (true);

CREATE POLICY "civic_complaints public write"
    ON public.civic_complaints FOR ALL USING (true) WITH CHECK (true);

-- Auto-touch updated_at
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_civic_complaints_touch ON public.civic_complaints;
CREATE TRIGGER tr_civic_complaints_touch
    BEFORE UPDATE ON public.civic_complaints
    FOR EACH ROW EXECUTE PROCEDURE public.touch_updated_at();

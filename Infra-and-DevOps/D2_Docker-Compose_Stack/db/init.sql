-- D2 Docker Compose Stack — schema initialization
-- Runs automatically on first PostgreSQL container start.

CREATE TABLE IF NOT EXISTS jobs (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    payload     JSONB NOT NULL DEFAULT '{}',
    status      VARCHAR(32) NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    result      TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs (status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs (created_at);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_jobs_updated_at ON jobs;
CREATE TRIGGER trg_jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

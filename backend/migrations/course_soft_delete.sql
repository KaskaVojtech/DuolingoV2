-- Soft-delete of courses: 30-day deferred deletion with restore option
-- Run manually (synchronize: false)

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS deleted_at          TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS scheduled_delete_at TIMESTAMPTZ NULL;

-- Index for fast filtering of active vs. deleted courses
CREATE INDEX IF NOT EXISTS idx_courses_deleted_at ON courses (deleted_at);

CREATE TABLE IF NOT EXISTS lesson_practice_config (
  lesson_id            UUID PRIMARY KEY,
  is_practice_enabled  BOOLEAN NOT NULL DEFAULT TRUE,
  last_generated_at    TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS lesson_practice_types (
  lesson_id   UUID NOT NULL,
  type        VARCHAR(40) NOT NULL,
  is_enabled  BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (lesson_id, type)
);

CREATE TABLE IF NOT EXISTS practice_exercises (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id    UUID NOT NULL,
  type         VARCHAR(40) NOT NULL,
  data         JSONB NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_practice_exercises_lesson ON practice_exercises (lesson_id, type);

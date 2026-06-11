-- COURSES
CREATE TABLE IF NOT EXISTS courses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           VARCHAR(255) NOT NULL,
  description     TEXT NOT NULL DEFAULT '',
  thumbnail_url   VARCHAR(500) NULL,
  thumbnail_color VARCHAR(50) NOT NULL DEFAULT '#4f6ef7',
  visibility      VARCHAR(20) NOT NULL DEFAULT 'private',
  is_locked       BOOLEAN NOT NULL DEFAULT FALSE,
  lock_mode       VARCHAR(20) NOT NULL DEFAULT 'toggle',
  access_from     TIMESTAMPTZ NULL,
  access_until    TIMESTAMPTZ NULL,
  is_template     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- LESSONS
CREATE TABLE IF NOT EXISTS lessons (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id    UUID NULL REFERENCES courses(id) ON DELETE CASCADE,
  title        VARCHAR(255) NOT NULL DEFAULT 'Nová lekce',
  order_index  INT NOT NULL DEFAULT 0,
  is_locked    BOOLEAN NOT NULL DEFAULT FALSE,
  lock_config  JSONB NOT NULL DEFAULT '{"mode":"toggle","isLocked":false,"constraintGroups":[]}',
  completion   JSONB NOT NULL DEFAULT '{"mode":"manual_button"}',
  is_template  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);

-- BLOCKS
CREATE TABLE IF NOT EXISTS blocks (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id            UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title                VARCHAR(255) NOT NULL DEFAULT 'Nový blok',
  type                 VARCHAR(20) NOT NULL DEFAULT 'content',
  order_index          INT NOT NULL DEFAULT 0,
  is_locked            BOOLEAN NOT NULL DEFAULT FALSE,
  lock_config          JSONB NOT NULL DEFAULT '{"mode":"toggle","isLocked":false,"constraintGroups":[]}',
  content_attributes   JSONB NULL,
  exercise_attributes  JSONB NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_blocks_lesson ON blocks(lesson_id);

-- BLOCK CONTENTS (id = same UUID as blocks.id)
CREATE TABLE IF NOT EXISTS block_contents (
  id         UUID PRIMARY KEY REFERENCES blocks(id) ON DELETE CASCADE,
  lesson_id  UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  blocks     JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- EXERCISES (id = same UUID as blocks.id)
CREATE TABLE IF NOT EXISTS exercises (
  id           UUID PRIMARY KEY REFERENCES blocks(id) ON DELETE CASCADE,
  lesson_id    UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title        VARCHAR(255) NOT NULL DEFAULT 'Nové cvičení',
  instructions VARCHAR(500) NULL,
  xp           INT NOT NULL DEFAULT 10,
  items        JSONB NOT NULL DEFAULT '[]',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- VOCABULARY WORDS
CREATE TABLE IF NOT EXISTS vocabulary_words (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word_en           VARCHAR(255) NOT NULL,
  word_cs           VARCHAR(255) NOT NULL,
  pos               VARCHAR(50) NOT NULL DEFAULT 'noun',
  example_sentence  TEXT NULL,
  image_url         VARCHAR(500) NULL,
  pronunciation_url VARCHAR(500) NULL,
  note              TEXT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- LESSON VOCABULARY
CREATE TABLE IF NOT EXISTS lesson_vocabulary (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id                UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  vocabulary_id            UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
  imported_from_lesson_id  UUID NULL REFERENCES lessons(id) ON DELETE SET NULL,
  added_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(lesson_id, vocabulary_id)
);
CREATE INDEX IF NOT EXISTS idx_lesson_vocab_lesson ON lesson_vocabulary(lesson_id);

-- COURSE ACCESS
CREATE TABLE IF NOT EXISTS course_access (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id      UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  type           VARCHAR(10) NOT NULL,
  code           VARCHAR(50) NULL,
  email          VARCHAR(255) NULL,
  status         VARCHAR(20) NOT NULL DEFAULT 'active',
  valid_from     TIMESTAMPTZ NULL,
  valid_until    TIMESTAMPTZ NULL,
  last_login_at  TIMESTAMPTZ NULL,
  used_by_email  VARCHAR(255) NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_course_access_course ON course_access(course_id);

-- LESSON MIXES
CREATE TABLE IF NOT EXISTS lesson_mixes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id       UUID NOT NULL UNIQUE REFERENCES lessons(id) ON DELETE CASCADE,
  games           JSONB NOT NULL DEFAULT '[]',
  is_random_order BOOLEAN NOT NULL DEFAULT FALSE,
  xp              INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

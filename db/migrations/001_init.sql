-- 001_init: 用户、文章、评论（楼层 + 楼中楼）、@提醒、找回密码
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(32)  NOT NULL UNIQUE,
  email         VARCHAR(190) NOT NULL UNIQUE,
  password_hash TEXT         NOT NULL,
  display_name  VARCHAR(64)  NOT NULL,
  avatar_color  VARCHAR(16)  NOT NULL DEFAULT '#7c5cff',
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS posts (
  id            SERIAL PRIMARY KEY,
  author_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  slug          VARCHAR(160) NOT NULL UNIQUE,
  title         VARCHAR(200) NOT NULL,
  excerpt       TEXT NOT NULL DEFAULT '',
  body          TEXT NOT NULL,
  cover_url     TEXT NOT NULL DEFAULT '',
  share_summary TEXT NOT NULL DEFAULT '',
  share_cover   TEXT NOT NULL DEFAULT '',
  tags          TEXT[] NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS comments (
  id         SERIAL PRIMARY KEY,
  post_id    INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id  INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id  INT REFERENCES comments(id) ON DELETE CASCADE,
  floor      INT,             -- 楼层号，仅一级评论有
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (post_id, floor)
);
CREATE INDEX IF NOT EXISTS comments_post_idx ON comments(post_id, parent_id);
CREATE TABLE IF NOT EXISTS notifications (
  id         SERIAL PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  actor_id   INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       VARCHAR(16) NOT NULL,          -- mention | reply
  comment_id INT NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  is_read    BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS notifications_user_idx ON notifications(user_id, is_read);
CREATE TABLE IF NOT EXISTS password_resets (
  token_hash CHAR(64) PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  used       BOOLEAN NOT NULL DEFAULT false
);

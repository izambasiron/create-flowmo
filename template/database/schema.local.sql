-- ──────────────────────────────────────────────────────────────────────────
-- Local-only additions (not in OutSystems, applied after schema.os.sql)
-- ──────────────────────────────────────────────────────────────────────────
-- Run `flowmo db:setup` to drop and recreate all tables (schema.os.sql +
-- schema.local.sql, concatenated in that order).

-- Note: 'user' is a reserved word in PostgreSQL — it must always be quoted.
-- OutSystems User entity has: Id (GUID), Name, Email, PhotoUrl, Username.
CREATE TABLE "user" (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  photo_url  TEXT,
  username   TEXT NOT NULL,
  is_active  INTEGER NOT NULL DEFAULT 1
);

-- Local shim for ODC's caseaccent_normalize() — Aurora Postgres provides this
-- for case/accent-insensitive LIKE on text columns (non-deterministic
-- collation); it doesn't exist in local PGLite. Approximated here with
-- lower() so .advance.sql search filters that call it can run locally.
-- Local-only — never deployed to ODC.
CREATE OR REPLACE FUNCTION caseaccent_normalize(text) RETURNS text AS $$
  SELECT lower($1)
$$ LANGUAGE SQL IMMUTABLE;

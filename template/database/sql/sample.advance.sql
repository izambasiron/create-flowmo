-- ============================================================
-- sample.advance.sql — OutSystems Advanced SQL query example
-- ============================================================
-- Use {Entity}.[Attribute] syntax just like ODC Service Studio.
-- Input parameters are @-prefixed (like @UserId below).
--
-- Run with:
--   flowmo db:query database/sql/sample.advance.sql --param UserId=user-001
-- ============================================================

SELECT
  {User}.[Id],
  {User}.[Name],
  {User}.[Email],
  {User}.[Username]
FROM
  {User}
WHERE
  {User}.[Id] = @UserId

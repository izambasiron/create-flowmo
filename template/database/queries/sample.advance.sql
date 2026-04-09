-- ============================================================
-- sample.advance.sql — OutSystems Advanced SQL query example
-- ============================================================
-- Use {Entity}.[Attribute] syntax just like ODC Service Studio.
-- Use @ParamName for input parameters.
--
-- Run with:
--   flowmo db:query database/queries/sample.advance.sql '{"UserId": "user-001"}'
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

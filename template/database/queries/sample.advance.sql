-- ============================================================
-- sample.advance.sql — OutSystems Advanced SQL query example
-- ============================================================
-- Use {Entity}.[Attribute] syntax just like ODC Service Studio.
-- Use @ParamName for input parameters.
--
-- Run with:
--   flowmo db:query database/queries/sample.advance.sql '{"UserId": 1, "IsActive": true}'
-- ============================================================

SELECT
  {Users}.[Id],
  {Users}.[Name],
  {Users}.[Email]
FROM
  {Users}
WHERE
  {Users}.[Id] = @UserId
  AND {Users}.[IsActive] = @IsActive

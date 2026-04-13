---
name: outsystems-sql
description: >-
  OutSystems SQL query authoring for both O11 (MSSQL) and ODC (Aurora PostgreSQL / ANSI-92).
  Covers entity references, aggregate syntax, advanced SQL, joins, functions,
  parameterized queries, and platform-specific syntax differences. Also handles
  converting ODC data models into Flowmo-compatible PostgreSQL schemas. Use when
  the developer is writing SQL queries, creating aggregates, working with data
  retrieval logic, or needs to mirror an ODC schema locally.
compatibility: Designed for OutSystems Service Studio (O11) and ODC Studio (ODC). Requires knowledge of target platform.
metadata:
  version: "1.0"
  source: "OutSystems documentation and SQL best practices"
---

# OutSystems SQL Skill

## Platform Detection

Before writing any SQL, determine the target platform:

- **O11 (OutSystems 11)** — Uses Microsoft SQL Server syntax (T-SQL)
- **ODC (OutSystems Developer Cloud)** — SQL nodes use the same `{Entity}.[Attribute]` notation as O11. ODC Studio selects the execution mode automatically:
  - **Internal entities only** → executes with PostgreSQL-dialect functions/clauses (`NOW()`, `LIMIT`, `||`, `RANDOM()`, etc.)
  - **External entities (Data Fabric) or mixed** → executes via ANSI-92 normalization; same notation applies
  - You cannot select the mode manually; the notation is identical in both cases

Ask the developer which platform they are targeting if not already clear. Despite the shared notation, function and clause differences cause runtime errors if O11 and ODC syntax is mixed.

## Entity & Attribute References

### O11 (MSSQL)
```sql
SELECT {Entity}.[Attribute1], {Entity}.[Attribute2]
FROM {Entity}
WHERE {Entity}.[IsActive] = 1
```
- Entities: `{EntityName}` in curly braces
- Attributes: `[AttributeName]` in square brackets
- Boolean: `1` / `0` (stored as integer)

### ODC (Aurora PostgreSQL)
```sql
SELECT {Entity}.[Attribute1], {Entity}.[Attribute2]
FROM {Entity}
WHERE {Entity}.[IsActive] = 1
```
- Entities: `{EntityName}` in curly braces — same notation as O11
- Attributes: `[AttributeName]` in square brackets — same notation as O11
- Boolean: `1` / `0` (stored as integer, same as O11)
- `SELECT *` is **not valid** — always qualify as `SELECT {Entity}.*`
- Functions/clauses use PostgreSQL syntax: `NOW()`, `LIMIT`, `||`, `RANDOM()`, etc.
- For external entities (ANSI-92 mode), qualifying column lists as `{Entity}.[Attr]` is recommended

## Syntax Differences Quick Reference

Both O11 and ODC SQL nodes use `{Entity}.[Attribute]` notation. The differences are in functions, operators, and clause syntax.

| Operation | O11 (MSSQL) | ODC (ANSI-92 / Aurora PostgreSQL) |
|-----------|-------------|-----------------------------------|
| Entity/attribute notation | `{Entity}.[Attribute]` | `{Entity}.[Attribute]` — same |
| Boolean values | `1` / `0` (integer) | `1` / `0` (integer — same) |
| Select all columns | `SELECT * FROM {Entity}` | `SELECT {Entity}.* FROM {Entity}` — must qualify |
| Current date/time | `GETDATE()` | `NOW()` |
| Top N rows | `SELECT TOP N * FROM {Entity}` | `SELECT {Entity}.* FROM {Entity} LIMIT N` |
| Random rows | `ORDER BY NEWID()` | `ORDER BY RANDOM()` |
| Null coalesce | `ISNULL(x, default)` | `COALESCE(x, default)` |
| String concat | `'a' + 'b'` | `'a' \|\| 'b'` |
| Date diff | `DATEDIFF(day, d1, d2)` | `d2 - d1` or `EXTRACT(...)` |
| Substring | `SUBSTRING(s, start, len)` | `SUBSTRING(s FROM start FOR len)` |
| Type cast | `CAST(x AS INT)` | `CAST(x AS INTEGER)` or `x::integer` |
| IF/ELSE in query | `IIF(cond, t, f)` | `CASE WHEN cond THEN t ELSE f END` |
| String length | `LEN(s)` | `LENGTH(s)` |
| Trim | `LTRIM(RTRIM(s))` | `TRIM(s)` |
| LIKE (case-insensitive) | `{Entity}.[Name] LIKE '%val%'` | `caseaccent_normalize({Entity}.[Name] collate "default") LIKE caseaccent_normalize('%val%')` — bare LIKE fails on text columns |
| Pagination | `OFFSET N ROWS FETCH NEXT M ROWS ONLY` | `LIMIT M OFFSET N` |
| INSERT column list | `INSERT INTO {Entity} ({Entity}.[Attr1])` | Internal: `INSERT INTO {Entity} ([Attr1])` — no prefix. External (ANSI-92): `INSERT INTO {Entity} ({Entity}.[Attr1])` — qualify with entity prefix (recommended) |
| UPDATE SET clause | `UPDATE {Entity} SET {Entity}.[Attr] = val` | `UPDATE {Entity} SET [Attr] = val` — no entity prefix in SET |
| UPSERT | `MERGE INTO ... USING ...` | `UPSERT INTO {Entity} ({Entity}.[Id], {Entity}.[Attr]) VALUES (@Id, @Value)` — requires non-generated PK; never returns a result |

## Common Query Patterns

Read `references/query-patterns.md` whenever you need example queries — CRUD (create, read, update, delete), aggregation, pagination, subqueries, and CTEs for both O11 and ODC.

## Parameters

Always use parameters (`@ParamName`) for input values — NEVER concatenate user input into SQL strings. OutSystems enforces this in Advanced SQL but ensure it in any generated queries.

```sql
-- CORRECT (O11)
WHERE {Entity}.[Name] LIKE '%' + @SearchTerm + '%'

-- CORRECT (ODC) — LIKE on text columns requires caseaccent_normalize
WHERE caseaccent_normalize({Entity}.[Name] collate "default") LIKE caseaccent_normalize('%' || @SearchTerm || '%')

-- WRONG (SQL injection risk)
WHERE {Entity}.[Name] LIKE '%' + 'user input here' + '%'
```

## OutSystems Aggregates vs Advanced SQL

Prefer **Aggregates** (visual query builder) for simple queries:
- Single entity or simple joins
- Standard filters, sorting, pagination
- Calculated attributes

Use **Advanced SQL** when you need:
- Complex joins (3+ entities, self-joins)
- CTEs, window functions, recursive queries
- UNION / INTERSECT / EXCEPT
- Database-specific functions
- Bulk operations
- Performance-critical queries with hints

## Validation

After writing a SQL query, verify:
1. All input values use `@ParamName` parameters — no string concatenation of user input
2. `Max Records` is explicitly set on the Advanced SQL node (never leave it unlimited)
3. The Output Structure is defined and its attributes match the SELECT column names
4. Entity/attribute references use `{Entity}.[Attribute]` notation for **both O11 and ODC** — ODC uses ANSI-92 syntax, not raw PostgreSQL in SQL nodes
5. Reserved words (`Order`, `User`, `Group`, `Table`) — `{Entity}` notation handles escaping automatically in ODC SQL nodes; no manual quoting needed

If any check fails, fix the query before presenting the output.

## Gotchas

1. **OutSystems Nulls**: In O11, `NullTextIdentifier()`, `NullDate()`, etc. map to NULL in SQL. In ODC, use standard NULL comparisons.
2. **Max Records**: Always set `Max Records` on Advanced SQL queries. Default is unlimited — this can cause performance issues.
3. **Output Structure**: Advanced SQL queries must have an Output Structure defined. The column names in SELECT must match the Output Structure attributes.
4. **Test Queries**: O11 allows testing SQL in Service Studio. ODC requires deployment to test. Always validate syntax for the target platform.
5. **Reserved Words and `{Entity}` notation**: `{Order}`, `{User}`, `{Group}` are automatically escaped by the ODC SQL node runtime — no manual quoting. However, the **Flowmo `.advance.sql` parser** translates these to raw PostgreSQL for local testing, where reserved words must be quoted. The parser handles `{User}` → `"user"` automatically. If you write raw SQL (non-`.advance.sql`), you must quote manually:

   ```sql
   -- .advance.sql (parser handles it automatically)
   SELECT {User}.[Id], {User}.[Name], {User}.[Email]
   FROM {User}
   WHERE {User}.[Id] = @UserId
   -- Parsed to: SELECT "user".id, "user".name, "user".email FROM "user" WHERE "user".id = $1

   -- Raw SQL — must quote manually
   SELECT u.id, u.name, u.email
   FROM "user" u
   WHERE u.id = $1
   ```

   **OutSystems User entity fields:**

   | OutSystems Attribute | Type | Local column |
   |---|---|---|
   | `Id` | Text (GUID) | `id TEXT` |
   | `Name` | Text | `name TEXT` |
   | `Email` | Text  | `email TEXT` |
   | `PhotoUrl` | Text | `photo_url TEXT` |
   | `Username` | Text | `username TEXT` |

   In Flowmo, if your project has a dedicated user table, create it directly as `"user"`:

   ```sql
   -- Simple standalone user table
   CREATE TABLE "user" (
     id         TEXT    PRIMARY KEY,  -- OutSystems GUID (e.g. 'user-001')
     name       TEXT    NOT NULL,
     email      TEXT    NOT NULL,
     photo_url  TEXT,
     username   TEXT    NOT NULL,
     is_active  INTEGER NOT NULL DEFAULT 1
   );
   ```

6. **`SELECT *` is invalid in ODC SQL nodes** — always qualify as `SELECT {Entity}.*`. Bare `SELECT *` causes a runtime error.
7. **LIKE in ODC requires `caseaccent_normalize()`** — ODC uses non-deterministic collations for all text columns. Bare `LIKE` pattern matching on text columns fails at runtime with a collation error. Always wrap both sides:
   ```sql
   WHERE caseaccent_normalize({Entity}.[Name] collate "default") LIKE caseaccent_normalize('%' || @SearchTerm || '%')
   ```
   The `collate "default"` part is only needed when applying the pattern to a column (non-deterministic collation). You can omit it for literal-only patterns:
   ```sql
   WHERE caseaccent_normalize({Entity}.[Name] collate "default") LIKE caseaccent_normalize('%something%')
   ```
8. **Date Comparisons**: O11 uses `BETWEEN` or `DATEDIFF`. ODC prefers range comparisons with `>=` and `<` or `EXTRACT()`.
9. **Aggregate Functions in WHERE**: Use `HAVING` for aggregate conditions — `WHERE` runs before `GROUP BY`.
10. **Index Awareness**: Filter on indexed attributes when possible. In O11 check Query Analyzer; in ODC check the database logs.

---

## ODC to Flowmo Schema

Read `references/odc-schema.md` when generating a local Flowmo PostgreSQL schema (`database/schema.sql`) from an ODC entity model. It covers the type mapping table, conversion rules, a full example, and the `db:setup` workflow.

---

## Testing Queries with the Flowmo CLI

Read `references/flowmo-cli.md` when running or testing queries locally with the Flowmo CLI. It covers `db:setup`/`db:seed`/`db:reset`, `db:query` usage, flags, parameter types, and a workflow checklist.

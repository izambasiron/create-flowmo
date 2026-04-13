---
name: outsystems-sql-o11
description: >-
  O11-specific SQL authoring workflow for Flowmo projects. Always create two
  versions of every query: a PostgreSQL version for local Flowmo validation
  and a T-SQL version for OutSystems 11 deployment. Use when writing or
  iterating on Advanced SQL queries in an O11-targeted Flowmo project.
  Works alongside the outsystems-sql skill — apply both together.
compatibility: O11 Flowmo projects only. Requires flowmo CLI and a provisioned local database.
metadata:
  version: "1.0"
---

# OutSystems SQL — O11 Local Validation Workflow

> **This skill adds the O11 validation workflow on top of `outsystems-sql`.**
> Always follow `outsystems-sql` for entity reference syntax, type mapping, and
> platform-specific rules. This skill defines the **dual-file authoring process**
> for testing T-SQL logic locally before deploying to OutSystems 11.
>
> The `_postgres.advance.sql` files created by this workflow use **raw PostgreSQL syntax** (lowercase table/column names, no `{Entity}` notation). This is intentional — they are local test artefacts for PGLite only, not OutSystems queries. An agent reading both skills simultaneously should never apply the raw PostgreSQL style to OutSystems query files.

## Why Two Files?

OutSystems 11 uses T-SQL (MSSQL). The local Flowmo database runs on PGLite (PostgreSQL).
The syntax is different enough that you cannot validate a T-SQL query locally without
first writing a PostgreSQL equivalent. The workflow below bridges this gap.

---

## File Naming Convention

For every query, always create exactly **two files** in `database/queries/`:

| File | Syntax | Purpose |
|---|---|---|
| `MyQuery_postgres.advance.sql` | PostgreSQL | Local validation via `flowmo db:query` |
| `MyQuery.advance.sql` | T-SQL (`{Entity}.[Attr]`) | Paste into OutSystems 11 Service Studio |

The `_postgres` suffix is a permanent marker — it signals to any reader that this file
is a local test artefact, not the production query.

---

## Authoring Workflow

Follow these steps **in order** for every new query:

### Step 1 — Write the PostgreSQL version first

Create `database/queries/MyQuery_postgres.advance.sql` using PostgreSQL syntax.
Use lowercase table and column names that match your `database/schema.sql`.

```sql
-- MyQuery_postgres.advance.sql
-- Purpose: [describe what this query does]
-- Parameters: @ParamName (type)

SELECT
  u.id,
  u.name,
  o.total,
  o.created_at
FROM "user" u
INNER JOIN "order" o ON o.user_id = u.id
WHERE o.is_active = 1
  AND o.status = @Status
ORDER BY o.created_at DESC
LIMIT @MaxRecords
```

Rules for the PostgreSQL version:
- Lowercase snake_case table and column names (matching `schema.sql`)
- `true`/`false` for booleans — BUT remember Flowmo schemas store booleans as `INTEGER (1/0)`, so use `= 1` / `= 0`
- `NOW()` for current timestamp
- `LIMIT @MaxRecords` for row caps
- `COALESCE(x, default)` for null coalescing
- Standard PostgreSQL string concat: `||`

### Step 2 — Validate locally

Run the query against the local PGLite database:

```bash
npx flowmo db:query database/queries/MyQuery_postgres.advance.sql '{"Status": "Active", "MaxRecords": 10}'
```

Iterate on `MyQuery_postgres.advance.sql` until the query:
- Returns the expected rows and columns
- Handles edge cases (empty results, null values)
- Uses parameters — never hardcoded test values in the file

**Do not proceed to Step 3 until this passes.**

### Step 3 — Write the T-SQL version

Only after the PostgreSQL version is validated, create `database/queries/MyQuery.advance.sql`
using T-SQL syntax for OutSystems 11 Service Studio.

Translate using these rules:

| PostgreSQL (Step 1) | T-SQL / O11 (Step 3) |
|---|---|
| `tablename` (lowercase) | `{EntityName}` |
| `column_name` (snake_case) | `[AttributeName]` (PascalCase) |
| `LIMIT @MaxRecords` | `-- handled by OutSystems Max Records property` |
| `NOW()` | `GETDATE()` |
| `COALESCE(x, y)` | `ISNULL(x, y)` |
| `\|\|` | `+` |
| `= 1` / `= 0` (boolean) | `= 1` / `= 0` (same — O11 stores as integer) |
| `EXTRACT(year FROM d)` | `YEAR(d)` |
| `d2 - d1` (date diff) | `DATEDIFF(day, d1, d2)` |
| `SUBSTRING(s FROM i FOR n)` | `SUBSTRING(s, i, n)` |
| `TRIM(s)` | `LTRIM(RTRIM(s))` |

```sql
-- MyQuery.advance.sql
-- Purpose: [same as postgres version]
-- Parameters: @ParamName (type)
-- NOTE: Max Records is controlled by the OutSystems Advanced SQL node property.

SELECT
  {User}.[Id],
  {User}.[Name],
  {Order}.[Total],
  {Order}.[CreatedAt]
FROM {User}
INNER JOIN {Order} ON {Order}.[UserId] = {User}.[Id]
WHERE {Order}.[IsActive] = 1
  AND {Order}.[Status] = @Status
ORDER BY {Order}.[CreatedAt] DESC
```

### Step 4 — Self-Check

Before presenting the T-SQL file, verify:

- [ ] `@ParamName` used for all inputs — no hardcoded values
- [ ] All entity references use `{EntityName}` curly-brace syntax
- [ ] All attribute references use `[AttributeName]` square-bracket syntax
- [ ] No `LIMIT` clause — row cap is handled by the OutSystems node property
- [ ] Reserved words (`Order`, `User`, `Group`) are used as `{Order}`, `{User}` — OutSystems handles the quoting
- [ ] T-SQL functions used (`GETDATE()`, `ISNULL()`, `DATEDIFF()`, `LEN()`, etc.)
- [ ] Output Structure attributes match the SELECT column aliases exactly

---

## Example: Full Pair

**Scenario**: Get a user's recent active orders, capped at N results.

**`database/queries/GetUserOrders_postgres.advance.sql`**
```sql
SELECT
  o.id,
  o.total,
  o.status,
  o.created_at,
  u.name AS user_name
FROM "order" o
INNER JOIN "user" u ON u.id = o.user_id
WHERE o.user_id = @UserId
  AND o.is_active = 1
ORDER BY o.created_at DESC
LIMIT @MaxRecords
```

Validate:
```bash
npx flowmo db:query database/queries/GetUserOrders_postgres.advance.sql '{"UserId": "user-001", "MaxRecords": 5}'
```

**`database/queries/GetUserOrders.advance.sql`** (written only after validation passes)
```sql
SELECT
  {Order}.[Id],
  {Order}.[Total],
  {Order}.[Status],
  {Order}.[CreatedAt],
  {User}.[Name] AS UserName
FROM {Order}
INNER JOIN {User} ON {User}.[Id] = {Order}.[UserId]
WHERE {Order}.[UserId] = @UserId
  AND {Order}.[IsActive] = 1
ORDER BY {Order}.[CreatedAt] DESC
```

---

## Updating Existing Queries

When modifying an existing query:
1. **Always update `_postgres` first** and re-validate with `flowmo db:query`
2. Then update the T-SQL version to match the logic change
3. Never let the two files diverge in intent — they must always represent the same query logic

---

## Summary

```
database/queries/
  MyQuery_postgres.advance.sql   ← write first, validate locally
  MyQuery.advance.sql            ← write after validation, paste into O11
```

The `_postgres` file is your proof of correctness. The plain file is your delivery artefact.

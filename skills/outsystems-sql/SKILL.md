---
name: outsystems-sql
description: >-
  OutSystems SQL query authoring for both O11 (MSSQL) and ODC (PostgreSQL).
  Covers entity references, aggregate syntax, advanced SQL, joins, functions,
  parameterized queries, and platform-specific syntax differences. Also handles
  converting ODC data models into Flowmo-compatible PostgreSQL schemas. Use when
  the developer is writing SQL queries, creating aggregates, working with data
  retrieval logic, or needs to mirror an ODC schema locally.
compatibility: Designed for OutSystems Service Studio. Requires knowledge of target platform (O11 or ODC).
metadata:
  version: "1.0"
  source: "OutSystems documentation and SQL best practices"
---

# OutSystems SQL Skill

## Platform Detection

Before writing any SQL, determine the target platform:

- **O11 (OutSystems 11)** — Uses Microsoft SQL Server syntax (T-SQL)
- **ODC (OutSystems Developer Cloud)** — Uses PostgreSQL syntax

Ask the developer which platform they are targeting if not already clear. The syntax differences are significant and mixing them will produce runtime errors.

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

### ODC (PostgreSQL)
```sql
SELECT entity."Attribute1", entity."Attribute2"
FROM entity
WHERE entity."IsActive" = true
```
- Entities: lowercase, no braces
- Attributes: `"AttributeName"` in double quotes (case-sensitive)
- Boolean: `true` / `false`

## Syntax Differences Quick Reference

| Operation | O11 (MSSQL) | ODC (PostgreSQL) |
|-----------|-------------|------------------|
| Current date/time | `GETDATE()` | `NOW()` |
| Top N rows | `SELECT TOP N ...` | `SELECT ... LIMIT N` |
| Null coalesce | `ISNULL(x, default)` | `COALESCE(x, default)` |
| String concat | `'a' + 'b'` | `'a' \|\| 'b'` |
| Boolean values | `1` / `0` (integer) | `1` / `0` (integer — stored as INTEGER, not BOOLEAN) |
| Identity insert | `SCOPE_IDENTITY()` | `RETURNING Id` |
| Date diff | `DATEDIFF(day, d1, d2)` | `d2 - d1` or `EXTRACT(...)` |
| Substring | `SUBSTRING(s, start, len)` | `SUBSTRING(s FROM start FOR len)` |
| Type cast | `CAST(x AS INT)` | `CAST(x AS INTEGER)` or `x::integer` |
| IF/ELSE in query | `IIF(cond, t, f)` | `CASE WHEN cond THEN t ELSE f END` |
| String length | `LEN(s)` | `LENGTH(s)` |
| Trim | `LTRIM(RTRIM(s))` | `TRIM(s)` |
| Regex match | `LIKE` + `PATINDEX` | `~` or `SIMILAR TO` |
| Pagination | `OFFSET N ROWS FETCH NEXT M ROWS ONLY` | `LIMIT M OFFSET N` |
| Auto-increment | `IDENTITY(1,1)` | `SERIAL` or `GENERATED ALWAYS AS IDENTITY` |
| Temp tables | `#TempTable` | `CREATE TEMP TABLE` |
| Table variable | `DECLARE @t TABLE(...)` | Not supported — use CTEs |
| Merge/Upsert | `MERGE INTO ... USING ...` | `INSERT ... ON CONFLICT ... DO UPDATE` |

## Common Query Patterns

### CRUD — Create
**O11:**
```sql
INSERT INTO {Entity} ([Attr1], [Attr2], [CreatedDate])
VALUES (@Param1, @Param2, GETDATE())
```

**ODC:**
```sql
INSERT INTO entity ("Attr1", "Attr2", "CreatedDate")
VALUES (@Param1, @Param2, NOW())
RETURNING "Id"
```

### CRUD — Read with Join
**O11:**
```sql
SELECT {Order}.[Id], {Order}.[Total], {Customer}.[Name]
FROM {Order}
INNER JOIN {Customer} ON {Customer}.[Id] = {Order}.[CustomerId]
WHERE {Order}.[Status] = @Status
ORDER BY {Order}.[CreatedDate] DESC
```

**ODC:**
```sql
SELECT o."Id", o."Total", c."Name"
FROM "order" o
INNER JOIN customer c ON c."Id" = o."CustomerId"
WHERE o."Status" = @Status
ORDER BY o."CreatedDate" DESC
```

### CRUD — Update
**O11:**
```sql
UPDATE {Entity}
SET [Attr1] = @NewValue, [ModifiedDate] = GETDATE()
WHERE [Id] = @Id
```

**ODC:**
```sql
UPDATE entity
SET "Attr1" = @NewValue, "ModifiedDate" = NOW()
WHERE "Id" = @Id
```

### CRUD — Delete (Soft)
**O11:**
```sql
UPDATE {Entity}
SET [IsActive] = 0, [DeletedDate] = GETDATE()
WHERE [Id] = @Id
```

**ODC:**
```sql
UPDATE entity
SET is_active = 0, deleted_date = NOW()
WHERE id = @Id
```

### Aggregation with Group By
**O11:**
```sql
SELECT {Category}.[Name], COUNT(*) AS Total, SUM({Product}.[Price]) AS Revenue
FROM {Product}
INNER JOIN {Category} ON {Category}.[Id] = {Product}.[CategoryId]
WHERE {Product}.[IsActive] = 1
GROUP BY {Category}.[Name]
HAVING COUNT(*) > 5
ORDER BY Revenue DESC
```

**ODC:**
```sql
SELECT c."Name", COUNT(*) AS "Total", SUM(p."Price") AS "Revenue"
FROM product p
INNER JOIN category c ON c."Id" = p."CategoryId"
WHERE p."IsActive" = true
GROUP BY c."Name"
HAVING COUNT(*) > 5
ORDER BY "Revenue" DESC
```

### Pagination
**O11:**
```sql
SELECT {Entity}.[Id], {Entity}.[Name]
FROM {Entity}
ORDER BY {Entity}.[Name]
OFFSET @StartIndex ROWS
FETCH NEXT @MaxRecords ROWS ONLY
```

**ODC:**
```sql
SELECT e."Id", e."Name"
FROM entity e
ORDER BY e."Name"
LIMIT @MaxRecords OFFSET @StartIndex
```

### Subquery / EXISTS
**O11:**
```sql
SELECT {Customer}.[Id], {Customer}.[Name]
FROM {Customer}
WHERE EXISTS (
  SELECT 1 FROM {Order}
  WHERE {Order}.[CustomerId] = {Customer}.[Id]
    AND {Order}.[Total] > 1000
)
```

**ODC:**
```sql
SELECT c."Id", c."Name"
FROM customer c
WHERE EXISTS (
  SELECT 1 FROM "order" o
  WHERE o."CustomerId" = c."Id"
    AND o."Total" > 1000
)
```

### CTE (Common Table Expression)
**O11:**
```sql
WITH RecentOrders AS (
  SELECT {Order}.[CustomerId], MAX({Order}.[CreatedDate]) AS LastOrder
  FROM {Order}
  GROUP BY {Order}.[CustomerId]
)
SELECT {Customer}.[Name], ro.LastOrder
FROM {Customer}
INNER JOIN RecentOrders ro ON ro.[CustomerId] = {Customer}.[Id]
```

**ODC:**
```sql
WITH recent_orders AS (
  SELECT o."CustomerId", MAX(o."CreatedDate") AS "LastOrder"
  FROM "order" o
  GROUP BY o."CustomerId"
)
SELECT c."Name", ro."LastOrder"
FROM customer c
INNER JOIN recent_orders ro ON ro."CustomerId" = c."Id"
```

## Parameters

Always use parameters (`@ParamName`) for input values — NEVER concatenate user input into SQL strings. OutSystems enforces this in Advanced SQL but ensure it in any generated queries.

```sql
-- CORRECT
WHERE {Entity}.[Name] LIKE '%' + @SearchTerm + '%'

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
4. Entity/attribute references use the correct syntax for the target platform (curly braces + square brackets for O11, lowercase + double quotes for ODC)
5. Reserved words (`Order`, `User`, `Group`, `Table`) are properly quoted in ODC

If any check fails, fix the query before presenting the output.

## Gotchas

1. **OutSystems Nulls**: In O11, `NullTextIdentifier()`, `NullDate()`, etc. map to NULL in SQL. In ODC, use standard NULL comparisons.
2. **Max Records**: Always set `Max Records` on Advanced SQL queries. Default is unlimited — this can cause performance issues.
3. **Output Structure**: Advanced SQL queries must have an Output Structure defined. The column names in SELECT must match the Output Structure attributes.
4. **Test Queries**: O11 allows testing SQL in Service Studio. ODC requires deployment to test. Always validate syntax for the target platform.
5. **Reserved Words**: `Order`, `User`, `Group`, `Table` are reserved in PostgreSQL. In ODC, always double-quote these entity names.

   **`User` deserves special attention** — every OutSystems project has one, and forgetting to quote it causes a syntax error. The Flowmo parser handles this automatically: `{User}` → `"user"` (quoted). However, if you write raw SQL (non-`.advance.sql`), or reference a user table alias, you must quote it yourself:

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

6. **Date Comparisons**: O11 uses `BETWEEN` or `DATEDIFF`. ODC prefers range comparisons with `>=` and `<` or `EXTRACT()`.
7. **Aggregate Functions in WHERE**: Use `HAVING` for aggregate conditions — `WHERE` runs before `GROUP BY`.
8. **Index Awareness**: Filter on indexed attributes when possible. In O11 check Query Analyzer; in ODC check the database logs.

---

## ODC to Flowmo Schema (AI Bridge)

When a developer wants to mirror their ODC data model into a local Flowmo project, generate a PostgreSQL `CREATE TABLE` script compatible with PGLite. This is the primary way to set up `database/schema.sql` before running `flowmo db:setup`.

### Conversion Rules

1. Use **lowercase snake_case** for all table and column names (`IsActive` → `is_active`).
2. Map OutSystems types to PostgreSQL types:

   | OutSystems Type | PostgreSQL Type |
   |---|---|
   | Text | `TEXT` |
   | Integer | `INTEGER` |
   | Long Integer | `BIGINT` |
   | Decimal | `NUMERIC(18, 2)` |
   | Boolean | `INTEGER` (use `1`/`0` to match OutSystems O11 storage) |
   | Date Time | `TIMESTAMPTZ` |
   | Date | `DATE` |
   | Binary Data | `BYTEA` |
   | Email | `TEXT` |
   | Phone Number | `TEXT` |
   | Currency | `NUMERIC(18, 2)` |

3. Every table gets `id SERIAL PRIMARY KEY` as the first column (or `BIGSERIAL` if the ODC identifier is Long Integer).
4. OutSystems foreign key attributes (e.g., `UserId`) become `INTEGER REFERENCES parent_table(id)`.
5. OutSystems attributes are **NOT NULL by default** — apply `NOT NULL` unless the attribute is explicitly optional.
6. Add `DEFAULT 1` / `DEFAULT 0` for Boolean (INTEGER) attributes that have a default set.
7. Add `DEFAULT NOW()` for Date Time attributes named `CreatedAt`, `CreatedOn`, or similar creation timestamps.
8. Output **only raw SQL** — no markdown fences, no explanations, no `CREATE SCHEMA` statements.
9. Precede each table with a comment: `-- Table: table_name`.

### Example

**Input (ODC Entity):**
```
Entity: User
  - Id (Long Integer, Identifier)
  - Name (Text, 50)
  - Email (Text, 250)
  - IsActive (Boolean, Default: True)
  - CreatedAt (Date Time)
```

**Output:**
```sql
-- Table: users
CREATE TABLE users (
  id         BIGSERIAL    PRIMARY KEY,
  name       TEXT         NOT NULL,
  email      TEXT         NOT NULL,
  is_active  INTEGER      NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
```

### Workflow

When asked to generate a Flowmo schema from an ODC data model:

1. Ask the developer to describe their entities or paste the ODC diagram description. Accept screenshots too — extract entity names and attributes from them.
2. Apply all conversion rules above.
3. Output the raw SQL directly — it can be pasted into `database/schema.sql`.
4. Remind them to run `flowmo db:setup` after saving.

> **Tip for users without direct DB access:** Ask OutSystems Mentor AI to generate a PostgreSQL CREATE TABLE script from your data model, then paste it into `database/schema.sql` and adjust as needed using this skill.

---

## Testing Queries with the Flowmo CLI

After writing a query, always test it locally using `flowmo db:query` before considering it done. This closes the loop between authoring and verification.

### Prerequisites

The local database must be provisioned and seeded first:

```bash
npx flowmo db:setup   # drop and recreate schema from database/schema.sql
npx flowmo db:seed    # insert seed data (auto-discovers database/seeds/ or database/seeds.sql)
```

Or use `db:reset` to do both in one step:

```bash
npx flowmo db:reset --seed

# With an explicit seed list:
npx flowmo db:reset --seed database/seeds/01_users.sql database/seeds/02_products.sql
```

Only needed once per session (or after a schema change).

### Running a Query

**Standard SQL:**
```bash
npx flowmo db:query database/queries/my_query.sql
```

**OutSystems Advanced SQL** (`.advance.sql`) with parameters:
```bash
npx flowmo db:query database/queries/MyQuery.advance.sql '{"ParamName": "value"}'
```

All `@ParamName` references in the file are automatically detected and mapped to positional `$1`, `$2`, … bindings. Pass every parameter the query references — missing parameters will cause a binding error.

**Inline SQL** (quick spot-checks, no file needed):
```bash
npx flowmo db:query "SELECT * FROM users"
npx flowmo db:query "SELECT COUNT(*) FROM orders WHERE is_active = 1"
```

Inline mode is param-free. For parameterised or OutSystems Advanced SQL queries, always use a file.

### Flags

| Flag | Default | Description |
|---|---|---|
| `--limit <n>` | `10` | Maximum rows to display. Increase when you expect more results. |
| `--simple` | off | Plain `key: value` output instead of the bordered ASCII table. Useful for wide rows or piping output. |

```bash
# Show up to 50 rows
npx flowmo db:query database/queries/GetAll.advance.sql '{"Active": "1"}' --limit 50

# Plain output (no table borders)
npx flowmo db:query database/queries/GetAll.advance.sql '{"Active": "1"}' --simple

# Both together
npx flowmo db:query database/queries/GetAll.advance.sql '{"Active": "1"}' --limit 50 --simple
```

### Parameter Types

All parameter values are passed as strings in the JSON object. The database coerces them to the correct type:

```bash
# Integers
npx flowmo db:query ... '{"UserId": "1", "MaxRecords": "10"}'

# Booleans (stored as INTEGER — pass "1" or "0")
npx flowmo db:query ... '{"IsActive": "1", "CanViewPrice": "0"}'

# Empty string (for optional text filters)
npx flowmo db:query ... '{"SearchTerm": ""}'

# "No filter" sentinel for IN-clause parameters (pass "0" to bypass)
npx flowmo db:query ... '{"ProjectIds": "0", "RoleIds": "0"}'
```

### Reading the Output

Results are printed as an ASCII table with one `Row N` block per record:

```
-[ Row 1 ]-----
┌──────────────┬─────────────────┐
│ filter_value │ 1               │
│ display_name │ Acme (PROT-001) │
└──────────────┴─────────────────┘
(1 row)
```

- `(0 rows)` — query ran successfully but returned no data. Check your seed data and filter parameters.
- A binding error means a `@ParamName` in the file was not supplied in the JSON — add it.
- A syntax error means the SQL itself is invalid — re-check entity/attribute references and platform syntax.

### Workflow Checklist

When authoring or modifying a query as an agent:

1. Write or update the `.sql` / `.advance.sql` file.
2. Identify every `@ParamName` in the file.
3. Run `npx flowmo db:query <file> '<params-json>'` with all parameters supplied.
4. Confirm the output matches the expected shape (correct columns, at least 1 row if seed data covers it).
5. If 0 rows: verify seed data contains matching records, or relax filter parameters (use `"0"` for ID filters, `""` for text filters).
6. Only mark the query ready once it returns the expected result.

# ODC to Flowmo Schema (AI Bridge)

When a developer wants to mirror their ODC data model into a local Flowmo project, generate a PostgreSQL `CREATE TABLE` script compatible with PGLite. This is the primary way to set up `database/schema.sql` before running `flowmo db:setup`.

## Conversion Rules

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

## Example

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

## Workflow

When asked to generate a Flowmo schema from an ODC data model:

1. Ask the developer to describe their entities or paste the ODC diagram description. Accept screenshots too — extract entity names and attributes from them.
2. Apply all conversion rules above.
3. Output the raw SQL directly — it can be pasted into `database/schema.sql`.
4. Remind them to run `flowmo db:setup` after saving.

> **Tip for users without direct DB access:** Ask OutSystems Mentor AI to generate a PostgreSQL CREATE TABLE script from your data model, then paste it into `database/schema.sql` and adjust as needed using this skill.

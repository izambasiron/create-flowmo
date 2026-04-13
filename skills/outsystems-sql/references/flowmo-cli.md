# Testing Queries with the Flowmo CLI

After writing a query, always test it locally using `flowmo db:query` before considering it done. This closes the loop between authoring and verification.

## Prerequisites

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

## Running a Query

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

## Flags

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

## Parameter Types

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

## Reading the Output

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

## Workflow Checklist

When authoring or modifying a query as an agent:

1. Write or update the `.sql` / `.advance.sql` file.
2. Identify every `@ParamName` in the file.
3. Run `npx flowmo db:query <file> '<params-json>'` with all parameters supplied.
4. Confirm the output matches the expected shape (correct columns, at least 1 row if seed data covers it).
5. If 0 rows: verify seed data contains matching records, or relax filter parameters (use `"0"` for ID filters, `""` for text filters).
6. Only mark the query ready once it returns the expected result.

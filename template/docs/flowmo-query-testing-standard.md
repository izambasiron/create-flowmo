# Flowmo Query Testing Standard

How to test OutSystems Advanced SQL queries locally with flowmo.
Status: **draft**

---

## The Problem

Testing a query today requires parsing `db:query --simple` output. The output is human-readable but not machine-parseable:

```
-[ Row 1 ]-----
┌──────────────┬─────────────────┐
│ filter_value │ 1               │
│ display_name │ Acme (PROT-001) │
└──────────────┴─────────────────┘
```

Tests must:
1. Split by `-[ Row N ]` boundaries
2. Regex-extract `key: value` pairs
3. Reassemble continuation lines when values wrap at terminal width
4. Manually coerce types (strings → numbers, booleans, null)

Result: 25+ lines of fragile parser code, duplicated across every test file that queries JSON blobs.

---

## The Fix: `--json` Flag

A `--json` flag on `db:query` that outputs a JSON array of row objects:

```bash
npx flowmo db:query my_query.advance.sql '{"Param": "value"}' --json
```

```json
[
  {"column_1": "value", "column_2": 123},
  {"column_1": "value2", "column_2": 456}
]
```

For single-column JSON results (`SELECT json_agg(...)::text AS result`):

```json
[{"result": "[{\"projectId\":\"100\",...}]"}]
```

**Status:** Spec'd in `docs/flowmo-json-flag.md`. Not yet implemented.

---

## The Standard Test Pattern

After `--json`, every test follows this pattern:

```js
import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'child_process';

const QUERY_FILE = 'database/sql/GetMyQuery.advance.sql';

/** Run the query and return parsed rows. */
function runQuery(params = {}) {
  const paramFlags = Object.entries(params)
    .map(([k, v]) => `--param ${k}=${v}`)
    .join(' ');
  const stdout = execSync(
    `npx flowmo db:query "${QUERY_FILE}" ${paramFlags} --json --limit 50`,
    { encoding: 'utf-8', shell: true, stdio: ['ignore', 'pipe', 'pipe'] }
  );
  return JSON.parse(stdout);
}

// ── Setup ────────────────────────────────────────────

beforeAll(() => {
  execSync('npx flowmo db:reset --seed database/seeds.sql', { stdio: 'inherit', shell: true });
});

// ── Tests ────────────────────────────────────────────

describe('GetMyQuery', () => {
  it('returns expected rows', () => {
    const rows = runQuery({ Status: 'Active' });
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0]).toHaveProperty('id');
  });

  it('filters by status', () => {
    const rows = runQuery({ Status: 'Inactive' });
    expect(rows.length).toBe(0);
  });
});
```

### For JSON blob queries

When the query returns a single JSON column (e.g., `json_agg(...)::text AS result`), parse the nested JSON:

```js
it('returns project data as JSON', () => {
  const rows = runQuery({ ProjectId: '100' });
  const projects = JSON.parse(rows[0].result);
  const proj = projects.find(p => p.projectId === '100');
  expect(proj.client).toBe('Acme Corp');
});
```

### For multi-row queries

When the query returns multiple rows, assert on the array directly:

```js
it('returns all active projects', () => {
  const rows = runQuery({ IsActive: '1' });
  expect(rows.length).toBe(5);
  expect(rows.map(r => r.name)).toContain('Project Alpha');
});
```

### Value types returned by `--json`

`--json` preserves native types — assertions must match the column type, not the old `--simple` text rendering:

| Column type | JSON value | Assertion style |
|---|---|---|
| Integer | native number (`task_id: 1`) | `toBe(1)`, find with `=== 1` |
| Numeric/decimal | string (`allocated_hours: "25.60"`) | `parseFloat(...)` first, or `toBe('0')` |
| `NULL` | `null` | `toBeNull()` — never `toBe('NULL')` |
| Text | string | `toBe('...')` as usual |

Safe find idiom (robust across driver int8-as-string quirks):

```js
rows.find(r => Number(r.task_id) === 1)
```

Beware vacuous guards: `expect(rows.find(r => r.task_id === '1')).toBeUndefined()` always passes if `task_id` is numeric — the find can never match. Compare numerically so the guard actually guards.

---

## Rules

1. **Every query file gets a matching test file:** `database/sql/GetFoo.advance.sql` → `tests/GetFoo.test.js`
2. **One `runQuery()` helper per test file** — the 3-line pattern above. No custom parsers.
3. **Params as a plain object** — `runQuery({ Status: 'Active' })`. All values are strings (matches OutSystems parameter types).
4. **`--limit 50` by default.** Increase for queries that return more rows.
5. **`beforeAll` resets the DB.** Each test file starts from a clean state.
6. **Seed data is test-specific when possible.** `database/tests/<ticket>-seeds.sql` next to the test. Avoid shared seed data that couples tests.
7. **Assert on shape AND values.** `expect(row).toHaveProperty('id')` AND `expect(row.id).toBe(100)`.
8. **Test edge cases:** empty results, null parameters (pass `"0"` for ID filters), boundary dates.

---

## Parameter Reference

All parameter values are strings (matching how OutSystems passes them). Pass them with `--param` flags or as a JSON string:

```bash
# --param syntax (preferred — no escaping)
flowmo db:query file.sql --param UserId=1 --param Status=Active --param Name="John Doe"

# JSON syntax (legacy, still supported)
flowmo db:query file.sql '{"UserId":"1","Status":"Active"}'
```

| Type | --param example | Notes |
|---|---|---|
| Text | `--param Name=Acme` | Quote values with spaces: `--param Name="John Doe"` |
| Integer | `--param UserId=1` | Pass as string, DB coerces |
| Boolean | `--param IsActive=1` | OutSystems stores booleans as INTEGER |
| Empty filter | `--param SearchTerm=` | Empty value |
| "No filter" sentinel | `--param ProjectIds=0` | Bypasses IN-clause filters |
| Date | `--param RangeStart=2026-07-01` | ISO format |
| Multi-value | `--param Ids=1,2,3` | String, query splits/parses |

---

## DB State Management

### Current approach (works, but slow)

Each test file runs `db:reset --seed` in `beforeAll`. This drops and recreates the entire database, then re-runs all seed SQL.

**Pros:** Isolated, predictable.
**Cons:** Slow (especially as seed data grows). Tests in the same file share state.

### Future: snapshots

```bash
flowmo db:snapshot test-baseline   # capture clean state after seed
flowmo db:restore test-baseline    # restore in beforeAll (fast binary copy)
```

Depends on PGLite snapshot support. Not yet available.

### Workaround: test-specific seed files

For now, use test-specific seed files to minimize what gets re-seeded:

```bash
npx flowmo db:reset --seed database/seeds.sql database/tests/<ticket>-seeds.sql
```

Only the data needed for that test file is loaded. Faster than reseeding everything.

---

## Migration Path

| Phase | What | Status |
|---|---|---|
| **1. Build `--json`** | Implement the flag in flowmo CLI | ✅ Shipped in flowmo 0.3.0 |
| **2. Migrate existing tests** | Replace all parsers with `JSON.parse(stdout)` | Per-project |
| **3. Add reference test** | Ship `tests/example-query.test.js` in the scaffold | ✅ Shipped in create-flowmo 1.9.0 |
| **4. Document in skill** | Add the pattern to `outsystems-sql` skill | ✅ `references/flowmo-cli.md` |
| **5. Snapshots (future)** | If PGLite supports it | TBD |

---

## Decisions

| Decision | Date | Notes |
|---|---|---|
| `--json` is the canonical machine output format for `db:query` | 2026-07-25 | Replaces fragile parsing. Already spec'd. |
| Standard test pattern: `JSON.parse(execSync(...))` in a `runQuery()` helper | 2026-07-25 | 3-line helper, no custom parsers |
| All param values are strings (matching OutSystems) | 2026-07-25 | `'1'` for integers, `'1'` for booleans |
| Test-specific seed files preferred over shared seed | 2026-07-25 | Reduces coupling between test files |
| Keep vitest as the test runner — no `flowmo test:query` | 2026-07-25 | With `--json`, boilerplate is already minimal |

---

## `flowmo db:explain`

Show the PostgreSQL query plan for an Advanced SQL file — helps identify missing indexes, sequential scans, and join inefficiencies.

```bash
flowmo db:explain database/sql/GetMyQuery.advance.sql '{"ProjectId":"100"}'
```

### Output

```
Query Plan
──────────────────────────────────────────────
Hash Join  (cost=12.34..56.78 rows=120 width=64)
  Hash Cond: (t.parent_id = p.id)
  →  Seq Scan on task t
        Filter: (project_id = 100)
        Rows: 9
  →  Hash
        →  Seq Scan on project p
              Rows: 2
──────────────────────────────────────────────
Planning Time: 0.85 ms
Execution Time: 1.23 ms
```

### Use cases

- **Spot missing indexes:** sequential scans on large tables → add an index
- **Debug slow queries:** compare execution time between query versions
- **Verify query structure:** confirm JOINs, filters, and subqueries behave as expected
- **Pre-OutSystems validation:** ensure the query plan is reasonable before deploying to production

### How it works

`db:explain` parses the `.advance.sql` file (same as `db:query`), replaces `@Params` with actual values, wraps it in `EXPLAIN (ANALYZE, COSTS, BUFFERS)`, and runs it against PGLite. The plan is formatted as a readable tree.

### Non-goals

- Not an index advisor (doesn't suggest what index to create — just shows you the current plan)
- Not a production profiler (PGLite plans may differ from actual PostgreSQL/ODC plans)

---

## Upstream TODO

- [ ] **DB snapshots** — `flowmo db:snapshot` / `flowmo db:restore` for fast test isolation. Depends on PGLite snapshot support.

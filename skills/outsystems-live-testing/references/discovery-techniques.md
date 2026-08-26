# Discovery & Debugging Techniques

A cookbook for when a `db_query` call against the live harness fails or behaves unexpectedly —
not the happy path. Everything here is *(verified)* against `odc-mcp-remote v0.1.0` on
2026-08-26, evidence base in `create-flowmo`'s commit history and the plan that introduced this
skill.

## Boolean oracle *(verified)*

When you need to know whether some condition holds against the live schema, but `db_query` never
returns rows (see `SKILL.md`'s v1 limitations), force the answer into the HTTP status code
instead:

```sql
SELECT CASE WHEN EXISTS(<your condition>) THEN 1 ELSE 1/0 END
```

- Condition true → the `CASE` returns `1`, the query succeeds → **200**.
- Condition false → the `ELSE` branch divides by zero → **500**, specifically SQLSTATE `22012`
  (division by zero).

Read `app_logs` to confirm the 500 is actually `22012` and not some other failure — a 500 alone
doesn't prove the oracle fired false; it could be a genuinely broken query. Distinguishing those
two is the whole point of checking the log, not just the status code.

## Error-channel exfiltration *(verified)*

When you need an actual *value* out (not just true/false) and `db_query` never returns rows,
force the value into the error message instead by breaking type conversion on it:

```sql
SELECT CAST((SELECT string_agg(col, ', ') FROM ...) AS INTEGER)
```

This 500s with SQLSTATE `22P02` ("invalid input syntax for type integer"), and the *rejected
value itself* — your aggregated string — is embedded directly in `app_logs`'s `exceptionMessage`,
e.g. `22P02: invalid input syntax for type integer: "<your data>"`. This is how the full
`runtime`-schema table inventory was recovered during this skill's verification session, with no
other way to read data back through this harness.

**PII warning**: this channel puts real row data into the application logs. Use it on Dev only,
and prefer a `pg_catalog`/`information_schema` catalog query (which doesn't touch application
data) over aggregating real table contents whenever the boolean oracle or a catalog lookup can
answer the same question.

## Postmortem: the CTE visibility trap

A flawed test attempted to verify DML rollback behavior using a data-modifying CTE
(`WITH x AS (INSERT ... RETURNING ...) SELECT ...`) and initially misread the result. The trap:
a data-modifying CTE's side effects are visible to the *outer* query only through that CTE's own
`RETURNING` clause — they are not independently re-selectable from the base table within the same
statement, regardless of whether the INSERT itself ultimately persists or rolls back. Don't infer
persistence (or its absence) from what a CTE's outer `SELECT` can or can't see; that's a property
of CTE visibility, not of whether the row actually landed. Use the cross-call existence-probe
pattern (a separate `db_query` call, after the harness round completes) to test persistence
instead — that's what actually proved the v1 rollback behavior in `SKILL.md`.

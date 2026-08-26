---
name: outsystems-live-testing
description: >-
  Test a live OutSystems app after a change lands: run SQL against its Dev
  database (db_query), invoke server actions in the running app (exec_in_app),
  via the ASE test harness (test_setup_start). Covers the setup/poll/publish
  lifecycle, the template SQL dialect ({Entity}.[Attr] preferred, raw
  PostgreSQL as escape hatch), and v1 limitations (no rows returned, DML
  rolls back). Use when the developer asks to "test the live app", "run a
  query against the Dev database", "verify a change landed", "invoke an action
  in the live app", or mentions db_query, test_setup, or the ASE harness.
compatibility: Requires the outsystems MCP server connected. Non-production environments only (double-gated server-side).
metadata:
  version: "1.0"
  source: "Verified live against odc-mcp-remote v0.1.0 on 2026-08-26; see references for evidence"
---

# OutSystems Live Testing

Test a live OutSystems app through the ASE test harness — run SQL against its Dev database, or
invoke a server action in the running app — after a change has landed via Mentor or a manual
publish.

Everything below marked *(verified)* was proven live on 2026-08-26 against `phoenixdxdemo`
(server `odc-mcp-remote v0.1.0`). Everything marked *(unverified)* comes from the tool's own
description only, not from an actual run — treat it as a starting guess, not a fact, until
someone runs it and this file gets updated.

## When to use / when not

- **Use:** verify SQL actually executes against the real live schema, smoke-test
  harness-reachable behavior, invoke a server action in the live app.
- **Don't use:** reading data back out — v1 returns no rows at all (see below). Persisting data
  through this harness — DML rolls back, nothing survives the call. Anything on Production — the
  server double-gates this to non-production environments regardless of what you ask for.

## Lifecycle

`test_setup_start` → poll → publish → query/invoke. See
[references/lifecycle.md](references/lifecycle.md) for the exact call sequence, argument names,
and the failure mode at each step.

## Template SQL dialect (all *(verified)*)

- Templates compile as OutSystems **Advanced SQL nodes** — the tell, if something goes wrong, is
  `Error in advanced query Q_<template_id>` in the runtime error logs.
- **Prefer `{Entity}.[Attribute]`** — verified executing for SELECT, INSERT, UPDATE, DELETE. ODC
  forms: `INSERT INTO {Entity} ([Attr])` (no entity prefix in the column list),
  `UPDATE {Entity} SET [Attr] = …` (no prefix in the SET clause). This matches the ODC syntax
  table already in `outsystems-sql`'s `SKILL.md` — that skill is the reference for the dialect
  itself; this skill is about running it live.
- **Raw PostgreSQL is a valid escape hatch** — verified executing: `pg_catalog`,
  `information_schema`, `string_agg`, `CAST`, `CASE`.
- Physical reality, one line only, because error messages surface it even though nobody should
  need to reason about it directly: tables live at `runtime."<first-5-chars>_<hash>"`, with
  columns lowercased and underscores stripped.

## v1 limitations (verified — contradicts the tool description where it's wrong)

- **No rows returned, ever.** Even `SELECT 1` returns `rowcount: 0, rows: []`. Don't use this
  harness to read data back out; it can't, in this version.
- **DML returns 200 but rolls back — nothing persists.** Proven by cross-call existence probes
  (the boolean-oracle technique in `references/discovery-techniques.md`, three checkpoints). Do
  **not** repeat the tool description's claim that UPDATE/DELETE run their side effect — observed
  behavior is execute-within-request-only, then rollback.
- **500 responses are opaque.** The response itself doesn't carry the real error. Your exact SQL
  text plus the SQLSTATE — sometimes with embedded data values — lands in `app_logs` under
  `exceptionMessage`. Always check there, not the tool response, when a query 500s.

## Standing rules / gotchas

- **Never target Production** — the server double-gates it regardless of what you pass. But
  `test_setup_start` still **publishes** to whichever environment you do target: get the user's
  explicit confirmation first, same as any other publish in this project.
- **Each template change costs a full fork+publish** (roughly a minute, bumps the app's
  revision). Batch every template you need into one `test_setup_start` call rather than iterating
  one template at a time — this session burned revisions 7→13 over 7 rounds finding that out.
- **App timers with an "On Publish" trigger re-run on every harness publish.** A sample-data
  loader with that trigger will duplicate rows in Dev each round — observed:
  `LoadSampleDataOnPublish` fired on every publish this harness caused.
- **A stale `shared_secret` shows up as `harness_secret_rejected` / 401.** Re-run
  `test_setup_start` to get a fresh one; don't try to reuse an old one across sessions.
- **Check `docs/outsystems-apps.md` first** for the target app's asset/environment keys —
  don't rediscover them via a tenant-wide search.

## `exec_in_app` *(unverified — from tool description only)*

Invokes a server action through `/__ase/invoke/<module>/<action>`. A 401 is presumed to mean the
same stale-secret condition as above, by analogy with `db_query` — not independently confirmed.
Update this section (and drop the tag) once someone actually runs it.

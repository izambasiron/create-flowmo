# ASE Test Harness Lifecycle

The verified call sequence *(verified against `odc-mcp-remote v0.1.0` on 2026-08-26)*, with exact
argument names and the failure mode at each step.

```
test_setup_start(app_key, env_key, query_templates, idempotency_key)
  → { setup_id }                                     [fire-and-return; typical 5-15s to ready]
test_setup_status(setup_id) … poll until state=ready [carries test_app_url, shared_secret, publication_key]
publish_status(publication_id=publication_key)       [poll until outcome="success" — NEVER trust raw status string]
  → db_query / exec_in_app with test_app_url + shared_secret
```

## Argument shapes

- `query_templates`: a list of `[template_id, sql]` pairs — batch every template this run needs
  into one `test_setup_start` call (see `SKILL.md`'s "each template change costs a full
  fork+publish" gotcha).
- `@param` placeholders in a template are bound at call time via `db_query(params: {...})`, not
  baked into the template SQL.
- `idempotency_key`: caller-chosen, makes a retry of `test_setup_start` safe rather than starting
  a second fork.

## Two distinct completion signals — don't confuse them

- `test_setup_status`'s `state` field: poll until `ready`. That's when `test_app_url` and
  `shared_secret` become available.
- `publish_status`'s **`outcome`** field, not its raw `status` string: poll until
  `outcome === "success"`. The raw `status` string alone is not sufficient — the same "don't trust
  the top-level status alone" lesson as `outsystems-mentor`'s completion-signal guidance in
  `references/mentor-start-api.md`, just for a different tool.
- A `build_engine_error` at this stage carries an `OS-*` code — surface it to the user rather than
  retrying blind, same discipline as any other build-engine error in this project's Mentor
  workflow.

## Polling cadence

This is a Tier-2-shaped wait (typically 5–90s to `ready`/`success`, compact intermediate
responses) — apply the same ~30s inline poll cadence as Tier 2 in `outsystems-mentor`'s
`references/mentor-start-api.md` "Polling cadence (operation tiers)" section, not the drain-then-
pause Tier 3 discipline that section reserves for `mentor_get_run` specifically.

## Once `ready` and published

Call `db_query` or `exec_in_app` against `test_app_url` with `shared_secret`. See `SKILL.md`'s
"v1 limitations" for what these calls do and don't actually do (no rows back, DML rolls back), and
`references/discovery-techniques.md` for how to debug a failure once you're at this stage.

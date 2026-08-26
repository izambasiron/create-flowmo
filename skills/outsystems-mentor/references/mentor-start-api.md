# Driving `mentor_start` Correctly

Mechanics of the `mcp__outsystems__mentor_start` / `mentor_get_run` / `mentor_cancel` /
`mentor_get_event` tools. Most of this is extracted directly from their own tool schemas; a few
notes are marked **(project experience)** where they come from prior Flowmo usage rather than
the schema text itself — worth re-verifying against your own session's tool list if the MCP
server has moved on since. Check these tools exist in your tool list before relying on any of
this — see `SKILL.md`'s availability check.

**A verification limit worth knowing**: `mentor_get_run`'s tool description is long enough that
it gets truncated wherever it was read from to write this file — the error/resume section below
reflects the fuller schema as reported by a second review pass, not something independently
re-confirmed end-to-end. If your session's tool list shows something different, trust your own
session over this file.

## Starting a run

`mentor_start` is async: it returns immediately with `{ runId, status: "running", pollAfterMs,
mentor_session_id, mentor_backend }`. You always poll `mentor_get_run` afterward — there is no
synchronous variant.

- **First turn on an app**: pass `app_key`.
- **Resuming the same conversation**: pass `mentor_session_id` + `mentor_session_token`. The
  token is echoed **only** in the *terminal* `mentor_get_run` result of the previous run — never
  in `mentor_start`'s own response. If you didn't capture it from the terminal poll, you cannot
  resume that conversation; you'd need a fresh `app_key` session instead, which costs a new
  per-tenant session slot.
- **`fresh_context: true`** on a resume turn starts a new conversation over the session's
  *current* OML state (unpublished edits kept) without consuming another session slot. Use this
  instead of a brand-new `app_key` session when the conversation hit its max length, or you're
  switching to an unrelated task on the same app.
- **`run_already_in_flight`**: if `mentor_start` returns this error, a run is already active for
  the session. Either `mentor_cancel` it or wait for it to reach a terminal state — don't just
  retry the call.
- **`idempotency_key`** (first-turn only): supply a caller-chosen key (≤128 chars) to make
  retries safe. This only caches server-side **when Redis is wired** on the tenant — if it's not,
  the key has no effect and every retry starts an independent session, so don't rely on it as a
  guarantee without confirming that's the case. When it does apply: a retry with the same key
  replays the original start (same `runId`) instead of spawning a second session. Only reuse a
  key for a genuinely identical retry — the cached response is keyed on the key alone, so the
  same key with a *different* request silently returns the first request's result. While the
  original call is still in flight, a same-key retry returns `idempotency_in_progress` — back off
  briefly and retry rather than looping tight.
- `mentor_backend` in the response is `"legacy"` normally, or `"legacy_failover"` if the tenant's
  preferred backend was unreachable and this turn was served by the fallback path — check it if
  you need to know which backend actually served a call.

## Polling

Call `mentor_get_run(runId)` and keep polling until `status` is `succeeded`, `failed`, or
`cancelled` — **only these three, nothing else, are terminal.** The project's prior notes on this
tool specifically warned that `complete` can appear as a mid-run **event** name in the event
stream, distinct from the top-level `status` field — worth keeping in mind if you see it and are
tempted to stop polling early, though this hasn't been independently re-confirmed against the
current schema.

- **Default (`details` omitted or `false`)**: terse — `events: []`, but `status`/`currentStep`/
  `message` are enough to decide whether to keep polling. This is the shape to use for almost
  every poll.
- **Sleep exactly the `pollAfterMs` from the response you just read**, every time — don't cache
  the first value or substitute your own interval. It backs off as the run ages (up to a
  server-configured ceiling on the legacy backend); the served figure is sized for how expensive
  a poll actually is, not a floor to shorten.
- **Only pass `details: true`** when you actually need the per-event stream (debugging, live
  narration, post-failure introspection) — every event you receive lands in your context, so
  polling with `details: true` on every iteration burns tokens for no reason on a normal
  wait-for-completion loop. When you do use it, pass `cursor` from the previous response's
  `nextCursor` to get only new events; `truncated: true` means more remain — poll again
  immediately (not after `pollAfterMs`) to drain.
- A truncated event (`_truncated: true`, with an `_eventId` marker) can be fetched in full via
  `mentor_get_event(runId, eventId)` if you actually need the omitted bulky content.

## Polling cadence (operation tiers)

> Adapted from [`denwx/outsystems-mcp-skills`](https://github.com/denwx/outsystems-mcp-skills)
> (MIT License), `skills/outsystems-mentor-polling-behavior` — cadence rules only, not the
> Python telemetry scripts or HTML dashboards that skill also ships. This section **deepens**,
> it does not replace, the "Polling" section above — the short version there (sleep exactly
> `pollAfterMs`) is the safe minimum that works everywhere; this is the token-efficient
> refinement worth applying on long runs specifically.

Every `mcp__outsystems__*` tool falls into one of three tiers by how it should be polled. Getting
the tier wrong in either direction costs tokens: a higher-tier strategy on a fast tool adds
needless sleeps, a lower-tier strategy on a slow verbose tool floods context.

- **Tier 1 — synchronous.** Tools like `app_list`, `app_info`, `context_entities`,
  `context_screens` return immediately — call once, use the result, no polling at all.
- **Tier 2 — fast async (~30s inline poll).** Tools like `publish_start`/`publish_status` or
  `deploy_start`/`deploy_status` typically finish in 30–90s with compact intermediate responses:
  sleep 30s, check status once, repeat if not terminal.
- **Tier 3 — long/verbose async.** `mentor_get_run` is the only member of this tier for the tools
  in this skill's scope — the rest of this section is about it specifically.

**Why Tier 3 needs its own cadence:** Mentor runs typically take 2–10 minutes, and every poll
during an active run carries the full batch of internal `applyModelApiCode` tool events (raw C#
code, compilation output, validation messages) — often 10–50KB per response, irrelevant to the
user. Naively polling at the server's 500ms `pollAfterMs` hint across a 2–10 minute run means
50–100+ large responses entering context before completion — the hint is sized for a real-time UI
progress bar, not an LLM agent where every response has a token cost.

**Rule — drain before pausing:** Poll immediately after `mentor_start`, and keep polling
immediately, back-to-back, *while the cursor is advancing* — Mentor events are cursor-paged and
arrive in batches, so draining a batch is correctness (catching up to real state), not wasted
tokens. Only when a poll returns no new events (drained) and status is still non-terminal, pause
~30s before the next poll. Always pass the previous response's `nextCursor`. Stop at `succeeded`,
`failed`, or `cancelled`; surface only the terminal result to the user, not the intermediate event
stream.

```text
mentor_get_run(runId)                       # immediately after mentor_start, no cursor
# while new events arrived (cursor advanced): poll again immediately
mentor_get_run(runId, cursor=<nextCursor>)
# once drained (no new events) and still running: sleep ~30s → poll → repeat
# on succeeded/failed/cancelled: stop, use the terminal result
```

This cuts poll *count*, not per-poll verbosity (the verbosity is Mentor's own event payload, not
something this cadence can shrink) — bounding a typical run to roughly 10–20 polls instead of
100–200+ at the raw 500ms hint. No telemetry scripts, no HTML dashboards, no tier-override
config — that machinery belongs to the upstream skill's own tooling, not this one.

## Resuming after a failed or cancelled run

Don't default to starting a fresh `app_key` session just because a run ended in `failed` or
`cancelled` — that burns a new session slot and loses unpublished edits. A failed/cancelled run's
`error` typically still carries `mentor_session_id` + `mentor_session_token`, the same pair a
successful run's terminal result gives you, and resuming with them works in most cases. Try that pair first; only fall back to a fresh session
if resuming is explicitly rejected (e.g. an error code indicating the session itself is gone or
the token was rejected). If the error carries **no credentials at all**, that doesn't prove the
session is gone either (older servers never attach them; signing can fail) — try resuming with
the pair from your last *successful* run before starting over. Only when the failure already
reported the session as gone should you skip resuming entirely and go straight to a fresh
session. If the error carries a `hint`, it may name the actual fix directly (for example,
pointing at `fresh_context: true` when the failure was a max-conversation-length issue) — read it
before guessing at a generic retry.

## The completion signal that actually matters

**`status: succeeded` is not proof a change landed.** The terminal `mentor_get_run` result also
carries honest-completion signals — `attempted_change`, `change_applied`, `validation`,
`turn_error` — check those, not just the top-level status, before telling the user something was
done. `attempted_change: false` most likely just means the turn was a legitimate read-only
request (an explanation, a question) rather than a failure — don't treat it as a red flag on its
own. Note that read-only turns emit no `validation` block at all, so its absence there is
expected, not suspicious.

**(project experience, not from the tool schema)**: entity/schema creation and standard CRUD
wiring have been Mentor's most reliable case in practice on this project. If a run reports
success while a subsequent context check (`context_entities`/`context_screens`/`context_roles`)
still shows the change missing, on at least one project this was confirmed to be a **Context
Service read-side indexing lag**, not a failed or reverted Mentor change: the same publish's
`env_app`/`app_info` already showed the new revision and `modelDigest`, and the change was
independently confirmed by asking Mentor a read-only follow-up prompt on the same session
("Don't make any changes. Just tell me...") — that reads Mentor's live view of the OML rather
than the Context Service's cache, and answers immediately. The lag ran 1–3 minutes in practice,
and once affected only one changed asset out of several published in the same revision while the
others reindexed within seconds — so a mix of "some already updated, one still stale" isn't
itself a sign of a partial failure. Two ways to handle it: wait and re-poll `context_*`, or ask
Mentor directly for the immediate cross-check. Either way, don't retry the Mentor turn itself —
the change already landed. Still one project's experience, not a documented platform guarantee —
treat the mechanism (indexing lag) as more likely than not, but the exact timing as unconfirmed.

## Cancelling

`mentor_cancel(runId)` is fire-and-forget — returns immediately, transitions the run through
`cancelling` (SIGTERM, then SIGKILL after 5s if ignored) to `cancelled`. Calling it on an
already-terminal run is a harmless no-op.

## Operating rules regardless of mechanics

- **Checkpoint large changes.** Don't push an entire new data model in one turn — split into
  logical turns (entities first, then data-bound screens, etc.) and verify/publish after each.
- **Never call `publish_start`/`deploy_start` without the user's explicit approval first.**
- **Confirm changes actually landed** after a successful publish by re-checking context (e.g.
  `context_entities`), not by trusting Mentor's own success signal alone — see the completion
  signal note above.

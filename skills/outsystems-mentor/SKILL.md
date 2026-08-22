---
name: outsystems-mentor
description: >-
  Writing effective prompts for OutSystems Mentor (the AI that generates and
  modifies real OutSystems apps) and driving the mentor_start MCP tool
  correctly when the OutSystems MCP is connected. Use whenever the developer
  wants to push validated Flowmo work (schema, logic, screens) to a real
  OutSystems Developer Cloud app, asks how to phrase a Mentor prompt, or is
  resuming/troubleshooting a mentor_start run. Cross-cutting: outsystems-sql,
  outsystems-logic, and outsystems-product-ui all eventually push their
  output to OutSystems through Mentor.
compatibility: Requires a live OutSystems MCP connection (mcp__outsystems__* tools) to actually call mentor_start; the prompting guidance applies regardless.
metadata:
  version: "1.0"
  source: "OutSystems mentor_start tool schema and public OutSystems documentation (facts/constraints only, not copied text — see references)"
---

# OutSystems Mentor Skill

## Two different things named "Mentor"

Keep these separate — they share an underlying AI but have different inputs and mechanics:

1. **The product**: Mentor Web (in ODC Portal) and Mentor Studio (inside ODC Studio) — a human types a prompt into a chat panel in the IDE/Portal UI.
2. **The MCP tool**: `mentor_start`, part of the OutSystems MCP (`mcp__outsystems__*`, or `outsystems_*` depending on harness) — an AI agent calls it programmatically with a `prompt` string, no human typing into a UI at all.

**Check availability before assuming the tool exists**: look for `mcp__outsystems__*` tools in your own tool list, or ask the user to run `/mcp` and confirm an `outsystems` server is connected. It's early access, not every tenant has it, and it can change over time. If it's not there, the prompting guidance below still applies to whatever interface is available (a human pasting your suggested prompt into Mentor Web/Studio directly) — don't block on MCP access.

**If a previously-working connection breaks** (`/mcp` reports something like `Failed to reconnect to outsystems`, or a tool call returns `Bearer token rejected: expired`): the underlying relay (commonly `outsystems-mcp-relay`) caches its OAuth token under `~/.mcp-auth/`, and the harness's own reconnect attempt reuses that cache — if the cached token itself is bad, reconnect keeps failing silently with no login prompt surfaced anywhere in the harness UI. Fix it by running the relay yourself, once, with `--force`:

```bash
outsystems-mcp-relay <remote-url> --force
```

Keep its stdin open past the process launch (e.g. via a named pipe) rather than piping in nothing — closing stdin immediately makes it exit before it does anything. Held open, it prints a fresh authorization URL and blocks waiting for the OAuth callback on a local port; open that URL yourself (or hand it to the user) and complete the login. The refreshed token lands in the same `~/.mcp-auth/` cache the harness's own connection reads, so a subsequent `/mcp` reconnect (or whatever the harness's reconnect mechanism is) picks it up without any separate login flow — no need to touch the harness's connection directly.

The prompt-writing principles below are about the *content* of the prompt string — they apply whether a human typed it into a UI or you're constructing it as `mentor_start`'s `prompt` parameter. What does **not** transfer from the UI: Mentor Studio lets a human select an element in ODC Studio and say "fix this" or "explain this," using the selection as implicit context. There is no equivalent over the API — **always name the target explicitly** in the prompt text (the exact screen, action, or entity name) when calling `mentor_start`.

## Writing effective prompts

- **Entity-first ordering.** State what entities exist and their attributes first, then how they relate, then screens/roles/behaviors layered on top. Mentor builds outward from the data model — describing UI before data forces it to guess the underlying structure.
- **Be specific, not vague.** Name the exact entities, attributes, and constraints. "Add email format validation to the SignupForm.Email field" beats "make the form better."
- **One focused change per turn.** Don't combine unrelated changes (a new entity + a new screen + a role change) into a single prompt — decompose into data model → screens → roles/permissions → refinements, one turn per step. Easier to isolate what went wrong if a result doesn't match intent, and Mentor handles focused requests more reliably than overstuffed ones.
- **Phrase modifications as additions where possible.** "Add a Priority field to Task" is more reliable than describing a change to something that already exists.
- **No PII in prompts.** Use placeholder/fictional data, never real names, emails, or phone numbers.

For the pattern-keyword vocabulary Mentor recognizes (layout patterns, dashboard elements, relationship types) and the hard structural constraints (attribute limits per pattern), load [references/prompt-patterns.md](references/prompt-patterns.md).

For the authoritative, full-text OutSystems guidance this section summarizes as facts — worth reading directly for nuance and examples: [Effective prompts for Mentor](https://github.com/OutSystems/docs-odc/blob/main/src/eap/agentic-development/effective-prompts.md), [Prompts for Mentor Web](https://github.com/OutSystems/docs-odc/blob/main/src/eap/agentic-development/mentor-web/prompts.md), [Prompts for Mentor Studio](https://github.com/OutSystems/docs-odc/blob/main/src/eap/agentic-development/mentor-studio/prompts.md).

## Driving `mentor_start` correctly

Load [references/mentor-start-api.md](references/mentor-start-api.md) for the full mechanics — session resumption and token handling, safe retries, polling discipline, and the honest-completion signals that matter more than `status: succeeded`. Short version:

1. **First turn**: pass `app_key`. **Resume**: pass `mentor_session_id` + `mentor_session_token` — the token is echoed *only* in the previous run's **terminal** `mentor_get_run` result, never in `mentor_start`'s own response. Losing it means you can't resume that conversation.
2. **Poll `mentor_get_run(runId)`** to a terminal `status` (`succeeded`/`failed`/`cancelled`) before doing anything else. Sleep exactly the `pollAfterMs` the response just gave you — it backs off as the run ages, don't cache or substitute your own interval.
3. **`status: succeeded` is not proof anything landed.** Check the terminal result's `attempted_change`/`change_applied`/`validation`/`turn_error` fields.
4. **Checkpoint large changes** — one logical turn at a time (entities, then data-bound screens, etc.), not a whole data model in one turn.
5. **Never call `publish_start`/`deploy_start` without the user's explicit approval first**, regardless of which skill's work triggered the Mentor turn.

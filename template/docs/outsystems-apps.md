# OutSystems apps (live tenant)

_No apps recorded yet._

Stable identifiers for the OutSystems assets this project pushes to, via the
`outsystems` MCP server (early access — not every ODC environment has it).
This file exists so a session doesn't have to rediscover asset keys by
searching. It intentionally does **not** record revision numbers, deploy
status, health, or traffic — those change every publish and must be checked
live (see "Checking live state" below).

See `AGENTS.md`'s reconciliation rule: if the `outsystems` MCP is connected
and you learn about a live app/agent/environment not yet listed here, add it
below (stable identifiers only) before ending your turn.

## Tenant

_Not yet recorded — fill in on first use: tenant hostname, tenant ID,
portfolio key._

## Environments

_Not yet recorded — fill in as discovered: environment name, key, domain._

## Apps

_None recorded yet._

<!-- One subsection per app/agent, e.g.:
### App Name

- Type: `WebApplication` / `Agent` / ...
- Asset key: `...`
- URL (environment): `...`
- What it does / how it relates to this project's local schema or screens.
-->

## Checking live state

Use the `outsystems` MCP tools, scoped by the asset keys above instead of
searching by name:

- `app_info` / `env_app` — current revision, deploy timestamp, live URL
- `app_revisions` — revision history
- `app_health` — traffic/error/latency over a time window (needs an `env_key`)
- `context_agents` / `context_actions` / `context_connections` — an agent's
  actions and model wiring

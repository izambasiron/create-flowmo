# MCP-Driven Schema Sync (ODC to Flowmo, and back)

An alternative to `odc-schema.md`'s manual/Forge-component workflow, for
when the AI assistant has a live connection to the OutSystems MCP server.

**The OutSystems MCP is early access — not GA, not every ODC tenant has it,
and access can change over time.** Before using anything in this file, check
whether it's actually available *this session*: look for OutSystems MCP tools
in your own tool list (named `mcp__outsystems__*` or `outsystems_*` depending
on your harness), or ask the user to run `/mcp` and confirm an `outsystems`
server is connected. If it's not there, use
`odc-schema.md`'s workflow instead — don't assume, and don't block on
getting MCP access; it's a parallel path, not a requirement.

## 1. Pull the schema

Call `context_entities` scoped to the app(s) you're working with, with
`owned_only: false` — this pulls in the full foreign-key dependency closure
in one call (entities from other apps/libraries an owned entity references),
not just the app's own entities:

```
context_entities(app: "<App Name>", owned_only: false)
```

If the response is `truncated: true`, page through it (`offset`/`limit`)
and merge every page's `data` array into one JSON array. If you're working
across more than one app, merge those apps' arrays too.

Save the merged array to a file (or pipe it directly) and hand it to:

```bash
npx flowmo schema:pull entities.json
# or: cat entities.json | npx flowmo schema:pull
```

This writes `database/schema.os.sql` — never touches `schema.local.sql` or
`schema.sql`. It reports which tables are the app's own vs. pulled in purely
for foreign-key integrity, and warns (doesn't silently drop) about any FK
whose target wasn't in the entities you gave it — that means fetch that
target's app too, or double check `owned_only: false` was actually passed.

## 2. Iterate locally

Same as the manual workflow: extend `database/schema.local.sql` (never
`schema.os.sql` — that's the pulled mirror of what's live in OutSystems
today), generate seed data, and validate with `npx flowmo db:setup`,
`db:seed`, and `db:query` against `.advance.sql` files — see
`references/flowmo-cli.md`. When writing new tables or columns by hand,
use the ODC→PostgreSQL type mapping in `references/odc-schema.md`:
`schema:pull` generates `schema.os.sql` for you, but `schema.local.sql`
is authored manually.

## 3. Push validated work back

Once local changes are tested, build a reviewable prompt from them:

```bash
npx flowmo mentor:prompt
npx flowmo mentor:prompt database/sql/GetActiveProjects.advance.sql --output mentor-prompt.md
```

This reads `database/schema.local.sql` plus any named `.advance.sql` files
and prints (or writes) a prompt describing exactly what to create in
OutSystems — it does **not** call `mentor_start` itself. Submit the
generated prompt yourself via `mentor_start`.

For how to actually drive `mentor_start` — session resumption and token
handling, safe retries, polling discipline, and why `status: succeeded`
alone isn't proof the schema change landed — load the **outsystems-mentor**
skill's [references/mentor-start-api.md](../../outsystems-mentor/references/mentor-start-api.md).
It also covers the checkpointing and publish-approval rules, which apply
here unchanged: don't push a whole new data model in one Mentor turn, and
never call `publish_start`/`deploy_start` without the user's explicit
approval first.

## 4. Confirm it actually landed

Don't trust Mentor's own success signal alone. After a publish reports
success, re-pull `context_entities` (same `owned_only: false` pattern as
step 1) and check the fresh result against your local delta:

```bash
npx flowmo schema:verify fresh-entities.json
```

This reports each `schema.local.sql` table as `confirmed`, `missing`, or
`attribute mismatch`. It's one-directional — it confirms your local delta
landed remotely, not whether OutSystems has extra columns you didn't ask
for. Once everything is `confirmed`, re-run `flowmo schema:pull` with the
fresh entities to fold them into `schema.os.sql` — `schema:verify` won't do
that for you automatically. A non-zero exit code means something isn't
`confirmed` yet — check before assuming the loop is done.

## Known MCP limitations relevant to this loop

Entity/schema creation and standard CRUD wiring are Mentor's strongest,
most reliable use case — but if a build ever reports success while Context
still shows the change missing, that's a known-gap signature, not something
to keep retrying via MCP. If your session has the full field guide
available, check it before spending more turns on something that isn't
landing.

# Curated Mentor Task Prompts

> **Source:** Adapted from [`denwx/outsystems-mcp-skills`](https://github.com/denwx/outsystems-mcp-skills)
> (MIT License), `skills/outsystems-mentor-copilot/templates/tasks.json` — the 11-task prompt
> library, rewritten here as prose + prompt blocks rather than JSON run/render machinery. The
> upstream skill's `run.py`/dashboard/session-storage tooling is not adopted.

A curated library of ready-to-send `mentor_start` prompts for common maintenance and build tasks
on an existing OutSystems app. Use these instead of writing a task prompt from scratch when the
request matches one below.

**Standing rule for every task here:** one focused task per Mentor turn — don't chain two of
these into a single `mentor_start` call. Poll per `references/mentor-start-api.md`'s discipline
(the drain-then-pause cadence for the run itself). A task whose prompt text below has `{{var}}`
placeholders needs those filled in before the prompt is sent; a required variable with no value
given means stop and ask, the same as any other missing input.

## Audit tasks (read-only — safe to run without publish approval)

### `quality-review` — App quality review

Anti-patterns, dead code, unclear naming, complexity hotspots, ranked by severity.

```text
Review this application for code quality issues. Surface the top 10 findings ordered by severity. For each finding include: (1) the exact element name and module path, (2) the issue category (anti-pattern / dead code / naming / complexity / duplication), (3) why it matters, (4) a concrete fix. Focus on actions and screens. Skip cosmetic issues.
```

### `performance-audit` — Performance audit

Slow screens, N+1 query patterns, oversized aggregates, heavy widgets.

```text
Audit this application for performance issues. Check specifically: (1) aggregates with N+1 patterns or missing indexes, (2) screens with >50 widgets or unbounded lists, (3) server actions that fetch oversized data, (4) client-side logic that should be server-side (or vice versa). For each issue: exact location, measured or estimated impact, specific fix. Order by likely user-visible impact.
```

### `security-review` — Security review

Auth gaps, missing role checks, exposed endpoints, SQL injection risk in advanced queries.

```text
Run a security audit on this application. Specifically check: (1) screens that bypass role checks (anonymous screens that should not be), (2) REST endpoints with weak or missing auth, (3) advanced SQL queries with concatenated inputs (injection risk), (4) hardcoded credentials, tokens, or connection strings, (5) sensitive data exposed in logs or client-side. For each: severity (critical/high/medium), exact location, exploit description, fix.
```

### `accessibility-audit` — Accessibility audit (WCAG 2.1 AA)

Missing alt text, low contrast, keyboard traps, missing labels — across screens and patterns.

```text
Audit screens in this app for WCAG 2.1 AA compliance. Focus on: missing alt text on images, color contrast violations (text vs. background), keyboard navigation traps, form fields without labels, semantic heading structure. For each issue: screen name, the offending element, the WCAG criterion violated, and the fix. Group by screen.
```

### `refactor-suggestions` — Refactor suggestions

Actions to split, screens to simplify, naming to normalize, duplication to extract. Suggests
only — does not apply changes (pair with a follow-up `add-feature`-style turn if the user wants
them applied).

```text
Suggest concrete refactoring opportunities in this application. Look for: (1) server actions longer than 30 nodes that should be split, (2) screens with mixed responsibilities, (3) naming inconsistencies (e.g., GetUser vs FetchAccount), (4) duplicated logic across actions that should be extracted. For each: current state, proposed change, expected maintainability gain. Prioritize by impact, not by count.
```

### `demo-readiness` — Demo readiness check

Pre-event sweep: broken screens, missing data, console errors, anything visible to an audience.
**Hackathon-critical, pairs with `demo-data` below** — run `demo-data` first if the app's data
looks thin, then `demo-readiness` as the final pre-demo pass.

```text
This application will be demoed live to an audience in the next 24 hours. Audit it for demo readiness. Check: (1) screens that error or render blank on load, (2) empty states that would be embarrassing on a live demo (zero data, broken images), (3) browser console errors visible to anyone inspecting, (4) accessibility issues a screen-reader user in the audience would catch, (5) deprecated patterns that produce visible warnings. For each: location, severity (showstopper / annoying / cosmetic), fix time estimate. Prioritize showstoppers first.
```

## Build tasks (produce changes — publish still needs separate explicit approval)

### `test-generation` — Generate test scaffolds

Unit + integration test scaffolds for the most-used server actions.

**Variables:** `count` (integer, default `5`) — how many actions to generate tests for.

```text
Generate test case scaffolds for the {{count}} most-used or most-critical server actions in this application. For each action provide: (1) happy-path test, (2) two edge cases, (3) one error case. Use the app's existing testing patterns if present; otherwise propose a standard pattern and note the choice. Output as a structured list ready to convert to BDDFramework tests.
```

### `doc-gap-fill` — Fill documentation gaps

Generate descriptions for entities, actions, screens that lack them.

**Variables:** `count` (integer, default `20`) — how many undocumented elements to cover.

```text
Identify entities, server actions, and screens in this application that lack a description. For the top {{count}} undocumented elements, generate concise (1-2 sentences) accurate descriptions based on the element's structure, name, and usage in the app. Output as a table: element_path | element_type | suggested_description. Be specific — do not write filler like 'This action does what its name suggests.'
```

### `model-migration` — AI model migration

Find references to one AI model connection and propose migration to another, adjusting prompts.

**Variables (both required):** `from_model` (current connection name, e.g. `TrialClaude3_7Sonnet`),
`to_model` (target connection name).

```text
Find all references to AIModelConnection '{{from_model}}' in this app's actions and agents. Propose a migration to '{{to_model}}' including: (1) the list of affected actions, (2) prompt adjustments needed for '{{to_model}}'s response style and token limits, (3) expected behavior differences, (4) a recommended testing checklist before publishing the migration.
```

### `add-feature` — Add a feature

Implement a new feature following the app's existing conventions.

**Variables (both required):** `feature_name` (short name, e.g. `Transfer Funds`), `requirements`
(1–3 sentence functional requirements).

```text
Add a {{feature_name}} feature to this application. Requirements: {{requirements}}. Follow existing conventions in this app for screens (layout, components used), actions (naming, error handling), and entities (naming, relationships). Reuse existing patterns where possible — do not introduce new dependencies unless necessary. Output: (1) entities to add/modify, (2) actions to add, (3) screens to add, (4) wiring (menu entries, navigation, role permissions), (5) any data migration steps.
```

### `demo-data` — Generate demo data

Realistic seed data for entities — sized and themed for a demo. **Hackathon-critical, see
`demo-readiness` above.**

**Variables:** `count` (integer, default `100`), `industry` (string, default `banking` —
banking / retail / healthcare / etc.).

```text
Generate {{count}} realistic demo records distributed across this application's main entities for a {{industry}} domain. Constraints: (1) names, addresses, and identifiers should look real but be fictional, (2) referential integrity must be preserved (foreign keys point to existing parent records), (3) date ranges should be recent (last 90 days) unless the entity semantics require otherwise, (4) include a small number of edge cases (high values, special characters, null optionals) to make demos visually interesting. Output as a structured seed plan with INSERT-equivalent records or BootstrapData callable specs.
```

## Multi-step sequences

The upstream skill defines a few named sequences (`audit-and-fix`, `add-feature-then-test`,
`publish-after-mentor`). These are not single `mentor_start` calls — they're just the tasks above
run one after another, each its own focused turn with its own poll-to-terminal:

- **`audit-and-fix`**: run `quality-review` (or `security-review`/`performance-audit`), review the
  findings with the user, then a separate `add-feature`-style turn to apply the ones they approve.
- **`add-feature-then-test`**: `add-feature`, then `test-generation` scoped to the actions it just
  added.
- **`publish-after-mentor`**: any of the above, then `publish_start` — **only with the user's
  explicit approval**, same as every other publish/deploy call in this skill (rule 5 in
  `SKILL.md`). Running a build task here never implies permission to publish it.

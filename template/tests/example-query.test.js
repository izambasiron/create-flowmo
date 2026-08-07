/**
 * example-query.test.js
 *
 * Reference test showing the canonical flowmo query testing pattern:
 * run an .advance.sql file with `flowmo db:query --json` and parse the
 * output directly — no custom parsers.
 *
 * Follow this pattern for every query you add:
 *   database/sql/GetFoo.advance.sql  →  tests/GetFoo.test.js
 *
 * See docs/flowmo-query-testing-standard.md for the full standard.
 *
 * Run:       npm test
 * Watch:     npm run test:watch
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'child_process';

const QUERY_FILE = 'database/sql/sample.advance.sql';

/** Run the query and return parsed rows. All param values are strings. */
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

describe('sample.advance.sql', () => {
  it('returns the seeded user by id', () => {
    const rows = runQuery({ UserId: 'user-001' });
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveProperty('id', 'user-001');
    expect(rows[0]).toHaveProperty('name');
    expect(rows[0]).toHaveProperty('email');
  });

  it('returns no rows for an unknown id', () => {
    const rows = runQuery({ UserId: 'user-999' });
    expect(rows).toHaveLength(0);
  });
});

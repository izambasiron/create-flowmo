@AGENTS.md

## Claude Code
This project follows the shared [agents.md](https://agents.md) convention — instructions
live in `AGENTS.md` (imported above) and Agent Skills live in `.agents/skills/`, both
readable by any compatible agent tool. Claude Code specifically only auto-loads
`CLAUDE.md` and only scans `.claude/skills/` for skills, so this file bridges the
instructions via the `@AGENTS.md` import above, and `.claude/skills` is a symlink to
`.agents/skills` (do not duplicate skill content into `.claude/skills` — edit the
`.agents/skills/` originals instead).

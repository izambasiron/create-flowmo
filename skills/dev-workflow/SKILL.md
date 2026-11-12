---
name: dev-workflow
description: >-
  Local development server setup and screen previewing for Flowmo projects.
  Use when the user wants to run, preview, or open screens in the browser;
  when asked to "start the dev server", "run the project", or "open in browser";
  or when troubleshooting why screens are not loading. Also covers why a local
  preview or verification harness should under-provide rather than
  over-provide relative to its real deployment target, and how to diff a
  local preview against a live app (document.styleSheets, computed-style
  baselines) when something renders differently live than it did locally.
  Covers npm run dev, Vite configuration, hot reload, and the screens index
  page.
compatibility: Requires Node.js and npm. Designed for VS Code agents working in a scaffolded Flowmo project.
metadata:
  version: "1.0"
  source: "Flowmo project conventions"
---

# Dev Workflow Skill

## How This Project Is Served

This project uses [Vite](https://vitejs.dev/) as its local development server. The HTML files are plain HTML — they open correctly in a browser or the Visual Inspector extension without a server — but Vite provides hot reload and a screen index page.

**Do NOT start an alternative server** (`npx serve`, `python -m http.server`, `live-server`, etc.). The project already has a dev server configured.

## Starting the Dev Server

```bash
npm install   # only needed once after scaffolding
npm run dev
```

Vite will:
1. Start a local server (default port **5173**)
2. Open the browser automatically to `http://localhost:5173`
3. Watch all files for changes and hot-reload the browser

## Starting Without Auto-Opening a Browser (for Agents)

If you are an AI agent with your own browser tool (Playwright, Puppeteer, built-in browser, etc.), use the agent-specific script to avoid a redundant browser window:

```bash
npm run dev:agent
```

This starts the same Vite server on the same port without the `--open` flag. Once the server prints its ready message, navigate your browser tool to `http://localhost:5173` (or the port shown in terminal output if 5173 was already in use).

## The Screens Index

`http://localhost:5173` (`index.html` at the project root) lists all `.html` files found in the `screens/` folder as clickable tiles. The list is generated dynamically by a Vite plugin — adding a new file to `screens/` and refreshing the index page is enough to see it appear.

## Hot Reload Behaviour

- **HTML files** — full page reload on save
- **CSS files** — injected without a full reload (Vite CSS HMR)
- **JS files** — full page reload for plain HTML projects (no framework)
- **New screen files** — refresh `index.html` to see them in the tile list

## VS Code Run & Debug

A `.vscode/launch.json` and `.vscode/tasks.json` are included in the project. Use the **"Start Dev Server (Vite)"** configuration from the Run & Debug panel (F5) instead of the terminal. It automatically runs `npm install` as a pre-launch task before starting Vite, so hitting F5 on a freshly scaffolded project just works. If you are operating as an agent, prefer `npm run dev:agent` in the terminal instead.

## Port Conflicts

If port 5173 is already in use, Vite automatically tries the next available port and prints the actual URL to the terminal. Check the terminal output if the browser does not open as expected.

## Screens Folder Conventions

- All screen prototypes live in `screens/` and use the `.visual.html` extension (e.g. `screens/Dashboard.visual.html`)
- Screens link to shared stylesheets via relative paths: `../theme/outsystems-ui.css`, `../theme/grid.css`, `../theme/theme.css`
- Scripts are referenced from `../scripts/`
- These relative paths resolve correctly both through Vite and when opening the file directly in a browser or the Visual Inspector extension

## Local Preview Should Under-Provide, Not Over-Provide

A local preview that's *more permissive* than the real OutSystems target lets real bugs ship
silently — the preview passes, the live app doesn't. Three ways this bites, all from the same
root cause:

- **A CDN or resource the target doesn't actually have.** If a real module only installs one icon
  weight, don't load a broader icon set locally "just in case" — glyphs that render locally but
  aren't in the live module vanish there with no error.
- **CSS load order that's more forgiving than the real cascade.** See
  `outsystems-ui`'s `references/architectural-heuristics.md` §1: a naive local preview loading
  component CSS last (so it always wins) hides exactly the specificity bugs that ship live, where
  the real order is different.
- **A convenience script the target won't have.** If interactive behavior (an accordion, a
  sortable table) is wired up via a script the local preview always includes, but that script
  isn't part of what actually ships to the target, the preview will show working interactions that
  don't exist live.

When you're building a preview or verification harness meant to stand in for a real deployment
target, default to loading only what that target will actually have — never more. `npx flowmo
block:build`'s generated `verify.html` follows this rule for OutSystems porting specifically (see
that command's README section in the `flowmo` package); apply the same instinct anywhere else a
local preview is standing in for a platform you don't fully control.

## Verifying Against the Live App

Two techniques for catching bugs that only exist once real changes reach the live app —
`document.styleSheets` and computed CSS agree with what a local preview merely predicts.

**Live-vs-local diffing.** When you have a Playwright (or similar) browser tool and a live target
to compare against, read the DOM/CSS directly instead of eyeballing a screenshot:

```js
// via a Playwright browser_evaluate call against the live page
[...document.styleSheets].map(s => s.href)               // confirms real load order
getComputedStyle(document.querySelector('.my-card')).backgroundColor  // confirms which rule actually won
```

This is how a real cascade-order bug gets confirmed rather than guessed at — a rule that *looks*
like it should win by specificity can still lose if it loads in the wrong position, and only
reading the live page's actual resolved styles proves which happened.

**Computed-style baseline diffing before/after a refactor.** Before a CSS refactor that touches
shared selectors (a theme split, a specificity fix), capture computed styles for the selectors and
breakpoints you're touching; diff byte-for-byte after. A visual screenshot comparison won't catch
a lost `@media` block or a specificity regression that happens not to move any pixels at the
breakpoint you happened to check — a computed-style diff will. This works against a local
`verify.html` just as well as a live page, and needs no MCP or live app at all.

# create-flowmo

Scaffold an OutSystems-Lite project with screens, a local SQL database, logic flows, and built-in agent skills for AI-assisted prototyping.

## Quick Start

```bash
npx create-flowmo
```

Or equivalently:

```bash
npm create flowmo
```

You'll be prompted for a project name, target platform (O11 or ODC), and app type. The CLI then scaffolds a project with:

- `screens/` — `.visual.html` starter screen with OutSystems UI layout
- `database/` — `schema.sql`, `seeds.sql`, and a `queries/` folder for `.sql` and `.advance.sql` files
- `logic/` — Server action flowcharts
- `scripts/` — Custom scripts
- `theme/` — OutSystems UI CSS and custom theme
- `.agents/skills/` — Copilot skills for OutSystems UI, SQL, and logic authoring

## After Scaffolding

```bash
cd my-project
npm install
npm exec flowmo db:setup   # provision the local PGLite database
npm exec flowmo db:seed    # insert seed data
npm run dev
```

The project uses [Vite](https://vitejs.dev/) for local development with hot reload.

## The Workflow

`create-flowmo` is the starting point of the Flowmo ecosystem. Once scaffolded, the project is designed to work with two VS Code extensions:

- **[Visual Inspector](https://marketplace.visualstudio.com/items?itemName=flowmo.flowmo-visual-inspector)** — opens `.visual.html` screen prototypes in a live preview with a layer panel for inspecting the element hierarchy.
- **[Flowchart Editor](https://marketplace.visualstudio.com/items?itemName=flowmo.flowmo-flowchart-editor)** — opens `.flowchart.md` logic flows in a visual drag-and-drop editor with bidirectional sync.

Install both at once with the **[Flowmo Extension Pack](https://marketplace.visualstudio.com/items?itemName=flowmo.flowmo-extension-pack)**.

The scaffolded project also includes Copilot skills that understand OutSystems UI patterns, SQL conventions, and server action structure — so AI-generated code stays compatible with the platform.

## Links and Support

- Web: [flowmo.lol](https://flowmo.lol)
- Issues: [GitHub Issues](https://github.com/izambasiron/create-flowmo/issues)
- Email: [support@flowmo.lol](mailto:support@flowmo.lol)
- Support model: best-effort, no response-time guarantee

## License

MIT

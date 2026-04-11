#!/usr/bin/env node
import { intro, outro, text, select, spinner, note, isCancel } from '@clack/prompts';
import picocolors from 'picocolors';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateProjectName, sanitizeProjectName, buildPackageJson } from './src/lib.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function init() {
  console.log(picocolors.cyan(`
      ___       ___           ___ 
     /\\__\\     /\\  \\         /\\__\\
    /:/  /    /::\\  \\       /:/  /
   /:/  /    /:/\\:\\  \\     /:/  / 
  /:/  /    /:/  \\:\\  \\   /:/  /  
 /:/__/    /:/__/ \\:\\__\\ /:/__/   
 \\:\\  \\    \\:\\  \\ /:/  / \\:\\  \\   
  \\:\\  \\    \\:\\  /:/  /   \\:\\  \\  
   \\:\\  \\    \\:\\/:/  /     \\:\\  \\ 
    \\:\\__\\    \\::/  /       \\:\\__\\
     \\/__/     \\/__/         \\/__/
`));

  intro(picocolors.bgCyan(picocolors.black(' Flowmo: Scaffold an OutSystems-Lite project with screens, data models, logic flows, and built-in agent skills for AI-assisted prototyping. ')));

  // 1. Project Name Prompt
  const projectName = await text({
    message: 'What is your project name?',
    placeholder: 'my-vibe-module',
    validate: validateProjectName,
  });

  if (isCancel(projectName)) {
    outro('Cancelled.');
    process.exit(0);
  }

  // 2. Target Environment Selection
  const platform = await select({
    message: 'Which OutSystems platform are you targeting?',
    options: [
      { value: 'ODC', label: 'OutSystems Developer Cloud (PostgreSQL)' },
      { value: 'O11', label: 'OutSystems 11 (T-SQL/MSSQL)' },
    ],
  });

  if (isCancel(platform)) {
    outro('Cancelled.');
    process.exit(0);
  }

  // 3. App Type Selection
  const appType = await select({
    message: 'What type of app are you building?',
    options: [
      { value: 'reactive', label: 'Reactive Web App' },
      { value: 'mobile', label: 'Mobile App' },
    ],
  });

  if (isCancel(appType)) {
    outro('Cancelled.');
    process.exit(0);
  }

  const s = spinner();
  s.start('Scaffolding your OutSystems-Lite environment...');

  const projectPath = path.join(process.cwd(), projectName);

  try {
    // Scaffold basic structure
    await fs.ensureDir(path.join(projectPath, '.agents'));
    await fs.ensureDir(path.join(projectPath, 'database/queries'));
    await fs.ensureDir(path.join(projectPath, 'logic'));
    await fs.ensureDir(path.join(projectPath, 'screens'));
    await fs.ensureDir(path.join(projectPath, 'scripts'));
    await fs.ensureDir(path.join(projectPath, 'theme'));

    // Copy bundled Agent Skills into the new project
    const bundledSkills = path.join(__dirname, 'skills');
    await fs.copy(bundledSkills, path.join(projectPath, '.agents/skills'));

    // Copy starter template files (CSS, starter screen, data, logic)
    const templateDir = path.join(__dirname, 'template');
    await fs.copy(path.join(templateDir, 'theme'), path.join(projectPath, 'theme'));
    await fs.copy(path.join(templateDir, 'scripts'), path.join(projectPath, 'scripts'));
    await fs.copy(path.join(templateDir, 'screens'), path.join(projectPath, 'screens'));
    await fs.copy(path.join(templateDir, 'database'), path.join(projectPath, 'database'));
    await fs.copy(path.join(templateDir, 'logic'), path.join(projectPath, 'logic'));

    // Generate package.json for the scaffolded project
    const pkg = buildPackageJson(projectName);
    await fs.writeJson(path.join(projectPath, 'package.json'), pkg, { spaces: 2 });

    // Generate vite config for multi-page HTML
    const viteConfig = `import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');

// Scan screens/ and one level of subdirectories for .html files.
function discoverScreens(screensDir) {
  const entries = [];
  for (const entry of readdirSync(screensDir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.html')) {
      entries.push({ href: \`screens/\${entry.name}\`, file: entry.name, folder: null });
    } else if (entry.isDirectory()) {
      try {
        for (const sub of readdirSync(resolve(screensDir, entry.name), { withFileTypes: true })) {
          if (sub.isFile() && sub.name.endsWith('.html')) {
            entries.push({ href: \`screens/\${entry.name}/\${sub.name}\`, file: sub.name, folder: entry.name });
          }
        }
      } catch { /* skip unreadable dirs */ }
    }
  }
  return entries.sort((a, b) => a.href.localeCompare(b.href));
}

function screenListPlugin() {
  const screensDir = resolve(__dirname, 'screens');
  return {
    name: 'screen-list',
    configureServer(server) {
      server.watcher.add(screensDir);
      const reload = (file) => {
        if (file.startsWith(screensDir) && file.endsWith('.html')) {
          server.ws.send({ type: 'full-reload' });
        }
      };
      server.watcher.on('add', reload);
      server.watcher.on('unlink', reload);
    },
    transformIndexHtml(html) {
      const entries = discoverScreens(screensDir);
      const links = entries.map(({ href, file, folder }) => {
        const name = file.replace(/\\.visual\\.html$/, '').replace(/\\.html$/, '');
        const title = folder ? \`\${folder} / \${name}\` : name;
        return \`<a class="welcome-link" href="\${href}">
          <h2>\${title}</h2>
          <p>\${href.replace('screens/', '')}</p>
        </a>\`;
      }).join('\\n');
      return html.replace('<!-- SCREENS_LIST -->', links);
    },
  };
}

// Auto-discover all .html files in screens/ (including one level of subdirs) for the build.
const screensDir = resolve(__dirname, 'screens');
const screens = discoverScreens(screensDir).reduce((entries, { href, folder, file }) => {
  const key = folder ? \`\${folder}/\${file.replace('.html', '')}\` : file.replace('.html', '');
  entries[key] = resolve(__dirname, href);
  return entries;
}, {});

export default defineConfig({
  root: '.',
  plugins: [screenListPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...screens,
      },
    },
  },
});
`;
    await fs.writeFile(path.join(projectPath, 'vite.config.js'), viteConfig);

    // Scaffold .vscode/launch.json so VS Code and agents know how to run the project
    const launchConfig = {
      version: '0.2.0',
      configurations: [
        {
          name: 'Start Dev Server (Vite)',
          type: 'node',
          request: 'launch',
          runtimeExecutable: 'npm',
          runtimeArgs: ['run', 'dev'],
          cwd: '${workspaceFolder}',
          console: 'integratedTerminal',
          skipFiles: ['<node_internals>/**'],
          preLaunchTask: 'npm: install',
        },
      ],
    };
    const tasksConfig = {
      version: '2.0.0',
      tasks: [
        {
          label: 'npm: install',
          type: 'shell',
          command: 'npm install',
          options: { cwd: '${workspaceFolder}' },
          presentation: { reveal: 'silent', panel: 'shared', close: true },
        },
      ],
    };
    await fs.ensureDir(path.join(projectPath, '.vscode'));
    await fs.writeJson(path.join(projectPath, '.vscode', 'launch.json'), launchConfig, { spaces: 2 });
    await fs.writeJson(path.join(projectPath, '.vscode', 'tasks.json'), tasksConfig, { spaces: 2 });

    // Copy root index.html and inject project name
    const safeName = sanitizeProjectName(projectName);
    let indexHtml = await fs.readFile(path.join(templateDir, 'index.html'), 'utf-8');
    indexHtml = indexHtml.replaceAll('{{PROJECT_NAME}}', safeName);
    await fs.writeFile(path.join(projectPath, 'index.html'), indexHtml);

    s.stop('Project scaffolded successfully!');

    note(`For the full visual editing experience, install the Flowmo Extension Pack in VS Code.\n\nTo get started:\ncd ${projectName}\nnpm install\n\nSet up your local database:\nnpx flowmo db:setup\nnpx flowmo db:seed\n\nPreview your screens:\nnpm run dev`, 'Next Steps');
    outro(picocolors.cyan('Time to vibe code! ⚡'));
    
  } catch (err) {
    s.stop('Scaffolding failed.');
    console.error(picocolors.red(err));
  }
}

init();
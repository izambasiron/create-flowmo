#!/usr/bin/env node
import { intro, outro, text, select, spinner, note, isCancel } from '@clack/prompts';
import picocolors from 'picocolors';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

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
    validate: (value) => {
      if (!value) return 'Please enter a name.';
      if (!/^[a-zA-Z0-9_-]+$/.test(value)) return 'Name can only contain letters, numbers, hyphens, and underscores.';
    },
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
    await fs.ensureDir(path.join(projectPath, 'data/sql'));
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
    await fs.copy(path.join(templateDir, 'data'), path.join(projectPath, 'data'));
    await fs.copy(path.join(templateDir, 'logic'), path.join(projectPath, 'logic'));

    // Generate package.json for the scaffolded project
    const pkg = {
      name: projectName,
      private: true,
      type: 'module',
      scripts: {
        dev: 'vite --open',
        'dev:agent': 'vite',
        build: 'vite build',
        preview: 'vite preview',
      },
      devDependencies: {
        vite: '^6.0.0',
      },
    };
    await fs.writeJson(path.join(projectPath, 'package.json'), pkg, { spaces: 2 });

    // Generate vite config for multi-page HTML
    const viteConfig = `import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');

function screenListPlugin() {
  return {
    name: 'screen-list',
    transformIndexHtml(html) {
      const files = readdirSync(resolve(__dirname, 'screens'))
        .filter(f => f.endsWith('.html'))
        .sort();
      const links = files.map(file => {
        const name = file.replace(/\\.visual\\.html$/, '').replace(/\\.html$/, '');
        return \`<a class="welcome-link" href="screens/\${file}">
          <h2>\${name}</h2>
          <p>\${file}</p>
        </a>\`;
      }).join('\\n');
      return html.replace('<!-- SCREENS_LIST -->', links);
    },
  };
}

// Auto-discover all .html files in screens/
const screens = readdirSync(resolve(__dirname, 'screens'))
  .filter(f => f.endsWith('.html'))
  .reduce((entries, file) => {
    entries[file.replace('.html', '')] = resolve(__dirname, 'screens', file);
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
    const safeName = projectName.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    let indexHtml = await fs.readFile(path.join(templateDir, 'index.html'), 'utf-8');
    indexHtml = indexHtml.replaceAll('{{PROJECT_NAME}}', safeName);
    await fs.writeFile(path.join(projectPath, 'index.html'), indexHtml);

    s.stop('Project scaffolded successfully!');

    note(`For the full visual editing experience, install the Flowmo Extension Pack in VS Code.\n\nOptional — to preview locally:\ncd ${projectName}\nnpm install\nnpm run dev`, 'Next Steps');
    outro(picocolors.cyan('Time to vibe code! ⚡'));
    
  } catch (err) {
    s.stop('Scaffolding failed.');
    console.error(picocolors.red(err));
  }
}

init();
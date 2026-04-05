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
        dev: 'vite',
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

// Auto-discover all .html files in screens/
const screens = readdirSync(resolve(__dirname, 'screens'))
  .filter(f => f.endsWith('.html'))
  .reduce((entries, file) => {
    entries[file.replace('.html', '')] = resolve(__dirname, 'screens', file);
    return entries;
  }, {});

export default defineConfig({
  root: '.',
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
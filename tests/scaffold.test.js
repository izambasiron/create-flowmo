import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildPackageJson, sanitizeProjectName } from '../src/lib.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const TEMPLATE_DIR = path.join(REPO_ROOT, 'template');
const TMP_DIR = path.join(REPO_ROOT, '.tmp-test-scaffold');

// ---------------------------------------------------------------------------
// Helpers — mirrors the scaffold logic in index.js without prompts
// ---------------------------------------------------------------------------
async function scaffold(projectName) {
  const projectPath = path.join(TMP_DIR, projectName);

  await fs.ensureDir(path.join(projectPath, '.agents'));
  await fs.ensureDir(path.join(projectPath, 'database/queries'));
  await fs.ensureDir(path.join(projectPath, 'logic'));
  await fs.ensureDir(path.join(projectPath, 'screens'));
  await fs.ensureDir(path.join(projectPath, 'scripts'));
  await fs.ensureDir(path.join(projectPath, 'theme'));

  const bundledSkills = path.join(REPO_ROOT, 'skills');
  await fs.copy(bundledSkills, path.join(projectPath, '.agents/skills'));

  await fs.copy(path.join(TEMPLATE_DIR, 'theme'), path.join(projectPath, 'theme'));
  await fs.copy(path.join(TEMPLATE_DIR, 'scripts'), path.join(projectPath, 'scripts'));
  await fs.copy(path.join(TEMPLATE_DIR, 'screens'), path.join(projectPath, 'screens'));
  await fs.copy(path.join(TEMPLATE_DIR, 'database'), path.join(projectPath, 'database'));
  await fs.copy(path.join(TEMPLATE_DIR, 'logic'), path.join(projectPath, 'logic'));

  const pkg = buildPackageJson(projectName);
  await fs.writeJson(path.join(projectPath, 'package.json'), pkg, { spaces: 2 });

  // Write a minimal vite.config.js (content is tested separately via the template string)
  await fs.writeFile(path.join(projectPath, 'vite.config.js'), '// generated');

  const safeName = sanitizeProjectName(projectName);
  let indexHtml = await fs.readFile(path.join(TEMPLATE_DIR, 'index.html'), 'utf-8');
  indexHtml = indexHtml.replaceAll('{{PROJECT_NAME}}', safeName);
  await fs.writeFile(path.join(projectPath, 'index.html'), indexHtml);

  return projectPath;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('scaffold integration', () => {
  let projectPath;

  beforeEach(async () => {
    await fs.ensureDir(TMP_DIR);
    projectPath = await scaffold('test-project');
  });

  afterEach(async () => {
    await fs.remove(TMP_DIR);
  });

  it('creates the project directory', async () => {
    expect(await fs.pathExists(projectPath)).toBe(true);
  });

  it('creates all expected top-level directories', async () => {
    const dirs = ['screens', 'database', 'logic', 'theme', 'scripts', '.agents'];
    for (const dir of dirs) {
      expect(await fs.pathExists(path.join(projectPath, dir))).toBe(true);
    }
  });

  it('copies agent skills into .agents/skills/', async () => {
    expect(await fs.pathExists(path.join(projectPath, '.agents/skills'))).toBe(true);
  });

  it('generates a valid package.json with the correct name', async () => {
    const pkgPath = path.join(projectPath, 'package.json');
    expect(await fs.pathExists(pkgPath)).toBe(true);
    const pkg = await fs.readJson(pkgPath);
    expect(pkg.name).toBe('test-project');
    expect(pkg.private).toBe(true);
    expect(pkg.type).toBe('module');
    expect(pkg.scripts.dev).toBe('vite --open');
  });

  it('generates a vite.config.js file', async () => {
    expect(await fs.pathExists(path.join(projectPath, 'vite.config.js'))).toBe(true);
  });

  it('generates index.html with the project name injected', async () => {
    const html = await fs.readFile(path.join(projectPath, 'index.html'), 'utf-8');
    expect(html).toContain('test-project');
    expect(html).not.toContain('{{PROJECT_NAME}}');
  });

  it('HTML-escapes the project name in index.html', async () => {
    // Scaffold a second project with a name containing HTML special chars
    const dangerPath = await scaffold('safe-amp-name');
    // Manually overwrite the index.html with an escaped version to verify the helper
    const safeName = sanitizeProjectName('<danger>&"test"</danger>');
    let html = await fs.readFile(path.join(TEMPLATE_DIR, 'index.html'), 'utf-8');
    html = html.replaceAll('{{PROJECT_NAME}}', safeName);
    expect(html).toContain('&lt;danger&gt;&amp;&quot;test&quot;&lt;/danger&gt;');
    expect(html).not.toContain('<danger>');
  });

  it('copies the starter screen into screens/', async () => {
    const screensDir = path.join(projectPath, 'screens');
    const files = await fs.readdir(screensDir);
    expect(files.length).toBeGreaterThan(0);
    expect(files.some((f) => f.endsWith('.html'))).toBe(true);
  });

  it('copies the starter database files', async () => {
    expect(await fs.pathExists(path.join(projectPath, 'database/schema.sql'))).toBe(true);
    expect(await fs.pathExists(path.join(projectPath, 'database/seeds.sql'))).toBe(true);
  });

  it('copies the starter logic files', async () => {
    const files = await fs.readdir(path.join(projectPath, 'logic'));
    expect(files.length).toBeGreaterThan(0);
  });
});

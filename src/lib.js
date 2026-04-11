/**
 * src/lib.js
 * Pure helper functions extracted from the CLI scaffolding logic.
 * All functions here are side-effect-free and fully testable.
 */

/**
 * Validates a project name entered by the user.
 * @param {string} value
 * @returns {string|undefined} An error message, or undefined if valid.
 */
export function validateProjectName(value) {
  if (!value) return 'Please enter a name.';
  if (!/^[a-zA-Z0-9_-]+$/.test(value))
    return 'Name can only contain letters, numbers, hyphens, and underscores.';
}

/**
 * HTML-escapes a project name for safe injection into an HTML file.
 * @param {string} name
 * @returns {string}
 */
export function sanitizeProjectName(name) {
  return name
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Builds the package.json object for the scaffolded project.
 * @param {string} projectName
 * @returns {object}
 */
export function buildPackageJson(projectName) {
  return {
    name: projectName,
    private: true,
    type: 'module',
    scripts: {
      dev: 'vite --open',
      'dev:agent': 'vite',
      build: 'vite build',
      preview: 'vite preview',
    },
    dependencies: {
      flowmo: 'latest',
    },
    devDependencies: {
      vite: '^6.0.0',
    },
  };
}

/**
 * Scans a directory (and one level of subdirectories) for .html files.
 * This mirrors the discoverScreens function embedded in the generated vite.config.js.
 *
 * @param {string} screensDir - Absolute path to the screens directory.
 * @param {function} readdirFn - Injectable readdirSync for testability (defaults to fs.readdirSync).
 * @returns {Array<{href: string, file: string, folder: string|null}>} Sorted list of discovered screens.
 */
export function discoverScreens(screensDir, readdirFn) {
  const entries = [];
  for (const entry of readdirFn(screensDir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.html')) {
      entries.push({ href: `screens/${entry.name}`, file: entry.name, folder: null });
    } else if (entry.isDirectory()) {
      try {
        const subPath = `${screensDir}/${entry.name}`;
        for (const sub of readdirFn(subPath, { withFileTypes: true })) {
          if (sub.isFile() && sub.name.endsWith('.html')) {
            entries.push({
              href: `screens/${entry.name}/${sub.name}`,
              file: sub.name,
              folder: entry.name,
            });
          }
        }
      } catch { /* skip unreadable dirs */ }
    }
  }
  return entries.sort((a, b) => a.href.localeCompare(b.href));
}

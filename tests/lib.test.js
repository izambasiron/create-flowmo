import { describe, it, expect } from 'vitest';
import { validateProjectName, sanitizeProjectName, buildPackageJson, discoverScreens } from '../src/lib.js';

// ---------------------------------------------------------------------------
// validateProjectName
// ---------------------------------------------------------------------------
describe('validateProjectName', () => {
  it('returns undefined for a valid simple name', () => {
    expect(validateProjectName('my-project')).toBeUndefined();
  });

  it('returns undefined for names with underscores and numbers', () => {
    expect(validateProjectName('flowmo_v2')).toBeUndefined();
    expect(validateProjectName('Project123')).toBeUndefined();
  });

  it('returns an error message for an empty string', () => {
    expect(validateProjectName('')).toBe('Please enter a name.');
  });

  it('returns an error message for names with spaces', () => {
    expect(validateProjectName('my project')).toMatch(/letters, numbers/);
  });

  it('returns an error message for names with special characters', () => {
    expect(validateProjectName('my@project!')).toMatch(/letters, numbers/);
    expect(validateProjectName('project/path')).toMatch(/letters, numbers/);
  });

  it('returns an error message for names with dots', () => {
    expect(validateProjectName('my.project')).toMatch(/letters, numbers/);
  });
});

// ---------------------------------------------------------------------------
// sanitizeProjectName
// ---------------------------------------------------------------------------
describe('sanitizeProjectName', () => {
  it('leaves a clean name unchanged', () => {
    expect(sanitizeProjectName('my-project')).toBe('my-project');
  });

  it('escapes ampersands', () => {
    expect(sanitizeProjectName('A&B')).toBe('A&amp;B');
  });

  it('escapes less-than signs', () => {
    expect(sanitizeProjectName('A<B')).toBe('A&lt;B');
  });

  it('escapes greater-than signs', () => {
    expect(sanitizeProjectName('A>B')).toBe('A&gt;B');
  });

  it('escapes double-quotes', () => {
    expect(sanitizeProjectName('say "hello"')).toBe('say &quot;hello&quot;');
  });

  it('escapes multiple special characters in one string', () => {
    expect(sanitizeProjectName('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    );
  });
});

// ---------------------------------------------------------------------------
// buildPackageJson
// ---------------------------------------------------------------------------
describe('buildPackageJson', () => {
  it('sets the correct project name', () => {
    const pkg = buildPackageJson('my-app');
    expect(pkg.name).toBe('my-app');
  });

  it('marks the package as private', () => {
    const pkg = buildPackageJson('my-app');
    expect(pkg.private).toBe(true);
  });

  it('uses ESM module type', () => {
    const pkg = buildPackageJson('my-app');
    expect(pkg.type).toBe('module');
  });

  it('includes the expected dev scripts', () => {
    const pkg = buildPackageJson('my-app');
    expect(pkg.scripts.dev).toBe('vite --open');
    expect(pkg.scripts['dev:agent']).toBe('vite');
    expect(pkg.scripts.build).toBe('vite build');
    expect(pkg.scripts.preview).toBe('vite preview');
  });

  it('lists flowmo as a runtime dependency', () => {
    const pkg = buildPackageJson('my-app');
    expect(pkg.dependencies.flowmo).toBe('latest');
  });

  it('lists vite as a dev dependency', () => {
    const pkg = buildPackageJson('my-app');
    expect(pkg.devDependencies.vite).toMatch(/^\^6/);
  });

  it('produces independent objects for different project names', () => {
    const pkgA = buildPackageJson('alpha');
    const pkgB = buildPackageJson('beta');
    expect(pkgA.name).toBe('alpha');
    expect(pkgB.name).toBe('beta');
  });
});

// ---------------------------------------------------------------------------
// discoverScreens
// ---------------------------------------------------------------------------

/**
 * Creates a mock `readdirSync` that returns a fake directory tree.
 *
 * @param {Record<string, Array<{name: string, isFile?: boolean, isDirectory?: boolean}>>} tree
 * Map of dirPath → array of Dirent-like objects.
 */
function makeMockReaddir(tree) {
  return (dirPath, _opts) => {
    const entries = tree[dirPath] ?? [];
    return entries.map((e) => ({
      name: e.name,
      isFile: () => e.isFile ?? true,
      isDirectory: () => e.isDirectory ?? false,
    }));
  };
}

describe('discoverScreens', () => {
  it('discovers .html files at the root level', () => {
    const readdir = makeMockReaddir({
      '/screens': [{ name: 'home.visual.html' }, { name: 'login.visual.html' }],
    });
    const result = discoverScreens('/screens', readdir);
    expect(result).toHaveLength(2);
    expect(result[0].href).toBe('screens/home.visual.html');
    expect(result[0].folder).toBeNull();
  });

  it('discovers .html files inside one subdirectory level', () => {
    const readdir = makeMockReaddir({
      '/screens': [{ name: 'admin', isFile: false, isDirectory: true }],
      '/screens/admin': [{ name: 'dashboard.visual.html' }],
    });
    const result = discoverScreens('/screens', readdir);
    expect(result).toHaveLength(1);
    expect(result[0].href).toBe('screens/admin/dashboard.visual.html');
    expect(result[0].folder).toBe('admin');
    expect(result[0].file).toBe('dashboard.visual.html');
  });

  it('ignores non-.html files', () => {
    const readdir = makeMockReaddir({
      '/screens': [
        { name: 'home.visual.html' },
        { name: 'README.md' },
        { name: 'styles.css' },
      ],
    });
    const result = discoverScreens('/screens', readdir);
    expect(result).toHaveLength(1);
    expect(result[0].file).toBe('home.visual.html');
  });

  it('returns an empty array for an empty directory', () => {
    const readdir = makeMockReaddir({ '/screens': [] });
    const result = discoverScreens('/screens', readdir);
    expect(result).toEqual([]);
  });

  it('sorts results by href alphabetically', () => {
    const readdir = makeMockReaddir({
      '/screens': [{ name: 'z-last.html' }, { name: 'a-first.html' }],
    });
    const result = discoverScreens('/screens', readdir);
    expect(result[0].href).toBe('screens/a-first.html');
    expect(result[1].href).toBe('screens/z-last.html');
  });

  it('handles a mix of root files and subdirectory files', () => {
    const readdir = makeMockReaddir({
      '/screens': [
        { name: 'home.visual.html' },
        { name: 'admin', isFile: false, isDirectory: true },
      ],
      '/screens/admin': [{ name: 'users.visual.html' }],
    });
    const result = discoverScreens('/screens', readdir);
    expect(result).toHaveLength(2);
    const hrefs = result.map((r) => r.href);
    expect(hrefs).toContain('screens/home.visual.html');
    expect(hrefs).toContain('screens/admin/users.visual.html');
  });

  it('skips unreadable subdirectories without throwing', () => {
    const readdir = (dirPath, _opts) => {
      if (dirPath === '/screens') {
        return [{ name: 'bad-dir', isFile: () => false, isDirectory: () => true }];
      }
      // Simulate an unreadable directory
      throw new Error('EACCES: permission denied');
    };
    expect(() => discoverScreens('/screens', readdir)).not.toThrow();
    expect(discoverScreens('/screens', readdir)).toEqual([]);
  });
});

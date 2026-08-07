import { defineConfig, defaultExclude } from 'vitest/config';

export default defineConfig({
  test: {
    // template/ contains the scaffolded project's own test files
    // (they run in the generated project, not in this repo).
    exclude: [...defaultExclude, 'template/**'],
  },
});

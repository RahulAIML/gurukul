import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    // The in-memory MongoDB download and boot can be slow on a cold cache.
    testTimeout: 30_000,
    hookTimeout: 180_000,
    // Sequential: the suites share one database and truncate between tests.
    fileParallelism: false,
  },
});

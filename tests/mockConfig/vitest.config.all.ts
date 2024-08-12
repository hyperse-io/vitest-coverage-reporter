import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      all: true,
      reporter: ['text', 'json-summary'],
      include: ['src'],
      exclude: ['src/types'],
      thresholds: {
        lines: 60,
        branches: 70,
        functions: 80,
        statements: 90,
      },
    },
  },
});

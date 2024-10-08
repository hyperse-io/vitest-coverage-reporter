import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      all: true,
      reporter: ['text', 'json-summary'],
      include: ['src'],
      exclude: ['src/types'],
      thresholds: {
        100: true,
      },
    },
  },
});

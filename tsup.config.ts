import { defineConfig } from 'tsup';

export default defineConfig((options) => [
  {
    dts: true,
    entry: ['src/index.ts'],
    splitting: false,
    noExternal: ['@actions/core', '@actions/github', 'common-tags'],
    sourcemap: !options.watch,
    clean: true,
    minify: !options.watch,
    treeshake: true,
    tsconfig: './tsconfig.build.json',
    format: ['esm'],
  },
  {
    dts: true,
    entry: ['src/main.ts'],
    splitting: false,
    sourcemap: !options.watch,
    clean: true,
    minify: !options.watch,
    treeshake: true,
    tsconfig: './tsconfig.build.json',
    format: ['esm'],
  },
]);

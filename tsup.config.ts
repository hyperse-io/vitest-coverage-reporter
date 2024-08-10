import { defineConfig } from 'tsup';

export default defineConfig((options) => [
  {
    dts: false,
    entry: ['src/index.ts'],
    splitting: false,
    noExternal: [
      '@actions/core',
      '@actions/github',
      '@actions/exec',
      '@manypkg/get-packages',
      'common-tags',
      'mdast-util-to-string',
      'remark-parse',
      'remark-stringify',
      'unified',
    ],
    sourcemap: !options.watch,
    clean: true,
    minify: false, //!options.watch,
    treeshake: true,
    tsconfig: './tsconfig.build.json',
    format: ['cjs'],
  },
  {
    dts: false,
    entry: ['src/main.ts'],
    splitting: false,
    sourcemap: !options.watch,
    clean: true,
    minify: false, //!options.watch,
    treeshake: true,
    tsconfig: './tsconfig.build.json',
    format: ['cjs'],
  },
]);

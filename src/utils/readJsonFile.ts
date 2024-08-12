import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export type Manifest = Record<string, unknown> & {
  name: string;
  version: string;
  packages: any;
  workspaces: any;
};

export const readJsonFile = (cwd: string) => {
  const manifest = JSON.parse(
    readFileSync(join(cwd, 'package.json'), 'utf-8')
  ) as Manifest;
  return manifest;
};

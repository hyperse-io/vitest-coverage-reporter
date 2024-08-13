import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export function getDirname(url, ...paths) {
  return join(dirname(fileURLToPath(url)), ...paths);
}

export function getVersion() {
  const { version } = JSON.parse(
    readFileSync(getDirname(import.meta.url, '../package.json'), 'utf-8')
  );

  return version;
}

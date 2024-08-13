import { readFileSync, writeFileSync } from 'node:fs';
import { exec } from '@actions/exec';
import { getDirname, getVersion } from './version.mjs';

const version = getVersion();
const releaseLine = `v${version.split('.')[0]}`;

process.chdir(getDirname(import.meta.url, '..'));

(async () => {
  await exec('changeset', ['version']);
  const readmePath = getDirname(import.meta.url, '..', 'README.md');
  const content = readFileSync(readmePath, 'utf8');
  const updatedContent = content.replace(
    /hyperse-io\/vitest-coverage-reporter@[^\s]+/g,
    `hyperse-io/vitest-coverage-reporter@${releaseLine}`
  );
  writeFileSync(readmePath, updatedContent);
})();

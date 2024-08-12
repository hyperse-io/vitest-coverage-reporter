import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as core from '@actions/core';
import { COVERAGE_README_MARKER } from '../constants.js';
import { updateReadmeEntry } from './updateReadmeEntry.js';

/**
 * Write the vitest coverage summary to the README
 * @param cwd - The current working directory
 * @param summary - The summary to write to the README
 * @param headline - The headline to use for the summary `## Coverage Report`
 */
export const writeSummaryToReadMe = async (
  cwd: string,
  summary: typeof core.summary,
  headline: string
) => {
  const readmeUpdateBody = `${COVERAGE_README_MARKER}\n\n${headline}\n\n${summary.stringify()}`;
  const readmeFile = join(cwd, 'README.md');
  if (existsSync(readmeFile)) {
    const readmeContents = await readFile(readmeFile, 'utf8');
    const entry = updateReadmeEntry(readmeContents, readmeUpdateBody);
    await writeFile(readmeFile, entry.content);
  } else {
    core.warning(`No README.md found in ${cwd}`);
  }
};

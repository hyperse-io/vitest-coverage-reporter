import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import * as core from '@actions/core';
import * as github from '@actions/github';
// import { getChangedPackages } from './getChangedPackages.js';
import { getReadmeEntry } from './getReadmeEntry.js';
import { getWorkspacePackages } from './getWorkspacePackages.js';
import { gitUtils } from './gitUtils.js';

/**
 * Write the vitest coverage summary to the README
 * @param summary - The summary to write to the README
 * @param headline - The headline to use for the summary `## Coverage Report`
 */
export const writeSummaryToReadMe = async (
  summary: typeof core.summary,
  headline: string
) => {
  const commitMessage = `chore: update README.md coverage report`;
  const cwd = process.cwd();
  const workspacePackages = await getWorkspacePackages(cwd);
  const readmeUpdateBody = `${headline}\n\n${summary.stringify()}`;
  // const changedPackages = await getChangedPackages(cwd, workspacePackages);
  for (const [dir] of workspacePackages) {
    const readmeFile = join(dir, 'README.md');
    const readmeContents = await readFile(readmeFile, 'utf8');
    const entry = getReadmeEntry(readmeContents);
    await writeFile(
      readmeFile,
      readmeContents.replace(entry.content, readmeUpdateBody)
    );
  }

  // project with `commit: true` setting could have already committed files
  if (!(await gitUtils.checkIfClean())) {
    const finalCommitMessage = `${commitMessage}`;
    await gitUtils.commitFiles(['**/README.md'], finalCommitMessage);
  }

  const branch = github.context.ref.replace('refs/heads/', '');
  core.info(`Pushing README.md changes to branch ${branch}...`);
  await gitUtils.push(branch, { force: true });
};

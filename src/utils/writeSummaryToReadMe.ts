import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import * as core from '@actions/core';
import * as github from '@actions/github';
import { getPullRequestBranchName } from './getPullRequestBranchName.js';
import { getPullRequestNumber } from './getPullRequestNumber.js';
// import { getChangedPackages } from './getChangedPackages.js';
import { getReadmeEntry } from './getReadmeEntry.js';
import { getWorkspacePackages } from './getWorkspacePackages.js';
import { gitUtils } from './gitUtils.js';
import { setupGitHubCredentials } from './setupGitHubCredentials.js';

/**
 * Write the vitest coverage summary to the README
 * @param summary - The summary to write to the README
 * @param headline - The headline to use for the summary `## Coverage Report`
 */
export const writeSummaryToReadMe = async (
  summary: typeof core.summary,
  headline: string
) => {
  const pullRequestNumber = await getPullRequestNumber();
  if (!pullRequestNumber) {
    core.info(
      'No pull-request-number found. Skipping write coverage summary to README.md'
    );
    return;
  }
  // setup github credentials
  await setupGitHubCredentials();
  const commitMessage = `chore: update README.md coverage report`;
  const cwd = process.cwd();
  const workspacePackages = await getWorkspacePackages(cwd);
  const readmeUpdateBody = `${headline}\n\n${summary.stringify()}`;
  const pullOriginBranch = await getPullRequestBranchName(pullRequestNumber);

  core.info(`PR ref branch is: ${pullOriginBranch}`);

  await gitUtils.switchToMaybeExistingBranch(pullOriginBranch);
  await gitUtils.reset(github.context.sha);

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
    await gitUtils.commitAll(finalCommitMessage);
  }

  await gitUtils.push(pullOriginBranch, { force: true });
};

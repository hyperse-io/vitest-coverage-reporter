import * as github from '@actions/github';
import { getOctokit } from './getOctokit.js';

/**
 * Get the branch name of the pull request
 * @param prNumber The pull request number
 * @returns The branch name of the pull request
 */
export const getPullRequestBranchName = async (prNumber: number) => {
  const octokit = getOctokit();

  const response = await octokit.rest.pulls.get({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: prNumber,
  });

  return response.data.head.ref;
};

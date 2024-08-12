import * as github from '@actions/github';
import { getGithubToken } from '../inputs/getGithubToken.js';

export type Octokit = ReturnType<typeof github.getOctokit>;

/**
 * Get the Octokit instance
 * @returns The Octokit instance
 */
export const getOctokit = () => {
  const gitHubToken = getGithubToken();
  const octokit: Octokit = github.getOctokit(gitHubToken);
  return octokit;
};

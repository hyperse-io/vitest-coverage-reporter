import * as core from '@actions/core';

/**
 * Get the GitHub token from action input `github-token`
 * @returns
 */
export const getGithubToken = () => {
  const gitHubToken = core.getInput('github-token').trim();
  return gitHubToken;
};

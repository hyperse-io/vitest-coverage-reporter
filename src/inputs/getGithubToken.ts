import * as core from '@actions/core';

export const getGithubToken = () => {
  const gitHubToken = core.getInput('github-token').trim();
  return gitHubToken;
};

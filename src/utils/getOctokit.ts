import * as github from '@actions/github';
import { getGithubToken } from '../inputs/getGithubToken.js';

type Octokit = ReturnType<typeof github.getOctokit>;

export const getOctokit = () => {
  const gitHubToken = getGithubToken();
  const octokit: Octokit = github.getOctokit(gitHubToken);
  return octokit;
};

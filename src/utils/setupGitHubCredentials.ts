import { writeFile } from 'fs/promises';
import * as core from '@actions/core';
import { getGithubToken } from '../inputs/getGithubToken.js';
import { gitUtils } from './gitUtils.js';

export const setupGitHubCredentials = async () => {
  const gitHubToken = getGithubToken();

  if (!gitHubToken) {
    core.setFailed(
      'Please add the GITHUB_TOKEN to the vitest-coverage-report action'
    );
    throw new Error('GITHUB_TOKEN not found');
  }

  core.info('setting git user');

  await gitUtils.setupUser();

  core.info('setting GitHub credentials');
  await writeFile(
    `${process.env.HOME}/.netrc`,
    `machine github.com\nlogin github-actions[bot]\npassword ${gitHubToken}`
  );
};

import * as github from '@actions/github';
import { getOctokit } from './getOctokit.js';
import { getPullRequestNumberFromTriggeringWorkflow } from './getPullRequestNumberFromTriggeringWorkflow.js';

export const getPullRequestNumber = async (userDefinedPrNumber?: number) => {
  const octokit = getOctokit();

  // The user-defined pull request number takes precedence
  let pullRequestNumber = userDefinedPrNumber;

  if (!pullRequestNumber) {
    // If in the context of a pull-request, get the pull-request number
    pullRequestNumber = github.context.payload.pull_request?.number;

    // This is to allow commenting on pull_request from forks
    if (github.context.eventName === 'workflow_run') {
      pullRequestNumber =
        await getPullRequestNumberFromTriggeringWorkflow(octokit);
    }
  }
  return pullRequestNumber;
};

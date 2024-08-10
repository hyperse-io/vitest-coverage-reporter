import * as core from '@actions/core';
import * as github from '@actions/github';
import { getPullRequestNumberFromTriggeringWorkflow } from './getPullRequestNumberFromTriggeringWorkflow.js';

const gitHubToken = core.getInput('github-token').trim();
const octokit: Octokit = github.getOctokit(gitHubToken);
const COMMENT_MARKER = (markerPostfix = 'root') =>
  `<!-- vitest-coverage-report-marker-${markerPostfix} -->`;

type Octokit = ReturnType<typeof github.getOctokit>;

export const writeSummaryToPR = async ({
  summary,
  markerPostfix,
  userDefinedPrNumber,
}: {
  summary: typeof core.summary;
  markerPostfix?: string;
  userDefinedPrNumber?: number;
}) => {
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

  if (!pullRequestNumber) {
    core.info('No pull-request-number found. Skipping comment creation.');
    return;
  }

  const commentBody = `${summary.stringify()}\n\n${COMMENT_MARKER(markerPostfix)}`;
  const existingComment = await findCommentByBody(
    octokit,
    COMMENT_MARKER(markerPostfix),
    pullRequestNumber
  );

  if (existingComment) {
    await octokit.rest.issues.updateComment({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      comment_id: existingComment.id,
      body: commentBody,
    });
  } else {
    await octokit.rest.issues.createComment({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: pullRequestNumber,
      body: commentBody,
    });
  }
};

async function findCommentByBody(
  octokit: Octokit,
  commentBodyIncludes: string,
  pullRequestNumber: number
) {
  const commentsIterator = octokit.paginate.iterator(
    octokit.rest.issues.listComments,
    {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: pullRequestNumber,
    }
  );

  for await (const { data: comments } of commentsIterator) {
    const comment = comments.find((comment) =>
      comment.body?.includes(commentBodyIncludes)
    );
    if (comment) return comment;
  }

  return;
}

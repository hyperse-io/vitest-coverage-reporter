import * as core from '@actions/core';
import * as github from '@actions/github';
import { RequestError } from '@octokit/request-error';
import { getOctokit } from '../utils/getOctokit.js';
import { FileCoverageMode } from './getCoverageModeFrom.js';

export async function getPullChanges(
  fileCoverageMode: FileCoverageMode
): Promise<string[]> {
  // Skip Changes collection if we don't need it
  if (fileCoverageMode === FileCoverageMode.None) {
    return [];
  }

  // Skip Changes collection if we can't do it
  if (!github.context.payload?.pull_request) {
    return [];
  }

  const prNumber = github.context.payload.pull_request.number;
  try {
    const paths: string[] = [];
    const octokit = getOctokit();

    core.startGroup(
      `Fetching list of changed files for PR#${prNumber} from Github API`
    );

    const iterator = octokit.paginate.iterator(octokit.rest.pulls.listFiles, {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: prNumber,
      per_page: 100,
    });

    for await (const response of iterator) {
      core.info(`Received ${response.data.length} items`);

      for (const file of response.data) {
        core.debug(`[${file.status}] ${file.filename}`);
        if (['added', 'modified'].includes(file.status)) {
          paths.push(file.filename);
        }
      }
    }
    return paths;
  } catch (error) {
    if (
      error instanceof RequestError &&
      (error.status === 404 || error.status === 403)
    ) {
      core.warning(
        `Couldn't fetch changes of PR due to error:\n[${error.name}]\n${error.message}`
      );
      return [];
    }

    throw error;
  } finally {
    core.endGroup();
  }
}

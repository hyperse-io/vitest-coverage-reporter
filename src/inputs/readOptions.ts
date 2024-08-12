import * as core from '@actions/core';
import { getCoverageModeFrom } from './getCoverageModeFrom.js';

export async function readOptions() {
  // Working directory can be used to modify all default/provided paths (for monorepos, etc)
  const repoCwd = core.getInput('repo-cwd');

  // all/changes/none
  const fileCoverageModeRaw = core.getInput('file-coverage-mode');
  const fileCoverageMode = getCoverageModeFrom(fileCoverageModeRaw);

  const name = core.getInput('name');

  // Get the user-defined pull-request number and perform input validation
  const prNumber = core.getInput('pr-number');
  let processedPrNumber: number | undefined = Number(prNumber);
  if (!Number.isSafeInteger(processedPrNumber) || processedPrNumber <= 0) {
    processedPrNumber = undefined;
  }
  if (processedPrNumber) {
    core.info(`Received pull-request number: ${processedPrNumber}`);
  }

  return {
    name,
    repoCwd,
    fileCoverageMode,
    processedPrNumber,
  };
}

import { resolve } from 'node:path';
import * as core from '@actions/core';
import { defaultJsonFinalPath, defaultJsonSummaryPath } from '../constants.js';
import { getCoverageModeFrom } from './getCoverageModeFrom.js';
import { getVitestThresholds } from './getVitestThresholds.js';

export async function readOptions() {
  // Working directory can be used to modify all default/provided paths (for monorepos, etc)
  const workingDirectory = core.getInput('working-directory');

  // all/changes/none
  const fileCoverageModeRaw = core.getInput('file-coverage-mode');
  const fileCoverageMode = getCoverageModeFrom(fileCoverageModeRaw);

  const jsonSummaryPath = resolve(
    workingDirectory,
    core.getInput('json-summary-path') || defaultJsonSummaryPath
  );
  const jsonFinalPath = resolve(
    workingDirectory,
    core.getInput('json-final-path') || defaultJsonFinalPath
  );

  const jsonSummaryCompareInput = core.getInput('json-summary-compare-path');
  let jsonSummaryComparePath: string | null = null;
  if (jsonSummaryCompareInput) {
    jsonSummaryComparePath = resolve(workingDirectory, jsonSummaryCompareInput);
  }

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

  const thresholds = await getVitestThresholds(
    workingDirectory,
    core.getInput('thresholds')
  );

  return {
    fileCoverageMode,
    jsonFinalPath,
    jsonSummaryPath,
    jsonSummaryComparePath,
    name,
    thresholds,
    workingDirectory,
    processedPrNumber,
  };
}

import * as path from 'node:path';
import * as core from '@actions/core';
import { getCoverageModeFrom } from './getCoverageModeFrom.js';
import { getViteConfigPath } from './getViteConfigPath.js';
import { parseCoverageThresholds } from './parseCoverageThresholds.js';

export async function readOptions() {
  // Working directory can be used to modify all default/provided paths (for monorepos, etc)
  const workingDirectory = core.getInput('working-directory');

  // all/changes/none
  const fileCoverageModeRaw = core.getInput('file-coverage-mode');
  const fileCoverageMode = getCoverageModeFrom(fileCoverageModeRaw);

  const jsonSummaryPath = path.resolve(
    workingDirectory,
    core.getInput('json-summary-path') || 'coverage/coverage-summary.json'
  );
  const jsonFinalPath = path.resolve(
    workingDirectory,
    core.getInput('json-final-path') || 'coverage/coverage-final.json'
  );

  const jsonSummaryCompareInput = core.getInput('json-summary-compare-path');
  let jsonSummaryComparePath: string | null = null;
  if (jsonSummaryCompareInput) {
    jsonSummaryComparePath = path.resolve(
      workingDirectory,
      jsonSummaryCompareInput
    );
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

  // ViteConfig is optional, as it is only required for thresholds. If no vite config is provided, we will not include thresholds in the final report.
  const viteConfigPath = await getViteConfigPath(
    workingDirectory,
    core.getInput('vite-config-path')
  );
  const thresholds = viteConfigPath
    ? await parseCoverageThresholds(viteConfigPath)
    : {};

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

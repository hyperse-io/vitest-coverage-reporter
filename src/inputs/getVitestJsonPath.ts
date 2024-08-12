import { resolve } from 'node:path';
import * as core from '@actions/core';
import { defaultJsonFinalPath, defaultJsonSummaryPath } from '../constants';

export const getVitestJsonPath = (projectCwd: string) => {
  const jsonSummaryPath = resolve(
    projectCwd,
    core.getInput('json-summary-path') || defaultJsonSummaryPath
  );
  const jsonFinalPath = resolve(
    projectCwd,
    core.getInput('json-final-path') || defaultJsonFinalPath
  );

  const jsonSummaryCompareInput = core.getInput('json-summary-compare-path');
  let jsonSummaryComparePath: string | null = null;
  if (jsonSummaryCompareInput) {
    jsonSummaryComparePath = resolve(projectCwd, jsonSummaryCompareInput);
  }

  return {
    jsonFinalPath,
    jsonSummaryPath,
    jsonSummaryComparePath,
  };
};

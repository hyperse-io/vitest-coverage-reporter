import * as core from '@actions/core';

export enum FileCoverageMode {
  All = 'all',
  Changes = 'changes',
  None = 'none',
}

export function getCoverageModeFrom(input: string): FileCoverageMode {
  const allEnums = Object.values(FileCoverageMode) as string[];
  const index = allEnums.indexOf(input);
  if (index === -1) {
    core.warning(`Not valid value "${input}" for summary mode, used "changes"`);
    return FileCoverageMode.Changes;
  }
  return input as FileCoverageMode;
}

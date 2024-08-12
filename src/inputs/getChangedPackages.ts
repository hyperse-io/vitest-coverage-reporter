import * as core from '@actions/core';
import { Package } from '@manypkg/get-packages';
import { FileCoverageMode } from './getCoverageModeFrom';
import { getPullChanges } from './getPullChanges';
import { getWorkspacePackages } from './getWorkspacePackages';

export async function getChangedPackages(
  repoCwd: string,
  includeAllProjects = false
) {
  const workspacePackages = await getWorkspacePackages(repoCwd);
  const changedPackages = new Set<Package>();
  // if all project don't need to check changes
  const allChangedFiles = includeAllProjects
    ? []
    : await getPullChanges(FileCoverageMode.All);
  core.debug(`allChangedFiles: ${JSON.stringify(allChangedFiles, null, 2)}`);
  for (const [dir, { name, relativeDir, version }] of workspacePackages) {
    const includeThisProject =
      includeAllProjects ||
      allChangedFiles.find((s) => !!~s.indexOf(relativeDir));

    core.info(`package(${name}: ${relativeDir}) is: ${includeThisProject}`);
    if (includeThisProject) {
      changedPackages.add({
        dir,
        relativeDir,
        packageJson: {
          name,
          version,
        },
      });
    }
  }

  return [...changedPackages];
}

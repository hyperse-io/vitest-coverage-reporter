import { Package } from '@manypkg/get-packages';
import { FileCoverageMode } from './getCoverageModeFrom';
import { getPullChanges } from './getPullChanges';
import { getWorkspacePackages } from './getWorkspacePackages';

export async function getChangedPackages(repoCwd: string) {
  const workspacePackages = await getWorkspacePackages(repoCwd);
  const changedPackages = new Set<Package>();
  const allChangedFiles = await getPullChanges(FileCoverageMode.All);

  for (const [dir, { name, relativeDir, version }] of workspacePackages) {
    const packageChanged = allChangedFiles.find(
      (s) => !!~s.indexOf(relativeDir)
    );

    if (packageChanged) {
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

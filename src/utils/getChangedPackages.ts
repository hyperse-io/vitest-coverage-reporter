import { getPackages, Package } from '@manypkg/get-packages';

export async function getChangedPackages(
  cwd: string,
  workspacePackages: Map<string, { name: string; version: string }>
) {
  const { packages } = await getPackages(cwd);
  const changedPackages = new Set<Package>();

  for (const pkg of packages) {
    const previousPackages = workspacePackages.get(pkg.dir);
    if (previousPackages?.version !== pkg.packageJson.version) {
      changedPackages.add(pkg);
    }
  }

  return [...changedPackages];
}

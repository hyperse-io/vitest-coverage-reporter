import { getPackages, Package } from '@manypkg/get-packages';

export async function getChangedPackages(
  cwd: string,
  workspacePackages: Map<string, { name: string; version: string }>
) {
  const changedPackages = new Set<Package>();
  const { packages } = await getPackages(cwd);

  for (const pkg of packages) {
    const previousPackages = workspacePackages.get(pkg.dir);
    if (previousPackages?.version !== pkg.packageJson.version) {
      changedPackages.add(pkg);
    }
  }

  return [...changedPackages];
}

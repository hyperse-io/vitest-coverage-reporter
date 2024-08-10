import { getPackages } from '@manypkg/get-packages';

export async function getWorkspacePackages(cwd: string) {
  const { packages } = await getPackages(cwd);
  const sortedPackages: Array<[string, { name: string; version: string }]> =
    packages.map((x) => [
      x.dir,
      {
        name: x.packageJson.name,
        version: x.packageJson.version,
      },
    ]);
  // sort by package name
  sortedPackages.sort((a, b) => {
    if (a[1].name < b[1].name) {
      return -1;
    }
    if (a[1].name > b[1].name) {
      return 1;
    }
    return 0;
  });

  return new Map(sortedPackages);
}

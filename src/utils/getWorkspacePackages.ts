import { getPackages } from '@manypkg/get-packages';

export async function getWorkspacePackages(cwd: string) {
  const { packages } = await getPackages(cwd);
  return new Map(
    packages.map((x) => [
      x.dir,
      {
        name: x.packageJson.name,
        version: x.packageJson.version,
      },
    ])
  );
}

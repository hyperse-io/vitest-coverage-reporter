import { Manifest, readJsonFile } from './readJsonFile.js';

export const isMonoRepo = (cwd: string = process.cwd()): boolean => {
  const manifest = readJsonFile(cwd);
  const workspaces = extractWorkspaces(manifest);
  return !!workspaces;
};

function extractWorkspaces(manifest: Manifest) {
  const workspaces = (manifest || {}).workspaces;
  return (
    (workspaces && workspaces.packages) ||
    (Array.isArray(workspaces) ? workspaces : null)
  );
}

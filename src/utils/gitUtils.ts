import { exec, getExecOutput } from '@actions/exec';

const commitAll = async (message: string) => {
  await exec('git', ['add', '.']);
  await exec('git', ['commit', '-m', message]);
};

/**
 * Commit files to the git repository
 * @param files - The files to commit
 * @param message
 */
export const commitFiles = async (files: string[], message: string) => {
  for (const file of files) {
    await exec('git', ['add', file]);
  }
  await exec('git', ['commit', '-m', message]);
};

const push = async (branch: string, { force }: { force?: boolean } = {}) => {
  await exec(
    'git',
    ['push', 'origin', `HEAD:${branch}`, force && '--force'].filter<string>(
      Boolean as any
    )
  );
};

export const switchToMaybeExistingBranch = async (branch: string) => {
  const { stderr } = await getExecOutput('git', ['checkout', branch], {
    ignoreReturnCode: true,
  });
  const isCreatingBranch = !stderr
    .toString()
    .includes(`Switched to a new branch '${branch}'`);
  if (isCreatingBranch) {
    await exec('git', ['checkout', '-b', branch]);
  }
};

export const reset = async (
  pathSpec: string,
  mode: 'hard' | 'soft' | 'mixed' = 'hard'
) => {
  await exec('git', ['reset', `--${mode}`, pathSpec]);
};

const checkIfClean = async (): Promise<boolean> => {
  const { stdout } = await getExecOutput('git', ['status', '--porcelain']);
  return !stdout.length;
};

const setupUser = async () => {
  await exec('git', ['config', 'user.name', `"github-actions[bot]"`]);
  await exec('git', [
    'config',
    'user.email',
    `"github-actions[bot]@users.noreply.github.com"`,
  ]);
};

export const gitUtils = {
  push,
  setupUser,
  commitAll,
  commitFiles,
  checkIfClean,
  switchToMaybeExistingBranch,
  reset,
};

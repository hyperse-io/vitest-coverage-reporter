import { exec, getExecOutput } from '@actions/exec';

const commitAll = async (message: string) => {
  await exec('git', ['add', '.']);
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

const checkIfClean = async (): Promise<boolean> => {
  const { stdout } = await getExecOutput('git', ['status', '--porcelain']);
  return !stdout.length;
};

export const gitUtils = {
  commitAll,
  push,
  checkIfClean,
};

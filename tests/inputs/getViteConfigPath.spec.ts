import { describe, expect, it, vi } from 'vitest';
import * as core from '@actions/core';
import { getViteConfigPath } from '../../src/inputs/getViteConfigPath.js';
import { getDirname } from '../../src/utils/get-dir-name.js';

describe('getViteConfigPath', () => {
  const mockWorkingDirectory = getDirname(import.meta.url, '../mockConfig');

  it('resolves with a full path if a file at the provided path exists', async (): Promise<void> => {
    await expect(
      getViteConfigPath(mockWorkingDirectory, 'vitest.config.all.ts')
    ).resolves.toMatch('tests/mockConfig/vitest.config.all.ts');
  });

  it('resolves with a full path if no path is provided but a file with a default name exists', async (): Promise<void> => {
    await expect(getViteConfigPath(mockWorkingDirectory, '')).resolves.toMatch(
      'tests/mockConfig/vitest.config.ts'
    );
  });

  it('returns null if config file can not be found', async (): Promise<void> => {
    vi.spyOn(core, 'warning').mockImplementationOnce(() => {});
    await expect(
      getViteConfigPath(mockWorkingDirectory, 'doesNotExist')
    ).resolves.toBeNull();

    expect(core.warning).toHaveBeenCalledOnce();
    const warningMessage = vi.mocked(core.warning).mock.calls[0][0];
    expect(warningMessage).toContain(`${mockWorkingDirectory}/doesNotExist`);
  });

  it('resolves Vitest workspace file', async (): Promise<void> => {
    await expect(
      getViteConfigPath(mockWorkingDirectory, 'vitest.workspace.ts')
    ).resolves.toMatch('tests/mockConfig/vitest.workspace.ts');
  });
});

import path, { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { parseCoverageThresholds } from '../../src/inputs/parseCoverageThresholds.js';

// Avoid logging warnings to the console during tests by stubbing the warning functions.
vi.mock('@actions/core', async (importOriginal) => ({
  ...importOriginal,
  warning: vi.fn(),
}));

describe('generateTableData', () => {
  const mockConfigPath = join(__dirname, '../mockConfig');
  const getConfig = (configName: string) =>
    path.resolve(mockConfigPath, configName);

  it('returns no thresholds if config file can not be found.', async (): Promise<void> => {
    const thresholds = await parseCoverageThresholds(getConfig('doesNotExist'));

    expect(thresholds).toEqual({});
  });

  it('returns no thresholds if non are provided in the config file', async (): Promise<void> => {
    const thresholds = await parseCoverageThresholds(
      getConfig('vitest.config.none.ts')
    );

    expect(thresholds).toEqual({});
  });

  it('reads all the thresholds from the given configuration file.', async (): Promise<void> => {
    const thresholds = await parseCoverageThresholds(
      getConfig('vitest.config.all.ts')
    );

    expect(thresholds).toEqual({
      lines: 60,
      branches: 70,
      functions: 80,
      statements: 90,
    });
  });

  it('sets thresholds to 100 if 100 property is true.', async (): Promise<void> => {
    const thresholds = await parseCoverageThresholds(
      getConfig('vitest.config.100.ts')
    );

    expect(thresholds).toEqual({
      lines: 100,
      branches: 100,
      functions: 100,
      statements: 100,
    });
  });
});

import { join } from 'node:path';
import { getChangedPackages } from '../../src/inputs/getChangedPackages.js';
import * as pullChanges from '../../src/inputs/getPullChanges.js';

describe('getChangedPackages()', () => {
  const fixtureCwd = join(__dirname, 'fixtures');
  beforeEach(() => {
    vi.spyOn(pullChanges, 'getPullChanges').mockResolvedValue([
      'packages/package1/src/index.ts',
      'packages/package2/src/index.ts',
      'website/index.ts',
    ]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Should correct resolve file changed packages', async () => {
    const changedPackages = await getChangedPackages(fixtureCwd);
    for (const { dir: _, ...restProps } of changedPackages) {
      expect(restProps).toBeDefined();

      expect(restProps).toMatchSnapshot();
    }
  });
});

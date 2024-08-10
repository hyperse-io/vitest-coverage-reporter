import { join } from 'node:path';
import { getChangedPackages } from '../../src/utils/getChangedPackages.js';
import { getWorkspacePackages } from '../../src/utils/getWorkspacePackages.js';

describe('getChangedPackages()', () => {
  const fixtureCwd = join(__dirname, 'fixtures');
  it('Should correct resolve file changed packages', async () => {
    const allWorkspacePackages = await getWorkspacePackages(fixtureCwd);
    const changedPackages = await getChangedPackages(
      fixtureCwd,
      allWorkspacePackages
    );
    expect(changedPackages).toMatchSnapshot();
  });
});

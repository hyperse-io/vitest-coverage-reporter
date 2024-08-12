import { join } from 'node:path';
import { getChangedPackages } from '../../src/inputs/getChangedPackages.js';
import { getWorkspacePackages } from '../../src/inputs/getWorkspacePackages.js';

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

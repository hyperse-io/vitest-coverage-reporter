import { join } from 'node:path';
import { getWorkspacePackages } from '../../src/inputs/getWorkspacePackages.js';

describe('getWorkspacePackages()', () => {
  const fixtureCwd = join(__dirname, 'fixtures');
  it('Should correct resolve workspace packages', async () => {
    const packages = await getWorkspacePackages(fixtureCwd);
    for (const [dir, meta] of packages) {
      expect(dir).toBeDefined();
      expect({
        meta,
      }).toMatchSnapshot();
    }
  });

  it('Should correct normalize single normal project', async () => {
    const packages = await getWorkspacePackages(join(fixtureCwd, 'website'));
    for (const [dir, meta] of packages) {
      expect(dir).toBeDefined();
      expect({
        meta,
      }).toMatchSnapshot();
    }
  });
});

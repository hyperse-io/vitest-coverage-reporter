import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { generateBadges } from '../../src/report/generateBadges.js';
import { JsonSummary } from '../../src/types/JsonSummary.js';
import { getDirname } from '../../src/utils/getDirname.js';
import { createMockJsonSummary } from '../testUtils/JsonSummaryMockFactory.js';

describe('generateBadges()', () => {
  const fixtureCwd = getDirname(import.meta.url, './');
  it('generates the headline', async () => {
    const jsonSummary: JsonSummary = createMockJsonSummary({});
    await generateBadges({
      badgesSavedTo: join(fixtureCwd, 'coverage'),
      totalCoverageReport: jsonSummary.total,
    });
    const expected: string[] = [
      join(fixtureCwd, 'coverage/statements.svg'),
      join(fixtureCwd, 'coverage/branches.svg'),
      join(fixtureCwd, 'coverage/functions.svg'),
      join(fixtureCwd, 'coverage/lines.svg'),
    ];
    const expectedPercentage = ['10%', '20%', '30%', '40%'];

    for (let index = 0; index < expected.length; index++) {
      const badge = expected[index];
      expect(existsSync(badge)).toBe(true);
      expect(readFileSync(badge, 'utf-8')).toMatch(expectedPercentage[index]);
    }
  });
});

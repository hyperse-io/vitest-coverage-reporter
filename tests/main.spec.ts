import { join } from 'path';
import { MockInstance } from 'vitest';
import * as parseJsonReports from '../src/inputs/parseVitestJsonReports.js';
import * as readOptions from '../src/inputs/readOptions.js';
import { main } from '../src/main.js';
import * as generateBadges from '../src/report/generateBadges.js';
import { GenerateBadgesOptions } from '../src/report/generateBadges.js';
import { JsonSummary } from '../src/types/JsonSummary.js';
import { createMockJsonSummary } from './testUtils/JsonSummaryMockFactory.js';

const jsonSummary: JsonSummary = createMockJsonSummary({});

describe('test cli main command `generate-badges`', () => {
  let generateBadgesStub: MockInstance<
    (options: GenerateBadgesOptions) => Promise<void>
  >;

  beforeEach(() => {
    vi.spyOn(readOptions, 'readOptions').mockResolvedValue({
      jsonSummaryPath: '',
    } as any);

    generateBadgesStub = vi
      .spyOn(generateBadges, 'generateBadges')
      .mockResolvedValue();

    vi.spyOn(parseJsonReports, 'parseVitestJsonSummary').mockResolvedValue(
      jsonSummary
    );
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('Shold correct read command line default pareamenters', async () => {
    await main([]);
    expect(generateBadgesStub).toHaveBeenCalledOnce();
    expect(generateBadgesStub).toBeCalledWith({
      badgesSavedTo: join(process.cwd(), 'coverage/badges'),
      totalCoverageReport: jsonSummary.total,
    });
  });

  it('Shold correct read command line pareamenters', async () => {
    await main(['-p', '/test/p']);
    expect(generateBadgesStub).toHaveBeenCalledOnce();
    expect(generateBadgesStub).toBeCalledWith({
      badgesSavedTo: '/test/p',
      totalCoverageReport: jsonSummary.total,
    });
  });
});

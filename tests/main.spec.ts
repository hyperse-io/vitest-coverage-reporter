import { join } from 'path';
import { MockInstance } from 'vitest';
import * as pullChanges from '../src/inputs/getPullChanges.js';
import * as parseJsonReports from '../src/inputs/parseVitestJsonFinalReport.js';
import * as readOptions from '../src/inputs/readOptions.js';
import { main } from '../src/main.js';
import * as generateBadges from '../src/report/generateBadges.js';
import { GenerateBadgesOptions } from '../src/report/generateBadges.js';
import { JsonSummary } from '../src/types/JsonSummary.js';
import * as readJsonFile from '../src/utils/readJsonFile.js';
import { createMockJsonSummary } from './testUtils/JsonSummaryMockFactory.js';
const jsonSummary: JsonSummary = createMockJsonSummary({});

describe('test cli main command `generate-badges`', () => {
  let generateBadgesStub: MockInstance<
    (options: GenerateBadgesOptions) => Promise<void>
  >;

  const fixtureCwd = join(__dirname, 'fixtures/main');

  beforeEach(() => {
    vi.spyOn(readOptions, 'readOptions').mockResolvedValue({
      jsonSummaryPath: '',
    } as any);

    generateBadgesStub = vi
      .spyOn(generateBadges, 'generateBadges')
      .mockResolvedValue();

    vi.spyOn(
      parseJsonReports,
      'parseVitestJsonSummaryReport'
    ).mockResolvedValue(jsonSummary);

    vi.spyOn(pullChanges, 'getPullChanges').mockResolvedValue([]);

    vi.spyOn(readJsonFile, 'readJsonFile').mockReturnValue({
      name: '',
      version: '',
      packages: [],
      workspaces: [],
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('Shold correct read command line `default` pareamenters', async () => {
    await main(['--projectCwd', fixtureCwd]);
    expect(generateBadgesStub).toHaveBeenCalledOnce();
    expect(generateBadgesStub).toBeCalledWith({
      badgesSavedTo: join(fixtureCwd, 'coverage/badges'),
      totalCoverageReport: jsonSummary.total,
    });
  });

  it('Shold correct read command line pareamenters `--path`', async () => {
    await main(['-p', '/test/p', '--projectCwd', fixtureCwd]);
    expect(generateBadgesStub).toHaveBeenCalledOnce();
    expect(generateBadgesStub).toBeCalledWith({
      badgesSavedTo: '/test/p',
      totalCoverageReport: jsonSummary.total,
    });
  });
  it('Shold correct read command line pareamenters `--type`', async () => {
    await main([
      '-p',
      '/test/p',
      '--type',
      'badges',
      '--type',
      'readme',
      '--projectCwd',
      fixtureCwd,
    ]);
    expect(generateBadgesStub).toHaveBeenCalledOnce();
    expect(generateBadgesStub).toBeCalledWith({
      badgesSavedTo: '/test/p',
      totalCoverageReport: jsonSummary.total,
    });
  });
});

import * as path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FileCoverageMode } from '../../src/inputs/FileCoverageMode.js';
import { generateFileCoverageHtml } from '../../src/report/generateFileCoverageHtml.js';
import type { JsonFinal } from '../../src/types/JsonFinal.js';
import { createJsonFinalEntry } from '../../src/types/JsonFinalMockFactory.js';
import type { JsonSummary } from '../../src/types/JsonSummary.js';
import {
  createMockCoverageReport,
  createMockJsonSummary,
  createMockReportNumbers,
} from '../../src/types/JsonSummaryMockFactory.js';
import { getTableLine } from '../queryHelper.js';

const workspacePath = process.cwd();
describe('generateFileCoverageHtml()', () => {
  beforeEach(() => {
    vi.stubEnv('GITHUB_REPOSITORY', 'owner/repo');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it('renders only the unchanged files if no changed files exist.', () => {
    const jsonSummary: JsonSummary = createMockJsonSummary({
      'src/generateFileCoverageHtml.ts': createMockCoverageReport(),
    });

    const html = generateFileCoverageHtml({
      jsonSummary,
      jsonFinal: {},
      fileCoverageMode: FileCoverageMode.All,
      pullChanges: [],
    });

    const firstTableLine = getTableLine(1, html);

    expect(firstTableLine).toContain('Unchanged Files');
  });

  it('renders changed files before unchanged files.', () => {
    const relativeChangedFilePath = 'src/changedFile.ts';
    const jsonSummary: JsonSummary = createMockJsonSummary({
      'src/unchangedFile.ts': createMockCoverageReport(),
      [path.join(workspacePath, 'src', 'changedFile.ts')]:
        createMockCoverageReport(),
    });

    const html = generateFileCoverageHtml({
      jsonSummary,
      jsonFinal: {},
      fileCoverageMode: FileCoverageMode.All,
      pullChanges: [relativeChangedFilePath],
    });

    expect(getTableLine(1, html)).toContain('Changed Files');
    expect(getTableLine(2, html)).toContain(relativeChangedFilePath);
    expect(getTableLine(3, html)).toContain('Unchanged Files');
    expect(getTableLine(4, html)).toContain('src/unchangedFile.ts');
  });

  it('only renders unchanged files if the fileCoverageMode is set to All but only unchanged files exist.', () => {
    const changedFileName = 'src/changedFile.ts';
    const jsonSummary: JsonSummary = createMockJsonSummary({
      [changedFileName]: createMockCoverageReport(),
    });

    const html = generateFileCoverageHtml({
      jsonSummary,
      jsonFinal: {},
      fileCoverageMode: FileCoverageMode.All,
      pullChanges: [changedFileName],
    });

    expect(html).not.toContain('Unchanged Files');
  });

  it('renders statement that no changed files were found if the fileCoverageMode is set to Changed but no changed files exist.', () => {
    const jsonSummary: JsonSummary = createMockJsonSummary({
      'src/unchangedFile.ts': createMockCoverageReport(),
    });

    const html = generateFileCoverageHtml({
      jsonSummary,
      jsonFinal: {},
      fileCoverageMode: FileCoverageMode.Changes,
      pullChanges: [],
    });

    expect(html).toContain('No changed files found.');
  });

  it('renders the statements, branches, functions and line coverage-percentage of a file.', () => {
    const jsonSummary: JsonSummary = createMockJsonSummary({
      'src/generateFileCoverageHtml.ts': {
        statements: createMockReportNumbers({ pct: 70 }),
        branches: createMockReportNumbers({ pct: 80 }),
        functions: createMockReportNumbers({ pct: 90 }),
        lines: createMockReportNumbers({ pct: 100 }),
      },
    });

    const html = generateFileCoverageHtml({
      jsonSummary,
      jsonFinal: {},
      fileCoverageMode: FileCoverageMode.All,
      pullChanges: [],
    });

    const tableLine = getTableLine(2, html);

    expect(tableLine).toContain('70%');
    expect(tableLine).toContain('80%');
    expect(tableLine).toContain('90%');
    expect(tableLine).toContain('100%');
  });

  it('renders the line-coverage in the same row as the coverage.', async (): Promise<void> => {
    const jsonSummary: JsonSummary = createMockJsonSummary({
      'src/exampleFile.ts': createMockCoverageReport({
        statements: createMockReportNumbers({ pct: 70 }),
      }),
    });
    const jsonFinal: JsonFinal = {
      ...createJsonFinalEntry('src/exampleFile.ts', [
        { line: 1, covered: false },
        { line: 2, covered: false },
      ]),
    };

    const html = generateFileCoverageHtml({
      jsonSummary,
      jsonFinal,
      fileCoverageMode: FileCoverageMode.All,
      pullChanges: [],
    });

    const tableLine = getTableLine(2, html);

    expect(tableLine).toContain('70%');
    expect(tableLine).toContain('1-2');
    expect(tableLine).toContain('#L1-L2');
  });

  it('renders single line coverage without range.', async (): Promise<void> => {
    const jsonSummary: JsonSummary = createMockJsonSummary({
      'src/exampleFile.ts': createMockCoverageReport({
        statements: createMockReportNumbers({ pct: 70 }),
      }),
    });
    const jsonFinal: JsonFinal = {
      ...createJsonFinalEntry('src/exampleFile.ts', [
        { line: 2, covered: false },
      ]),
    };

    const html = generateFileCoverageHtml({
      jsonSummary,
      jsonFinal,
      fileCoverageMode: FileCoverageMode.All,
      pullChanges: [],
    });

    const tableLine = getTableLine(2, html);

    expect(tableLine).toContain('2');
    expect(tableLine).toContain('#L2');
  });

  it('renders non adjacent line coverage with multiple links.', async (): Promise<void> => {
    const jsonSummary: JsonSummary = createMockJsonSummary({
      'src/exampleFile.ts': createMockCoverageReport({
        statements: createMockReportNumbers({ pct: 70 }),
      }),
    });
    const jsonFinal: JsonFinal = {
      ...createJsonFinalEntry('src/exampleFile.ts', [
        { line: 2, covered: false },
        { line: 3, covered: true },
        { line: 4, covered: true },
        { line: 5, covered: false },
        { line: 6, covered: false },
      ]),
    };

    const html = generateFileCoverageHtml({
      jsonSummary,
      jsonFinal,
      fileCoverageMode: FileCoverageMode.All,
      pullChanges: [],
    });

    const tableLine = getTableLine(2, html);

    expect(tableLine).toContain('#L2');
    expect(tableLine).toContain('#L5-L6');
  });
});

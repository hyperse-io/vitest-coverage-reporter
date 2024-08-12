import minimist from 'minimist';
import { resolve } from 'path';
import { defaultJsonFinalPath, defaultJsonSummaryPath } from './constants.js';
import { FileCoverageMode } from './inputs/getCoverageModeFrom.js';
import { getVitestThresholds } from './inputs/getVitestThresholds.js';
import { parseVitestJsonSummaryReport } from './inputs/parseVitestJsonFinalReport.js';
import { readOptions } from './inputs/readOptions.js';
import { generateBadges } from './report/generateBadges.js';
import { generateCoverageSummary } from './report/generateCoverageSummary.js';
import { writeSummaryToReadMe } from './utils/writeSummaryToReadMe.js';

type Argv = {
  p: string;
  path: string;
  type: Array<'badges' | 'readme'>;
  projectCwd: string;
};

export const main = async (args: string[]) => {
  const argv = minimist<Argv>(args, {
    '--': true,
    alias: {
      p: 'path',
    },
    default: {
      p: 'coverage/badges',
      type: ['badges'],
      projectCwd: process.cwd(),
    },
  });
  const cwd = argv.projectCwd || process.cwd();
  const badgesSavedTo = resolve(cwd, argv.path);
  const { jsonSummaryPath } = await readOptions();
  const jsonSummary = await parseVitestJsonSummaryReport(jsonSummaryPath);

  for (const type of argv.type) {
    if (type === 'badges') {
      await generateBadges({
        badgesSavedTo,
        totalCoverageReport: jsonSummary.total,
      });
    } else if (type === 'readme') {
      const thresholds = await getVitestThresholds(cwd, '');
      const summary = await generateCoverageSummary({
        name: 'Coverage Report',
        jsonSummaryPath: defaultJsonSummaryPath,
        fileCoverageMode: FileCoverageMode.None,
        jsonFinalPath: defaultJsonFinalPath,
        workingDirectory: cwd,
        thresholds,
      });
      await writeSummaryToReadMe(cwd, summary, '## Coverage Report');
    }
  }
};

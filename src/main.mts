import minimist from 'minimist';
import { resolve } from 'path';
import { FileCoverageMode } from './inputs/getCoverageModeFrom.js';
import { getVitestJsonPath } from './inputs/getVitestJsonPath.js';
import { parseVitestJsonSummaryReport } from './inputs/parseVitestJsonFinalReport.js';
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
  const { jsonSummaryPath } = getVitestJsonPath(cwd);
  const jsonSummary = await parseVitestJsonSummaryReport(jsonSummaryPath);
  const types = Array.isArray(argv.type) ? argv.type : [argv.type];
  for (const type of types) {
    if (type === 'badges') {
      await generateBadges({
        badgesSavedTo,
        totalCoverageReport: jsonSummary.total,
      });
    } else if (type === 'readme') {
      const summary = await generateCoverageSummary({
        name: '',
        fileCoverageMode: FileCoverageMode.None,
        repoCwd: cwd,
        hideHeadline: true,
        includeAllProjects: true,
      });
      await writeSummaryToReadMe(cwd, summary, '## Coverage Report');
    }
  }
};

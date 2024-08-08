import minimist from 'minimist';
import { resolve } from 'path';
import { parseVitestJsonSummary } from './inputs/parseVitestJsonReports.js';
import { readOptions } from './inputs/readOptions.js';
import { generateBadges } from './report/generateBadges.js';

type Argv = {
  p: string;
  path: string;
};

export const main = async (args: string[]) => {
  const argv = minimist<Argv>(args, {
    '--': true,
    alias: {
      p: 'path',
    },
    default: {
      p: 'coverage/badges',
    },
  });

  const badgesSavedTo = resolve(process.cwd(), argv.path);
  const { jsonSummaryPath } = await readOptions();
  const jsonSummary = await parseVitestJsonSummary(jsonSummaryPath);

  return generateBadges({
    badgesSavedTo,
    totalCoverageReport: jsonSummary.total,
  });
};

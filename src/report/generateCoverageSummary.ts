import * as core from '@actions/core';
import * as github from '@actions/github';
import { getChangedPackages } from '../inputs/getChangedPackages.js';
import { FileCoverageMode } from '../inputs/getCoverageModeFrom.js';
import { getPullChanges } from '../inputs/getPullChanges.js';
import { getVitestJsonPath } from '../inputs/getVitestJsonPath.js';
import { getVitestThresholds } from '../inputs/getVitestThresholds.js';
import {
  parseVitestJsonFinalReport,
  parseVitestJsonSummaryReport,
} from '../inputs/parseVitestJsonFinalReport.js';
import type { JsonSummary } from '../types/JsonSummary.js';
import { generateFileCoverageHtml } from './generateFileCoverageHtml.js';
import { generateHeadline } from './generateHeadline.js';
import { generateSummaryTableHtml } from './generateSummaryTableHtml.js';

type GenerateCoverageSummaryOptions = {
  name: string;
  repoCwd: string;
  fileCoverageMode: FileCoverageMode;
  includeAllProjects: boolean;
};

export const generateCoverageSummary = async (
  options: GenerateCoverageSummaryOptions
): Promise<typeof core.summary> => {
  const changedPackages = await getChangedPackages(
    options.repoCwd,
    options.includeAllProjects
  );
  const summary = core.summary.addHeading(
    generateHeadline({
      name: options.name,
      relativeDir: '',
    }),
    2
  );

  for (const packageItem of changedPackages) {
    const projectCwd = packageItem.dir;
    core.info(`generating coverage summary from: ${projectCwd}`);

    const { jsonSummaryPath, jsonSummaryComparePath, jsonFinalPath } =
      getVitestJsonPath(projectCwd);
    const jsonSummary = await parseVitestJsonSummaryReport(jsonSummaryPath);
    const thresholds = await getVitestThresholds(projectCwd);

    let jsonSummaryCompare: JsonSummary | undefined;
    if (jsonSummaryComparePath) {
      jsonSummaryCompare = await parseVitestJsonSummaryReport(
        jsonSummaryComparePath
      );
    }
    summary.addHeading(
      generateHeadline({
        name: options.name,
        relativeDir: packageItem.relativeDir,
      }),
      2
    );

    const tableData = generateSummaryTableHtml(
      jsonSummary.total,
      thresholds,
      jsonSummaryCompare?.total
    );

    summary.addRaw(tableData);

    if (options.fileCoverageMode !== FileCoverageMode.None) {
      const pullChanges = await getPullChanges(options.fileCoverageMode);
      const jsonFinal = await parseVitestJsonFinalReport(jsonFinalPath);
      const fileTable = generateFileCoverageHtml({
        jsonSummary,
        jsonFinal,
        fileCoverageMode: options.fileCoverageMode,
        pullChanges,
      });
      summary.addDetails('File Coverage', fileTable);
    }
  }

  summary.addRaw(
    `<em>Generated in workflow <a href=${getWorkflowSummaryURL()}>#${github.context.runNumber}</a></em>`
  );
  return summary;
};

function getWorkflowSummaryURL() {
  const { owner, repo } = github.context.repo;
  const { runId } = github.context;
  return `${github.context.serverUrl}/${owner}/${repo}/actions/runs/${runId}`;
}

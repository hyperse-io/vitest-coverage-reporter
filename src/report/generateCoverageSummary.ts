import * as core from '@actions/core';
import * as github from '@actions/github';
import { FileCoverageMode } from '../inputs/getCoverageModeFrom.js';
import { getPullChanges } from '../inputs/getPullChanges.js';
import {
  parseVitestJsonFinalReport,
  parseVitestJsonSummaryReport,
} from '../inputs/parseVitestJsonFinalReport.js';
import type { JsonSummary } from '../types/JsonSummary.js';
import { Thresholds } from '../types/Threshold.js';
import { generateFileCoverageHtml } from './generateFileCoverageHtml.js';
import { generateHeadline } from './generateHeadline.js';
import { generateSummaryTableHtml } from './generateSummaryTableHtml.js';

type GenerateCoverageSummaryOptions = {
  name: string;
  workingDirectory: string;
  jsonSummaryPath: string;
  jsonSummaryComparePath?: string | null;
  thresholds: Thresholds;
  fileCoverageMode: FileCoverageMode;
  jsonFinalPath: string;
};

export const generateCoverageSummary = async (
  options: GenerateCoverageSummaryOptions
): Promise<typeof core.summary> => {
  const jsonSummary = await parseVitestJsonSummaryReport(
    options.jsonSummaryPath
  );

  let jsonSummaryCompare: JsonSummary | undefined;
  if (options.jsonSummaryComparePath) {
    jsonSummaryCompare = await parseVitestJsonSummaryReport(
      options.jsonSummaryComparePath
    );
  }

  const tableData = generateSummaryTableHtml(
    jsonSummary.total,
    options.thresholds,
    jsonSummaryCompare?.total
  );

  const summary = core.summary
    .addHeading(
      generateHeadline({
        workingDirectory: options.workingDirectory,
        name: options.name,
      }),
      2
    )
    .addRaw(tableData);

  if (options.fileCoverageMode !== FileCoverageMode.None) {
    const pullChanges = await getPullChanges(options.fileCoverageMode);
    const jsonFinal = await parseVitestJsonFinalReport(options.jsonFinalPath);
    const fileTable = generateFileCoverageHtml({
      jsonSummary,
      jsonFinal,
      fileCoverageMode: options.fileCoverageMode,
      pullChanges,
    });
    summary.addDetails('File Coverage', fileTable);
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

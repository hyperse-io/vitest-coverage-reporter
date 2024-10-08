import { stripIndent } from 'common-tags';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import * as core from '@actions/core';
import type { JsonFinal } from '../types/JsonFinal.js';
import type { JsonSummary } from '../types/JsonSummary.js';

const parseVitestCoverageReport = async <type extends JsonSummary | JsonFinal>(
  jsonPath: string
): Promise<type> => {
  const resolvedJsonSummaryPath = resolve(process.cwd(), jsonPath);
  const jsonSummaryRaw = await readFile(resolvedJsonSummaryPath);
  return JSON.parse(jsonSummaryRaw.toString()) as type;
};

export const parseVitestJsonSummaryReport = async (
  jsonSummaryPath: string
): Promise<JsonSummary> => {
  try {
    return await parseVitestCoverageReport<JsonSummary>(jsonSummaryPath);
  } catch (err: unknown) {
    const stack = err instanceof Error ? err.stack : '';
    core.setFailed(stripIndent`
        Failed to parse the json-summary at path "${jsonSummaryPath}."
        Make sure to run vitest before this action and to include the "json-summary" reporter.

        Original Error:
        ${stack}
    `);

    // Rethrow to abort the entire workflow
    throw err;
  }
};

export const parseVitestJsonFinalReport = async (
  jsonFinalPath: string
): Promise<JsonFinal> => {
  try {
    return await parseVitestCoverageReport<JsonFinal>(jsonFinalPath);
  } catch (err: unknown) {
    const stack = err instanceof Error ? err.stack : '';
    core.warning(stripIndent`
      Failed to parse JSON Final at path "${jsonFinalPath}".
      Line coverage will be empty. To include it, make sure to include the "json" reporter in your vitest execution.

      Original Error:
      ${stack}
    `);
    return {};
  }
};

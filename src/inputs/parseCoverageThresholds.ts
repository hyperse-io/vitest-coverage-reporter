import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import * as core from '@actions/core';
import type { Thresholds } from '../types/Threshold.js';

const regex100 = /100"?\s*:\s*true/;
const regexStatements = /statements\s*:\s*(\d+)/;
const regexLines = /lines:\s*(\d+)/;
const regexBranches = /branches\s*:\s*(\d+)/;
const regexFunctions = /functions\s*:\s*(\d+)/;

/**
 * Parse the coverage thresholds from the vite config file, supports all vite config file formats
 * @param vitestConfigPath The path to the vite config file
 * @returns
 */
export const parseCoverageThresholds = async (
  vitestConfigPath: string
): Promise<Thresholds> => {
  try {
    const resolvedViteConfigPath = resolve(process.cwd(), vitestConfigPath);
    const rawContent = await readFile(resolvedViteConfigPath, 'utf8');

    const has100Value = rawContent.match(regex100);

    if (has100Value) {
      return {
        lines: 100,
        branches: 100,
        functions: 100,
        statements: 100,
      };
    }

    const lines = rawContent.match(regexLines);
    const branches = rawContent.match(regexBranches);
    const functions = rawContent.match(regexFunctions);
    const statements = rawContent.match(regexStatements);

    return {
      lines: lines ? Number.parseInt(lines[1]) : undefined,
      branches: branches ? Number.parseInt(branches[1]) : undefined,
      functions: functions ? Number.parseInt(functions[1]) : undefined,
      statements: statements ? Number.parseInt(statements[1]) : undefined,
    };
  } catch (err: unknown) {
    core.warning(
      `Could not read vite config file for tresholds due to an error:\n ${err}`
    );
    return {};
  }
};

import type {
  JsonFinal,
  StatementCoverage,
  StatementCoverageReport,
  StatementMap,
} from '../../src/types/JsonFinal.js';

type LineConfig = { line: number; covered: boolean };

export const createJsonFinalEntry = (
  fileName: string,
  lineConfigs: LineConfig[]
): JsonFinal => {
  const statementCoverageReport: StatementCoverageReport = {
    statementMap: lineConfigs.reduce((obj: StatementMap, lineConfig) => {
      obj[`${lineConfig.line - 1}`] = {
        start: {
          line: lineConfig.line,
          column: 0,
        },
        end: {
          line: lineConfig.line,
          column: 0,
        },
      };
      return obj;
    }, {}),
    s: lineConfigs.reduce((obj: StatementCoverage, lineConfig) => {
      obj[lineConfig.line - 1] = lineConfig.covered ? 1 : 0;
      return obj;
    }, {}),
  };

  return {
    [fileName]: {
      path: fileName,
      all: false,
      ...statementCoverageReport,
    },
  };
};

const defaultJsonFinal: JsonFinal = {
  ...createJsonFinalEntry('src/exampleFile.ts', [{ line: 1, covered: false }]),
};

export const createTestJsonFinal = (
  overwrites: Partial<JsonFinal> = {}
): JsonFinal =>
  ({
    ...defaultJsonFinal,
    ...overwrites,
  }) as JsonFinal;

export type StatementMap = {
  [statementNumber: string]: {
    start: {
      line: number;
      column: number;
    };
    end: {
      line: number;
      column: number;
    };
  };
};

export type StatementCoverage = {
  [statementNumber: string]: number;
};

export type StatementCoverageReport = {
  statementMap: StatementMap;
  s: StatementCoverage;
};

export type FileCoverageReport = StatementCoverageReport & {
  path: string;
  all: boolean;
};

export type JsonFinal = {
  [path: string]: FileCoverageReport;
};

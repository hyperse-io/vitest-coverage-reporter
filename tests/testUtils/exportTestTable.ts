import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseVitestJsonSummary } from '../../src/inputs/parseVitestJsonReports.js';
import { generateSummaryTableHtml } from '../../src/report/generateSummaryTableHtml.js';
import { getDirname } from '../../src/utils/getDirname.js';

const basePath = getDirname(import.meta.url, '../mockReports', 'coverage');
const coveragePath = getDirname(basePath, 'coverage-summary.json');
const coverageComparePath = getDirname(
  basePath,
  'coverage-summary-compare.json'
);

const targetPath = getDirname(import.meta.url, '..', 'tmp');

async function generateMarkdown() {
  // Parse the coverage reports
  const coverageSummary = await parseVitestJsonSummary(coveragePath);
  const coverageSummaryCompare =
    await parseVitestJsonSummary(coverageComparePath);

  // Generate the HTML table
  const htmlTable = generateSummaryTableHtml(
    coverageSummary.total,
    {
      branches: 60,
      functions: 50,
      lines: 40,
      statements: 20,
    },
    coverageSummaryCompare.total
  );

  // Write the HTML into a markdown file
  await mkdir(targetPath, { recursive: true });
  await writeFile(join(targetPath, 'coverage-summary.md'), htmlTable);
}

generateMarkdown().catch(console.error);

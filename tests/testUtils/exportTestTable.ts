import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { parseVitestJsonSummaryReport } from '../../src/inputs/parseVitestJsonFinalReport.js';
import { generateSummaryTableHtml } from '../../src/report/generateSummaryTableHtml.js';

const basePath = join(__dirname, '../mockReports', 'coverage');
const coveragePath = resolve(basePath, 'coverage-summary.json');
const coverageComparePath = resolve(basePath, 'coverage-summary-compare.json');

const targetPath = join(__dirname, '..', 'tmp');

async function generateMarkdown() {
  // Parse the coverage reports
  const coverageSummary = await parseVitestJsonSummaryReport(coveragePath);
  const coverageSummaryCompare =
    await parseVitestJsonSummaryReport(coverageComparePath);

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

import { oneLine } from 'common-tags';
import { icons } from '../constants.js';
import type { CoverageReport, ReportNumbers } from '../types/JsonSummary.js';
import type { Thresholds } from '../types/Threshold.js';

export function generateSummaryTableHtml(
  jsonReport: CoverageReport,
  thresholds: Thresholds = {},
  jsonCompareReport: CoverageReport | undefined = undefined
): string {
  return oneLine`
		<table>
			<thead>
				<tr>
				 <th align="center">Status</th>
				 <th align="left">Category</th>
				 <th align="right">Percentage</th>
				 <th align="right">Covered / Total</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					${generateTableRow({ reportNumbers: jsonReport.lines, category: 'Lines', threshold: thresholds.lines, reportCompareNumbers: jsonCompareReport?.lines })}
				</tr>
				<tr>
					${generateTableRow({ reportNumbers: jsonReport.statements, category: 'Statements', threshold: thresholds.statements, reportCompareNumbers: jsonCompareReport?.statements })}
				</tr>
				<tr>
					${generateTableRow({ reportNumbers: jsonReport.functions, category: 'Functions', threshold: thresholds.functions, reportCompareNumbers: jsonCompareReport?.functions })}
				</tr>
				<tr>
					${generateTableRow({ reportNumbers: jsonReport.branches, category: 'Branches', threshold: thresholds.branches, reportCompareNumbers: jsonCompareReport?.branches })}
				</tr>
			</tbody>
		</table>
	`;
}

function generateTableRow({
  reportNumbers,
  category,
  threshold,
  reportCompareNumbers,
}: {
  reportNumbers: ReportNumbers;
  category: string;
  threshold?: number;
  reportCompareNumbers?: ReportNumbers;
}): string {
  let status = icons.blue;
  let percent = `${reportNumbers.pct}%`;

  if (threshold) {
    percent = `${percent} (${icons.target} ${threshold}%)`;
    status = reportNumbers.pct >= threshold ? icons.green : icons.red;
  }

  if (reportCompareNumbers) {
    const percentDiff = reportNumbers.pct - reportCompareNumbers.pct;
    const compareString = getCompareString(percentDiff);
    percent = `${percent}<br/>${compareString}`;
  }

  return `
    <td align="center">${status}</td>
    <td align="left">${category}</td>
		<td align="right">${percent}</td>
    <td align="right">${reportNumbers.covered} / ${reportNumbers.total}</td>
  `;
}

function getCompareString(percentDiff: number): string {
  if (percentDiff === 0) {
    return `${icons.equal} <em>±0%</em>`;
  }

  if (percentDiff > 0) {
    return `${icons.increase} <em>+${percentDiff.toFixed(2)}%</em>`;
  }

  // The - char is already included in a negative number
  return `${icons.decrease} <em>${percentDiff.toFixed(2)}%</em>`;
}

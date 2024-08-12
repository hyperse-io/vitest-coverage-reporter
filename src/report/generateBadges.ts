import { createWriteStream, existsSync, mkdirSync } from 'node:fs';
import https from 'node:https';
import { resolve } from 'node:path';
import { CoverageReport } from '../types/JsonSummary.js';

/**
 * Generate a shields.io URL for a badge.
 * Change the color of the badge based on the percentage.
 *
 * @param summaryData The coverage summary report data.
 * @param summaryKey  The summary key to display on the badge.
 * @returns The shields.io URL.
 */
const generateUrl = (
  summaryData: CoverageReport,
  summaryKey: keyof CoverageReport
) => {
  const percentage = summaryData[summaryKey].pct;
  let color = 'brightgreen';
  if (percentage < 70) {
    color = 'red';
  } else if (percentage < 80) {
    color = 'yellow';
  } else if (percentage < 90) {
    color = 'orange';
  }
  return `https://img.shields.io/badge/coverage%3A${summaryKey}-${percentage}%25-${color}.svg`;
};

/**
 * Download a badge from shields.io.
 * @param url The shields.io URL.
 * @param filename The filename to save the badge to.
 * @return Promise<void>
 */
const downloadBadge = (url: string, filename: string) => {
  return new Promise<void>((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        const newError = new Error(
          `Error downloading badge: ${res.statusMessage}`
        );
        console.error(newError);
        return reject(newError);
      }

      const file = createWriteStream(filename);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
      file.on('error', (err) => {
        console.error(`Error saving badge: ${err}`);
        reject(err);
      });
    });
  });
};

/**
 * Generate badges for code coverage.
 */
export type GenerateBadgesOptions = {
  /**
   * The path to the coverage json file.
   */
  totalCoverageReport: CoverageReport;
  /**
   * The directory to save the badges to.
   */
  badgesSavedTo: string;
};

/**
 * Generate badges for code coverage.
 */
export const generateBadges = async (options: GenerateBadgesOptions) => {
  const { badgesSavedTo, totalCoverageReport } = options;

  // Construct the shields.io URL for each badge.
  const statementsBadgeUrl = generateUrl(totalCoverageReport, 'statements');
  const branchesBadgeUrl = generateUrl(totalCoverageReport, 'branches');
  const functionsBadgeUrl = generateUrl(totalCoverageReport, 'functions');
  const linesBadgeUrl = generateUrl(totalCoverageReport, 'lines');

  // Create the badges directory if it does not exist.
  if (!existsSync(badgesSavedTo)) {
    mkdirSync(badgesSavedTo);
  }

  // Download each badge and save it to the badges directory.
  await downloadBadge(
    statementsBadgeUrl,
    resolve(badgesSavedTo, 'statements.svg')
  );
  await downloadBadge(
    functionsBadgeUrl,
    resolve(badgesSavedTo, 'functions.svg')
  );
  await downloadBadge(linesBadgeUrl, resolve(badgesSavedTo, 'lines.svg'));
  await downloadBadge(branchesBadgeUrl, resolve(badgesSavedTo, 'branches.svg'));

  console.log('Code coverage badges created successfully.');
};

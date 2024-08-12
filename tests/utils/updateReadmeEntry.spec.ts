import { COVERAGE_README_MARKER } from '../../src/constants.js';
import { updateReadmeEntry } from '../../src/utils/updateReadmeEntry.js';

const README = `
# @hyperse/vitest-coverage-reporter

<p align="left">
  <a aria-label="Build" href="https://github.com/hyperse-io/vitest-coverage-reporter/actions?query=workflow%3ACI">
    <img alt="build" src="https://img.shields.io/github/actions/workflow/status/hyperse-io/vitest-coverage-reporter/ci-integrity.yml?branch=main&label=ci&logo=github&style=flat-quare&labelColor=000000" />
  </a>
  <a aria-label="stable version" href="https://www.npmjs.com/package/@hyperse/vitest-coverage-reporter">
    <img alt="stable version" src="https://img.shields.io/npm/v/%40hyperse%2Fvitest-coverage-reporter?branch=main&label=version&logo=npm&style=flat-quare&labelColor=000000" />
  </a>
  <a aria-label="Top language" href="https://github.com/hyperse-io/vitest-coverage-reporter/search?l=typescript">
    <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/hyperse-io/vitest-coverage-reporter?style=flat-square&labelColor=000&color=blue">
  </a>
  <a aria-label="Licence" href="https://github.com/hyperse-io/vitest-coverage-reporter/blob/main/LICENSE">
    <img alt="Licence" src="https://img.shields.io/github/license/hyperse-io/vitest-coverage-reporter?style=flat-quare&labelColor=000000" />
  </a>
</p>

This GitHub Action reports vitest coverage results as a GitHub step-summary and as a comment on a pull request

${COVERAGE_README_MARKER}

## Coverage Report

<table> <thead> <tr> <th align="center">Status</th> <th align="left">Category</th> <th align="right">Percentage</th> <th align="right">Covered / Total</th> </tr> </thead> <tbody> <tr> <td align="center">🔵</td> <td align="left">Lines</td> <td align="right">5%</td> <td align="right">5 / 100</td> </tr> <tr> <td align="center">🔵</td> <td align="left">Statements</td> <td align="right">5%</td> <td align="right">5 / 100</td> </tr> <tr> <td align="center">🔵</td> <td align="left">Functions</td> <td align="right">5%</td> <td align="right">5 / 100</td> </tr> <tr> <td align="center">🔵</td> <td align="left">Branches</td> <td align="right">5%</td> <td align="right">5 / 100</td> </tr> </tbody> </table>

This GitHub Action reports vitest coverage results as a GitHub step-summary and as a comment on a pull request

## Other Actions
The action generates a high-level coverage summary for all coverage categories, as well as a detailed, file-based report. The report includes links to the files themselves and

the uncovered lines for easy reference.

`;

const README_2 = `
# @hyperse/vitest-coverage-reporter

<p align="left">
  <a aria-label="Build" href="https://github.com/hyperse-io/vitest-coverage-reporter/actions?query=workflow%3ACI">
    <img alt="build" src="https://img.shields.io/github/actions/workflow/status/hyperse-io/vitest-coverage-reporter/ci-integrity.yml?branch=main&label=ci&logo=github&style=flat-quare&labelColor=000000" />
  </a>
  <a aria-label="stable version" href="https://www.npmjs.com/package/@hyperse/vitest-coverage-reporter">
    <img alt="stable version" src="https://img.shields.io/npm/v/%40hyperse%2Fvitest-coverage-reporter?branch=main&label=version&logo=npm&style=flat-quare&labelColor=000000" />
  </a>
  <a aria-label="Top language" href="https://github.com/hyperse-io/vitest-coverage-reporter/search?l=typescript">
    <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/hyperse-io/vitest-coverage-reporter?style=flat-square&labelColor=000&color=blue">
  </a>
  <a aria-label="Licence" href="https://github.com/hyperse-io/vitest-coverage-reporter/blob/main/LICENSE">
    <img alt="Licence" src="https://img.shields.io/github/license/hyperse-io/vitest-coverage-reporter?style=flat-quare&labelColor=000000" />
  </a>
</p>

This GitHub Action reports vitest coverage results as a GitHub step-summary and as a comment on a pull request

## Other Actions
The action generates a high-level coverage summary for all coverage categories, as well as a detailed, file-based report. The report includes links to the files themselves and

the uncovered lines for easy reference.

`;

const README_3 = `
# @hyperse/vitest-coverage-reporter

<p align="left">
  <a aria-label="Build" href="https://github.com/hyperse-io/vitest-coverage-reporter/actions?query=workflow%3ACI">
    <img alt="build" src="https://img.shields.io/github/actions/workflow/status/hyperse-io/vitest-coverage-reporter/ci-integrity.yml?branch=main&label=ci&logo=github&style=flat-quare&labelColor=000000" />
  </a>
  <a aria-label="stable version" href="https://www.npmjs.com/package/@hyperse/vitest-coverage-reporter">
    <img alt="stable version" src="https://img.shields.io/npm/v/%40hyperse%2Fvitest-coverage-reporter?branch=main&label=version&logo=npm&style=flat-quare&labelColor=000000" />
  </a>
  <a aria-label="Top language" href="https://github.com/hyperse-io/vitest-coverage-reporter/search?l=typescript">
    <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/hyperse-io/vitest-coverage-reporter?style=flat-square&labelColor=000&color=blue">
  </a>
  <a aria-label="Licence" href="https://github.com/hyperse-io/vitest-coverage-reporter/blob/main/LICENSE">
    <img alt="Licence" src="https://img.shields.io/github/license/hyperse-io/vitest-coverage-reporter?style=flat-quare&labelColor=000000" />
  </a>
</p>

`;

describe('getReadmeEntry()', () => {
  const headline = '## Coverage Report';
  const summary = `<table> <thead> <tr> <th align="center">Status</th> <th align="left">Category</th> <th align="right">Percentage</th> <th align="right">Covered / Total</th> </tr> </thead> <tbody> <tr> <td align="center">🔵</td> <td align="left">Lines</td> <td align="right">5%</td> <td align="right">5 / 100</td> </tr> <tr> <td align="center">🔵</td> <td align="left">Statements</td> <td align="right">5%</td> <td align="right">5 / 100</td> </tr> <tr> <td align="center">🔵</td> <td align="left">Functions</td> <td align="right">5%</td> <td align="right">5 / 100</td> </tr> <tr> <td align="center">🔵</td> <td align="left">Branches</td> <td align="right">5%</td> <td align="right">5 / 100</td> </tr> </tbody> </table>`;
  const readmeUpdateBody = `${COVERAGE_README_MARKER}\n\n${headline}\n\n${summary}`;

  it('Should correct parse readme entry 1', () => {
    const { content } = updateReadmeEntry(README, readmeUpdateBody);
    expect(content).toMatchSnapshot();
  });
  it('Should correct parse readme entry 2', () => {
    const { content } = updateReadmeEntry(README_2, readmeUpdateBody);
    expect(content).toMatchSnapshot();
  });

  it('Should correct parse readme entry 3', () => {
    const { content } = updateReadmeEntry(README_3, readmeUpdateBody);
    expect(content).toMatchSnapshot();
  });
});
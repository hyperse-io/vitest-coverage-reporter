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

<!-- hyperse-vitest-coverage-reporter-marker-readme -->

## Coverage Report

<h2>Coverage Report for Coverage Report (/Users/tianyingchun/Documents/hyperse-io/vitest-coverage-reporter/tests/fixtures/main)</h2>
<table> <thead> <tr> <th align="center">Status</th> <th align="left">Category</th> <th align="right">Percentage</th> <th align="right">Covered / Total</th> </tr> </thead> <tbody> <tr> <td align="center">🔵</td> <td align="left">Lines</td> <td align="right">40%</td> <td align="right">40 / 100</td> </tr> <tr> <td align="center">🔵</td> <td align="left">Statements</td> <td align="right">10%</td> <td align="right">10 / 100</td> </tr> <tr> <td align="center">🔵</td> <td align="left">Functions</td> <td align="right">30%</td> <td align="right">30 / 100</td> </tr> <tr> <td align="center">🔵</td> <td align="left">Branches</td> <td align="right">20%</td> <td align="right">20 / 100</td> </tr> </tbody> </table><em>Generated in workflow <a href=https://github.com/owner/repo/actions/runs/NaN>#NaN</a></em>

This GitHub Action reports vitest coverage results as a GitHub step-summary and as a comment on a pull request

The action generates a high-level coverage summary for all coverage categories, as well as a detailed, file-based report. The report includes links to the files themselves and the uncovered lines for easy reference.

## Usage (Prerequisite)

To use this action, you need to configure vitest to create a coverage report with the following reporters:

* `json-summary` (required): This reporter generates a high-level summary of your overall coverage.
* `json` (optional): If provided, this reporter generates file-specific coverage reports for each file in your project.

You can configure the reporters in your Vite configuration file (e.g., `vite.config.ts`) as follows:

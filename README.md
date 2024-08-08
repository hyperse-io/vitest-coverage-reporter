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


The action generates a high-level coverage summary for all coverage categories, as well as a detailed, file-based report. The report includes links to the files themselves and the uncovered lines for easy reference.

## Usage (Prerequisite)
To use this action, you need to configure vitest to create a coverage report with the following reporters:

- `json-summary` (required): This reporter generates a high-level summary of your overall coverage.
- `json` (optional): If provided, this reporter generates file-specific coverage reports for each file in your project.

 You can configure the reporters in your Vite configuration file (e.g., `vite.config.ts`) as follows:


```ts
import { defineConfig } from 'vite/config';

export default defineConfig({
  test: {
    coverage: {
      // you can include other reporters, but 'json-summary' is required, json is recommended
      reporter: ['text', 'json-summary', 'json'],
      // If you want a coverage reports even if your tests are failing, include the reportOnFailure option
      reportOnFailure: true,
    }
  }
});
```

## Example workflow

## Case Example 1

### Step 1: install @hyperse/vitest-coverage-reporter

```shell
yarn add @hyperse/vitest-coverage-reporter
```

### Step 2: Create a Script to Extract Coverage Data

```json
{
  "scripts": {
    "test:coverage": "vitest run --coverage",
    "generate-badges": "generate-badges -p ./coverage/badges",
  }
}

```

### Step 3: Configure GitHub Actions

```yml
name: (main) coverage badge

on:
  workflow_dispatch:
  push:
    branches:
      - main

jobs:
  coverage-badge:
    strategy:
      matrix:
        os:
          - ubuntu-latest
        node:
          - 18.14.2
        pnpm:
          - 7
    runs-on: ${{ matrix.os }}
    steps:
      - name: checkout repository
        uses: actions/checkout@v4
      - name: setup node
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}

      - name: 📥 Install Dependencies
        run: yarn --frozen-lockfile

      - name: run coverage
        run: yarn test:coverage

      - name: generate badges
        run: yarn generate-badges

      - name: push coverage artifacts to another branch
        uses: peaceiris/actions-gh-pages@v3
        if: github.ref == 'refs/heads/main'
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./coverage
          publish_branch: coverage
          allow_empty_commit: true

```
### Step 4: Add Badge to README

```md
![Coverage: Statements](https://raw.githubusercontent.com/<USER_NAME>/<REPO_NAME>/<PUBLISH_BRANCH_NAME>/badges/statements.svg)
![Coverage: Branches](https://raw.githubusercontent.com/<USER_NAME>/<REPO_NAME>/<PUBLISH_BRANCH_NAME>/badges/branches.svg)
![Coverage: Functions](https://raw.githubusercontent.com/<USER_NAME>/<REPO_NAME>/<PUBLISH_BRANCH_NAME>/badges/functions.svg)
![Coverage: Lines](https://raw.githubusercontent.com/<USER_NAME>/<REPO_NAME>/<PUBLISH_BRANCH_NAME>/badges/lines.svg)
```
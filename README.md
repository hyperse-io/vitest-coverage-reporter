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
    },
  },
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
    "generate-coverage-report": "generate-coverage-report -p ./coverage/badges"
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
        run: yarn generate-coverage-report

      - name: push coverage artifacts to another branch
        uses: peaceiris/actions-gh-pages@v4
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

## Case Example 2 (github action)

```yml
name: PR vitest coverage reporter
on:
  pull_request:

jobs:
  build-and-test:
    permissions:
      pull-requests: write
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: 'Install Node'
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
      - name: 📥 Install Dependencies
        run: yarn --frozen-lockfile

      - name: 'Build'
        run: yarn build

      - name: run coverage
        run: yarn test:coverage

      - name: 'PR UT Reports'
        uses: hyperse-io/vitest-coverage-reporter@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          name: 'PR UT Reports'
```

### Required Permissions

This action requires the `pull-request: write` permission to add a comment to your pull request. If you're using the default `GITHUB_TOKEN`, ensure that you include both `pull-request: write` and `contents: read` permissions in the job. The `contents: read` permission is necessary for the `actions/checkout` action to checkout the repository. This is particularly important for new repositories created after GitHub's [announcement](https://github.blog/changelog/2023-02-02-github-actions-updating-the-default-github_token-permissions-to-read-only/) to change the default permissions to `read-only` for all new `GITHUB_TOKEN`s.

### Action Options

| Option                      | Description                                                                                                                                                              | Default                                                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `repo-cwd`                  | repo root directory                                                                                                                                                      | `./`                                                                                                                               |
| `json-summary-path`         | The path to the json summary file.                                                                                                                                       | `${working-directory}/coverage/coverage-summary.json`                                                                              |
| `json-final-path`           | The path to the json final file.                                                                                                                                         | `${working-directory}/coverage/coverage-final.json`                                                                                |
| `vite-config-path`          | The path to the vite config file. Will check the same paths as vite and vitest                                                                                           | Checks pattern `${working-directory}/vitest.config.{t\|mt\|ct\|j\|mj\|cj}s`                                                        |
| `github-token`              | A GitHub access token with permissions to write to issues (defaults to secrets.GITHUB_TOKEN).                                                                            | `${{ github.token }}`                                                                                                              |
| `file-coverage-mode`        | Defines how file-based coverage is reported. Possible values are `all`, `changes` or `none`.                                                                             | `changes`                                                                                                                          |
| `name`                      | Give the report a custom name. This is useful if you want multiple reports for different test suites within the same PR. Needs to be unique.                             | ''                                                                                                                                 |
| `json-summary-compare-path` | The path to the json summary file to compare against. If given, will display a trend indicator and the difference in the summary. Respects the working-directory option. | undefined                                                                                                                          |
| `pr-number`                 | The number of the PR to post a comment to (if any)                                                                                                                       | If in the context of a triggered workflow, the PR of the triggering workflow.If no PR context is found, it defaults to `undefined` |
| `include-all-projects`      | Include all projects or auto detect file changed project in the pull request.                                                                                            | it defaults to `false`, will auto detect PR changed projects                                                                       |

#### File Coverage Mode

- `changes` - show Files coverage only for project files changed in that pull request (works only with `pull_request`, `pull_request_review`, `pull_request_review_comment` actions)
- `all` - show it grouped by changed and not changed files in that pull request (works only with `pull_request`, `pull_request_review`, `pull_request_review_comment` actions)
- `none` - do not show any File coverage details (only total Summary)

#### Name

If your project includes multiple test suites and you want to consolidate their coverage reports into a single pull request comment, you must assign a unique `name` to each action step that parses a summary report. For example:

```yml
## ...
- name: 'Report Frontend Coverage'
  if: always() # Also generate the report if tests are failing
  uses: hyperse-io/vitest-coverage-reporter@v1
  with:
    name: 'Frontend'
    json-summary-path: './coverage/coverage-summary-frontend.json'
    json-final-path: './coverage/coverage-final-frontend.json
- name: 'Report Backend Coverage'
  if: always() # Also generate the report if tests are failing
  uses: hyperse-io/vitest-coverage-reporter@v1
  with:
    name: 'Backend'
    json-summary-path: './coverage/coverage-summary-backend.json'
    json-final-path: './coverage/coverage-final-backend.json'
```

import minimist from 'minimist';
import * as path from 'path';
import { resolve, join } from 'path';
import * as core5 from '@actions/core';
import { stripIndent, oneLine } from 'common-tags';
import { readFile, writeFile } from 'fs/promises';
import { existsSync, mkdirSync, createWriteStream, readFileSync, promises, constants } from 'fs';
import https from 'https';
import * as github3 from '@actions/github';
import { getPackages } from '@manypkg/get-packages';
import { toString } from 'mdast-util-to-string';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/wrappy/wrappy.js
var require_wrappy = __commonJS({
  "node_modules/wrappy/wrappy.js"(exports, module) {
    module.exports = wrappy;
    function wrappy(fn, cb) {
      if (fn && cb) return wrappy(fn)(cb);
      if (typeof fn !== "function")
        throw new TypeError("need wrapper function");
      Object.keys(fn).forEach(function(k) {
        wrapper[k] = fn[k];
      });
      return wrapper;
      function wrapper() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        var ret = fn.apply(this, args);
        var cb2 = args[args.length - 1];
        if (typeof ret === "function" && ret !== cb2) {
          Object.keys(cb2).forEach(function(k) {
            ret[k] = cb2[k];
          });
        }
        return ret;
      }
    }
  }
});

// node_modules/once/once.js
var require_once = __commonJS({
  "node_modules/once/once.js"(exports, module) {
    var wrappy = require_wrappy();
    module.exports = wrappy(once2);
    module.exports.strict = wrappy(onceStrict);
    once2.proto = once2(function() {
      Object.defineProperty(Function.prototype, "once", {
        value: function() {
          return once2(this);
        },
        configurable: true
      });
      Object.defineProperty(Function.prototype, "onceStrict", {
        value: function() {
          return onceStrict(this);
        },
        configurable: true
      });
    });
    function once2(fn) {
      var f = function() {
        if (f.called) return f.value;
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      f.called = false;
      return f;
    }
    function onceStrict(fn) {
      var f = function() {
        if (f.called)
          throw new Error(f.onceError);
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      var name = fn.name || "Function wrapped with `once`";
      f.onceError = name + " shouldn't be called more than once";
      f.called = false;
      return f;
    }
  }
});

// src/constants.ts
var icons = {
  red: "\u{1F534}",
  green: "\u{1F7E2}",
  blue: "\u{1F535}",
  increase: "\u2B06\uFE0F",
  decrease: "\u2B07\uFE0F",
  equal: "\u{1F7F0}",
  target: "\u{1F3AF}"
};
var COVERAGE_README_MARKER = `<!-- hyperse-vitest-coverage-reporter-marker-readme -->`;
var defaultJsonSummaryPath = "coverage/coverage-summary.json";
var defaultJsonFinalPath = "coverage/coverage-final.json";

// src/inputs/getVitestJsonPath.ts
var getVitestJsonPath = (projectCwd) => {
  const jsonSummaryPath = resolve(
    projectCwd,
    core5.getInput("json-summary-path") || defaultJsonSummaryPath
  );
  const jsonFinalPath = resolve(
    projectCwd,
    core5.getInput("json-final-path") || defaultJsonFinalPath
  );
  const jsonSummaryCompareInput = core5.getInput("json-summary-compare-path");
  let jsonSummaryComparePath = null;
  if (jsonSummaryCompareInput) {
    jsonSummaryComparePath = resolve(projectCwd, jsonSummaryCompareInput);
  }
  return {
    jsonFinalPath,
    jsonSummaryPath,
    jsonSummaryComparePath
  };
};
var parseVitestCoverageReport = async (jsonPath) => {
  const resolvedJsonSummaryPath = resolve(process.cwd(), jsonPath);
  const jsonSummaryRaw = await readFile(resolvedJsonSummaryPath);
  return JSON.parse(jsonSummaryRaw.toString());
};
var parseVitestJsonSummaryReport = async (jsonSummaryPath) => {
  try {
    return await parseVitestCoverageReport(jsonSummaryPath);
  } catch (err) {
    const stack = err instanceof Error ? err.stack : "";
    core5.setFailed(stripIndent`
        Failed to parse the json-summary at path "${jsonSummaryPath}."
        Make sure to run vitest before this action and to include the "json-summary" reporter.

        Original Error:
        ${stack}
    `);
    throw err;
  }
};
var parseVitestJsonFinalReport = async (jsonFinalPath) => {
  try {
    return await parseVitestCoverageReport(jsonFinalPath);
  } catch (err) {
    const stack = err instanceof Error ? err.stack : "";
    core5.warning(stripIndent`
      Failed to parse JSON Final at path "${jsonFinalPath}".
      Line coverage will be empty. To include it, make sure to include the "json" reporter in your vitest execution.

      Original Error:
      ${stack}
    `);
    return {};
  }
};
var generateUrl = (summaryData, summaryKey) => {
  const percentage = summaryData[summaryKey].pct;
  let color = "brightgreen";
  if (percentage < 70) {
    color = "red";
  } else if (percentage < 80) {
    color = "yellow";
  } else if (percentage < 90) {
    color = "orange";
  }
  return `https://img.shields.io/badge/coverage%3A${summaryKey}-${percentage}%25-${color}.svg`;
};
var downloadBadge = (url, filename) => {
  return new Promise((resolve7, reject) => {
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
      file.on("finish", () => {
        file.close();
        resolve7();
      });
      file.on("error", (err) => {
        console.error(`Error saving badge: ${err}`);
        reject(err);
      });
    });
  });
};
var generateBadges = async (options) => {
  const { badgesSavedTo, totalCoverageReport } = options;
  const statementsBadgeUrl = generateUrl(totalCoverageReport, "statements");
  const branchesBadgeUrl = generateUrl(totalCoverageReport, "branches");
  const functionsBadgeUrl = generateUrl(totalCoverageReport, "functions");
  const linesBadgeUrl = generateUrl(totalCoverageReport, "lines");
  if (!existsSync(badgesSavedTo)) {
    mkdirSync(badgesSavedTo);
  }
  await downloadBadge(
    statementsBadgeUrl,
    resolve(badgesSavedTo, "statements.svg")
  );
  await downloadBadge(
    functionsBadgeUrl,
    resolve(badgesSavedTo, "functions.svg")
  );
  await downloadBadge(linesBadgeUrl, resolve(badgesSavedTo, "lines.svg"));
  await downloadBadge(branchesBadgeUrl, resolve(badgesSavedTo, "branches.svg"));
  console.log("Code coverage badges created successfully.");
};

// node_modules/deprecation/dist-web/index.js
var Deprecation = class extends Error {
  constructor(message) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    this.name = "Deprecation";
  }
};

// node_modules/@octokit/request-error/dist-src/index.js
var import_once = __toESM(require_once());
var logOnceCode = (0, import_once.default)((deprecation) => console.warn(deprecation));
var logOnceHeaders = (0, import_once.default)((deprecation) => console.warn(deprecation));
var RequestError = class extends Error {
  constructor(message, statusCode, options) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    this.name = "HttpError";
    this.status = statusCode;
    let headers;
    if ("headers" in options && typeof options.headers !== "undefined") {
      headers = options.headers;
    }
    if ("response" in options) {
      this.response = options.response;
      headers = options.response.headers;
    }
    const requestCopy = Object.assign({}, options.request);
    if (options.request.headers.authorization) {
      requestCopy.headers = Object.assign({}, options.request.headers, {
        authorization: options.request.headers.authorization.replace(
          / .*$/,
          " [REDACTED]"
        )
      });
    }
    requestCopy.url = requestCopy.url.replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]").replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
    this.request = requestCopy;
    Object.defineProperty(this, "code", {
      get() {
        logOnceCode(
          new Deprecation(
            "[@octokit/request-error] `error.code` is deprecated, use `error.status`."
          )
        );
        return statusCode;
      }
    });
    Object.defineProperty(this, "headers", {
      get() {
        logOnceHeaders(
          new Deprecation(
            "[@octokit/request-error] `error.headers` is deprecated, use `error.response.headers`."
          )
        );
        return headers || {};
      }
    });
  }
};
var getGithubToken = () => {
  const gitHubToken = core5.getInput("github-token").trim();
  return gitHubToken;
};

// src/utils/getOctokit.ts
var getOctokit2 = () => {
  const gitHubToken = getGithubToken();
  const octokit = github3.getOctokit(gitHubToken);
  return octokit;
};

// src/inputs/getPullChanges.ts
async function getPullChanges(fileCoverageMode) {
  var _a;
  if (fileCoverageMode === "none" /* None */) {
    return [];
  }
  if (!((_a = github3.context.payload) == null ? void 0 : _a.pull_request)) {
    return [];
  }
  const prNumber = github3.context.payload.pull_request.number;
  try {
    const paths = [];
    const octokit = getOctokit2();
    core5.startGroup(
      `Fetching list of changed files for PR#${prNumber} from Github API`
    );
    const iterator = octokit.paginate.iterator(octokit.rest.pulls.listFiles, {
      owner: github3.context.repo.owner,
      repo: github3.context.repo.repo,
      pull_number: prNumber,
      per_page: 100
    });
    for await (const response of iterator) {
      core5.info(`Received ${response.data.length} items`);
      for (const file of response.data) {
        core5.debug(`[${file.status}] ${file.filename}`);
        if (["added", "modified"].includes(file.status)) {
          paths.push(file.filename);
        }
      }
    }
    return paths;
  } catch (error) {
    if (error instanceof RequestError && (error.status === 404 || error.status === 403)) {
      core5.warning(
        `Couldn't fetch changes of PR due to error:
[${error.name}]
${error.message}`
      );
      return [];
    }
    throw error;
  } finally {
    core5.endGroup();
  }
}
var readJsonFile = (cwd) => {
  const manifest = JSON.parse(
    readFileSync(join(cwd, "package.json"), "utf-8")
  );
  return manifest;
};

// src/utils/isMonoRepo.ts
var isMonoRepo = (cwd = process.cwd()) => {
  const manifest = readJsonFile(cwd);
  const workspaces = extractWorkspaces(manifest);
  return !!workspaces;
};
function extractWorkspaces(manifest) {
  const workspaces = (manifest || {}).workspaces;
  return workspaces && workspaces.packages || (Array.isArray(workspaces) ? workspaces : null);
}

// src/inputs/getWorkspacePackages.ts
async function getWorkspacePackages(cwd) {
  if (!isMonoRepo(cwd)) {
    try {
      const packageJson = readJsonFile(cwd);
      return /* @__PURE__ */ new Map([
        [
          cwd,
          {
            name: packageJson.name,
            version: packageJson.version,
            // always keep relativeDir as empty string for non-monorepo
            relativeDir: ""
          }
        ]
      ]);
    } catch {
      return /* @__PURE__ */ new Map();
    }
  }
  const { packages } = await getPackages(cwd);
  const sortedPackages = packages.map((x) => [
    x.dir,
    {
      name: x.packageJson.name,
      version: x.packageJson.version,
      relativeDir: x.relativeDir
    }
  ]);
  sortedPackages.sort((a, b) => {
    if (a[1].name < b[1].name) {
      return -1;
    }
    if (a[1].name > b[1].name) {
      return 1;
    }
    return 0;
  });
  return new Map(sortedPackages);
}

// src/inputs/getChangedPackages.ts
async function getChangedPackages(repoCwd, includeAllProjects = false) {
  const workspacePackages = await getWorkspacePackages(repoCwd);
  const changedPackages = /* @__PURE__ */ new Set();
  const allChangedFiles = includeAllProjects ? [] : await getPullChanges("all" /* All */);
  core5.debug(`allChangedFiles: ${JSON.stringify(allChangedFiles, null, 2)}`);
  for (const [dir, { name, relativeDir, version }] of workspacePackages) {
    const includeThisProject = includeAllProjects || allChangedFiles.find((s) => !!~s.indexOf(relativeDir));
    core5.info(`package(${name}: ${relativeDir}) is: ${includeThisProject}`);
    if (includeThisProject) {
      changedPackages.add({
        dir,
        relativeDir,
        packageJson: {
          name,
          version
        }
      });
    }
  }
  return [...changedPackages];
}
var testFilePath = async (workingDirectory, filePath) => {
  const resolvedPath = resolve(workingDirectory, filePath);
  await promises.access(resolvedPath, constants.R_OK);
  return resolvedPath;
};
var defaultPaths = [
  "vitest.config.ts",
  "vitest.config.mts",
  "vitest.config.cts",
  "vitest.config.js",
  "vitest.config.mjs",
  "vitest.config.cjs",
  "vite.config.ts",
  "vite.config.mts",
  "vite.config.cts",
  "vite.config.js",
  "vite.config.mjs",
  "vite.config.cjs",
  "vitest.workspace.ts",
  "vitest.workspace.mts",
  "vitest.workspace.cts",
  "vitest.workspace.js",
  "vitest.workspace.mjs",
  "vitest.workspace.cjs"
];
var getViteConfigPath = async (workingDirectory, configPath = "") => {
  try {
    if (configPath === "") {
      return await Promise.any(
        defaultPaths.map((filePath) => testFilePath(workingDirectory, filePath))
      );
    }
    return await testFilePath(workingDirectory, configPath);
  } catch {
    const searchPath = configPath ? resolve(workingDirectory, configPath) : `any default location in "${workingDirectory}"`;
    core5.warning(stripIndent`
          Failed to read vite config file at ${searchPath}.
          Make sure you provide the vite-config-path option if you're using a non-default location or name of your config file.

          Will not include thresholds in the final report.
      `);
    return null;
  }
};
var regex100 = /100"?\s*:\s*true/;
var regexStatements = /statements\s*:\s*(\d+)/;
var regexLines = /lines:\s*(\d+)/;
var regexBranches = /branches\s*:\s*(\d+)/;
var regexFunctions = /functions\s*:\s*(\d+)/;
var parseCoverageThresholds = async (vitestConfigPath) => {
  try {
    const resolvedViteConfigPath = resolve(process.cwd(), vitestConfigPath);
    const rawContent = await readFile(resolvedViteConfigPath, "utf8");
    const has100Value = rawContent.match(regex100);
    if (has100Value) {
      return {
        lines: 100,
        branches: 100,
        functions: 100,
        statements: 100
      };
    }
    const lines = rawContent.match(regexLines);
    const branches = rawContent.match(regexBranches);
    const functions = rawContent.match(regexFunctions);
    const statements = rawContent.match(regexStatements);
    return {
      lines: lines ? Number.parseInt(lines[1]) : void 0,
      branches: branches ? Number.parseInt(branches[1]) : void 0,
      functions: functions ? Number.parseInt(functions[1]) : void 0,
      statements: statements ? Number.parseInt(statements[1]) : void 0
    };
  } catch (err) {
    core5.warning(
      `Could not read vite config file for tresholds due to an error:
 ${err}`
    );
    return {};
  }
};

// src/inputs/getVitestThresholds.ts
var getVitestThresholds = async (projectCwd, viteConfigPath = "") => {
  const finalViteConfigPath = await getViteConfigPath(
    projectCwd,
    viteConfigPath
  );
  const thresholds = finalViteConfigPath ? await parseCoverageThresholds(finalViteConfigPath) : {};
  return thresholds;
};
var generateBlobFileUrl = (relativeFilePath) => {
  const sha = github3.context.payload.pull_request ? github3.context.payload.pull_request.head.sha : github3.context.sha;
  return [
    github3.context.serverUrl,
    github3.context.repo.owner,
    github3.context.repo.repo,
    "blob",
    sha,
    relativeFilePath
  ].join("/");
};

// src/report/getUncoveredLinesFromStatements.ts
var getUncoveredLinesFromStatements = ({
  s,
  statementMap
}) => {
  const keys = Object.keys(statementMap);
  const uncoveredLineRanges = keys.reduce((acc, key) => {
    if (s[key] === 0) {
      const lastRange = acc.at(-1);
      if (lastRange && lastRange.end === statementMap[key].start.line - 1) {
        lastRange.end = statementMap[key].end.line;
        return acc;
      }
      acc.push({
        start: statementMap[key].start.line,
        end: statementMap[key].end.line
      });
    }
    return acc;
  }, []);
  return uncoveredLineRanges;
};

// src/report/generateFileCoverageHtml.ts
var workspacePath = process.cwd();
var generateFileCoverageHtml = ({
  jsonSummary,
  jsonFinal,
  fileCoverageMode,
  pullChanges
}) => {
  const filePaths = Object.keys(jsonSummary).filter((key) => key !== "total");
  const formatFileLine = (filePath) => {
    const coverageSummary = jsonSummary[filePath];
    const lineCoverage = jsonFinal[filePath];
    const uncoveredLines = lineCoverage ? getUncoveredLinesFromStatements(jsonFinal[filePath]) : [];
    const relativeFilePath = path.relative(workspacePath, filePath);
    const url = generateBlobFileUrl(relativeFilePath);
    return `
      <tr>
        <td align="left"><a href="${url}">${relativeFilePath}</a></td>
        <td align="right">${coverageSummary.statements.pct}%</td>
        <td align="right">${coverageSummary.branches.pct}%</td>
        <td align="right">${coverageSummary.functions.pct}%</td>
        <td align="right">${coverageSummary.lines.pct}%</td>
        <td align="left">${createRangeURLs(uncoveredLines, url)}</td>
      </tr>`;
  };
  let reportData = "";
  const [changedFiles, unchangedFiles] = splitFilesByChangeStatus(
    filePaths,
    pullChanges
  );
  if (fileCoverageMode === "changes" /* Changes */ && changedFiles.length === 0) {
    return "No changed files found.";
  }
  if (changedFiles.length > 0) {
    reportData += `
			${formatGroupLine("Changed Files")} 
			${changedFiles.map(formatFileLine).join("")}
		`;
  }
  if (fileCoverageMode === "all" /* All */ && unchangedFiles.length > 0) {
    reportData += `
			${formatGroupLine("Unchanged Files")}
			${unchangedFiles.map(formatFileLine).join("")}
		`;
  }
  return oneLine`
    <table>
      <thead>
        <tr>
         <th align="left">File</th>
         <th align="right">Stmts</th>
         <th align="right">% Branch</th>
         <th align="right">% Funcs</th>
         <th align="right">% Lines</th>
         <th align="left">Uncovered Lines</th>
        </tr>
      </thead>
      <tbody>
      ${reportData}
      </tbody>
    </table>
  `;
};
function formatGroupLine(caption) {
  return `
		<tr>
			<td align="left" colspan="6"><b>${caption}</b></td>
		</tr>
	`;
}
function createRangeURLs(uncoveredLines, url) {
  return uncoveredLines.map((range) => {
    let linkText = `${range.start}`;
    let urlHash = `#L${range.start}`;
    if (range.start !== range.end) {
      linkText += `-${range.end}`;
      urlHash += `-L${range.end}`;
    }
    return `<a href="${url}${urlHash}" class="text-red">${linkText}</a>`;
  }).join(", ");
}
function splitFilesByChangeStatus(filePaths, pullChanges) {
  return filePaths.reduce(
    ([changedFiles, unchangedFiles], filePath) => {
      const comparePath = path.relative(workspacePath, filePath);
      if (pullChanges.includes(comparePath)) {
        changedFiles.push(filePath);
      } else {
        unchangedFiles.push(filePath);
      }
      return [changedFiles, unchangedFiles];
    },
    [[], []]
  );
}

// src/report/generateHeadline.ts
function generateHeadline(options) {
  const relativeDir = options.relativeDir;
  if (options.name && relativeDir) {
    return `Coverage Report for ${options.name} (${relativeDir})`;
  }
  if (options.name) {
    return `Coverage Report for ${options.name}`;
  }
  if (relativeDir) {
    return `Coverage Report for ${relativeDir}`;
  }
  return "Coverage Report";
}
function generateSummaryTableHtml(jsonReport, thresholds = {}, jsonCompareReport = void 0) {
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
					${generateTableRow({ reportNumbers: jsonReport.lines, category: "Lines", threshold: thresholds.lines, reportCompareNumbers: jsonCompareReport == null ? void 0 : jsonCompareReport.lines })}
				</tr>
				<tr>
					${generateTableRow({ reportNumbers: jsonReport.statements, category: "Statements", threshold: thresholds.statements, reportCompareNumbers: jsonCompareReport == null ? void 0 : jsonCompareReport.statements })}
				</tr>
				<tr>
					${generateTableRow({ reportNumbers: jsonReport.functions, category: "Functions", threshold: thresholds.functions, reportCompareNumbers: jsonCompareReport == null ? void 0 : jsonCompareReport.functions })}
				</tr>
				<tr>
					${generateTableRow({ reportNumbers: jsonReport.branches, category: "Branches", threshold: thresholds.branches, reportCompareNumbers: jsonCompareReport == null ? void 0 : jsonCompareReport.branches })}
				</tr>
			</tbody>
		</table>
	`;
}
function generateTableRow({
  reportNumbers,
  category,
  threshold,
  reportCompareNumbers
}) {
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
function getCompareString(percentDiff) {
  if (percentDiff === 0) {
    return `${icons.equal} <em>\xB10%</em>`;
  }
  if (percentDiff > 0) {
    return `${icons.increase} <em>+${percentDiff.toFixed(2)}%</em>`;
  }
  return `${icons.decrease} <em>${percentDiff.toFixed(2)}%</em>`;
}

// src/report/generateCoverageSummary.ts
var generateCoverageSummary = async (options) => {
  const changedPackages = await getChangedPackages(
    options.repoCwd,
    options.includeAllProjects
  );
  const summary2 = !options.hideHeadline ? core5.summary.addHeading(
    generateHeadline({
      name: options.name,
      relativeDir: ""
    }),
    2
  ) : core5.summary;
  for (const packageItem of changedPackages) {
    const projectCwd = packageItem.dir;
    core5.info(`generating coverage summary from: ${projectCwd}`);
    const { jsonSummaryPath, jsonSummaryComparePath, jsonFinalPath } = getVitestJsonPath(projectCwd);
    if (!existsSync(jsonSummaryPath)) {
      core5.warning(`No summary report json file found, skip ${projectCwd}`);
      continue;
    }
    const jsonSummary = await parseVitestJsonSummaryReport(jsonSummaryPath);
    const thresholds = await getVitestThresholds(projectCwd);
    let jsonSummaryCompare;
    if (jsonSummaryComparePath) {
      jsonSummaryCompare = await parseVitestJsonSummaryReport(
        jsonSummaryComparePath
      );
    }
    if (packageItem.relativeDir) {
      summary2.addHeading(
        generateHeadline({
          name: options.name,
          relativeDir: packageItem.relativeDir
        }),
        2
      );
    }
    const tableData = generateSummaryTableHtml(
      jsonSummary.total,
      thresholds,
      jsonSummaryCompare == null ? void 0 : jsonSummaryCompare.total
    );
    summary2.addRaw(tableData);
    if (options.fileCoverageMode !== "none" /* None */) {
      const pullChanges = await getPullChanges(options.fileCoverageMode);
      const jsonFinal = await parseVitestJsonFinalReport(jsonFinalPath);
      const fileTable = generateFileCoverageHtml({
        jsonSummary,
        jsonFinal,
        fileCoverageMode: options.fileCoverageMode,
        pullChanges
      });
      summary2.addDetails("File Coverage", fileTable);
    }
  }
  try {
    summary2.addRaw(
      `<em>Generated in workflow <a href=${getWorkflowSummaryURL()}>#${github3.context.runNumber}</a></em>`
    );
  } catch {
  }
  return summary2;
};
function getWorkflowSummaryURL() {
  const { owner, repo } = github3.context.repo;
  const { runId } = github3.context;
  return `${github3.context.serverUrl}/${owner}/${repo}/actions/runs/${runId}`;
}
function updateReadmeEntry(readme, readmeUpdateBody) {
  const ast = unified().use(remarkParse).parse(readme);
  const updatedast = unified().use(remarkParse).parse(readmeUpdateBody);
  const nodes = ast.children;
  let headingStartInfo;
  let endIndex;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.type === "html") {
      const stringified = toString(node);
      if (headingStartInfo === void 0 && stringified === COVERAGE_README_MARKER) {
        headingStartInfo = {
          index: i
        };
        continue;
      }
      if (endIndex === void 0 && headingStartInfo !== void 0) {
        endIndex = i;
        break;
      }
    }
  }
  if (headingStartInfo && endIndex) {
    ast.children.splice(
      headingStartInfo.index,
      endIndex - headingStartInfo.index + 1,
      ...updatedast.children
    );
  } else {
    ast.children.splice(2, 0, ...updatedast.children);
  }
  return {
    content: unified().use(remarkStringify).stringify(ast)
  };
}

// src/utils/writeSummaryToReadMe.ts
var writeSummaryToReadMe = async (cwd, summary2, headline) => {
  const readmeUpdateBody = `${COVERAGE_README_MARKER}

${headline}

${summary2.stringify()}`;
  const readmeFile = join(cwd, "README.md");
  if (existsSync(readmeFile)) {
    const readmeContents = await readFile(readmeFile, "utf8");
    const entry = updateReadmeEntry(readmeContents, readmeUpdateBody);
    await writeFile(readmeFile, entry.content);
  } else {
    core5.warning(`No README.md found in ${cwd}`);
  }
};

// src/main.mts
var main = async (args) => {
  const argv = minimist(args, {
    "--": true,
    alias: {
      p: "path"
    },
    default: {
      p: "coverage/badges",
      type: ["badges"],
      projectCwd: process.cwd()
    }
  });
  const cwd = argv.projectCwd || process.cwd();
  const badgesSavedTo = resolve(cwd, argv.path);
  const { jsonSummaryPath } = getVitestJsonPath(cwd);
  const jsonSummary = await parseVitestJsonSummaryReport(jsonSummaryPath);
  const types = Array.isArray(argv.type) ? argv.type : [argv.type];
  for (const type of types) {
    if (type === "badges") {
      await generateBadges({
        badgesSavedTo,
        totalCoverageReport: jsonSummary.total
      });
    } else if (type === "readme") {
      const summary2 = await generateCoverageSummary({
        name: "",
        fileCoverageMode: "none" /* None */,
        repoCwd: cwd,
        hideHeadline: true,
        includeAllProjects: true
      });
      await writeSummaryToReadMe(cwd, summary2, "## Coverage Report");
    }
  }
};

export { main };
//# sourceMappingURL=main.mjs.map
//# sourceMappingURL=main.mjs.map
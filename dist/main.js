import Q from 'minimist';
import * as p from 'path';
import p__default, { resolve } from 'path';
import { stripIndent } from 'common-tags';
import { readFile } from 'fs/promises';
import * as i from '@actions/core';
import { existsSync, mkdirSync, promises, createWriteStream, constants } from 'fs';
import K from 'https';

var O=async r=>{let e=p__default.resolve(process.cwd(),r),t=await readFile(e);return JSON.parse(t.toString())},h=async r=>{try{return await O(r)}catch(e){let t=e instanceof Error?e.stack:"";throw i.setFailed(stripIndent`
        Failed to parse the json-summary at path "${r}."
        Make sure to run vitest before this action and to include the "json-summary" reporter.

        Original Error:
        ${t}
    `),e}};var y=(o=>(o.All="all",o.Changes="changes",o.None="none",o))(y||{});function w(r){return Object.values(y).indexOf(r)===-1?(i.warning(`Not valid value "${r}" for summary mode, used "changes"`),"changes"):r}var b=async(r,e)=>{let t=p__default.resolve(r,e);return await promises.access(t,constants.R_OK),t},V=["vitest.config.ts","vitest.config.mts","vitest.config.cts","vitest.config.js","vitest.config.mjs","vitest.config.cjs","vite.config.ts","vite.config.mts","vite.config.cts","vite.config.js","vite.config.mjs","vite.config.cjs","vitest.workspace.ts","vitest.workspace.mts","vitest.workspace.cts","vitest.workspace.js","vitest.workspace.mjs","vitest.workspace.cjs"],S=async(r,e)=>{try{return e===""?await Promise.any(V.map(t=>b(r,t))):await b(r,e)}catch{let t=e?p__default.resolve(r,e):`any default location in "${r}"`;return i.warning(stripIndent`
          Failed to read vite config file at ${t}.
          Make sure you provide the vite-config-path option if you're using a non-default location or name of your config file.

          Will not include thresholds in the final report.
      `),null}};var A=/100"?\s*:\s*true/,G=/statements\s*:\s*(\d+)/,L=/lines:\s*(\d+)/,W=/branches\s*:\s*(\d+)/,q=/functions\s*:\s*(\d+)/,P=async r=>{try{let e=p__default.resolve(process.cwd(),r),t=await promises.readFile(e,"utf8");if(t.match(A))return {lines:100,branches:100,functions:100,statements:100};let n=t.match(L),a=t.match(W),s=t.match(q),m=t.match(G);return {lines:n?Number.parseInt(n[1]):void 0,branches:a?Number.parseInt(a[1]):void 0,functions:s?Number.parseInt(s[1]):void 0,statements:m?Number.parseInt(m[1]):void 0}}catch(e){return i.warning(`Could not read vite config file for tresholds due to an error:
 ${e}`),{}}};async function k(){let r=i.getInput("working-directory"),e=i.getInput("file-coverage-mode"),t=w(e),o=p.resolve(r,i.getInput("json-summary-path")||"coverage/coverage-summary.json"),n=p.resolve(r,i.getInput("json-final-path")||"coverage/coverage-final.json"),a=i.getInput("json-summary-compare-path"),s=null;a&&(s=p.resolve(r,a));let m=i.getInput("name"),I=i.getInput("pr-number"),c=Number(I);(!Number.isSafeInteger(c)||c<=0)&&(c=void 0),c&&i.info(`Received pull-request number: ${c}`);let d=await S(r,i.getInput("vite-config-path")),J=d?await P(d):{};return {fileCoverageMode:t,jsonFinalPath:n,jsonSummaryPath:o,jsonSummaryComparePath:s,name:m,thresholds:J,workingDirectory:r,processedPrNumber:c}}var l=(r,e)=>{let t=r[e].pct,o="brightgreen";return t<70?o="red":t<80?o="yellow":t<90&&(o="orange"),`https://img.shields.io/badge/coverage%3A${e}-${t}%25-${o}.svg`},u=(r,e)=>new Promise((t,o)=>{K.get(r,n=>{if(n.statusCode!==200){let s=new Error(`Error downloading badge: ${n.statusMessage}`);return console.error(s),o(s)}let a=createWriteStream(e);n.pipe(a),a.on("finish",()=>{a.close(),t();}),a.on("error",s=>{console.error(`Error saving badge: ${s}`),o(s);});});}),F=async r=>{let{badgesSavedTo:e,totalCoverageReport:t}=r,o=l(t,"statements"),n=l(t,"branches"),a=l(t,"functions"),s=l(t,"lines");existsSync(e)||mkdirSync(e),await u(o,resolve(e,"statements.svg")),await u(a,resolve(e,"functions.svg")),await u(s,resolve(e,"lines.svg")),await u(n,resolve(e,"branches.svg")),console.log("Code coverage badges created successfully.");};var je=async r=>{let e=Q(r,{"--":!0,alias:{p:"path"},default:{p:"coverage/badges"}}),t=resolve(process.cwd(),e.path),{jsonSummaryPath:o}=await k(),n=await h(o);return F({badgesSavedTo:t,totalCoverageReport:n.total})};

export { je as main };
//# sourceMappingURL=main.js.map
//# sourceMappingURL=main.js.map
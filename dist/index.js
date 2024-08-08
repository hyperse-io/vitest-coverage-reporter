import * as l from '@actions/core';
import * as c from '@actions/github';
import { stripIndent, oneLine } from 'common-tags';
import { readFile } from 'fs/promises';
import * as P from 'path';
import P__default from 'path';
import { promises, constants } from 'fs';

var pe=Object.create;var J=Object.defineProperty;var ge=Object.getOwnPropertyDescriptor;var fe=Object.getOwnPropertyNames;var de=Object.getPrototypeOf,he=Object.prototype.hasOwnProperty;var I=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var ye=(e,t,r,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of fe(t))!he.call(e,n)&&n!==r&&J(e,n,{get:()=>t[n],enumerable:!(o=ge(t,n))||o.enumerable});return e};var be=(e,t,r)=>(r=e!=null?pe(de(e)):{},ye(!e||!e.__esModule?J(r,"default",{value:e,enumerable:!0}):r,e));var D=I((ze,H)=>{H.exports=L;function L(e,t){if(e&&t)return L(e)(t);if(typeof e!="function")throw new TypeError("need wrapper function");return Object.keys(e).forEach(function(o){r[o]=e[o];}),r;function r(){for(var o=new Array(arguments.length),n=0;n<o.length;n++)o[n]=arguments[n];var s=e.apply(this,o),i=o[o.length-1];return typeof s=="function"&&s!==i&&Object.keys(i).forEach(function(a){s[a]=i[a];}),s}}});var U=I((Ke,O)=>{var A=D();O.exports=A(R);O.exports.strict=A(M);R.proto=R(function(){Object.defineProperty(Function.prototype,"once",{value:function(){return R(this)},configurable:!0}),Object.defineProperty(Function.prototype,"onceStrict",{value:function(){return M(this)},configurable:!0});});function R(e){var t=function(){return t.called?t.value:(t.called=!0,t.value=e.apply(this,arguments))};return t.called=!1,t}function M(e){var t=function(){if(t.called)throw new Error(t.onceError);return t.called=!0,t.value=e.apply(this,arguments)},r=e.name||"Function wrapped with `once`";return t.onceError=r+" shouldn't be called more than once",t.called=!1,t}});var x=class extends Error{constructor(t){super(t),Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor),this.name="Deprecation";}};var N=be(U()),we=(0, N.default)(e=>console.warn(e)),ve=(0, N.default)(e=>console.warn(e)),$=class extends Error{constructor(t,r,o){super(t),Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor),this.name="HttpError",this.status=r;let n;"headers"in o&&typeof o.headers<"u"&&(n=o.headers),"response"in o&&(this.response=o.response,n=o.response.headers);let s=Object.assign({},o.request);o.request.headers.authorization&&(s.headers=Object.assign({},o.request.headers,{authorization:o.request.headers.authorization.replace(/ .*$/," [REDACTED]")})),s.url=s.url.replace(/\bclient_secret=\w+/g,"client_secret=[REDACTED]").replace(/\baccess_token=\w+/g,"access_token=[REDACTED]"),this.request=s,Object.defineProperty(this,"code",{get(){return we(new x("[@octokit/request-error] `error.code` is deprecated, use `error.status`.")),r}}),Object.defineProperty(this,"headers",{get(){return ve(new x("[@octokit/request-error] `error.headers` is deprecated, use `error.response.headers`.")),n||{}}});}};var k=(o=>(o.All="all",o.Changes="changes",o.None="none",o))(k||{});function B(e){return Object.values(k).indexOf(e)===-1?(l.warning(`Not valid value "${e}" for summary mode, used "changes"`),"changes"):e}async function G(e){if(e==="none")return [];if(!c.context.payload?.pull_request)return [];let t=l.getInput("github-token").trim(),r=c.context.payload.pull_request.number;try{let o=c.getOctokit(t),n=[];l.startGroup(`Fetching list of changed files for PR#${r} from Github API`);let s=o.paginate.iterator(o.rest.pulls.listFiles,{owner:c.context.repo.owner,repo:c.context.repo.repo,pull_number:r,per_page:100});for await(let i of s){l.info(`Received ${i.data.length} items`);for(let a of i.data)l.debug(`[${a.status}] ${a.filename}`),["added","modified"].includes(a.status)&&n.push(a.filename);}return n}catch(o){if(o instanceof $&&(o.status===404||o.status===403))return l.warning(`Couldn't fetch changes of PR due to error:
[${o.name}]
${o.message}`),[];throw o}finally{l.endGroup();}}var z=async e=>{let t=P__default.resolve(process.cwd(),e),r=await readFile(t);return JSON.parse(r.toString())},E=async e=>{try{return await z(e)}catch(t){let r=t instanceof Error?t.stack:"";throw l.setFailed(stripIndent`
        Failed to parse the json-summary at path "${e}."
        Make sure to run vitest before this action and to include the "json-summary" reporter.

        Original Error:
        ${r}
    `),t}},K=async e=>{try{return await z(e)}catch(t){let r=t instanceof Error?t.stack:"";return l.warning(stripIndent`
      Failed to parse JSON Final at path "${e}".
      Line coverage will be empty. To include it, make sure to include the "json" reporter in your vitest execution.

      Original Error:
      ${r}
    `),{}}};var Q=async(e,t)=>{let r=P__default.resolve(e,t);return await promises.access(r,constants.R_OK),r},Se=["vitest.config.ts","vitest.config.mts","vitest.config.cts","vitest.config.js","vitest.config.mjs","vitest.config.cjs","vite.config.ts","vite.config.mts","vite.config.cts","vite.config.js","vite.config.mjs","vite.config.cjs","vitest.workspace.ts","vitest.workspace.mts","vitest.workspace.cts","vitest.workspace.js","vitest.workspace.mjs","vitest.workspace.cjs"],Z=async(e,t)=>{try{return t===""?await Promise.any(Se.map(r=>Q(e,r))):await Q(e,t)}catch{let r=t?P__default.resolve(e,t):`any default location in "${e}"`;return l.warning(stripIndent`
          Failed to read vite config file at ${r}.
          Make sure you provide the vite-config-path option if you're using a non-default location or name of your config file.

          Will not include thresholds in the final report.
      `),null}};var Pe=/100"?\s*:\s*true/,qe=/statements\s*:\s*(\d+)/,Te=/lines:\s*(\d+)/,Oe=/branches\s*:\s*(\d+)/,Ne=/functions\s*:\s*(\d+)/,te=async e=>{try{let t=P__default.resolve(process.cwd(),e),r=await promises.readFile(t,"utf8");if(r.match(Pe))return {lines:100,branches:100,functions:100,statements:100};let n=r.match(Te),s=r.match(Oe),i=r.match(Ne),a=r.match(qe);return {lines:n?Number.parseInt(n[1]):void 0,branches:s?Number.parseInt(s[1]):void 0,functions:i?Number.parseInt(i[1]):void 0,statements:a?Number.parseInt(a[1]):void 0}}catch(t){return l.warning(`Could not read vite config file for tresholds due to an error:
 ${t}`),{}}};async function re(){let e=l.getInput("working-directory"),t=l.getInput("file-coverage-mode"),r=B(t),o=P.resolve(e,l.getInput("json-summary-path")||"coverage/coverage-summary.json"),n=P.resolve(e,l.getInput("json-final-path")||"coverage/coverage-final.json"),s=l.getInput("json-summary-compare-path"),i=null;s&&(i=P.resolve(e,s));let a=l.getInput("name"),y=l.getInput("pr-number"),u=Number(y);(!Number.isSafeInteger(u)||u<=0)&&(u=void 0),u&&l.info(`Received pull-request number: ${u}`);let f=await Z(e,l.getInput("vite-config-path")),b=f?await te(f):{};return {fileCoverageMode:r,jsonFinalPath:n,jsonSummaryPath:o,jsonSummaryComparePath:i,name:a,thresholds:b,workingDirectory:e,processedPrNumber:u}}var oe=e=>{let t=c.context.payload.pull_request?c.context.payload.pull_request.head.sha:c.context.sha;return [c.context.serverUrl,c.context.repo.owner,c.context.repo.repo,"blob",t,e].join("/")};var ne=({s:e,statementMap:t})=>Object.keys(t).reduce((n,s)=>{if(e[s]===0){let i=n.at(-1);if(i&&i.end===t[s].start.line-1)return i.end=t[s].end.line,n;n.push({start:t[s].start.line,end:t[s].end.line});}return n},[]);var ie=process.cwd(),ae=({jsonSummary:e,jsonFinal:t,fileCoverageMode:r,pullChanges:o})=>{let n=Object.keys(e).filter(u=>u!=="total"),s=u=>{let f=e[u],g=t[u]?ne(t[u]):[],F=P.relative(ie,u),S=oe(F);return `
      <tr>
        <td align="left"><a href="${S}">${F}</a></td>
        <td align="right">${f.statements.pct}%</td>
        <td align="right">${f.branches.pct}%</td>
        <td align="right">${f.functions.pct}%</td>
        <td align="right">${f.lines.pct}%</td>
        <td align="left">${_e(g,S)}</td>
      </tr>`},i="",[a,y]=Je(n,o);return r==="changes"&&a.length===0?"No changed files found.":(a.length>0&&(i+=`
			${se("Changed Files")} 
			${a.map(s).join("")}
		`),r==="all"&&y.length>0&&(i+=`
			${se("Unchanged Files")}
			${y.map(s).join("")}
		`),oneLine`
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
      ${i}
      </tbody>
    </table>
  `)};function se(e){return `
		<tr>
			<td align="left" colspan="6"><b>${e}</b></td>
		</tr>
	`}function _e(e,t){return e.map(r=>{let o=`${r.start}`,n=`#L${r.start}`;return r.start!==r.end&&(o+=`-${r.end}`,n+=`-L${r.end}`),`<a href="${t}${n}" class="text-red">${o}</a>`}).join(", ")}function Je(e,t){return e.reduce(([r,o],n)=>{let s=P.relative(ie,n);return t.includes(s)?r.push(n):o.push(n),[r,o]},[[],[]])}function ce(e){return e.name&&e.workingDirectory!=="./"?`Coverage Report for ${e.name} (${e.workingDirectory})`:e.name?`Coverage Report for ${e.name}`:e.workingDirectory!=="./"?`Coverage Report for ${e.workingDirectory}`:"Coverage Report"}var d={red:"\u{1F534}",green:"\u{1F7E2}",blue:"\u{1F535}",increase:"\u2B06\uFE0F",decrease:"\u2B07\uFE0F",equal:"\u{1F7F0}",target:"\u{1F3AF}"};function ue(e,t={},r=void 0){return oneLine`
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
					${q({reportNumbers:e.lines,category:"Lines",threshold:t.lines,reportCompareNumbers:r?.lines})}
				</tr>
				<tr>
					${q({reportNumbers:e.statements,category:"Statements",threshold:t.statements,reportCompareNumbers:r?.statements})}
				</tr>
				<tr>
					${q({reportNumbers:e.functions,category:"Functions",threshold:t.functions,reportCompareNumbers:r?.functions})}
				</tr>
				<tr>
					${q({reportNumbers:e.branches,category:"Branches",threshold:t.branches,reportCompareNumbers:r?.branches})}
				</tr>
			</tbody>
		</table>
	`}function q({reportNumbers:e,category:t,threshold:r,reportCompareNumbers:o}){let n=d.blue,s=`${e.pct}%`;if(r&&(s=`${s} (${d.target} ${r}%)`,n=e.pct>=r?d.green:d.red),o){let i=e.pct-o.pct,a=Le(i);s=`${s}<br/>${a}`;}return `
    <td align="center">${n}</td>
    <td align="left">${t}</td>
		<td align="right">${s}</td>
    <td align="right">${e.covered} / ${e.total}</td>
  `}function Le(e){return e===0?`${d.equal} <em>\xB10%</em>`:e>0?`${d.increase} <em>+${e.toFixed(2)}%</em>`:`${d.decrease} <em>${e.toFixed(2)}%</em>`}var He=l.getInput("github-token").trim(),T=c.getOctokit(He),le=(e="root")=>`<!-- vitest-coverage-report-marker-${e} -->`,me=async({summary:e,markerPostfix:t,userDefinedPrNumber:r})=>{let o=r;if(o||(o=c.context.payload.pull_request?.number,c.context.eventName==="workflow_run"&&(o=await Ae(T))),!o){l.info("No pull-request-number found. Skipping comment creation.");return}let n=`${e.stringify()}

${le(t)}`,s=await De(T,le(t),o);s?await T.rest.issues.updateComment({owner:c.context.repo.owner,repo:c.context.repo.repo,comment_id:s.id,body:n}):await T.rest.issues.createComment({owner:c.context.repo.owner,repo:c.context.repo.repo,issue_number:o,body:n});};async function De(e,t,r){let o=e.paginate.iterator(e.rest.issues.listComments,{owner:c.context.repo.owner,repo:c.context.repo.repo,issue_number:r});for await(let{data:n}of o){let s=n.find(i=>i.body?.includes(t));if(s)return s}}async function Ae(e){if(l.info("Trying to get the triggering workflow in order to find the pull-request-number to comment the results on..."),!c.context.payload.workflow_run){l.info("The triggering workflow does not have a workflow_run payload. Skipping comment creation.");return}let t=c.context.payload.workflow_run.id,{data:r}=await e.rest.actions.getWorkflowRun({owner:c.context.repo.owner,repo:c.context.repo.repo,run_id:t});if(r.event!=="pull_request"){l.info("The triggering workflow is not a pull-request. Skipping comment creation.");return}if(r.pull_requests&&r.pull_requests.length>0)return r.pull_requests[0].number;l.info(`Trying to find the pull-request for the triggering workflow run with id: ${t} (${r.url}) with HEAD_SHA ${r.head_sha}...`);let o=await Me(e,r.head_sha);if(!o){l.info("Could not find the pull-request for the triggering workflow run. Skipping comment creation.");return}return o.number}async function Me(e,t){l.startGroup("Querying REST API for Pull-Requests.");let r=e.paginate.iterator(e.rest.pulls.list,{owner:c.context.repo.owner,repo:c.context.repo.repo,per_page:30});for await(let{data:o}of r){l.info(`Found ${o.length} pull-requests in this page.`);for(let n of o)if(l.debug(`Comparing: ${n.number} sha: ${n.head.sha} with expected: ${t}.`),n.head.sha===t)return n}l.endGroup();}var Ue=async()=>{let{fileCoverageMode:e,jsonFinalPath:t,jsonSummaryPath:r,jsonSummaryComparePath:o,name:n,thresholds:s,workingDirectory:i,processedPrNumber:a}=await re(),y=await E(r),u;o&&(u=await E(o));let f=ue(y.total,s,u?.total),b=l.summary.addHeading(ce({workingDirectory:i,name:n}),2).addRaw(f);if(e!=="none"){let g=await G(e),F=await K(t),S=ae({jsonSummary:y,jsonFinal:F,fileCoverageMode:e,pullChanges:g});b.addDetails("File Coverage",S);}b.addRaw(`<em>Generated in workflow <a href=${Be()}>#${c.context.runNumber}</a></em>`);try{await me({summary:b,markerPostfix:Ve({name:n,workingDirectory:i}),userDefinedPrNumber:a});}catch(g){if(g instanceof $&&(g.status===404||g.status===403))l.warning(`Couldn't write a comment to the pull-request. Please make sure your job has the permission 'pull-request: write'.
				 Original Error was: [${g.name}] - ${g.message}
				`);else throw g}await b.write();};function Ve({name:e,workingDirectory:t}){return e||(t!=="./"?t:"root")}function Be(){let{owner:e,repo:t}=c.context.repo,{runId:r}=c.context;return `${c.context.serverUrl}/${e}/${t}/actions/runs/${r}`}Ue().then(()=>{l.info("Report generated successfully.");}).catch(e=>{l.error(e);});
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
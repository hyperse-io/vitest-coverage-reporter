import * as core from '@actions/core';
import { RequestError } from '@octokit/request-error';
import { readOptions } from './inputs/readOptions.js';
import { generateCoverageSummary } from './report/generateCoverageSummary.js';
import { writeSummaryToPR } from './utils/writeSummaryToPR.js';

function getMarkerPostfix({
  name,
  repoCwd,
}: {
  name: string;
  repoCwd: string;
}) {
  if (name) return name;
  if (repoCwd !== './') return repoCwd;
  return 'root';
}

const run = async () => {
  const { name, processedPrNumber, repoCwd, fileCoverageMode } =
    await readOptions();

  const summary = await generateCoverageSummary({
    name,
    repoCwd,
    fileCoverageMode,
  });

  try {
    const markerPostfix = getMarkerPostfix({ name, repoCwd });
    await writeSummaryToPR({
      summary,
      markerPostfix,
      userDefinedPrNumber: processedPrNumber,
    });
  } catch (error) {
    if (
      error instanceof RequestError &&
      (error.status === 404 || error.status === 403)
    ) {
      core.warning(
        `Couldn't write a comment to the pull-request. Please make sure your job has the permission 'pull-request: write'.
				 Original Error was: [${error.name}] - ${error.message}
				`
      );
    } else {
      // Rethrow to handle it in the catch block of the run()-call.
      throw error;
    }
  }

  await summary.write();
};

run()
  .then(() => {
    core.info('Report generated successfully.');
  })
  .catch((err) => {
    core.error(err);
  });

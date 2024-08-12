import { Thresholds } from '../types/Threshold.js';
import { getViteConfigPath } from './getViteConfigPath.js';
import { parseCoverageThresholds } from './parseCoverageThresholds.js';

export const getVitestThresholds = async (
  projectCwd: string,
  viteConfigPath: string = ''
): Promise<Thresholds> => {
  // ViteConfig is optional, as it is only required for thresholds. If no vite config is provided, we will not include thresholds in the final report.
  const finalViteConfigPath = await getViteConfigPath(
    projectCwd,
    viteConfigPath
  );

  const thresholds = finalViteConfigPath
    ? await parseCoverageThresholds(finalViteConfigPath)
    : {};
  return thresholds;
};

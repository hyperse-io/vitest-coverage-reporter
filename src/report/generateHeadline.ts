type HeadlineArgs = {
  name?: string;
  relativeDir?: string;
};

export function generateHeadline(options: HeadlineArgs) {
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

  return 'Coverage Report';
}

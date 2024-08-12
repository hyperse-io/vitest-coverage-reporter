import { describe, expect, it } from 'vitest';
import { generateHeadline } from '../../src/report/generateHeadline.js';

describe('generateHeadline()', () => {
  it('returns only static headline if no name and no working-directory is provided.', () => {
    const headline = generateHeadline({
      name: '',
      relativeDir: '',
    });

    expect(headline).toEqual('Coverage Report');
  });

  it('adds name to headline if only name is provided.', () => {
    const headline = generateHeadline({
      name: 'My Project',
      relativeDir: '',
    });

    expect(headline).toEqual('Coverage Report for My Project');
  });

  it('adds working-directory to headline if only working-directory is provided.', () => {
    const headline = generateHeadline({
      name: '',
      relativeDir: 'path/to/project',
    });

    expect(headline).toEqual('Coverage Report for path/to/project');
  });

  it('adds name and working-directory in parentheses to headline if both are provided.', () => {
    const headline = generateHeadline({
      name: 'My Project',
      relativeDir: 'path/to/project',
    });

    expect(headline).toEqual(
      'Coverage Report for My Project (path/to/project)'
    );
  });
});

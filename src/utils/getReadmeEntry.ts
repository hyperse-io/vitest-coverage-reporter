import { toString } from 'mdast-util-to-string';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';

export const README_MARKER_START = `<!-- hyperse-vitest-coverage-reporter-marker-readme-start -->`;
export const README_MARKER_END = `<!-- hyperse-vitest-coverage-reporter-marker-readme-end -->`;

export function getReadmeEntry(readme: string) {
  const ast = unified().use(remarkParse).parse(readme);

  const nodes = ast.children;
  let headingStartInfo:
    | {
        index: number;
      }
    | undefined;

  let headingEndInfo:
    | {
        index: number;
      }
    | undefined;

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.type === 'html') {
      const stringified: string = toString(node);
      if (
        headingStartInfo === undefined &&
        stringified === README_MARKER_START
      ) {
        headingStartInfo = {
          index: i,
        };
        continue;
      }

      if (headingEndInfo === undefined && stringified === README_MARKER_END) {
        headingEndInfo = {
          index: i,
        };
        break;
      }
    }
  }
  if (headingStartInfo && headingEndInfo) {
    ast.children = ast.children.slice(
      headingStartInfo.index + 1,
      headingEndInfo.index
    );
  }
  return {
    content: unified().use(remarkStringify).stringify(ast),
  };
}

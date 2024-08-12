import { toString } from 'mdast-util-to-string';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import { COVERAGE_README_MARKER } from '../constants.js';

export function updateReadmeEntry(readme: string, readmeUpdateBody: string) {
  const ast = unified().use(remarkParse).parse(readme);
  const updatedast = unified().use(remarkParse).parse(readmeUpdateBody);

  const nodes = ast.children;
  let headingStartInfo:
    | {
        index: number;
      }
    | undefined;
  let endIndex: number | undefined;

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.type === 'html') {
      const stringified: string = toString(node);
      if (
        headingStartInfo === undefined &&
        stringified === COVERAGE_README_MARKER
      ) {
        headingStartInfo = {
          index: i,
        };
        continue;
      }
      if (endIndex === undefined && headingStartInfo !== undefined) {
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
    content: unified().use(remarkStringify).stringify(ast),
  };
}

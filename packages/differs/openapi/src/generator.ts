import * as fs from 'node:fs';
import openapiDiff, { type DiffOutcome } from 'openapi-diff';

interface DiffResult {
  version: 'minor' | 'major' | 'patch' | 'unchanged';
  diff: DiffOutcome | null;
}

export async function diffSpecs(
  destinationSpecPath: string,
  sourceSpecPath: string
): Promise<DiffResult> {
  const diff = await openapiDiff.diffSpecs({
    destinationSpec: {
      content: fs.readFileSync(destinationSpecPath, 'utf-8'),
      location: destinationSpecPath,
      format: 'openapi3',
    },
    sourceSpec: {
      content: fs.readFileSync(sourceSpecPath, 'utf-8'),
      location: sourceSpecPath,
      format: 'openapi3',
    },
  });

  if (diff.breakingDifferencesFound) {
    return { version: 'major', diff: diff };
  }

  if (diff.unclassifiedDifferences.length === 0 && diff.nonBreakingDifferences.length === 0) {
    return { version: 'unchanged', diff: null };
  }

  return { version: 'minor', diff: diff };
}

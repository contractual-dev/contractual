/**
 * OpenAPI Differ using openapi-diff (native Node.js)
 *
 * Pure Node.js library for detecting breaking changes in OpenAPI specs.
 * No binary dependencies required.
 *
 * @see https://www.npmjs.com/package/openapi-diff
 */

import { readFile } from 'node:fs/promises';
import type { DiffResult, Change, ChangeSeverity } from '@contractual/types';
import openapiDiff from 'openapi-diff';

// Types from openapi-diff
type DiffResultType = 'breaking' | 'non-breaking' | 'unclassified';

interface DiffResultSpecEntityDetails {
  location: string;
  value?: unknown;
}

interface OpenApiDiffResult<T extends DiffResultType> {
  action: 'add' | 'remove';
  code: string;
  entity: string;
  sourceSpecEntityDetails: DiffResultSpecEntityDetails[];
  destinationSpecEntityDetails: DiffResultSpecEntityDetails[];
  source: string;
  type: T;
}

interface DiffOutcomeSuccess {
  breakingDifferencesFound: false;
  nonBreakingDifferences: OpenApiDiffResult<'non-breaking'>[];
  unclassifiedDifferences: OpenApiDiffResult<'unclassified'>[];
}

interface DiffOutcomeFailure {
  breakingDifferencesFound: true;
  breakingDifferences: OpenApiDiffResult<'breaking'>[];
  nonBreakingDifferences: OpenApiDiffResult<'non-breaking'>[];
  unclassifiedDifferences: OpenApiDiffResult<'unclassified'>[];
}

type DiffOutcome = DiffOutcomeSuccess | DiffOutcomeFailure;

/**
 * Diff two OpenAPI specifications using openapi-diff
 */
export async function diffOpenAPI(oldSpecPath: string, newSpecPath: string): Promise<DiffResult> {
  const oldContent = await readSpecFile(oldSpecPath);
  const newContent = await readSpecFile(newSpecPath);

  const result = await openapiDiff.diffSpecs({
    sourceSpec: {
      content: oldContent,
      location: oldSpecPath,
      format: detectFormat(oldContent),
    },
    destinationSpec: {
      content: newContent,
      location: newSpecPath,
      format: detectFormat(newContent),
    },
  });

  return parseResult(result);
}

/**
 * Diff two OpenAPI spec objects directly (no file I/O)
 */
export async function diffOpenAPIObjects(oldSpec: object, newSpec: object): Promise<DiffResult> {
  const oldContent = JSON.stringify(oldSpec);
  const newContent = JSON.stringify(newSpec);

  const result = await openapiDiff.diffSpecs({
    sourceSpec: {
      content: oldContent,
      location: 'old-spec.json',
      format: detectFormatFromObject(oldSpec),
    },
    destinationSpec: {
      content: newContent,
      location: 'new-spec.json',
      format: detectFormatFromObject(newSpec),
    },
  });

  return parseResult(result);
}

/**
 * Quick check if specs have breaking changes
 */
export async function hasOpenAPIBreakingChanges(
  oldSpec: object,
  newSpec: object
): Promise<boolean> {
  const result = await diffOpenAPIObjects(oldSpec, newSpec);
  return result.summary.breaking > 0;
}

// --- Internal helpers ---

async function readSpecFile(path: string): Promise<string> {
  try {
    return await readFile(path, 'utf-8');
  } catch (error) {
    throw new Error(
      `Failed to read spec "${path}": ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

function detectFormat(content: string): 'openapi3' | 'swagger2' {
  if (content.includes('openapi:') || content.includes('"openapi"')) {
    return 'openapi3';
  }
  return 'swagger2';
}

function detectFormatFromObject(spec: object): 'openapi3' | 'swagger2' {
  const s = spec as Record<string, unknown>;
  if (s.openapi && typeof s.openapi === 'string' && s.openapi.startsWith('3')) {
    return 'openapi3';
  }
  return 'swagger2';
}

function parseResult(result: DiffOutcome): DiffResult {
  const breaking = result.breakingDifferencesFound ? result.breakingDifferences : [];
  const nonBreaking = result.nonBreakingDifferences ?? [];
  const unclassified = result.unclassifiedDifferences ?? [];

  const changes: Change[] = [
    ...breaking.map((d) => mapChange(d, 'breaking')),
    ...nonBreaking.map((d) => mapChange(d, 'non-breaking')),
    ...unclassified.map((d) => mapChange(d, 'unknown')),
  ];

  const summary = {
    breaking: breaking.length,
    nonBreaking: nonBreaking.length,
    patch: 0,
    unknown: unclassified.length,
  };

  const suggestedBump = summary.breaking > 0 ? 'major' : summary.nonBreaking > 0 ? 'minor' : 'none';

  return { contract: '', changes, summary, suggestedBump };
}

function mapChange(
  diff: OpenApiDiffResult<DiffResultType>,
  severity: ChangeSeverity
): Change {
  const srcDetails = diff.sourceSpecEntityDetails?.[0];
  const destDetails = diff.destinationSpecEntityDetails?.[0];
  const path = destDetails?.location || srcDetails?.location || '/';

  // Generate human-readable message from code
  const message = `${diff.action} ${diff.entity.replace(/\./g, ' ')} at ${path}`;

  return {
    path,
    severity,
    category: diff.code,
    message,
    oldValue: srcDetails?.value,
    newValue: destDetails?.value,
  };
}

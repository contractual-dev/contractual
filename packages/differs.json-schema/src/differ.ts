/**
 * JSON Schema Structural Differ
 *
 * Compares two JSON Schema files and detects structural changes,
 * classifying them by severity for semver bump decisions.
 */

import { readFile } from 'node:fs/promises';
import type { DiffResult, Change, ChangeSeverity, RawChange } from './types.js';
import { resolveRefs } from './ref-resolver.js';
import { walk } from './walker.js';
import { classify, classifyPropertyAdded } from './classifiers.js';

/**
 * Format a human-readable message for a change
 *
 * @param change - The raw change to format
 * @returns Human-readable message describing the change
 */
export function formatChangeMessage(change: RawChange): string {
  const pathDisplay = change.path || '/';

  switch (change.type) {
    case 'property-added':
      return `Property added at ${pathDisplay}`;

    case 'property-removed':
      return `Property removed at ${pathDisplay}`;

    case 'required-added':
      return `Field "${formatRequiredFieldName(change.newValue)}" made required at ${pathDisplay}`;

    case 'required-removed':
      return `Field "${formatRequiredFieldName(change.oldValue)}" made optional at ${pathDisplay}`;

    case 'type-changed':
      return `Type changed from ${formatValue(change.oldValue)} to ${formatValue(change.newValue)} at ${pathDisplay}`;

    case 'type-narrowed':
      return `Type narrowed from ${formatValue(change.oldValue)} to ${formatValue(change.newValue)} at ${pathDisplay}`;

    case 'type-widened':
      return `Type widened from ${formatValue(change.oldValue)} to ${formatValue(change.newValue)} at ${pathDisplay}`;

    case 'enum-value-added':
      return `Enum value ${formatValue(change.newValue)} added at ${pathDisplay}`;

    case 'enum-value-removed':
      return `Enum value ${formatValue(change.oldValue)} removed at ${pathDisplay}`;

    case 'enum-added':
      return `Enum constraint added at ${pathDisplay}`;

    case 'enum-removed':
      return `Enum constraint removed at ${pathDisplay}`;

    case 'constraint-tightened':
      return formatConstraintMessage(change, 'tightened', pathDisplay);

    case 'constraint-loosened':
      return formatConstraintMessage(change, 'loosened', pathDisplay);

    case 'format-added':
      return `Format "${change.newValue}" added at ${pathDisplay}`;

    case 'format-removed':
      return `Format "${change.oldValue}" removed at ${pathDisplay}`;

    case 'format-changed':
      return `Format changed from "${change.oldValue}" to "${change.newValue}" at ${pathDisplay}`;

    case 'additional-properties-denied':
      return `Additional properties denied at ${pathDisplay}`;

    case 'additional-properties-allowed':
      return `Additional properties allowed at ${pathDisplay}`;

    case 'additional-properties-changed':
      return `Additional properties schema changed at ${pathDisplay}`;

    case 'items-changed':
      return `Array items schema changed at ${pathDisplay}`;

    case 'min-items-increased':
      return `Minimum items increased from ${formatValue(change.oldValue)} to ${formatValue(change.newValue)} at ${pathDisplay}`;

    case 'max-items-decreased':
      return `Maximum items decreased from ${formatValue(change.oldValue)} to ${formatValue(change.newValue)} at ${pathDisplay}`;

    case 'composition-changed':
      return `Composition (allOf/anyOf/oneOf) changed at ${pathDisplay}`;

    case 'ref-target-changed':
      return `Reference target changed at ${pathDisplay}`;

    case 'description-changed':
      return `Description changed at ${pathDisplay}`;

    case 'title-changed':
      return `Title changed at ${pathDisplay}`;

    case 'default-changed':
      return `Default value changed at ${pathDisplay}`;

    case 'examples-changed':
      return `Examples changed at ${pathDisplay}`;

    case 'unknown-change':
    default:
      return `Unknown change at ${pathDisplay}`;
  }
}

/**
 * Format a value for display in messages
 */
function formatValue(value: unknown): string {
  if (value === undefined) {
    return 'undefined';
  }
  if (value === null) {
    return 'null';
  }
  if (typeof value === 'string') {
    return `"${value}"`;
  }
  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

/**
 * Format required field name from change value
 */
function formatRequiredFieldName(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }
  return String(value);
}

/**
 * Format constraint change message
 */
function formatConstraintMessage(
  change: RawChange,
  direction: 'tightened' | 'loosened',
  pathDisplay: string
): string {
  const constraintName = extractConstraintName(change.path);
  const oldVal = change.oldValue !== undefined ? formatValue(change.oldValue) : 'none';
  const newVal = change.newValue !== undefined ? formatValue(change.newValue) : 'none';

  if (constraintName) {
    return `Constraint "${constraintName}" ${direction} from ${oldVal} to ${newVal} at ${pathDisplay}`;
  }

  return `Constraint ${direction} from ${oldVal} to ${newVal} at ${pathDisplay}`;
}

/**
 * Extract constraint name from path
 */
function extractConstraintName(path: string): string | null {
  const segments = path.split('/');
  const lastSegment = segments[segments.length - 1];
  if (lastSegment && lastSegment !== '') {
    return lastSegment;
  }
  return null;
}

/**
 * Classify a change, with context-aware classification for property-added
 *
 * @param change - The raw change to classify
 * @param newSchema - The new schema for context (used for property-added)
 * @returns The severity classification
 */
function classifyChange(change: RawChange, newSchema: unknown): ChangeSeverity {
  if (change.type === 'property-added') {
    return classifyPropertyAdded(change, newSchema);
  }
  return classify(change);
}

/**
 * Diff two JSON Schema files and detect structural changes
 *
 * Reads both schema files, resolves $ref references, walks the schemas
 * to detect differences, and classifies each change by severity.
 *
 * @param oldPath - Path to the old/base schema file
 * @param newPath - Path to the new/changed schema file
 * @returns DiffResult with classified changes and suggested bump
 *
 * @example
 * ```typescript
 * const result = await diffJsonSchema('v1/schema.json', 'v2/schema.json');
 *
 * console.log(`Suggested bump: ${result.suggestedBump}`);
 * console.log(`Breaking changes: ${result.summary.breaking}`);
 *
 * for (const change of result.changes) {
 *   console.log(`[${change.severity}] ${change.message}`);
 * }
 * ```
 */
export async function diffJsonSchema(oldPath: string, newPath: string): Promise<DiffResult> {
  // Read both schema files
  let oldContent: string;
  let newContent: string;

  try {
    oldContent = await readFile(oldPath, 'utf-8');
  } catch (error) {
    throw new Error(
      `Failed to read old schema file "${oldPath}": ${error instanceof Error ? error.message : String(error)}`
    );
  }

  try {
    newContent = await readFile(newPath, 'utf-8');
  } catch (error) {
    throw new Error(
      `Failed to read new schema file "${newPath}": ${error instanceof Error ? error.message : String(error)}`
    );
  }

  // Parse JSON
  let oldSchema: unknown;
  let newSchema: unknown;

  try {
    oldSchema = JSON.parse(oldContent);
  } catch (error) {
    throw new Error(
      `Failed to parse old schema as JSON "${oldPath}": ${error instanceof Error ? error.message : String(error)}`
    );
  }

  try {
    newSchema = JSON.parse(newContent);
  } catch (error) {
    throw new Error(
      `Failed to parse new schema as JSON "${newPath}": ${error instanceof Error ? error.message : String(error)}`
    );
  }

  // Resolve $refs in both schemas
  const resolvedOldResult = resolveRefs(oldSchema);
  const resolvedNewResult = resolveRefs(newSchema);

  const resolvedOld = resolvedOldResult.schema;
  const resolvedNew = resolvedNewResult.schema;

  // Log warnings if any $refs couldn't be resolved
  const allWarnings = [
    ...resolvedOldResult.warnings.map((w) => `[old] ${w}`),
    ...resolvedNewResult.warnings.map((w) => `[new] ${w}`),
  ];

  if (allWarnings.length > 0) {
    // Warnings are informational; diff continues with best effort
    // In production, you might want to expose these in the result
  }

  // Walk both schemas and detect raw changes
  const rawChanges = walk(resolvedOld, resolvedNew, '');

  // Classify changes and build final Change objects
  const changes: Change[] = rawChanges.map((raw) => ({
    path: raw.path,
    severity: classifyChange(raw, resolvedNew),
    category: raw.type,
    message: formatChangeMessage(raw),
    oldValue: raw.oldValue,
    newValue: raw.newValue,
  }));

  // Calculate summary counts
  const summary = {
    breaking: changes.filter((c) => c.severity === 'breaking').length,
    nonBreaking: changes.filter((c) => c.severity === 'non-breaking').length,
    patch: changes.filter((c) => c.severity === 'patch').length,
    unknown: changes.filter((c) => c.severity === 'unknown').length,
  };

  // Determine suggested semver bump based on highest severity
  const suggestedBump =
    summary.breaking > 0
      ? 'major'
      : summary.nonBreaking > 0
        ? 'minor'
        : summary.patch > 0
          ? 'patch'
          : 'none';

  return {
    contract: '',
    changes,
    summary,
    suggestedBump,
  };
}

/**
 * Diff two JSON Schema objects and detect structural changes
 *
 * Like diffJsonSchema but accepts schema objects directly instead of file paths.
 *
 * @param oldSchema - The old/base schema object
 * @param newSchema - The new/changed schema object
 * @returns DiffResult with classified changes and suggested bump
 *
 * @example
 * ```typescript
 * const oldSchema = { type: 'object', properties: { name: { type: 'string' } } };
 * const newSchema = { type: 'object', properties: { name: { type: 'number' } } };
 *
 * const result = diffJsonSchemaObjects(oldSchema, newSchema);
 * console.log(`Suggested bump: ${result.suggestedBump}`);
 * ```
 */
export function diffJsonSchemaObjects(oldSchema: unknown, newSchema: unknown): DiffResult {
  // Resolve $refs in both schemas
  const resolvedOldResult = resolveRefs(oldSchema);
  const resolvedNewResult = resolveRefs(newSchema);

  const resolvedOld = resolvedOldResult.schema;
  const resolvedNew = resolvedNewResult.schema;

  // Walk both schemas and detect raw changes
  const rawChanges = walk(resolvedOld, resolvedNew, '');

  // Classify changes and build final Change objects
  const changes: Change[] = rawChanges.map((raw) => ({
    path: raw.path,
    severity: classifyChange(raw, resolvedNew),
    category: raw.type,
    message: formatChangeMessage(raw),
    oldValue: raw.oldValue,
    newValue: raw.newValue,
  }));

  // Calculate summary counts
  const summary = {
    breaking: changes.filter((c) => c.severity === 'breaking').length,
    nonBreaking: changes.filter((c) => c.severity === 'non-breaking').length,
    patch: changes.filter((c) => c.severity === 'patch').length,
    unknown: changes.filter((c) => c.severity === 'unknown').length,
  };

  // Determine suggested semver bump based on highest severity
  const suggestedBump =
    summary.breaking > 0
      ? 'major'
      : summary.nonBreaking > 0
        ? 'minor'
        : summary.patch > 0
          ? 'patch'
          : 'none';

  return {
    contract: '',
    changes,
    summary,
    suggestedBump,
  };
}

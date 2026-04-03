/**
 * Human-readable message formatting for raw changes
 */

import type { RawChange } from '@contractual/types';

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

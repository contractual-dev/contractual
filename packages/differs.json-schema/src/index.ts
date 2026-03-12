/**
 * @contractual/differs.json-schema
 *
 * Detect and classify breaking changes between JSON Schema versions.
 *
 * This package provides tools to compare JSON Schema documents and determine
 * the semantic versioning impact of changes. It identifies breaking changes
 * (major), non-breaking additions (minor), and documentation changes (patch).
 *
 * @example
 * ```typescript
 * import { compareSchemas } from '@contractual/differs.json-schema';
 *
 * const result = compareSchemas(oldSchema, newSchema, { currentVersion: '1.0.0' });
 * console.log(result.version);    // 'major' | 'minor' | 'patch' | 'equal' | null
 * console.log(result.newVersion); // { major: 2, minor: 0, patch: 0, version: '2.0.0' }
 * ```
 *
 * @example
 * ```typescript
 * import { diffJsonSchema, diffJsonSchemaObjects } from '@contractual/differs.json-schema';
 *
 * // Compare files
 * const result = await diffJsonSchema('v1/schema.json', 'v2/schema.json');
 * console.log(result.suggestedBump); // 'major' | 'minor' | 'patch' | 'none'
 *
 * // Compare schema objects directly
 * const result2 = diffJsonSchemaObjects(oldSchema, newSchema);
 * for (const change of result2.changes) {
 *   console.log(`[${change.severity}] ${change.message}`);
 * }
 * ```
 *
 * @packageDocumentation
 */

// =============================================================================
// Strands-compatible API (primary)
// =============================================================================

export { compareSchemas, checkCompatibility } from './compare.js';

// =============================================================================
// Legacy file-based API (backward compatible)
// =============================================================================

export { diffJsonSchema, diffJsonSchemaObjects, formatChangeMessage } from './differ.js';

// =============================================================================
// Classification utilities
// =============================================================================

export {
  classify,
  classifyPropertyAdded,
  classifyAll,
  CLASSIFICATION_SETS,
} from './classifiers.js';

// =============================================================================
// Ref resolution utilities
// =============================================================================

export {
  resolveRefs,
  hasUnresolvedRefs,
  extractRefs,
  validateRefs,
  type ResolveResult,
} from './ref-resolver.js';

// =============================================================================
// Low-level walker
// =============================================================================

export { walk } from './walker.js';

// =============================================================================
// Strands API Types
// =============================================================================

export type {
  CompareResult,
  CompareOptions,
  StrandsTrace,
  StrandsCompatibility,
  StrandsVersion,
  SemanticVersion,
  JsonSchemaDraft,
} from './types.js';

// =============================================================================
// Core Types
// =============================================================================

export type {
  ResolvedSchema,
  JSONSchemaType,
  NormalizedType,
  ConstraintKey,
  ConstraintDirection,
  CompositionKeyword,
  MetadataKey,
  AnnotationKey,
  ContentKey,
  WalkerContext,
} from './types.js';

// =============================================================================
// Type guards and utilities
// =============================================================================

export {
  isSchemaObject,
  isSchemaArray,
  normalizeType,
  arraysEqual,
  deepEqual,
  escapeJsonPointer,
  joinPath,
  CONSTRAINT_KEYS,
  CONSTRAINT_DIRECTION,
  COMPOSITION_KEYWORDS,
  METADATA_KEYS,
  ANNOTATION_KEYS,
  CONTENT_KEYS,
  DEFAULT_MAX_DEPTH,
} from './types.js';

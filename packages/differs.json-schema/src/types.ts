/**
 * Internal types for JSON Schema structural differ
 */

// ============================================================================
// Strands API Types
// ============================================================================

/**
 * Strands compatibility classification for a trace
 */
export type StrandsCompatibility = 'incompatible' | 'compatible' | 'unknown';

/**
 * Strands version bump level
 */
export type StrandsVersion = 'equal' | 'patch' | 'minor' | 'major' | null;

/**
 * A single trace showing where schemas differ (Strands format)
 */
export interface StrandsTrace {
  /** Compatibility status of this change */
  readonly compatibility: StrandsCompatibility;
  /** JSON Pointer path in the source (left) schema, null if added */
  readonly left: string | null;
  /** JSON Pointer path in the target (right) schema, null if removed */
  readonly right: string | null;
}

/**
 * Semantic version object
 */
export interface SemanticVersion {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
  readonly version: string;
}

/**
 * Strands API response format
 */
export interface CompareResult {
  /** Version bump level, null if unknown/error */
  readonly version: StrandsVersion;
  /** List of traces showing where schemas differ */
  readonly traces: StrandsTrace[];
  /** Computed new version based on current version + bump */
  readonly newVersion: SemanticVersion | null;
  /** Error or warning message */
  readonly message?: string;
}

/**
 * Options for schema comparison
 */
export interface CompareOptions {
  /** Current version to compute newVersion from (e.g., "1.0.0") */
  readonly currentVersion?: string;
  /** Draft version for validation rules */
  readonly draft?: JsonSchemaDraft;
}

/**
 * Supported JSON Schema drafts
 */
export type JsonSchemaDraft = 'draft-07' | 'draft-2019-09' | 'draft-2020-12';

// ============================================================================
// JSON Schema Types
// ============================================================================

/**
 * JSON Schema type values
 */
export type JSONSchemaType =
  | 'string'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'object'
  | 'array'
  | 'null';

/**
 * Normalized type representation (always an array for comparison)
 */
export type NormalizedType = JSONSchemaType[];

/**
 * JSON Schema constraint keys that can be tightened or loosened
 */
export type ConstraintKey =
  | 'minimum'
  | 'maximum'
  | 'exclusiveMinimum'
  | 'exclusiveMaximum'
  | 'minLength'
  | 'maxLength'
  | 'minItems'
  | 'maxItems'
  | 'minProperties'
  | 'maxProperties'
  | 'minContains'
  | 'maxContains'
  | 'pattern'
  | 'multipleOf'
  | 'uniqueItems';

/**
 * Constraint comparison direction
 */
export type ConstraintDirection = 'min' | 'max' | 'exact';

/**
 * Constraint metadata for determining tightened vs loosened
 */
export interface ConstraintMeta {
  readonly key: ConstraintKey;
  readonly direction: ConstraintDirection;
}

/**
 * Map of constraint keys to their comparison direction
 */
export const CONSTRAINT_DIRECTION: Record<ConstraintKey, ConstraintDirection> = {
  minimum: 'min',
  maximum: 'max',
  exclusiveMinimum: 'min',
  exclusiveMaximum: 'max',
  minLength: 'min',
  maxLength: 'max',
  minItems: 'min',
  maxItems: 'max',
  minProperties: 'min',
  maxProperties: 'max',
  minContains: 'min',
  maxContains: 'max',
  pattern: 'exact',
  multipleOf: 'exact',
  uniqueItems: 'exact',
};

/**
 * All constraint keys for iteration
 */
export const CONSTRAINT_KEYS: ConstraintKey[] = [
  'minimum',
  'maximum',
  'exclusiveMinimum',
  'exclusiveMaximum',
  'minLength',
  'maxLength',
  'minItems',
  'maxItems',
  'minProperties',
  'maxProperties',
  'minContains',
  'maxContains',
  'pattern',
  'multipleOf',
  'uniqueItems',
];

/**
 * Composition keywords in JSON Schema
 */
export type CompositionKeyword = 'anyOf' | 'oneOf' | 'allOf' | 'if' | 'then' | 'else' | 'not';

/**
 * All composition keywords for iteration
 */
export const COMPOSITION_KEYWORDS: CompositionKeyword[] = [
  'anyOf',
  'oneOf',
  'allOf',
  'if',
  'then',
  'else',
  'not',
];

/**
 * Metadata keys that are compared (patch-level changes)
 */
export type MetadataKey = 'description' | 'title' | 'default' | 'examples';

/**
 * All metadata keys for iteration
 */
export const METADATA_KEYS: MetadataKey[] = ['description', 'title', 'default', 'examples'];

/**
 * Annotation keys (patch-level changes per Strands API)
 */
export type AnnotationKey = 'deprecated' | 'readOnly' | 'writeOnly';

/**
 * All annotation keys for iteration
 */
export const ANNOTATION_KEYS: AnnotationKey[] = ['deprecated', 'readOnly', 'writeOnly'];

/**
 * Content keywords (patch-level changes per Strands API)
 */
export type ContentKey = 'contentEncoding' | 'contentMediaType' | 'contentSchema';

/**
 * All content keys for iteration
 */
export const CONTENT_KEYS: ContentKey[] = ['contentEncoding', 'contentMediaType', 'contentSchema'];

/**
 * Resolved JSON Schema object (refs already resolved)
 */
export interface ResolvedSchema {
  // Schema identification
  $schema?: string;
  $id?: string;
  $ref?: string;
  $defs?: Record<string, ResolvedSchema>;

  // Type
  type?: JSONSchemaType | JSONSchemaType[];

  // Metadata
  title?: string;
  description?: string;
  default?: unknown;
  examples?: unknown[];

  // Annotations (Draft 2019-09+)
  deprecated?: boolean;
  readOnly?: boolean;
  writeOnly?: boolean;

  // Enum
  enum?: unknown[];
  const?: unknown;

  // Format
  format?: string;

  // Numeric constraints
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number;
  exclusiveMaximum?: number;
  multipleOf?: number;

  // String constraints
  minLength?: number;
  maxLength?: number;
  pattern?: string;

  // Content keywords (Draft 7+)
  contentEncoding?: string;
  contentMediaType?: string;
  contentSchema?: ResolvedSchema;

  // Object keywords
  properties?: Record<string, ResolvedSchema>;
  required?: string[];
  additionalProperties?: boolean | ResolvedSchema;
  minProperties?: number;
  maxProperties?: number;
  propertyNames?: ResolvedSchema;
  patternProperties?: Record<string, ResolvedSchema>;
  dependentRequired?: Record<string, string[]>;
  dependentSchemas?: Record<string, ResolvedSchema>;
  unevaluatedProperties?: boolean | ResolvedSchema;

  // Array keywords
  items?: ResolvedSchema | ResolvedSchema[];
  prefixItems?: ResolvedSchema[];
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
  contains?: ResolvedSchema;
  minContains?: number;
  maxContains?: number;
  unevaluatedItems?: boolean | ResolvedSchema;

  // Composition
  anyOf?: ResolvedSchema[];
  oneOf?: ResolvedSchema[];
  allOf?: ResolvedSchema[];
  if?: ResolvedSchema;
  then?: ResolvedSchema;
  else?: ResolvedSchema;
  not?: ResolvedSchema;

  // Allow additional properties for extensibility
  [key: string]: unknown;
}

/**
 * Walker context for tracking traversal state
 */
export interface WalkerContext {
  /** Current JSON Pointer path */
  readonly path: string;
  /** Depth of recursion (for cycle detection) */
  readonly depth: number;
  /** Maximum allowed depth */
  readonly maxDepth: number;
}

/**
 * Default maximum recursion depth
 */
export const DEFAULT_MAX_DEPTH = 100;

/**
 * Type guard to check if value is a schema object
 */
export function isSchemaObject(value: unknown): value is ResolvedSchema {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type guard to check if value is an array of schemas
 */
export function isSchemaArray(value: unknown): value is ResolvedSchema[] {
  return Array.isArray(value) && value.every(isSchemaObject);
}

/**
 * Normalize type to array for consistent comparison
 */
export function normalizeType(type: JSONSchemaType | JSONSchemaType[] | undefined): NormalizedType {
  if (type === undefined) {
    return [];
  }
  if (Array.isArray(type)) {
    return [...type].sort();
  }
  return [type];
}

/**
 * Check if two arrays have the same elements (order-independent)
 */
export function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, idx) => val === sortedB[idx]);
}

/**
 * Deep equality check for JSON values
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (a === null || b === null) return a === b;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((val, idx) => deepEqual(val, b[idx]));
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const aObj = a as Record<string, unknown>;
    const bObj = b as Record<string, unknown>;
    const aKeys = Object.keys(aObj);
    const bKeys = Object.keys(bObj);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((key) => deepEqual(aObj[key], bObj[key]));
  }

  return false;
}

/**
 * Escape JSON Pointer segment according to RFC 6901
 */
export function escapeJsonPointer(segment: string): string {
  return segment.replace(/~/g, '~0').replace(/\//g, '~1');
}

/**
 * Join path segments into a JSON Pointer
 */
export function joinPath(basePath: string, ...segments: string[]): string {
  const escaped = segments.map(escapeJsonPointer);
  if (basePath === '') {
    return escaped.length > 0 ? '/' + escaped.join('/') : '';
  }
  return basePath + '/' + escaped.join('/');
}

// ============================================================================
// Diff Result Types
// ============================================================================

/**
 * Severity classification for detected changes
 */
export type ChangeSeverity = 'breaking' | 'non-breaking' | 'patch' | 'unknown';

/**
 * Suggested semver bump based on detected changes
 */
export type SuggestedBump = 'major' | 'minor' | 'patch' | 'none';

/**
 * A single change detected between two spec versions
 */
export interface Change {
  path: string;
  severity: ChangeSeverity;
  category: string;
  message: string;
  oldValue?: unknown;
  newValue?: unknown;
}

/**
 * Summary counts of changes by severity
 */
export interface DiffSummary {
  breaking: number;
  nonBreaking: number;
  patch: number;
  unknown: number;
}

/**
 * Result of comparing two spec versions
 */
export interface DiffResult {
  contract: string;
  changes: Change[];
  summary: DiffSummary;
  suggestedBump: SuggestedBump;
}

/**
 * All possible structural change types for classification
 */
export type ChangeType =
  // Property-level changes
  | 'property-added'
  | 'property-removed'
  | 'required-added'
  | 'required-removed'
  // Type-level changes
  | 'type-changed'
  | 'type-narrowed'
  | 'type-widened'
  // Enum-level changes
  | 'enum-value-added'
  | 'enum-value-removed'
  | 'enum-added'
  | 'enum-removed'
  // Constraint-level changes
  | 'constraint-tightened'
  | 'constraint-loosened'
  | 'format-changed'
  | 'format-added'
  | 'format-removed'
  // Object-level changes
  | 'additional-properties-denied'
  | 'additional-properties-allowed'
  | 'additional-properties-changed'
  | 'property-names-changed'
  | 'dependent-required-added'
  | 'dependent-required-removed'
  | 'dependent-schemas-changed'
  | 'unevaluated-properties-changed'
  // Array-level changes
  | 'items-changed'
  | 'min-items-increased'
  | 'max-items-decreased'
  | 'min-contains-changed'
  | 'max-contains-changed'
  | 'unevaluated-items-changed'
  // Ref-level changes
  | 'ref-target-changed'
  // Metadata-level changes (patch)
  | 'description-changed'
  | 'title-changed'
  | 'default-changed'
  | 'examples-changed'
  // Annotation changes (patch per Strands API)
  | 'deprecated-changed'
  | 'read-only-changed'
  | 'write-only-changed'
  // Content keyword changes (patch per Strands API)
  | 'content-encoding-changed'
  | 'content-media-type-changed'
  | 'content-schema-changed'
  // Granular composition changes
  | 'anyof-option-added'
  | 'anyof-option-removed'
  | 'oneof-option-added'
  | 'oneof-option-removed'
  | 'allof-member-added'
  | 'allof-member-removed'
  | 'not-schema-changed'
  | 'if-then-else-changed'
  // Legacy composition
  | 'composition-changed'
  // Catch-all
  | 'unknown-change';

/**
 * Raw change detected by a differ before severity classification
 */
export interface RawChange {
  path: string;
  type: ChangeType;
  oldValue?: unknown;
  newValue?: unknown;
}

/**
 * Mapping from change types to their severity classification
 */
export const CHANGE_TYPE_SEVERITY: Record<ChangeType, ChangeSeverity> = {
  // Breaking changes (major)
  'property-removed': 'breaking',
  'required-added': 'breaking',
  'type-changed': 'breaking',
  'type-narrowed': 'breaking',
  'enum-value-removed': 'breaking',
  'enum-added': 'breaking',
  'constraint-tightened': 'breaking',
  'additional-properties-denied': 'breaking',
  'items-changed': 'breaking',
  'min-items-increased': 'breaking',
  'max-items-decreased': 'breaking',
  'ref-target-changed': 'breaking',
  'dependent-required-added': 'breaking',
  'anyof-option-added': 'breaking',
  'oneof-option-added': 'breaking',
  'allof-member-added': 'breaking',
  'not-schema-changed': 'breaking',

  // Non-breaking changes (minor)
  'property-added': 'non-breaking',
  'required-removed': 'non-breaking',
  'type-widened': 'non-breaking',
  'enum-value-added': 'non-breaking',
  'enum-removed': 'non-breaking',
  'constraint-loosened': 'non-breaking',
  'additional-properties-allowed': 'non-breaking',
  'additional-properties-changed': 'non-breaking',
  'dependent-required-removed': 'non-breaking',
  'anyof-option-removed': 'non-breaking',
  'oneof-option-removed': 'non-breaking',
  'allof-member-removed': 'non-breaking',

  // Patch-level changes
  'format-added': 'patch',
  'format-removed': 'patch',
  'format-changed': 'patch',
  'description-changed': 'patch',
  'title-changed': 'patch',
  'default-changed': 'patch',
  'examples-changed': 'patch',
  'deprecated-changed': 'patch',
  'read-only-changed': 'patch',
  'write-only-changed': 'patch',
  'content-encoding-changed': 'patch',
  'content-media-type-changed': 'patch',
  'content-schema-changed': 'patch',

  // Unknown (manual review)
  'property-names-changed': 'unknown',
  'dependent-schemas-changed': 'unknown',
  'unevaluated-properties-changed': 'unknown',
  'unevaluated-items-changed': 'unknown',
  'min-contains-changed': 'unknown',
  'max-contains-changed': 'unknown',
  'if-then-else-changed': 'unknown',
  'composition-changed': 'unknown',
  'unknown-change': 'unknown',
};

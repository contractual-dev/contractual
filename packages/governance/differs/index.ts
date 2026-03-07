/**
 * Differs
 *
 * Contract differ implementations for detecting structural changes
 * between two versions of a contract specification.
 *
 * All differs are pure Node.js - no binary dependencies.
 */

export { diffOpenAPI, diffOpenAPIObjects, hasOpenAPIBreakingChanges } from './openapi-diff.js';

export { diffJsonSchema } from './json-schema/index.js';

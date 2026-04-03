/**
 * OpenAPI structural differ
 *
 * Compares the structural layer of two OpenAPI specs:
 * paths, operations, parameters, request bodies, responses.
 * Schema-level diffing is delegated to @contractual/differs.core walker.
 */

import type { RawChange, ChangeType } from '@contractual/types';
import { walk, escapeJsonPointer } from '@contractual/differs.core';

const HTTP_METHODS = ['get', 'put', 'post', 'delete', 'patch', 'options', 'head', 'trace'] as const;

type PathsMap = Record<string, Record<string, unknown>>;
type OperationMap = Record<string, unknown>;

/**
 * Diff the structural layer of two resolved OpenAPI specs
 */
export function diffStructural(
  oldSpec: Record<string, unknown>,
  newSpec: Record<string, unknown>
): RawChange[] {
  const changes: RawChange[] = [];

  const oldPaths = (oldSpec.paths ?? {}) as PathsMap;
  const newPaths = (newSpec.paths ?? {}) as PathsMap;

  // Diff paths
  for (const path of Object.keys(oldPaths)) {
    const escapedPath = escapeJsonPointer(path);

    if (!(path in newPaths)) {
      changes.push({
        path: `/paths/${escapedPath}`,
        type: 'path-removed' as ChangeType,
        oldValue: path,
      });
      continue;
    }

    // Diff operations within matching paths
    changes.push(...diffOperations(oldPaths[path], newPaths[path], path));
  }

  for (const path of Object.keys(newPaths)) {
    if (!(path in oldPaths)) {
      const escapedPath = escapeJsonPointer(path);
      changes.push({
        path: `/paths/${escapedPath}`,
        type: 'path-added' as ChangeType,
        newValue: path,
      });
    }
  }

  return changes;
}

/**
 * Diff operations (HTTP methods) within a path
 */
function diffOperations(
  oldPathItem: Record<string, unknown>,
  newPathItem: Record<string, unknown>,
  apiPath: string
): RawChange[] {
  const changes: RawChange[] = [];
  const escapedPath = escapeJsonPointer(apiPath);

  for (const method of HTTP_METHODS) {
    const oldOp = oldPathItem[method] as OperationMap | undefined;
    const newOp = newPathItem[method] as OperationMap | undefined;

    if (oldOp && !newOp) {
      changes.push({
        path: `/paths/${escapedPath}/${method}`,
        type: 'operation-removed' as ChangeType,
        oldValue: `${method.toUpperCase()} ${apiPath}`,
      });
    } else if (!oldOp && newOp) {
      changes.push({
        path: `/paths/${escapedPath}/${method}`,
        type: 'operation-added' as ChangeType,
        newValue: `${method.toUpperCase()} ${apiPath}`,
      });
    } else if (oldOp && newOp) {
      // Both exist — diff parameters, request body, responses at schema level
      const basePath = `/paths/${escapedPath}/${method}`;
      changes.push(...diffParameters(oldOp, newOp, basePath));
      changes.push(...diffRequestBody(oldOp, newOp, basePath));
      changes.push(...diffResponses(oldOp, newOp, basePath));
    }
  }

  return changes;
}

/**
 * Diff parameters between two operations
 */
function diffParameters(oldOp: OperationMap, newOp: OperationMap, basePath: string): RawChange[] {
  const changes: RawChange[] = [];
  const oldParams = (oldOp.parameters ?? []) as Array<Record<string, unknown>>;
  const newParams = (newOp.parameters ?? []) as Array<Record<string, unknown>>;

  // Index by "in+name" for matching
  const oldByKey = new Map(oldParams.map((p) => [`${p.in}:${p.name}`, p]));
  const newByKey = new Map(newParams.map((p) => [`${p.in}:${p.name}`, p]));

  for (const [key, oldParam] of oldByKey) {
    if (!newByKey.has(key)) {
      changes.push({
        path: `${basePath}/parameters/${oldParam.name}`,
        type: 'parameter-removed' as ChangeType,
        oldValue: key,
      });
    } else {
      const newParam = newByKey.get(key)!;

      // Check required change
      if (oldParam.required !== newParam.required) {
        changes.push({
          path: `${basePath}/parameters/${oldParam.name}/required`,
          type: 'parameter-required-changed' as ChangeType,
          oldValue: oldParam.required,
          newValue: newParam.required,
        });
      }

      // Diff parameter schemas using core walker
      if (oldParam.schema && newParam.schema) {
        const schemaChanges = walk(
          oldParam.schema,
          newParam.schema,
          `${basePath}/parameters/${oldParam.name}/schema`
        );
        changes.push(...schemaChanges);
      }
    }
  }

  for (const [key, newParam] of newByKey) {
    if (!oldByKey.has(key)) {
      changes.push({
        path: `${basePath}/parameters/${newParam.name}`,
        type: 'parameter-added' as ChangeType,
        newValue: key,
      });
    }
  }

  return changes;
}

/**
 * Extract the primary schema from a content map (prefers application/json)
 */
function extractSchema(content: Record<string, unknown> | undefined): unknown {
  if (!content) return undefined;

  // Prefer application/json, then first available
  const jsonContent = content['application/json'] as Record<string, unknown> | undefined;
  if (jsonContent?.schema) return jsonContent.schema;

  for (const mediaType of Object.values(content)) {
    const mt = mediaType as Record<string, unknown>;
    if (mt?.schema) return mt.schema;
  }

  return undefined;
}

/**
 * Diff request bodies between two operations
 */
function diffRequestBody(oldOp: OperationMap, newOp: OperationMap, basePath: string): RawChange[] {
  const changes: RawChange[] = [];
  const oldBody = oldOp.requestBody as Record<string, unknown> | undefined;
  const newBody = newOp.requestBody as Record<string, unknown> | undefined;

  if (oldBody && !newBody) {
    changes.push({
      path: `${basePath}/requestBody`,
      type: 'request-body-removed' as ChangeType,
    });
  } else if (!oldBody && newBody) {
    changes.push({
      path: `${basePath}/requestBody`,
      type: 'request-body-added' as ChangeType,
    });
  } else if (oldBody && newBody) {
    const oldSchema = extractSchema(oldBody.content as Record<string, unknown>);
    const newSchema = extractSchema(newBody.content as Record<string, unknown>);

    if (oldSchema && newSchema) {
      const schemaChanges = walk(oldSchema, newSchema, `${basePath}/requestBody/content/schema`);
      changes.push(...schemaChanges);
    }
  }

  return changes;
}

/**
 * Diff responses between two operations
 */
function diffResponses(oldOp: OperationMap, newOp: OperationMap, basePath: string): RawChange[] {
  const changes: RawChange[] = [];
  const oldResponses = (oldOp.responses ?? {}) as Record<string, Record<string, unknown>>;
  const newResponses = (newOp.responses ?? {}) as Record<string, Record<string, unknown>>;

  for (const statusCode of Object.keys(oldResponses)) {
    if (!(statusCode in newResponses)) {
      changes.push({
        path: `${basePath}/responses/${statusCode}`,
        type: 'response-removed' as ChangeType,
        oldValue: statusCode,
      });
    } else {
      // Diff response schemas
      const oldSchema = extractSchema(oldResponses[statusCode].content as Record<string, unknown>);
      const newSchema = extractSchema(newResponses[statusCode].content as Record<string, unknown>);

      if (oldSchema && newSchema) {
        const schemaChanges = walk(
          oldSchema,
          newSchema,
          `${basePath}/responses/${statusCode}/content/schema`
        );
        changes.push(...schemaChanges);
      }
    }
  }

  for (const statusCode of Object.keys(newResponses)) {
    if (!(statusCode in oldResponses)) {
      changes.push({
        path: `${basePath}/responses/${statusCode}`,
        type: 'response-added' as ChangeType,
        newValue: statusCode,
      });
    }
  }

  return changes;
}

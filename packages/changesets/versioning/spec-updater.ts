/**
 * Spec Version Updater
 *
 * Updates the version field inside a spec file (e.g., info.version in OpenAPI)
 * to keep the spec's internal version in sync with the tracked version.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { extname } from 'node:path';
import { parseDocument } from 'yaml';
import type { ContractType } from '@contractual/types';

/**
 * Contract types that have a version field in the spec
 */
const VERSION_FIELD_PATHS: Partial<Record<ContractType, readonly string[]>> = {
  openapi: ['info', 'version'],
  asyncapi: ['info', 'version'],
  odcs: ['version'],
};

/**
 * Detect indentation used in a JSON file
 */
function detectJsonIndent(content: string): number {
  const match = content.match(/^(\s+)"/m);
  return match?.[1]?.length ?? 2;
}

/**
 * Ensure nested path exists in a plain object, creating intermediate objects as needed.
 * Returns the parent object of the last key.
 */
function ensureJsonPath(
  root: Record<string, unknown>,
  fieldPath: readonly string[]
): Record<string, unknown> {
  let current = root;
  for (let i = 0; i < fieldPath.length - 1; i++) {
    const key = fieldPath[i]!;
    if (typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  return current;
}

/**
 * Update the version field inside a JSON spec file.
 * Creates missing intermediate objects if needed.
 */
function updateJsonSpec(specPath: string, fieldPath: readonly string[], newVersion: string): void {
  const content = readFileSync(specPath, 'utf-8');
  const spec = JSON.parse(content) as Record<string, unknown>;

  const parent = ensureJsonPath(spec, fieldPath);
  parent[fieldPath.at(-1)!] = newVersion;

  const indent = detectJsonIndent(content);
  const trailingNewline = content.endsWith('\n') ? '\n' : '';
  writeFileSync(specPath, JSON.stringify(spec, null, indent) + trailingNewline, 'utf-8');
}

/**
 * Update the version field inside a YAML spec file.
 * Uses parseDocument() to preserve comments, formatting, and key ordering.
 * Creates missing intermediate keys if needed.
 */
function updateYamlSpec(specPath: string, fieldPath: readonly string[], newVersion: string): void {
  const content = readFileSync(specPath, 'utf-8');
  const doc = parseDocument(content);

  // setIn creates intermediate nodes automatically
  doc.setIn([...fieldPath], newVersion);

  writeFileSync(specPath, doc.toString(), 'utf-8');
}

/**
 * Update the version field inside a spec file.
 *
 * Reads the spec, updates the appropriate version field based on contract type,
 * and writes it back preserving the original format (YAML comments, JSON indentation).
 * If the version field (or its parent, e.g. `info`) is missing, it will be created.
 *
 * @param specPath - Absolute path to the spec file
 * @param newVersion - The new version string to set
 * @param contractType - The type of contract (openapi, asyncapi, odcs, json-schema)
 * @returns true if the file was updated, false if the spec type has no version field (e.g. json-schema)
 */
export function updateSpecVersion(
  specPath: string,
  newVersion: string,
  contractType: ContractType
): boolean {
  const fieldPath = VERSION_FIELD_PATHS[contractType];
  if (!fieldPath) {
    return false;
  }

  const ext = extname(specPath).toLowerCase();
  if (ext === '.json') {
    updateJsonSpec(specPath, fieldPath, newVersion);
  } else {
    updateYamlSpec(specPath, fieldPath, newVersion);
  }

  return true;
}

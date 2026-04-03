/**
 * OpenAPI spec resolver using @redocly/openapi-core
 *
 * Handles both OpenAPI 3.0 and 3.1 specifications.
 * Resolves all $ref pointers and produces fully dereferenced documents.
 */

/**
 * Resolve an OpenAPI spec file to a fully dereferenced object
 *
 * @param specPath - Absolute or relative path to the OpenAPI spec file
 * @returns The fully resolved OpenAPI document as a plain object
 */
export async function resolveOpenApiSpec(specPath: string): Promise<Record<string, unknown>> {
  let bundle: typeof import('@redocly/openapi-core').bundle;
  let loadConfig: typeof import('@redocly/openapi-core').loadConfig;

  try {
    const redocly = await import('@redocly/openapi-core');
    bundle = redocly.bundle;
    loadConfig = redocly.loadConfig;
  } catch {
    throw new Error(
      'OpenAPI diffing requires @redocly/openapi-core. ' +
        'Install it with: npm install @redocly/openapi-core'
    );
  }

  const config = await loadConfig();
  const result = await bundle({ ref: specPath, config, dereference: true });
  return result.bundle.parsed as Record<string, unknown>;
}

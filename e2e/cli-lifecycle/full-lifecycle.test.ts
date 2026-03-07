import { describe, test, expect, afterEach } from 'vitest';
import path from 'node:path';
import {
  createTempRepo,
  run,
  setupRepoWithConfig,
  copyFixture,
  writeFile,
  readJSON,
  fileExists,
  listFiles,
} from './helpers.js';

describe('Full CLI Lifecycle (installed from Verdaccio)', () => {
  let repo: { dir: string; cleanup: () => void };

  afterEach(() => {
    repo?.cleanup();
  });

  test('init detects JSON Schema and creates config', () => {
    repo = createTempRepo();
    const { dir } = repo;

    copyFixture('json-schema/order-base.json', path.join(dir, 'schemas/order.schema.json'));

    const result = run('init', dir);
    expect(result.exitCode).toBe(0);
    expect(fileExists(dir, 'contractual.yaml')).toBe(true);
    expect(fileExists(dir, '.contractual/versions.json')).toBe(true);
  });

  test('status shows contract versions', () => {
    repo = createTempRepo();
    const { dir } = repo;

    setupRepoWithConfig(dir, [{ name: 'order', type: 'json-schema', path: 'schemas/order.json' }]);
    copyFixture('json-schema/order-base.json', path.join(dir, 'schemas/order.json'));
    writeFile(
      dir,
      '.contractual/versions.json',
      JSON.stringify({
        order: { version: '1.2.3', released: '2026-01-01T00:00:00Z' },
      })
    );

    const result = run('status', dir);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toMatch(/order/);
    expect(result.stdout).toMatch(/1\.2\.3/);
  });

  test('breaking detects field removal', () => {
    repo = createTempRepo();
    const { dir } = repo;

    setupRepoWithConfig(dir, [{ name: 'order', type: 'json-schema', path: 'schemas/order.json' }]);
    copyFixture('json-schema/order-base.json', path.join(dir, '.contractual/snapshots/order.json'));
    copyFixture('json-schema/order-field-removed.json', path.join(dir, 'schemas/order.json'));
    writeFile(
      dir,
      '.contractual/versions.json',
      JSON.stringify({
        order: { version: '1.0.0', released: '2026-01-01T00:00:00Z' },
      })
    );

    const result = run('breaking --format json', dir, { expectFail: true });
    expect(result.exitCode).toBe(1);
    const parsed = JSON.parse(result.stdout);
    expect(parsed.hasBreaking).toBe(true);
  });

  test('changeset creates a changeset file for breaking change', () => {
    repo = createTempRepo();
    const { dir } = repo;

    setupRepoWithConfig(dir, [{ name: 'order', type: 'json-schema', path: 'schemas/order.json' }]);
    copyFixture('json-schema/order-base.json', path.join(dir, '.contractual/snapshots/order.json'));
    copyFixture('json-schema/order-field-removed.json', path.join(dir, 'schemas/order.json'));
    writeFile(
      dir,
      '.contractual/versions.json',
      JSON.stringify({
        order: { version: '1.0.0', released: '2026-01-01T00:00:00Z' },
      })
    );

    const result = run('changeset', dir);
    expect(result.exitCode).toBe(0);

    const changesets = listFiles(dir, '.contractual/changesets').filter((f) => f.endsWith('.md'));
    expect(changesets.length).toBeGreaterThan(0);
  });

  test('complete lifecycle: changeset -> version', () => {
    repo = createTempRepo();
    const { dir } = repo;

    // Setup with a JSON Schema contract
    setupRepoWithConfig(dir, [{ name: 'order', type: 'json-schema', path: 'schemas/order.json' }]);
    copyFixture('json-schema/order-base.json', path.join(dir, 'schemas/order.json'));
    copyFixture('json-schema/order-base.json', path.join(dir, '.contractual/snapshots/order.json'));
    writeFile(
      dir,
      '.contractual/versions.json',
      JSON.stringify({
        order: { version: '1.0.0', released: '2026-01-01T00:00:00Z' },
      })
    );

    // Make a breaking change
    copyFixture('json-schema/order-field-removed.json', path.join(dir, 'schemas/order.json'));

    // Run changeset
    const changesetResult = run('changeset', dir);
    expect(changesetResult.exitCode).toBe(0);

    // Verify changeset exists
    const changesets = listFiles(dir, '.contractual/changesets').filter((f) => f.endsWith('.md'));
    expect(changesets.length).toBeGreaterThan(0);

    // Run version
    const versionResult = run('version', dir);
    expect(versionResult.exitCode).toBe(0);
    expect(versionResult.stdout).toMatch(/2\.0\.0/);

    // Verify version updated
    const versions = readJSON(dir, '.contractual/versions.json') as Record<
      string,
      { version: string }
    >;
    expect(versions['order'].version).toBe('2.0.0');
  });
});

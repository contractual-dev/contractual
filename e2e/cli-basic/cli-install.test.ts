import { execSync } from 'node:child_process';
import { describe, test, expect } from 'vitest';

function run(command: string): string {
  return execSync(command, {
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' },
  });
}

describe('CLI Installation and Basic Commands', () => {
  test('contractual binary is available after npm install', () => {
    const result = run('npx contractual --version');
    expect(result).toMatch(/\d+\.\d+\.\d+/);
  });

  test('contractual --help shows available commands', () => {
    const result = run('npx contractual --help');
    expect(result).toContain('init');
    expect(result).toContain('lint');
    expect(result).toContain('breaking');
    expect(result).toContain('changeset');
    expect(result).toContain('version');
    expect(result).toContain('status');
  });

  test('contractual init --help shows init options', () => {
    const result = run('npx contractual init --help');
    expect(result.toLowerCase()).toContain('initialize');
  });

  test('contractual lint --help shows lint options', () => {
    const result = run('npx contractual lint --help');
    expect(result).toContain('--format');
  });

  test('contractual breaking --help shows breaking options', () => {
    const result = run('npx contractual breaking --help');
    expect(result).toContain('--format');
  });
});

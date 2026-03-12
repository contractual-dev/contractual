import { existsSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import fg from 'fast-glob';
import chalk from 'chalk';
import ora from 'ora';
import { stringify as stringifyYaml } from 'yaml';
import { ensureContractualDir, detectSpecType } from '../utils/files.js';
import type { ContractDefinition, ContractType } from '@contractual/types';

/**
 * Glob patterns to find spec files
 */
const SPEC_PATTERNS = [
  '**/*.openapi.yaml',
  '**/*.openapi.yml',
  '**/*.openapi.json',
  '**/openapi.yaml',
  '**/openapi.yml',
  '**/openapi.json',
  '**/*.asyncapi.yaml',
  '**/*.asyncapi.yml',
  '**/*.asyncapi.json',
  '**/*.schema.json',
  '**/*.odcs.yaml',
  '**/*.odcs.yml',
];

/**
 * Directories to ignore when scanning
 */
const IGNORE_PATTERNS = [
  '**/node_modules/**',
  '**/.git/**',
  '**/dist/**',
  '**/build/**',
  '**/.contractual/**',
];

/**
 * Extract contract name from file path
 * Uses the filename stem without extension patterns
 */
function extractContractName(filePath: string): string {
  const base = basename(filePath);

  // Remove known suffixes and extensions
  let name = base
    .replace(/\.openapi\.(ya?ml|json)$/i, '')
    .replace(/\.asyncapi\.(ya?ml|json)$/i, '')
    .replace(/\.schema\.json$/i, '')
    .replace(/\.odcs\.ya?ml$/i, '')
    .replace(/\.(ya?ml|json)$/i, '');

  // Handle generic names like "openapi" -> use parent directory name
  if (['openapi', 'asyncapi', 'schema', 'spec', 'api'].includes(name.toLowerCase())) {
    const parts = filePath.split('/');
    if (parts.length >= 2) {
      name = parts[parts.length - 2];
    }
  }

  return name;
}

/**
 * Initialize Contractual in a repository
 *
 * Scans for spec files and generates contractual.yaml configuration
 */
export async function initCommand(): Promise<void> {
  const cwd = process.cwd();
  const configPath = join(cwd, 'contractual.yaml');

  // Check if already initialized
  if (existsSync(configPath)) {
    console.log(chalk.red('Already initialized:') + ' contractual.yaml exists');
    console.log(chalk.dim('Use `contractual status` to see current state'));
    process.exitCode = 1;
    return;
  }

  const spinner = ora('Scanning for spec files...').start();

  try {
    // Scan for spec files
    const files = await fg(SPEC_PATTERNS, {
      cwd,
      ignore: IGNORE_PATTERNS,
      absolute: false,
      onlyFiles: true,
    });

    spinner.text = `Found ${files.length} potential spec file(s)`;

    // Build contract definitions
    const contracts: ContractDefinition[] = [];
    const seenNames = new Set<string>();

    for (const filePath of files) {
      const absolutePath = join(cwd, filePath);
      const detectedType = detectSpecType(absolutePath);

      if (!detectedType) {
        continue;
      }

      let name = extractContractName(filePath);

      // Ensure unique names
      if (seenNames.has(name)) {
        let counter = 2;
        while (seenNames.has(`${name}-${counter}`)) {
          counter++;
        }
        name = `${name}-${counter}`;
      }
      seenNames.add(name);

      contracts.push({
        name,
        type: detectedType,
        path: filePath,
      });
    }

    if (contracts.length === 0) {
      spinner.warn('No spec files found');
      console.log(chalk.dim('\nSupported file patterns:'));
      console.log(chalk.dim('  - *.openapi.yaml/json'));
      console.log(chalk.dim('  - *.asyncapi.yaml/json'));
      console.log(chalk.dim('  - *.schema.json'));
      console.log(chalk.dim('  - *.odcs.yaml'));
      console.log(chalk.dim('\nYou can manually create contractual.yaml to define contracts.'));
      return;
    }

    // Generate config
    const config = {
      contracts,
      changeset: {
        autoDetect: true,
        requireOnPR: true,
      },
    };

    // Write contractual.yaml
    const yamlContent = stringifyYaml(config, {
      lineWidth: 100,
      singleQuote: true,
    });
    writeFileSync(configPath, yamlContent, 'utf-8');

    // Create .contractual directory structure
    ensureContractualDir(cwd);

    spinner.succeed('Initialized Contractual');

    // Print summary
    console.log();
    console.log(chalk.bold('Created:'));
    console.log(`  ${chalk.green('+')} contractual.yaml`);
    console.log(`  ${chalk.green('+')} .contractual/`);
    console.log(`  ${chalk.green('+')} .contractual/changesets/`);
    console.log(`  ${chalk.green('+')} .contractual/snapshots/`);
    console.log(`  ${chalk.green('+')} .contractual/versions.json`);

    console.log();
    console.log(chalk.bold(`Detected ${contracts.length} contract(s):`));

    for (const contract of contracts) {
      const typeColor = getTypeColor(contract.type);
      console.log(
        `  ${chalk.cyan(contract.name)} ${chalk.dim('(')}${typeColor(contract.type)}${chalk.dim(')')}`
      );
      console.log(`    ${chalk.dim(contract.path)}`);
    }

    console.log();
    console.log(chalk.dim('Next steps:'));
    console.log(chalk.dim('  1. Review contractual.yaml and adjust as needed'));
    console.log(chalk.dim('  2. Run `contractual status` to check current state'));
    console.log(chalk.dim('  3. Run `contractual lint` to validate specs'));
  } catch (error) {
    spinner.fail('Initialization failed');
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(chalk.red(message));
    process.exitCode = 1;
  }
}

/**
 * Get chalk color function for contract type
 */
function getTypeColor(type: ContractType): (text: string) => string {
  switch (type) {
    case 'openapi':
      return chalk.green;
    case 'asyncapi':
      return chalk.magenta;
    case 'json-schema':
      return chalk.blue;
    case 'odcs':
      return chalk.yellow;
    default:
      return chalk.white;
  }
}

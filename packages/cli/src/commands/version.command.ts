import { existsSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import chalk from 'chalk';
import ora from 'ora';
import { loadConfig } from '../config/index.js';
import { findContractualDir, CHANGESETS_DIR } from '../utils/files.js';
import {
  VersionManager,
  readChangesets,
  aggregateBumps,
  extractContractChanges,
  appendChangelog,
} from '@contractual/changesets';
import type { BumpResult } from '@contractual/types';

/**
 * Consume changesets and bump versions
 */
export async function versionCommand(): Promise<void> {
  const spinner = ora('Loading configuration...').start();

  let config;
  try {
    config = loadConfig();
    spinner.succeed('Configuration loaded');
  } catch (error) {
    spinner.fail('Failed to load configuration');
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(chalk.red(message));
    process.exit(1);
  }

  const contractualDir = findContractualDir(config.configDir);
  if (!contractualDir) {
    console.error(chalk.red('No .contractual directory found. Run `contractual init` first.'));
    process.exit(1);
  }

  // Read all changesets
  const readSpinner = ora('Reading changesets...').start();
  const changesetsDir = join(contractualDir, CHANGESETS_DIR);
  const changesets = await readChangesets(changesetsDir);

  if (changesets.length === 0) {
    readSpinner.succeed('No pending changesets');
    console.log(chalk.gray('Nothing to version.'));
    process.exit(0);
  }

  readSpinner.succeed(`Found ${changesets.length} changeset(s)`);

  // Aggregate bumps (highest wins per contract)
  const aggregatedBumps = aggregateBumps(changesets);

  if (Object.keys(aggregatedBumps).length === 0) {
    console.log(chalk.gray('No version bumps required.'));
    process.exit(0);
  }

  // Initialize version manager
  const versionManager = new VersionManager(contractualDir);

  // Process each contract bump
  const bumpSpinner = ora('Applying version bumps...').start();
  const bumpResults: BumpResult[] = [];
  const consumedChangesetPaths: string[] = [];

  for (const [contractName, bumpType] of Object.entries(aggregatedBumps)) {
    // Find the contract in config
    const contract = config.contracts.find((c) => c.name === contractName);
    if (!contract) {
      console.warn(
        chalk.yellow(`Warning: Contract "${contractName}" not found in config, skipping.`)
      );
      continue;
    }

    // Apply semver bump and update snapshot
    const { oldVersion, newVersion } = versionManager.bump(
      contractName,
      bumpType,
      contract.absolutePath
    );

    // Extract changes text from changesets for this contract
    const changes = extractContractChanges(changesets, contractName);

    bumpResults.push({
      contract: contractName,
      oldVersion,
      newVersion,
      bumpType,
      changes,
    });
  }

  bumpSpinner.succeed('Version bumps applied');

  // Append to CHANGELOG.md
  const changelogSpinner = ora('Updating changelog...').start();
  const changelogPath = join(config.configDir, 'CHANGELOG.md');
  try {
    appendChangelog(changelogPath, bumpResults);
    changelogSpinner.succeed('Changelog updated');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    changelogSpinner.warn(`Failed to update changelog: ${message}`);
  }

  // Delete consumed changeset files
  const cleanupSpinner = ora('Cleaning up changesets...').start();

  for (const changeset of changesets) {
    const changesetPath = join(changesetsDir, changeset.filename);
    try {
      if (existsSync(changesetPath)) {
        unlinkSync(changesetPath);
        consumedChangesetPaths.push(changeset.filename);
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  }
  cleanupSpinner.succeed(`Removed ${consumedChangesetPaths.length} changeset(s)`);

  // Print summary
  console.log();
  console.log(chalk.bold('Version Summary:'));
  console.log();

  for (const result of bumpResults) {
    console.log(
      `  ${chalk.cyan(result.contract)}: ` +
        `${chalk.gray(result.oldVersion)} -> ${chalk.green(result.newVersion)} ` +
        `(${result.bumpType})`
    );
  }

  console.log();
  console.log(chalk.green('Done!'), 'Run `contractual status` to verify changes.');
}

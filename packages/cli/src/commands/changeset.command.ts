import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import chalk from 'chalk';
import ora from 'ora';
import { loadConfig } from '../config/index.js';
import { findContractualDir, CHANGESETS_DIR } from '../utils/files.js';
import { getDiffer } from '../governance/index.js';
import { getSnapshotPath } from '../utils/files.js';
import {
  createChangeset,
  generateUniqueChangesetName,
  readChangesets,
} from '@contractual/changesets';
import type { DiffResult } from '@contractual/types';

/**
 * Auto-generate changeset from detected changes
 */
export async function changesetCommand(): Promise<void> {
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

  // Detect changes for all contracts
  const diffSpinner = ora('Detecting changes...').start();
  const diffResults: DiffResult[] = [];

  for (const contract of config.contracts) {
    // Get snapshot path
    const snapshotPath = getSnapshotPath(contract.name, contractualDir);

    if (!snapshotPath) {
      // First version - no changes to compare
      continue;
    }

    // Check if breaking detection is disabled for this contract
    if (contract.breaking === false) {
      continue;
    }

    // Get the differ from the registry
    const differ = getDiffer(contract.type, contract.breaking);

    if (!differ) {
      // No differ available or disabled
      continue;
    }

    try {
      // Run the differ: snapshot (old) vs current spec (new)
      const diffResult = await differ(snapshotPath, contract.absolutePath);

      // Override contract name to match config
      const result: DiffResult = {
        ...diffResult,
        contract: contract.name,
      };

      // Only include if there are actual changes
      if (result.changes.length > 0) {
        diffResults.push(result);
      }
    } catch (error) {
      // Skip contracts that fail to diff
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.warn(chalk.yellow(`Warning: Failed to diff ${contract.name}: ${message}`));
    }
  }

  if (diffResults.length === 0) {
    diffSpinner.succeed('No changes detected');
    console.log(chalk.gray('No changeset created.'));
    process.exit(0);
  }

  diffSpinner.succeed(`Detected changes in ${diffResults.length} contract(s)`);

  // Create changeset content
  const { content: changesetContent } = createChangeset(diffResults);

  // Read existing changesets to ensure unique name
  const changesetsDir = join(contractualDir, CHANGESETS_DIR);
  const existingChangesets = await readChangesets(changesetsDir);
  const existingNames = existingChangesets.map((c) => c.filename.replace(/\.md$/, ''));
  const changesetName = generateUniqueChangesetName(existingNames);

  // Write changeset file
  const changesetPath = join(changesetsDir, `${changesetName}.md`);

  writeFileSync(changesetPath, changesetContent, 'utf-8');

  console.log();
  console.log(chalk.green('Created changeset:'), chalk.cyan(changesetPath));
  console.log();
  console.log(chalk.gray('You can edit this file to add more details about the changes.'));
  console.log(chalk.gray('Run `contractual version` to consume changesets and bump versions.'));
}

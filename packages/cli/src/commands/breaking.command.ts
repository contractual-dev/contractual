import chalk from 'chalk';
import ora from 'ora';
import { loadConfig } from '../config/index.js';
import { findContractualDir, getSnapshotPath } from '../utils/files.js';
import { getDiffer } from '../governance/index.js';
import { formatSeverity } from '../utils/output.js';
import type { DiffResult } from '@contractual/types';

interface BreakingOptions {
  contract?: string;
  format?: 'text' | 'json';
  failOn?: 'breaking' | 'non-breaking' | 'any';
}

interface BreakingCommandResult {
  hasBreaking: boolean;
  results: DiffResult[];
}

/**
 * Detect breaking changes against snapshots
 */
export async function breakingCommand(options: BreakingOptions): Promise<void> {
  const spinner = ora('Loading configuration...').start();

  let config;
  try {
    config = loadConfig();
    spinner.succeed('Configuration loaded');
  } catch (error) {
    spinner.fail('Failed to load configuration');
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(chalk.red(message));
    process.exitCode = 1;
    return;
  }

  const contractualDir = findContractualDir(config.configDir);
  if (!contractualDir) {
    console.error(chalk.red('No .contractual directory found. Run `contractual init` first.'));
    process.exitCode = 1;
    return;
  }

  // Filter contracts if --contract option is provided
  const contracts = options.contract
    ? config.contracts.filter((c) => c.name === options.contract)
    : config.contracts;

  if (options.contract && contracts.length === 0) {
    console.error(chalk.red(`Contract "${options.contract}" not found in configuration.`));
    process.exitCode = 1;
    return;
  }

  const results: DiffResult[] = [];
  let hasBreaking = false;

  for (const contract of contracts) {
    const contractSpinner = ora(`Checking ${contract.name}...`).start();

    // Get snapshot path
    const snapshotPath = getSnapshotPath(contract.name, contractualDir);

    if (!snapshotPath) {
      contractSpinner.info(`No snapshot for ${contract.name} - first version`);
      continue;
    }

    // Check if breaking detection is disabled for this contract
    if (contract.breaking === false) {
      contractSpinner.info(`Breaking detection disabled for ${contract.name}`);
      continue;
    }

    // Get the differ from the registry
    const differ = getDiffer(contract.type, contract.breaking);

    if (differ === null) {
      // Disabled via config
      contractSpinner.info(`Breaking detection disabled for ${contract.name}`);
      continue;
    }

    if (!differ) {
      contractSpinner.warn(`No differ registered for type "${contract.type}"`);
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

      results.push(result);

      if (result.summary.breaking > 0) {
        hasBreaking = true;
        contractSpinner.fail(
          `${contract.name}: ${result.summary.breaking} breaking change(s) detected`
        );
      } else {
        contractSpinner.succeed(`${contract.name}: No breaking changes`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      contractSpinner.fail(`${contract.name}: Failed to check - ${message}`);
    }
  }

  // Output results
  console.log();
  if (options.format === 'json') {
    const output: BreakingCommandResult = { hasBreaking, results };
    console.log(JSON.stringify(output, null, 2));
  } else {
    printTextResults(results);
  }

  // Determine exit code based on --fail-on option
  const failOn = options.failOn ?? 'breaking';
  let shouldFail = false;

  if (failOn === 'any') {
    // Fail on any detected changes
    shouldFail = results.some((r) => r.changes.length > 0);
  } else if (failOn === 'non-breaking') {
    // Fail on non-breaking or breaking changes
    shouldFail = results.some((r) => r.summary.breaking > 0 || r.summary.nonBreaking > 0);
  } else {
    // Default: fail only on breaking changes
    shouldFail = hasBreaking;
  }

  if (shouldFail) {
    process.exitCode = 1;
  }
}

/**
 * Print results in human-readable text format
 */
function printTextResults(results: DiffResult[]): void {
  if (results.length === 0) {
    console.log(chalk.gray('No contracts were checked.'));
    return;
  }

  for (const result of results) {
    console.log(chalk.bold.underline(result.contract));
    console.log();

    if (result.changes.length === 0) {
      console.log(chalk.gray('  No changes detected.'));
      console.log();
      continue;
    }

    // Group changes by severity
    const breaking = result.changes.filter((c) => c.severity === 'breaking');
    const nonBreaking = result.changes.filter((c) => c.severity === 'non-breaking');
    const patch = result.changes.filter((c) => c.severity === 'patch');
    const unknown = result.changes.filter((c) => c.severity === 'unknown');

    // Print summary
    console.log(
      `  Summary: ` +
        `${chalk.red(String(result.summary.breaking))} breaking, ` +
        `${chalk.yellow(String(result.summary.nonBreaking))} non-breaking, ` +
        `${chalk.green(String(result.summary.patch))} patch, ` +
        `${chalk.gray(String(result.summary.unknown))} unknown`
    );
    console.log(`  Suggested bump: ${chalk.cyan(result.suggestedBump)}`);
    console.log();

    // Print changes by severity
    if (breaking.length > 0) {
      console.log(`  ${formatSeverity('breaking')} Changes:`);
      for (const change of breaking) {
        console.log(`    - ${change.path}: ${change.message}`);
      }
      console.log();
    }

    if (nonBreaking.length > 0) {
      console.log(`  ${formatSeverity('non-breaking')} Changes:`);
      for (const change of nonBreaking) {
        console.log(`    - ${change.path}: ${change.message}`);
      }
      console.log();
    }

    if (patch.length > 0) {
      console.log(`  ${formatSeverity('patch')} Changes:`);
      for (const change of patch) {
        console.log(`    - ${change.path}: ${change.message}`);
      }
      console.log();
    }

    if (unknown.length > 0) {
      console.log(`  ${formatSeverity('unknown')} Changes:`);
      for (const change of unknown) {
        console.log(`    - ${change.path}: ${change.message}`);
      }
      console.log();
    }
  }
}

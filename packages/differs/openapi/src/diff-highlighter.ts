import chalk from 'chalk';
import { table } from 'table';
import type OpenApiDiff from 'openapi-diff';
import { type DiffOutcome } from 'openapi-diff';
import type { TableUserConfig } from 'table';

async function printOpenApiDiff(diffOutcome: DiffOutcome) {
  try {
    if ('breakingDifferencesFound' in diffOutcome && diffOutcome.breakingDifferencesFound) {
      console.log(chalk.red.bold('\nBreaking Differences Found:\n'));
      console.log(formatDiffs(diffOutcome.breakingDifferences, chalk.red));
    }

    if (diffOutcome.nonBreakingDifferences.length > 0) {
      console.log(chalk.green.bold('\nNon-Breaking Differences:\n'));
      console.log(formatDiffs(diffOutcome.nonBreakingDifferences, chalk.green));
    }

    if (diffOutcome.unclassifiedDifferences.length > 0) {
      console.log(chalk.yellow.bold('\nUnclassified Differences:\n'));
      console.log(formatDiffs(diffOutcome.unclassifiedDifferences, chalk.yellow));
    }

    if (
      !('breakingDifferencesFound' in diffOutcome) ||
      (!diffOutcome.breakingDifferencesFound &&
        diffOutcome.nonBreakingDifferences.length === 0 &&
        diffOutcome.unclassifiedDifferences.length === 0)
    ) {
      console.log(
        chalk.green.bold('\nNo Differences Found! Specifications are identical or compatible.\n')
      );
    }
  } catch (error) {
    console.error(chalk.red.bold('\nError performing diff:\n'));
    console.error(error);
  }
}

function formatDiffs(
  diffs: OpenApiDiff.DiffResult<any>[],
  colorFn: (text: string) => string
): string {
  const formattedDiffs = diffs.map((diff) => [
    colorFn(diff.code),
    colorFn(diff.entity),
    chalk.bold(diff.action === 'add' ? '➕ Add' : '❌ Remove'),
    diff.sourceSpecEntityDetails.map((d) => `${d.location}`).join(', '),
    diff.destinationSpecEntityDetails.map((d) => `${d.location}`).join(', '),
  ]);

  const tableConfig: TableUserConfig = {
    columns: {
      0: { alignment: 'left', width: 20 },
      1: { alignment: 'left', width: 20 },
      2: { alignment: 'center', width: 10 },
      3: { alignment: 'left', width: 30 },
      4: { alignment: 'left', width: 30 },
    },
  };

  return table(
    [
      [
        chalk.underline.bold('Code'),
        chalk.underline.bold('Entity'),
        chalk.underline.bold('Action'),
        chalk.underline.bold('Source Location'),
        chalk.underline.bold('Destination Location'),
      ],
      ...formattedDiffs,
    ],
    tableConfig
  );
}

export { printOpenApiDiff };

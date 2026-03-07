import { Command } from 'commander';
import { initCommand } from './commands/init.command.js';
import { lintCommand } from './commands/lint.command.js';
import { breakingCommand } from './commands/breaking.command.js';
import { changesetCommand } from './commands/changeset.command.js';
import { versionCommand } from './commands/version.command.js';
import { statusCommand } from './commands/status.command.js';

const program = new Command();

program.name('contractual').description('Schema contract lifecycle orchestrator').version('0.1.0');

program
  .command('init')
  .description('Initialize Contractual in this repository')
  .action(initCommand);

program
  .command('lint')
  .description('Lint all configured contracts')
  .option('-c, --contract <name>', 'Lint specific contract')
  .option('--format <format>', 'Output format: text, json', 'text')
  .option('--fail-on-warn', 'Exit 1 on warnings')
  .action(lintCommand);

program
  .command('breaking')
  .description('Detect breaking changes against last snapshot')
  .option('-c, --contract <name>', 'Check specific contract')
  .option('--format <format>', 'Output format: text, json', 'text')
  .option('--fail-on <level>', 'Exit 1 on: breaking, non-breaking, any', 'breaking')
  .action(breakingCommand);

program
  .command('changeset')
  .description('Create changeset from detected changes')
  .action(changesetCommand);

program
  .command('version')
  .description('Consume changesets and bump versions')
  .action(versionCommand);

program
  .command('status')
  .description('Show current versions and pending changesets')
  .action(statusCommand);

program.parseAsync(process.argv).catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(2);
});

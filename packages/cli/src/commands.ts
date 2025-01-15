import type { GenerateFixturesOptions } from '@contractual/generators.fixtures';
import { Command } from 'commander';
import { generate, generateSpec } from './commands/generate.command.js';
import type { GenerateClientOptions } from './commands/types.js';

const program = new Command();
program.name('contractual').description('A sample CLI tool').version('1.0.0');

const generateCommand = new Command('generate').description('Generate resources');

generateCommand
  .command('client')
  .description('Generate a client based on the provided OpenAPI file')
  .requiredOption('--openapi <filePath>', 'Path to the OpenAPI file')
  .option('--output <directory>', 'Optional output directory')
  .action((options: GenerateClientOptions) => {
    return generate('Client', options);
  });

generateCommand
  .command('fixtures')
  .description('Generate fixtures')
  .requiredOption('--path <directory>', 'Optional target directory')
  .option('--output <directory>', 'Optional output directory')
  .action((options: GenerateFixturesOptions) => {
    return generate('Fixtures', options);
  });

generateCommand
  .command('spec')
  .description('Generate spec')
  .action(async () => {
    await generateSpec();
  });

program.addCommand(generateCommand);

program.command('snapshot').description('Take a snapshot').action(() => {
  console.log('Snapshot taken');
});

program.parse(process.argv);

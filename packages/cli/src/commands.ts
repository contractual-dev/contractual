import { Command } from 'commander';
import { generateContract, generateSpec } from './commands/generate.command.js';
import inquirer from 'inquirer';

const program = new Command();
program.name('contractual').description('A sample CLI tool');

const generateCommand = new Command('generate').description('Generate resources');

generateCommand
  .command('contract')
  .description('Generate a contract based on the provided OpenAPI file')
  .action(() => {
    return generateContract();
  });

generateCommand
  .command('spec')
  .description('Generate spec')
  .action(async () => {
    await generateSpec(inquirer);
  });

program.addCommand(generateCommand);

program.parse(process.argv);

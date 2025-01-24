import { Command } from 'commander';
import { graduateSpec, generateContract } from './commands/generate.command.js';

const program = new Command();
program.name('contractual');

const generateContractCommand = new Command('generate')
  .description('Generate resources')
  .command('contract')
  .description('Generate a contract based on the provided OpenAPI file')
  .action(() => {
    return generateContract();
  });

const graduateSpecCommand = new Command('graduate').command('spec').action(() => {
  return graduateSpec();
});

program.addCommand(graduateSpecCommand);
program.addCommand(generateContractCommand);

program.parse(process.argv);

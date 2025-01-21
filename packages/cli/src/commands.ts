import { Command } from 'commander';
import { generate, generateSpec } from './commands/generate.command.js';
import type { GenerateContractsOptions } from './commands/types.js';
import inquirer from 'inquirer';

const program = new Command();
program.name('contractual').description('A sample CLI tool');

const generateCommand = new Command('generate').description('Generate resources');

generateCommand
  .command('contract')
  .description('Generate a contract based on the provided OpenAPI file')
  .option('--version <filePath>', 'Path to the OpenAPI file')
  .option('--output <directory>', 'Optional output directory')
  .action((options: GenerateContractsOptions) => {
    return generate('Contract', options);
  });

// generateCommand
//   .command('fixtures')
//   .description('Generate fixtures')
//   .requiredOption('--path <directory>', 'Optional target directory')
//   .option('--output <directory>', 'Optional output directory')
//   .action((options: GenerateFixturesOptions) => {
//     return generate('Fixtures', options);
//   });

interface InitCommandAnswers {
  version: string;
  folder: string;
  monorepo: boolean;
  packageManager: 'npm' | 'pnpm' | 'yarn';
  installDependencies: boolean;
}

generateCommand
  .command('spec')
  .description('Generate spec')
  .action(async () => {
    await generateSpec();
  });

const initCommand = new Command('init')
  .description('Initialize a new Contractual project')
  .action(async () => {
    const answers: InitCommandAnswers = await inquirer.prompt<InitCommandAnswers>([
      {
        type: 'input',
        name: 'version',
        message: 'What is the initial version of the API?',
        default: 'v1.0.0',
      },
      {
        type: 'input',
        name: 'folder',
        message: 'Where to store the contractual folder?',
        default: 'root',
      },
      {
        type: 'confirm',
        name: 'monorepo',
        message: 'Are you using a monorepo?',
        default: false,
      },
      {
        type: 'list',
        name: 'packageManager',
        message: 'What package manager do you use?',
        choices: ['npm', 'pnpm', 'yarn'],
        default: 'npm',
      },
      {
        type: 'confirm',
        name: 'installDependencies',
        message: 'Is it okay to install dependencies?',
        default: true,
      },
    ]);
  });

program.addCommand(generateCommand);
program.addCommand(initCommand);

program.parse(process.argv);

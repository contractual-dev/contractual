import { compile, logDiagnostics, NodeHost } from '@typespec/compiler';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as process from 'node:process';
import { parse, stringify } from 'yaml';
import { inc } from 'semver';
import type inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import { diffSpecs, printOpenApiDiff } from '@contractual/generators.diff';

async function initializePaths() {
  const rootPath = path.resolve(process.cwd(), 'contractual');
  const configFilePath = path.resolve(rootPath, 'api-lock.yaml');
  const snapshotsPath = path.resolve(rootPath, 'specs');
  const currentPath = path.resolve(path.dirname(new URL(import.meta.url).pathname));
  const specPath = path.resolve(rootPath, 'api.tsp');
  const tempSpecPath = path.resolve(currentPath, '@typespec', 'openapi3', 'openapi.yaml');

  return { rootPath, configFilePath, snapshotsPath, currentPath, specPath, tempSpecPath };
}

function checkFileExists(filePath: string, errorMessage: string): boolean {
  if (!fs.existsSync(filePath)) {
    console.error(errorMessage, filePath);
    return false;
  }

  return true;
}

async function compileSpecification(specPath: string, outputPath: string) {
  const program = await compile(NodeHost, specPath, {
    emit: ['@typespec/openapi3'],
    additionalImports: ['@typespec/openapi', '@typespec/openapi3', '@typespec/http'],
    outputDir: outputPath,
    ignoreDeprecated: true,
    warningAsError: false,
  });

  if (program.hasError()) {
    logDiagnostics(
      program.diagnostics.filter(({ severity }) => severity === 'error'),
      NodeHost.logSink
    );

    return null;
  }

  return program;
}

async function checkSpecificationDifferences(
  tempSpecPath: string,
  snapshotsPath: string,
  version: string
) {
  return diffSpecs(tempSpecPath, path.resolve(snapshotsPath, `openapi-v${version}.yaml`));
}

function updateVersionAndSnapshot(
  configPath: string,
  snapshotsPath: string,
  tempSpecPath: string,
  currentVersion: string
) {
  const newVersion = inc(currentVersion, 'minor');
  const newConfigContent = stringify({ version: { latest: newVersion } });

  fs.writeFileSync(configPath, newConfigContent);
  fs.copyFileSync(tempSpecPath, path.resolve(snapshotsPath, `openapi-v${newVersion}.yaml`));
}

export function getLatestVersion(configPath: string) {
  const configContent = parse(fs.readFileSync(configPath, 'utf-8'));
  return configContent.version.latest;
}

export async function generateSpecification(inquirerDep: typeof inquirer) {
  const paths = await initializePaths();

  if (!checkFileExists(paths.rootPath, `'contractual' directory not found`)) {
    return;
  }

  if (!fs.existsSync(paths.snapshotsPath)) {
    fs.mkdirSync(paths.snapshotsPath);
  }

  if (!checkFileExists(paths.specPath, 'specification file not found')) {
    process.exit(1);
  }

  const latest = getLatestVersion(paths.configFilePath);

  console.log(chalk.gray(`Latest version is ${latest}`));

  const spinner = ora('Compiling TypeSpec API specification..').start();

  const program = await compileSpecification(paths.specPath, paths.currentPath);

  if (!program) {
    spinner.fail('Compilation failed due to compilation errors');
    return;
  }

  if (!checkFileExists(paths.tempSpecPath, 'openapi.yaml not found')) {
    spinner.fail('Compilation failed due to missing temp openapi.yaml');
    return;
  }

  spinner.succeed('TypeSpec API specification compiled successfully');

  if (latest === 'unversioned') {
    const { initialVersion } = await inquirerDep.prompt([
      {
        type: 'input',
        name: 'initialVersion',
        message: 'Please provide the initial version (e.g., 1.0.0):',
        default: '1.0.0',
        validate: (input) =>
          /^\d+\.\d+\.\d+$/.test(input) ||
          'Invalid version format. Please use semantic versioning format (e.g., 1.0.0).',
      },
    ]);

    const updateSpinner = ora('Creating new version..').start();

    const destinationPath = path.resolve(paths.snapshotsPath, `openapi-v${initialVersion}.yaml`);

    fs.copyFileSync(paths.tempSpecPath, destinationPath);

    updateSpinner.info(`New version ${initialVersion} created successfully`);

    const newConfigContent = stringify({ version: { latest: initialVersion } });

    fs.writeFileSync(paths.configFilePath, newConfigContent);

    updateSpinner.info(`Updated to new version: ${initialVersion}`);

    updateSpinner.succeed('Specification generated successfully');

    return;
  }

  const diffSpinner = ora('Checking for API diff..').start();

  const differences = await checkSpecificationDifferences(
    paths.tempSpecPath,
    paths.snapshotsPath,
    latest
  );

  if (differences.version === 'unchanged') {
    diffSpinner.info('No differences found. Specifications are identical or compatible.');
    return;
  }

  diffSpinner.info('Differences found');

  await printOpenApiDiff(differences.diff!);

  const { confirmUpdate } = await inquirerDep.prompt([
    {
      type: 'confirm',
      name: 'confirmUpdate',
      message: 'Do you want to update the API version?',
      default: true,
    },
  ]);

  if (!confirmUpdate) {
    diffSpinner.info('API version not updated');
    return;
  }

  diffSpinner.start('Updating API version..');

  updateVersionAndSnapshot(paths.configFilePath, paths.snapshotsPath, paths.tempSpecPath, latest);

  diffSpinner.succeed('API version updated successfully');
}

import { compile, logDiagnostics, NodeHost } from '@typespec/compiler';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as process from 'node:process';
import openapiDiff from 'openapi-diff';
import { parse, stringify } from 'yaml';
import { inc } from 'semver';
import inquirer from 'inquirer';

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
  const diff = await openapiDiff.diffSpecs({
    destinationSpec: {
      content: fs.readFileSync(tempSpecPath, 'utf-8'),
      location: tempSpecPath,
      format: 'openapi3',
    },
    sourceSpec: {
      content: fs.readFileSync(path.resolve(snapshotsPath, `openapi-v${version}.yaml`), 'utf-8'),
      location: path.resolve(snapshotsPath, `openapi-v${version}.yaml`),
      format: 'openapi3',
    },
  });

  if (diff.breakingDifferencesFound) {
    console.error('Breaking differences found', diff.breakingDifferences);
    return false;
  }

  if (diff.nonBreakingDifferences.length === 0 && diff.unclassifiedDifferences.length === 0) {
    console.log('No differences found');
    return null;
  }

  return true;
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
  console.log(`Updated to new version: ${newVersion}`);
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

  const program = await compileSpecification(paths.specPath, paths.currentPath);

  if (!program) {
    return;
  }

  if (!checkFileExists(paths.tempSpecPath, 'openapi.yaml not found')) {
    return;
  }

  const configContent = parse(fs.readFileSync(paths.configFilePath, 'utf-8'));

  const {
    version: { latest },
  } = configContent;

  if (latest === 'unversioned') {
    const { initialVersion } = await inquirer.prompt([
      {
        type: 'input',
        name: 'initialVersion',
        message: 'Enter the initial version:',
        default: '1.0.0',
        validate: (input) =>
          /^\d+\.\d+\.\d+$/.test(input) || 'Please enter a valid version (e.g., 1.0.0).',
      },
    ]);

    const destinationPath = path.resolve(paths.snapshotsPath, `openapi-v${initialVersion}.yaml`);
    fs.copyFileSync(paths.tempSpecPath, destinationPath);
    console.log('Initial version created at:', destinationPath);

    const newConfigContent = stringify({ version: { latest: initialVersion } });

    fs.writeFileSync(paths.configFilePath, newConfigContent);

    return;
  }

  const differences = await checkSpecificationDifferences(
    paths.tempSpecPath,
    paths.snapshotsPath,
    latest
  );

  if (differences === false || differences === null) {
    return;
  }

  updateVersionAndSnapshot(paths.configFilePath, paths.snapshotsPath, paths.tempSpecPath, latest);
}

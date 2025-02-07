import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import path from 'node:path';
import process from 'node:process';
import {
  generateSpecification,
  getLatestVersion,
  initializePaths,
  createCommandHandler,
} from '@contractual/openapi';

export function generateContract() {
  return createCommandHandler(
    ora,
    chalk,
    console,
    path.resolve(
      process.cwd(),
      'contractual',
      'specs',
      `openapi-v${getLatestVersion(initializePaths().configFilePath)}.yaml`
    )
  ).handle();
}

export function graduateSpec() {
  return generateSpecification(inquirer);
}

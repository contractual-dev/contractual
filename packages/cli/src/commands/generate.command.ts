import inquirer from 'inquirer';
import { createContractCommandHandler } from '@contractual/generators.contract';
import ora from 'ora';
import chalk from 'chalk';
import path from 'node:path';
import process from 'node:process';
import {
  generateSpecification,
  getLatestVersion,
  initializePaths,
} from '@contractual/generators.spec';

export function generateContract() {
  return createContractCommandHandler(
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

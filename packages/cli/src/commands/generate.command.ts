import { generateSpecification } from '@contractual/generators.spec';
import { generateContract as generateContractImport } from '@contractual/generators.client';
import type inquirer from 'inquirer';

export function generateContract() {
  return generateContractImport();
}

export function generateSpec(inq: typeof inquirer) {
  return generateSpecification(inq);
}
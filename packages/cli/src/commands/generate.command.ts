import { generateSpecification } from '@contractual/generators.spec';
import { generateContract } from '@contractual/generators.client';
import type inquirer from 'inquirer';

export function regenerateContract() {
  return generateContract();
}

export function generateSpec(inq: typeof inquirer) {
  return generateSpecification(inq);
}
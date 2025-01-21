import { generateContract } from '@contractual/generators.contract';
import { generateFixtures, type GenerateFixturesOptions } from '@contractual/generators.fixtures';
import { generateSpecification } from '@contractual/generators.spec';
import { type GenerateContractsOptions, Target } from './types.js';

export async function generate<TTarget extends Target>(
  target: TTarget,
  options: TTarget extends 'Contract'
    ? GenerateContractsOptions
    : TTarget extends 'Fixtures'
      ? GenerateFixturesOptions
      : never
) {
  if (target === Target.Contract) {
    return generateContract();
  }

  if (target === Target.Fixtures) {
    return generateFixtures(options as GenerateFixturesOptions);
  }
}

export function generateSpec() {
  return generateSpecification();
}
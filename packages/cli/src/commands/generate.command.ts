import { transformOpenApiFile } from '@contractual/generators.client';
import { generateFixtures, type GenerateFixturesOptions } from '@contractual/generators.fixtures';
import { generateSpecification } from '@contractual/generators.openapi';
import { type GenerateClientOptions, Target } from './types.js';

export async function generate<TTarget extends Target>(
  target: TTarget,
  options: TTarget extends 'Client'
    ? GenerateClientOptions
    : TTarget extends 'Fixtures'
      ? GenerateFixturesOptions
      : never
) {
  if (target === Target.Client) {
    return transformOpenApiFile((options as GenerateClientOptions).openapi);
  }

  if (target === Target.Fixtures) {
    return generateFixtures(options as GenerateFixturesOptions);
  }
}

export function generateSpec() {
  return generateSpecification();
}
import { getClientPath } from '@contractual/client';
import { generateFixtures, type GenerateFixturesOptions } from '@contractual/fixtures/generator';
import { transformOpenApiFile } from './openapi.transformer.js';
import { type GenerateClientOptions, Target } from './types.js';

export default async function generate<TTarget extends Target>(
  target: TTarget,
  options: TTarget extends 'Client'
    ? GenerateClientOptions
    : TTarget extends 'Fixtures'
      ? GenerateFixturesOptions
      : never
) {
  if (target === Target.Client) {
    return transformOpenApiFile((options as GenerateClientOptions).openapi, getClientPath());
  }

  if (target === Target.Fixtures) {
    return generateFixtures(options as GenerateFixturesOptions);
  }
}

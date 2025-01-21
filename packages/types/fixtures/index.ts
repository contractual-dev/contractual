import type { ApiClientInput, ApiOperationToClientMethod } from '@contractual/contract';
import type { ApiOperations } from '@contractual/contract/contract';

export type FixturesBuilder<TOperation extends keyof typeof ApiOperations> = Record<
  string,
  FixtureCallback<TOperation>
>;

export type FixtureCallback<TOperation extends keyof typeof ApiOperations> = (params: {
  extend: ExtendFunction<TOperation>;
}) => ApiClientInput<ApiOperationToClientMethod<TOperation>>;

export type ExtendFunction<TOperation extends keyof typeof ApiOperations> = (
  fixtures: FixturesBuilder<TOperation>
) => ApiClientInput<ApiOperationToClientMethod<TOperation>>;

export type GeneratedFixtures<TOperation extends keyof typeof ApiOperations> = Record<
  string,
  ApiClientInput<ApiOperationToClientMethod<TOperation>>
>;

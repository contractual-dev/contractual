import type { ApiClient, ApiClientInput, ApiOperationToClientMethod } from '@contractual/contract';
import type { Fixtures } from '@contractual/fixtures/fixtures';
import type { ApiOperations } from '@contractual/contract/contract';

export interface TestFunctionParams<TOperation extends keyof typeof ApiOperations> {
  operation<TFixture extends keyof (typeof Fixtures)[TOperation]>(
    fixture: TFixture
  ): ReturnType<ApiClient[ApiOperationToClientMethod<TOperation>]>;

  operation(
    cb: () => ApiClientInput<ApiOperationToClientMethod<TOperation>>
  ): ReturnType<ApiClient[ApiOperationToClientMethod<TOperation>]>;

  operation<TFixture extends keyof (typeof Fixtures)[TOperation]>(
    fixture: TFixture,
    cb: () => ApiClientInput<ApiOperationToClientMethod<TOperation>>
  ): ReturnType<ApiClient[ApiOperationToClientMethod<TOperation>]>;

  operation<TFixture extends keyof (typeof Fixtures)[TOperation]>(
    fixture?: TFixture,
    cb?: () => ApiClientInput<ApiOperationToClientMethod<TOperation>>
  ): ReturnType<ApiClient[ApiOperationToClientMethod<TOperation>]>;
}

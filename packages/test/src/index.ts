import type { appRouter } from '@contractual/client';
import { type ApiClient, type ApiClientInput, getApiClient } from '@contractual/client';
import { ApiOperations } from '@contractual/client/client';
import { Fixtures } from '@contractual/fixtures/fixtures';
import type { TestFunctionParams } from '@contractual/types.test';
import { test as playwrightTest } from '@playwright/test';
import type { ClientArgs, InitClientReturn } from '@ts-rest/core';

const testFixture = playwrightTest.extend<{ client: ApiClient }>({
  client: async ({ baseURL, extraHTTPHeaders }, use) => {
    await use(
      getApiClient({
        baseUrl: baseURL || 'http://localhost:3000',
        baseHeaders: extraHTTPHeaders,
      })
    );
  },
});

export function test<TOperation extends keyof typeof ApiOperations>(
  operation: TOperation,
  fn: (fixtures: TestFunctionParams<TOperation>) => Promise<void>
) {
  // Create the operation function
  const operationFn = (
    clientMethod: (typeof ApiOperations)[TOperation],
    client: InitClientReturn<typeof appRouter, ClientArgs>
  ) =>
    Object.assign(
      <TFixture extends keyof (typeof Fixtures)[TOperation]>(fixture: TFixture) => {
        const resolvedFixture = Fixtures[operation][fixture];

        return (
          client[clientMethod] as (
            args: ApiClientInput<typeof clientMethod>
          ) => ReturnType<ApiClient[typeof clientMethod]>
        )(resolvedFixture as ApiClientInput<typeof clientMethod>);
      },
      (cb?: () => ApiClientInput<typeof clientMethod>) => {
        if (!cb) {
          throw new Error('Callback function is required for operation');
        }

        return (
          client[clientMethod] as (
            args: ApiClientInput<typeof clientMethod>
          ) => ReturnType<ApiClient[typeof clientMethod]>
        )(cb());
      }
    );

  // Extend Playwright's test runner
  return testFixture(operation, async ({ client }) => {
    // Resolve the client method
    const clientMethod = ApiOperations[operation];

    // Call the user-defined function with resolved fixtures and test info
    await fn({ operation: operationFn(clientMethod, client) });
  });
}

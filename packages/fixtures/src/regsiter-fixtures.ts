import type { ApiClientInput, ApiOperationToClientMethod } from '@contractual/client';
import type { ApiOperations } from '@contractual/client/client';
import type {
  FixtureCallback,
  FixturesBuilder,
  GeneratedFixtures,
} from '@contractual/types.fixtures';

export type RegisterFixturesReturnType<TOperation extends keyof typeof ApiOperations> = {
  operation: TOperation;
  fixtures: GeneratedFixtures<TOperation>;
};

export function registerFixtures<TOperation extends keyof typeof ApiOperations>(
  operation: TOperation,
  fixturesBuilder: FixturesBuilder<TOperation>
): RegisterFixturesReturnType<TOperation> {
  const processFixture = (
    callback: FixtureCallback<TOperation>,
    baseKey: string
  ): GeneratedFixtures<TOperation> => {
    // Define a flag to detect if `extend` was called
    let extendCalled = false;

    const fixture = callback({
      extend: (extensions: FixturesBuilder<TOperation>) => {
        // Mark that `extend` was called
        extendCalled = true;

        // Recursively process nested fixtures with updated keys
        return Object.entries<FixtureCallback<TOperation>>(extensions).reduce(
          (acc: GeneratedFixtures<TOperation>, [key, nestedCallback]) => {
            const nestedKey = `${baseKey} ${key}`;
            const nestedResult = processFixture(nestedCallback, nestedKey);

            // Merge nested results without wrapping
            return { ...acc, ...nestedResult };
          },
          {} as GeneratedFixtures<TOperation>
        ) as ApiClientInput<ApiOperationToClientMethod<TOperation>>;
      },
    });

    // If `extend` was called, do NOT include the baseKey itself
    if (extendCalled) {
      return fixture as GeneratedFixtures<TOperation>;
    }

    // If no `extend` was called, return the baseKey fixture directly
    return { [baseKey]: fixture };
  };

  // Process all top-level fixtures
  const fixtures = Object.entries(fixturesBuilder).reduce<GeneratedFixtures<TOperation>>(
    (result, [key, callback]) => ({
      ...result,
      ...processFixture(callback, key), // Add processed fixtures
    }),
    {} as GeneratedFixtures<TOperation>
  );

  return { operation, fixtures };
}

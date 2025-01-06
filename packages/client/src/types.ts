import type { ApiOperations } from '../client/index.js';
import type { ApiClient } from './api-client';

export type ApiOperationToClientMethod<TOperation extends keyof typeof ApiOperations> =
  (typeof ApiOperations)[TOperation];

export type ApiClientInput<TMethod extends keyof ApiClient> = ApiClient[TMethod] extends (
  data: infer TInput
) => any
  ? TInput
  : never;

import * as path from 'node:path';
export * from './api-client.js';
export * from './types.js';

export function getClientPath() {
  return path.resolve('..', 'client');
}

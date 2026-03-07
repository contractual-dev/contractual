// Public API for programmatic use
export { loadConfig, ConfigError } from './config/index.js';
export { registerLinter, registerDiffer, getLinter, getDiffer } from './governance/index.js';

// Re-export from @contractual/changesets
export {
  VersionManager,
  createChangeset,
  readChangesets,
  aggregateBumps,
  generateChangesetName,
  VERSIONS_FILE,
  SNAPSHOTS_DIR,
  CHANGESETS_DIR,
} from '@contractual/changesets';

// Re-export types from @contractual/types
export type * from '@contractual/types';

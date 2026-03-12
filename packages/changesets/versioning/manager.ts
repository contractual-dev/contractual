import { existsSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import * as semver from 'semver';
import type { VersionsFile, SimpleVersionEntry, BumpType } from '@contractual/types';

/**
 * Default version for new contracts
 */
export const DEFAULT_VERSION = '0.0.0' as const;

/**
 * Supported spec file extensions for snapshot lookup
 */
export const SPEC_EXTENSIONS = ['.yaml', '.yml', '.json'] as const;

/**
 * Error thrown when version operations fail
 */
export class VersionError extends Error {
  constructor(
    message: string,
    public readonly version?: string,
    public readonly bumpType?: BumpType
  ) {
    super(message);
    this.name = 'VersionError';
  }
}

/**
 * Result of a version bump operation
 */
export interface BumpOperationResult {
  /** Version before the bump */
  oldVersion: string;
  /** Version after the bump */
  newVersion: string;
}

/**
 * Increment a version by a bump type
 * @param version - The current version string (must be valid semver)
 * @param bumpType - The type of version bump (major, minor, patch)
 * @returns The new version string
 * @throws {VersionError} If the version is invalid or increment fails
 */
export function incrementVersion(version: string, bumpType: BumpType): string {
  if (!semver.valid(version)) {
    throw new VersionError(`Invalid semver version: ${version}`, version, bumpType);
  }
  const newVersion = semver.inc(version, bumpType);
  if (!newVersion) {
    throw new VersionError(
      `Failed to increment version ${version} with type ${bumpType}`,
      version,
      bumpType
    );
  }
  return newVersion;
}

/**
 * Filename for the versions registry
 */
export const VERSIONS_FILE = 'versions.json' as const;

/**
 * Directory name for snapshots
 */
export const SNAPSHOTS_DIR = 'snapshots' as const;

/**
 * Directory name for changesets
 */
export const CHANGESETS_DIR = 'changesets' as const;

/**
 * Manages contract versions and snapshots
 */
export class VersionManager {
  private readonly versionsPath: string;
  private readonly snapshotsDir: string;
  private versions: VersionsFile;

  constructor(contractualDir: string) {
    this.versionsPath = join(contractualDir, VERSIONS_FILE);
    this.snapshotsDir = join(contractualDir, SNAPSHOTS_DIR);
    this.versions = this.load();
  }

  /**
   * Load versions.json from disk
   * @throws {VersionError} If the file exists but contains invalid JSON
   */
  private load(): VersionsFile {
    if (!existsSync(this.versionsPath)) {
      return {};
    }

    const content = readFileSync(this.versionsPath, 'utf-8');
    try {
      const parsed: unknown = JSON.parse(content);
      if (!this.isValidVersionsFile(parsed)) {
        throw new VersionError(`Invalid versions.json format at ${this.versionsPath}`);
      }
      return parsed;
    } catch (error) {
      if (error instanceof VersionError) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new VersionError(`Failed to parse versions.json: ${message}`);
    }
  }

  /**
   * Type guard to validate VersionsFile structure
   */
  private isValidVersionsFile(value: unknown): value is VersionsFile {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return false;
    }
    for (const entry of Object.values(value as Record<string, unknown>)) {
      if (!this.isValidVersionEntry(entry)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Type guard to validate SimpleVersionEntry structure
   */
  private isValidVersionEntry(value: unknown): value is SimpleVersionEntry {
    if (typeof value !== 'object' || value === null) {
      return false;
    }
    const entry = value as Record<string, unknown>;
    return typeof entry.version === 'string' && typeof entry.released === 'string';
  }

  /**
   * Get current version for a contract
   * @param contractName - The contract name to look up
   * @returns The version string, or null if not found
   */
  getVersion(contractName: string): string | null {
    const entry = this.versions[contractName];
    return entry?.version ?? null;
  }

  /**
   * Get snapshot path for a contract
   * @param contractName - The contract name to look up
   * @returns The snapshot file path, or null if not found
   */
  getSnapshotPath(contractName: string): string | null {
    for (const ext of SPEC_EXTENSIONS) {
      const snapshotPath = join(this.snapshotsDir, `${contractName}${ext}`);
      if (existsSync(snapshotPath)) {
        return snapshotPath;
      }
    }

    return null;
  }

  /**
   * Bump version, update versions.json, and copy spec to snapshots
   * @param contractName - The contract name to bump
   * @param bumpType - The type of version bump (major, minor, patch)
   * @param specPath - Path to the current spec file to snapshot
   * @returns The old and new version strings
   * @throws {VersionError} If the bump operation fails
   */
  bump(contractName: string, bumpType: BumpType, specPath: string): BumpOperationResult {
    const currentEntry = this.versions[contractName];
    const oldVersion = currentEntry?.version ?? DEFAULT_VERSION;

    // Use the shared incrementVersion function for consistent error handling
    const newVersion = incrementVersion(oldVersion, bumpType);

    // Update versions entry
    this.versions[contractName] = {
      version: newVersion,
      released: new Date().toISOString(),
    };

    // Copy spec to snapshots directory
    const ext = extname(specPath) || '.yaml';
    const snapshotPath = join(this.snapshotsDir, `${contractName}${ext}`);
    copyFileSync(specPath, snapshotPath);

    // Save versions.json
    this.save();

    return { oldVersion, newVersion };
  }

  /**
   * Save versions.json to disk
   */
  private save(): void {
    const content = JSON.stringify(this.versions, null, 2);
    writeFileSync(this.versionsPath, content, 'utf-8');
  }
}

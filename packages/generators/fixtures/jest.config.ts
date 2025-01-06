import type { Config } from 'jest';
import baseConfig from '../../../jest.base.config';

const config: Config = {
  ...baseConfig(process.env.COVERAGE_DIR),
  id: 'generators.fixtures',
  displayName: 'generators.fixtures',
  collectCoverageFrom: ['src/**/*.ts', 'test/**/*.ts'],
  coveragePathIgnorePatterns: [
    'index.ts',
    'types.ts',
  ],
};

export default config;

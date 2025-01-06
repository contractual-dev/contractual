import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  name: 'demo-api',
  testDir: __dirname,
  testMatch: '*.e2e.test.ts',
  workers: 1,
  retries: 0,
  use: {
    baseURL: 'https://dash.readme.com/api/v1',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa('rdme_xn8s9h2390f02a267ff4123685499bbbf93db28092eb3fd3da3b817fa2d0b82a1ced11')}:`,
    },
  },
};

export default config;

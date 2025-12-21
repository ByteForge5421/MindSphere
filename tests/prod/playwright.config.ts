import { defineConfig } from '@playwright/test';

const PROD_URL = 'https://mindsphere-hub.vercel.app';

export default defineConfig({
  testDir: '.',
  timeout: 60_000,
  retries: 1,
  workers: 1, // serial — tests share auth state via storageState

  use: {
    baseURL: PROD_URL,
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],

  outputDir: './test-results',
});

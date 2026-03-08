import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',

  use: {
    baseURL: 'http://localhost:8080',
    headless: true,
  },

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
  },

  projects: [
    {
      name: 'setup',
      testMatch: '**/auth.setup.ts',
      use: { browserName: 'chromium' },
    },
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  timeout: 60_000,
  retries: 0,
  // In GitHub Actions, failures also show up as annotations on the pull request.
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    // Locally you can run against an installed Chrome with PW_CHANNEL=chrome.
    channel: process.env.PW_CHANNEL || undefined,
  },
});

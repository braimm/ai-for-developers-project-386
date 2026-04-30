import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'APP_STORAGE=memory make run',
      url: 'http://localhost:8000/health',
      reuseExistingServer: !process.env.CI,
      cwd: '..',
    },
    {
      command: 'make frontend-dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      cwd: '../frontend',
    },
  ],
});

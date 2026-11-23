import { defineConfig, devices } from '@playwright/test';

// Uses the Microsoft Edge already on the machine (no browser download needed).
// Set PW_CHANNEL=chrome to use Google Chrome instead.
const channel = process.env.PW_CHANNEL || 'msedge';
export default defineConfig({
  testDir: 'tests',
  timeout: 60_000,
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:4180', channel, trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Edge'], channel, viewport: { width: 1360, height: 860 } } },
    { name: 'phone', use: { ...devices['Pixel 7'], channel }, grep: /@phone/ },
  ],
  webServer: { command: 'npx vite build && npx vite preview --port 4180 --strictPort', url: 'http://localhost:4180', reuseExistingServer: !process.env.CI, timeout: 120_000 },
});

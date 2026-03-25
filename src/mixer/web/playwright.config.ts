// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { PlaywrightTestConfig } from '@playwright/test';

const serverURL = process.env.NEXT_PUBLIC_URL;

const config: PlaywrightTestConfig = {
  testDir: '.',
  testMatch: [
    'src/**/*e2e.test.{js,jsx,ts,tsx}',
  ],
  workers: 999,
  timeout: 600000,
  webServer: {
    command: 'npm run serve',
    url: serverURL,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: serverURL,
    // headless: false,
    // viewport: { width: 1280, height: 720 },
    // ignoreHTTPSErrors: true,
    // video: 'on-first-retry',
  },
  // globalSetup: './playwright.setup',
};

export default config;

// readme https://playwright.dev/
import { expect, test } from '@playwright/test';

test.describe('Startup', () => {

  test('has title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Mixer/);
  });

});

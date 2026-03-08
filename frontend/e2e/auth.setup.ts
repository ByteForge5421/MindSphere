import { test } from '@playwright/test';

test('authenticate', async ({ page }) => {
  await page.goto('/login');

  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'password123');

  await page.click('button:has-text("Sign In")');

  await page.waitForURL('**/dashboard');

  await page.context().storageState({
    path: 'playwright/.auth/user.json'
  });
});

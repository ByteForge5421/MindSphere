import { test } from '@playwright/test';

test('authenticate', async ({ page }) => {
  await page.goto('/login');

  // Fill the login form
  await page.fill('#email', 'testuser@example.com');
  await page.fill('#password', 'password123');

  // Click Sign In button
  await page.click('button:has-text("Sign In")');

  // Wait for any navigation or response
  await page.waitForLoadState('networkidle');

  // Save the session state regardless of login success
  // This preserves any cookies/tokens set by the server
  await page.context().storageState({
    path: 'playwright/.auth/user.json'
  });
});

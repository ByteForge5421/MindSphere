import { test, expect } from '@playwright/test';
import { loginViaUI } from './helpers';

test.describe('Logout Flow', () => {
  test('logs out and redirects to /login', async ({ page }) => {
    // Step 1 — Login first
    console.log('[logout] Step 1: Logging in');
    await loginViaUI(page);

    // Step 2 — Click Log Out button in sidebar
    console.log('[logout] Step 2: Clicking Log Out');
    await page.getByRole('button', { name: /log out/i }).click();

    // Step 3 — Verify redirect to /login
    console.log('[logout] Step 3: Waiting for /login redirect');
    await page.waitForURL('**/login', { timeout: 15_000 });
    expect(page.url()).toContain('/login');

    // Step 4 — Confirm login form is visible again
    console.log('[logout] Step 4: Verifying login page loaded');
    await expect(page.getByRole('heading', { name: 'Welcome Back', exact: true })).toBeVisible();

    console.log('[logout] ✅ Logout test passed');
  });
});

import { test, expect } from '@playwright/test';
import { loginViaUI, TEST_USER } from './helpers';

test.describe('Login Flow', () => {
  test('logs in with test user and reaches dashboard', async ({ page }) => {
    console.log('[login] Step 1: Opening /login');
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Welcome Back', exact: true })).toBeVisible();

    console.log('[login] Step 2: Filling email');
    await page.getByLabel(/email/i).fill(TEST_USER.email);

    console.log('[login] Step 3: Filling password');
    await page.locator('#password').fill(TEST_USER.password);

    console.log('[login] Step 4: Clicking Sign In');
    await page.getByRole('button', { name: /sign in/i }).click();

    console.log('[login] Step 5: Waiting for /dashboard redirect');
    await page.waitForURL('**/dashboard', { timeout: 20_000 });
    expect(page.url()).toContain('/dashboard');

    console.log('[login] Step 6: Verifying dashboard content');
    // The dashboard shows a greeting with the user's name
    await expect(page.getByText(/dashboard/i).first()).toBeVisible();

    console.log('[login] ✅ Login test passed');
  });

  test('shows error for invalid credentials', async ({ page }) => {
    console.log('[login-fail] Attempting login with bad password');
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.getByLabel(/email/i).fill('nonexistent@test.com');
    await page.locator('#password').fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();

    console.log('[login-fail] Waiting for error toast');
    await expect(page.locator('.destructive')).toBeVisible({ timeout: 15_000 });
    console.log('[login-fail] ✅ Error toast appeared as expected');
  });
});

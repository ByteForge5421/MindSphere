import { test, expect } from '@playwright/test';
import { assertNoErrorToast, TEST_USER, BACKEND_URL } from './helpers';

test.describe('Registration Flow', () => {
  test('registers a new user with dynamic email', async ({ page }) => {
    const uniqueEmail = `prodtest+${Date.now()}@mindsphere.com`;
    console.log(`[registration] Using email: ${uniqueEmail}`);

    // Step 1 — Open register page
    console.log('[registration] Step 1: Navigating to /register');
    await page.goto('/register');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/create your account/i)).toBeVisible();

    // Step 2 — Fill in form fields
    console.log('[registration] Step 2: Filling form fields');
    await page.getByLabel(/full name/i).fill('E2E Prod User');
    await page.getByLabel(/email/i).fill(uniqueEmail);
    await page.locator('#password').fill('TestPass123!');
    await page.locator('#confirmPassword').fill('TestPass123!');

    // Step 3 — Select Student role
    console.log('[registration] Step 3: Selecting Student role');
    await page.locator('label[for="student"]').click();

    // Step 4 — Submit
    console.log('[registration] Step 4: Clicking Create My Account');
    await page.getByRole('button', { name: /create my account/i }).click();

    // Step 5 — Wait for navigation away from /register
    console.log('[registration] Step 5: Waiting for redirect');
    await page.waitForURL(url => !url.toString().includes('/register'), {
      timeout: 20_000,
    });
    console.log(`[registration] Redirected to: ${page.url()}`);

    // Step 6 — Verify no error toast
    console.log('[registration] Step 6: Checking for error toasts');
    await assertNoErrorToast(page);

    // Accept /, /dashboard, or /login as success (register navigates to '/')
    expect(page.url()).toMatch(/\/(dashboard|login)?$/);
    console.log('[registration] ✅ Registration completed successfully');
  });

  test('shows error for duplicate email', async ({ page }) => {
    console.log('[registration-dup] Attempting duplicate registration');
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    await page.getByLabel(/full name/i).fill(TEST_USER.name);
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.locator('#password').fill(TEST_USER.password);
    await page.locator('#confirmPassword').fill(TEST_USER.password);
    await page.locator('label[for="student"]').click();
    await page.getByRole('button', { name: /create my account/i }).click();

    // Should show destructive toast for duplicate
    console.log('[registration-dup] Waiting for error toast');
    await expect(page.locator('.destructive')).toBeVisible({ timeout: 15_000 });
    console.log('[registration-dup] ✅ Error toast appeared as expected');
  });
});

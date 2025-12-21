/**
 * Shared helpers for production E2E tests.
 */
import { type Page, expect } from '@playwright/test';

export const PROD_URL = 'https://mindsphere-hub.vercel.app';
export const BACKEND_URL = 'https://mindsphere-backend-9c0u.onrender.com';

// Persistent test-user credentials (pre-registered)
export const TEST_USER = {
  email: 'prodtest@mindsphere.com',
  password: 'TestPass123!',
  name: 'Prod Tester',
  role: 'student',
};

/** Login via the UI and wait for redirect to /dashboard */
export async function loginViaUI(page: Page) {
  console.log('  → Navigating to /login');
  await page.goto('/login', { timeout: 30_000 });
  await page.waitForLoadState('networkidle');

  console.log('  → Filling credentials');
  await page.getByLabel(/email/i).fill(TEST_USER.email);
  await page.locator('#password').fill(TEST_USER.password);

  console.log('  → Clicking Sign In');
  await page.getByRole('button', { name: /sign in/i }).click();

  console.log('  → Waiting for /dashboard redirect');
  await page.waitForURL('**/dashboard', { timeout: 20_000 });
  expect(page.url()).toContain('/dashboard');
  console.log('  → Logged in successfully');
}

/**
 * Assert that no destructive (red error) toast appeared.
 * Shadcn toasts with variant "destructive" get the CSS class "destructive".
 */
export async function assertNoErrorToast(page: Page) {
  const errorToast = page.locator('.destructive');
  const count = await errorToast.count();
  if (count > 0) {
    const text = await errorToast.first().innerText();
    throw new Error(`Destructive error toast appeared: ${text}`);
  }
}

import { test, expect } from '@playwright/test';
import { loginViaUI } from './helpers';

test.describe('Journal Flow', () => {
  test('creates a journal entry after login', async ({ page }) => {
    // Step 1 — Login
    console.log('[journal] Step 1: Logging in');
    await loginViaUI(page);

    // Step 2 — Navigate to journal
    console.log('[journal] Step 2: Navigating to /journal');
    await page.goto('/journal');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/mental wellness journal/i).first()).toBeVisible();

    // Step 3 — Fill journal entry
    const title = `E2E Test Entry ${Date.now()}`;
    const content = 'This is an automated production E2E test journal entry. Feeling great today!';

    console.log(`[journal] Step 3: Creating journal with title "${title}"`);
    await page.getByPlaceholder(/entry title/i).fill(title);
    await page.getByPlaceholder(/what's on your mind/i).fill(content);

    // Step 4 — Save
    console.log('[journal] Step 4: Clicking Save');
    await page.getByRole('button', { name: /save/i }).click();

    // Step 5 — Verify success toast
    console.log('[journal] Step 5: Waiting for success confirmation');
    await expect(
      page.getByText(/journal entry saved/i).first()
    ).toBeVisible({ timeout: 15_000 });

    // Step 6 — Reload to refresh the journal list, then verify entry appears
    console.log('[journal] Step 6: Reloading page to refresh journal list');
    await page.reload({ waitUntil: 'networkidle' });
    console.log('[journal] Step 7: Verifying journal appears in list');
    await expect(page.getByText(title)).toBeVisible({ timeout: 15_000 });

    console.log('[journal] ✅ Journal creation test passed');
  });
});

import { test, expect } from '@playwright/test';
import { loginViaUI } from './helpers';

test.describe('Mood Check-in Flow', () => {
  test('submits a mood check-in from the check-in page', async ({ page }) => {
    // Step 1 — Login
    console.log('[mood] Step 1: Logging in');
    await loginViaUI(page);

    // Step 2 — Navigate to check-in page
    console.log('[mood] Step 2: Navigating to /check-in');
    await page.goto('/check-in');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/how are you feeling/i).first()).toBeVisible();

    // Step 3 — Fill the text input
    console.log('[mood] Step 3: Filling mood text');
    await page.getByPlaceholder(/today i feel/i).fill(
      'E2E production test — feeling productive and happy!'
    );

    // Step 4 — Adjust mood slider (optional — default 5 is fine)
    console.log('[mood] Step 4: Mood slider at default value');

    // Step 5 — Submit check-in
    console.log('[mood] Step 5: Clicking Submit Check-in');
    await page.getByRole('button', { name: /submit check-in/i }).click();

    // Step 6 — Verify success toast
    console.log('[mood] Step 6: Waiting for success confirmation');
    await expect(
      page.getByText(/check-in recorded/i).first()
    ).toBeVisible({ timeout: 20_000 });

    console.log('[mood] ✅ Mood check-in test passed');
  });
});

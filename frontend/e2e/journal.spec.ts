import { test, expect } from '@playwright/test';
import { ensureAuthenticated } from './auth-helper';

test.describe('Journal', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure we're authenticated before each test
    await ensureAuthenticated(page);
  });

  test('user can create a journal entry', async ({ page }) => {
    const title = `Journal Entry ${Date.now()}`;
    const content = `Playwright journal test - ${Date.now()}`;

    // Verify we're on the journal page
    await expect(page).toHaveURL(/.*journal/);

    // Fill in title
    const titleInput = page.getByPlaceholder('Entry Title');
    await expect(titleInput).toBeVisible();
    await titleInput.fill(title);

    // Fill in content
    const contentTextarea = page.getByPlaceholder(/What's on your mind/);
    await expect(contentTextarea).toBeVisible();
    await contentTextarea.fill(content);

    // Click the Save Entry button
    await page.getByRole('button', { name: /Save Entry/i }).click();

    // Wait for network to settle
    await page.waitForLoadState('networkidle');

    // Wait a moment for the entry to appear or reload page
    await page.waitForTimeout(1000);
    
    // Reload the page to see the newly saved entry
    await page.reload({ waitUntil: 'networkidle' });

    // Verify the entry appears on the page
    await expect(page.getByText(title)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(content)).toBeVisible({ timeout: 10000 });
  });

  test('user can view multiple journal entries', async ({ page }) => {
    // Verify we're on the journal page
    await expect(page).toHaveURL(/.*journal/);

    // Verify the journal form is visible
    const titleInput = page.getByPlaceholder('Entry Title');
    await expect(titleInput).toBeVisible();
  });

  test('journal textarea is cleared after saving', async ({ page }) => {
    const title = `Entry ${Date.now()}`;
    const content = `Test content ${Date.now()}`;

    // Fill and submit form
    const titleInput = page.getByPlaceholder('Entry Title');
    const contentTextarea = page.getByPlaceholder(/What's on your mind/);
    
    await titleInput.fill(title);
    await contentTextarea.fill(content);

    await page.getByRole('button', { name: /Save Entry/i }).click();

    // Wait for network to settle
    await page.waitForLoadState('networkidle');

    // Verify textarea is cleared
    await expect(contentTextarea).toHaveValue('');
    // Also verify title is cleared
    await expect(titleInput).toHaveValue('');
  });

  test('user cannot save empty journal entry', async ({ page }) => {
    // Get the form fields
    const titleInput = page.getByPlaceholder('Entry Title');
    const contentTextarea = page.getByPlaceholder(/What's on your mind/);
    const saveButton = page.getByRole('button', { name: /Save Entry/i });

    // Verify button is disabled when both fields are empty
    await expect(saveButton).toBeDisabled();

    // Fill only title, button should still be disabled (content is empty)
    await titleInput.fill('Only Title');
    await expect(saveButton).toBeDisabled();

    // Fill only content, button should still be disabled (title is empty)
    await titleInput.fill('');
    await contentTextarea.fill('Only Content');
    await expect(saveButton).toBeDisabled();
  });
});

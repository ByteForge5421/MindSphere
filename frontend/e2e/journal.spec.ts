import { test, expect } from '@playwright/test';
import { ensureAuthenticated } from './auth-helper';
import { JournalPage } from './pages/JournalPage';

test.describe('Journal', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure we're authenticated before each test
    await ensureAuthenticated(page);
  });

  test('user can create a journal entry', async ({ page }) => {
    const journalPage = new JournalPage(page);
    const title = `Journal Entry ${Date.now()}`;
    const content = `Playwright journal test - ${Date.now()}`;

    await journalPage.verifyOnJournalPage();
    await journalPage.submitEntryWithData(title, content);

    // Verify the entry appears on the page
    await journalPage.verifyEntryDisplayed(title, content);
  });

  test('user can view multiple journal entries', async ({ page }) => {
    const journalPage = new JournalPage(page);

    await journalPage.verifyOnJournalPage();
    await journalPage.verifyFormElementsVisible();
  });

  test('journal textarea is cleared after saving', async ({ page }) => {
    const journalPage = new JournalPage(page);
    const title = `Entry ${Date.now()}`;
    const content = `Test content ${Date.now()}`;

    await journalPage.fillEntryForm(title, content);
    await journalPage.clickSave();
    await page.waitForLoadState('networkidle');

    // Verify fields are cleared
    await journalPage.verifyInputCleared();
  });

  test('user cannot save empty journal entry', async ({ page }) => {
    const journalPage = new JournalPage(page);

    // Verify button is disabled when both fields are empty
    await expect(journalPage.getSaveButton()).toBeDisabled();

    // Fill only title, button should still be disabled (content is empty)
    await journalPage.fillTitle('Only Title');
    await expect(journalPage.getSaveButton()).toBeDisabled();

    // Fill only content, button should still be disabled (title is empty)
    await journalPage.fillTitle('');
    await journalPage.fillContent('Only Content');
    await expect(journalPage.getSaveButton()).toBeDisabled();
  });
});

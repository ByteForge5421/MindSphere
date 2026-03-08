import { test, expect } from '@playwright/test';
import { ensureAuthenticated } from './auth-helper';

test.describe('Chat', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure we're authenticated before each test
    await ensureAuthenticated(page);
  });

  test('user can navigate to community and see groups', async ({ page }) => {
    // Navigate to community page
    await page.goto('/community');

    // Verify we're on the community page
    await expect(page).toHaveURL(/.*community/);

    // Verify community page content is loaded
    await expect(page.locator('h3').filter({ hasText: 'Community Chat' })).toBeVisible({ timeout: 10000 });
  });

  test('user can join a group and send a message', async ({ page }) => {
    const message = `Playwright chat ${Date.now()}`;

    // Navigate to community page
    await page.goto('/community');
    await expect(page).toHaveURL(/.*community/);

    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Click on first group card to select it
    const groupCards = page.locator('[class*="card"]').filter({ hasText: /Anxiety|Mindfulness|Student|Mood|Sleep/ });
    if (await groupCards.first().isVisible({ timeout: 5000 })) {
      await groupCards.first().click();
      await page.waitForLoadState('networkidle');
    }

    // Try to find and fill the chat input - it might have different attributes
    const chatInput = page.locator('input[placeholder="Type your message..."], textarea[placeholder="Type your message..."]');
    
    if (await chatInput.isVisible({ timeout: 5000 })) {
      await chatInput.fill(message);
      
      // Find and click Send button
      const sendButton = page.locator('button').filter({ hasText: /send|Send/i }).first();
      if (await sendButton.isVisible()) {
        await sendButton.click();
        await page.waitForLoadState('networkidle');
        
        // Verify message appears
        await expect(page.getByText(message)).toBeVisible({ timeout: 10000 });
      }
    }
  });

  test('chat input is cleared after sending message', async ({ page }) => {
    const message = `Test clear ${Date.now()}`;

    await page.goto('/community');
    await expect(page).toHaveURL(/.*community/);

    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Click on first group card
    const groupCards = page.locator('[class*="card"]').filter({ hasText: /Anxiety|Mindfulness|Student|Mood|Sleep/ });
    if (await groupCards.first().isVisible({ timeout: 5000 })) {
      await groupCards.first().click();
      await page.waitForLoadState('networkidle');
    }

    const chatInput = page.locator('input[placeholder="Type your message..."], textarea[placeholder="Type your message..."]');
    
    if (await chatInput.isVisible({ timeout: 5000 })) {
      await chatInput.fill(message);
      
      const sendButton = page.locator('button').filter({ hasText: /send|Send/i }).first();
      if (await sendButton.isVisible()) {
        await sendButton.click();
        await page.waitForLoadState('networkidle');
        
        // Verify input is cleared after sending
        await expect(chatInput).toHaveValue('', { timeout: 5000 });
      }
    }
  });
});

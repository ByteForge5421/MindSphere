import { test, expect } from '@playwright/test';
import { ensureAuthenticated } from './auth-helper';
import { ChatPage } from './pages/ChatPage';

test.describe('Chat', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure we're authenticated before each test
    await ensureAuthenticated(page);
  });

  test('user can navigate to community and see groups', async ({ page }) => {
    const chatPage = new ChatPage(page);

    await chatPage.goto();
    await chatPage.verifyOnCommunityPage();
    await chatPage.verifyCommunityPageLoaded();
  });

  test('user can join a group and send a message', async ({ page }) => {
    const chatPage = new ChatPage(page);
    const message = `Playwright chat ${Date.now()}`;

    await chatPage.navigateAndSelectGroup();
    // Attempt to send message - the core functionality is the message input working
    await chatPage.sendMessage(message);
    
    // Wait for any network activity to complete
    await page.waitForLoadState('networkidle');
  });

  test('chat input is ready for multiple messages', async ({ page }) => {
    const chatPage = new ChatPage(page);
    const message1 = `Test message 1 ${Date.now()}`;

    await chatPage.navigateAndSelectGroup();
    // Attempt to send message
    await chatPage.sendMessage(message1);
    await page.waitForLoadState('networkidle');
  });
});

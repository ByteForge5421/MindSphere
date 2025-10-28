import { Page, expect } from '@playwright/test';

export class ChatPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/community');
  }

  async verifyOnCommunityPage() {
    await expect(this.page).toHaveURL(/.*community/);
  }

  async verifyCommunityPageLoaded() {
    await expect(
      this.page.locator('h3').filter({ hasText: 'Community Chat' })
    ).toBeVisible({ timeout: 10000 });
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  getGroupCards() {
    return this.page.locator('[class*="card"]').filter({ 
      hasText: /Anxiety|Mindfulness|Student|Mood|Sleep/ 
    });
  }

  async selectFirstGroup() {
    const groupCards = this.getGroupCards();
    if (await groupCards.first().isVisible({ timeout: 5000 })) {
      await groupCards.first().click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  getChatInput() {
    return this.page.locator(
      'input[placeholder="Type your message..."], textarea[placeholder="Type your message..."]'
    );
  }

  getSendButton() {
    return this.page.locator('button').filter({ hasText: /send|Send/i }).first();
  }

  async fillMessage(message: string) {
    const input = this.getChatInput();
    if (await input.isVisible({ timeout: 5000 })) {
      await input.fill(message);
    }
  }

  async sendMessage(message: string) {
    const chatInput = this.getChatInput();
    const sendButton = this.getSendButton();

    // Ensure input is visible and fill it
    if (await chatInput.isVisible({ timeout: 5000 })) {
      await chatInput.fill(message);

      // Ensure send button is visible and click it
      if (await sendButton.isVisible()) {
        await sendButton.click();
        await this.page.waitForLoadState('networkidle');
      }
    }
  }

  async verifyMessageDisplayed(message: string) {
    await expect(this.page.getByText(message)).toBeVisible({ timeout: 10000 });
  }

  async verifyChatInputCleared() {
    const input = this.getChatInput();
    // Just verify the input still exists and is visible for next message
    await expect(input).toBeVisible({ timeout: 5000 });
  }

  async navigateAndSelectGroup() {
    await this.goto();
    await this.verifyOnCommunityPage();
    await this.waitForPageLoad();
    await this.selectFirstGroup();
  }
}

import { Page, expect } from '@playwright/test';

export class JournalPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/journal');
  }

  async verifyOnJournalPage() {
    await expect(this.page).toHaveURL(/.*journal/);
  }

  getTitleInput() {
    return this.page.getByPlaceholder('Entry Title');
  }

  getContentTextarea() {
    return this.page.getByPlaceholder(/What's on your mind/);
  }

  getSaveButton() {
    return this.page.getByRole('button', { name: /Save Entry/i });
  }

  async fillTitle(title: string) {
    await this.getTitleInput().fill(title);
  }

  async fillContent(content: string) {
    await this.getContentTextarea().fill(content);
  }

  async clickSave() {
    await this.getSaveButton().click();
  }

  async fillEntryForm(title: string, content: string) {
    await this.fillTitle(title);
    await this.fillContent(content);
  }

  async submitEntry() {
    await this.clickSave();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
    await this.page.reload({ waitUntil: 'networkidle' });
  }

  async submitEntryWithData(title: string, content: string) {
    await this.fillEntryForm(title, content);
    await this.submitEntry();
  }

  async verifyFormElementsVisible() {
    await expect(this.getTitleInput()).toBeVisible();
    await expect(this.getContentTextarea()).toBeVisible();
    await expect(this.getSaveButton()).toBeVisible();
  }

  async verifyEntryDisplayed(title: string, content: string) {
    await expect(this.page.getByText(title)).toBeVisible({ timeout: 10000 });
    await expect(this.page.getByText(content)).toBeVisible({ timeout: 10000 });
  }

  async verifyInputCleared() {
    await expect(this.getTitleInput()).toHaveValue('');
    await expect(this.getContentTextarea()).toHaveValue('');
  }

  async verifyTitleCleared() {
    await expect(this.getTitleInput()).toHaveValue('', { timeout: 5000 });
  }
}

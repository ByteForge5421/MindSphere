import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async verifyOnLoginPage() {
    await expect(this.page).toHaveURL(/.*login/);
  }

  getEmailInput() {
    return this.page.locator('#email');
  }

  getPasswordInput() {
    return this.page.locator('#password');
  }

  getSubmitButton() {
    return this.page.locator('button[type="submit"]');
  }

  async fillEmail(email: string) {
    await this.getEmailInput().fill(email);
  }

  async fillPassword(password: string) {
    await this.getPasswordInput().fill(password);
  }

  async clickSubmit() {
    await this.getSubmitButton().click();
  }

  async fillCredentials(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
  }

  async submitForm() {
    await this.clickSubmit();
    await this.page.waitForLoadState('networkidle');
  }

  async submitFormWithCredentials(email: string, password: string) {
    await this.fillCredentials(email, password);
    await this.submitForm();
  }

  async verifyFormElementsVisible() {
    await expect(this.getEmailInput()).toBeVisible();
    await expect(this.getPasswordInput()).toBeVisible();
    await expect(this.getSubmitButton()).toBeVisible();
  }

  async verifyEmailValue(email: string) {
    await expect(this.getEmailInput()).toHaveValue(email);
  }

  async verifyPasswordValue(password: string) {
    await expect(this.getPasswordInput()).toHaveValue(password);
  }

  async verifyStillOnLoginPage() {
    await this.verifyOnLoginPage();
  }

  async verifyRedirectedFromLogin() {
    const url = this.page.url();
    return !url.includes('/login');
  }
}

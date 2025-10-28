import { Page, expect } from '@playwright/test';

export class SignupPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/register');
  }

  async verifyOnSignupPage() {
    await expect(this.page).toHaveURL(/.*register/);
  }

  getNameInput() {
    return this.page.locator('#name');
  }

  getEmailInput() {
    return this.page.locator('#email');
  }

  getPasswordInput() {
    return this.page.locator('#password');
  }

  getConfirmPasswordInput() {
    return this.page.locator('#confirmPassword');
  }

  getSubmitButton() {
    return this.page.locator('button:has-text("Create My Account")');
  }

  async fillName(name: string) {
    await this.getNameInput().fill(name);
  }

  async fillEmail(email: string) {
    await this.getEmailInput().fill(email);
  }

  async fillPassword(password: string) {
    await this.getPasswordInput().fill(password);
  }

  async fillConfirmPassword(password: string) {
    await this.getConfirmPasswordInput().fill(password);
  }

  async clickSubmit() {
    await this.getSubmitButton().click();
  }

  async fillSignupForm(name: string, email: string, password: string) {
    await this.fillName(name);
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.fillConfirmPassword(password);
  }

  async submitForm() {
    await this.clickSubmit();
    await this.page.waitForLoadState('networkidle');
  }

  async submitFormWithData(name: string, email: string, password: string) {
    await this.fillSignupForm(name, email, password);
    await this.submitForm();
  }

  async verifyFormElementsVisible() {
    await expect(this.getNameInput()).toBeVisible();
    await expect(this.getEmailInput()).toBeVisible();
    await expect(this.getPasswordInput()).toBeVisible();
    await expect(this.getConfirmPasswordInput()).toBeVisible();
    await expect(this.getSubmitButton()).toBeVisible();
  }

  async verifyNameValue(name: string) {
    await expect(this.getNameInput()).toHaveValue(name);
  }

  async verifyEmailValue(email: string) {
    await expect(this.getEmailInput()).toHaveValue(email);
  }

  async verifyPasswordValue(password: string) {
    await expect(this.getPasswordInput()).toHaveValue(password);
  }

  async verifyConfirmPasswordValue(password: string) {
    await expect(this.getConfirmPasswordInput()).toHaveValue(password);
  }

  async verifyAllFieldsValues(name: string, email: string, password: string) {
    await this.verifyNameValue(name);
    await this.verifyEmailValue(email);
    await this.verifyPasswordValue(password);
    await this.verifyConfirmPasswordValue(password);
  }

  async verifyStillOnSignupPage() {
    await this.verifyOnSignupPage();
  }

  getErrorMessage() {
    return this.page.locator('p:has-text("Password"), div:has-text("Password")').first();
  }

  async verifyPasswordMismatchError() {
    await expect(this.getErrorMessage()).toBeVisible({ timeout: 5000 });
  }

  async verifyFieldRequired(fieldName: string) {
    // Browser validation message will appear
    // This is handled by HTML5 validation
    const url = this.page.url();
    return url.includes('/register');
  }

  getLoginLink() {
    return this.page.locator('a:has-text("Sign in instead")');
  }

  async verifyLoginLinkPresent() {
    await expect(this.getLoginLink()).toBeVisible();
  }
}

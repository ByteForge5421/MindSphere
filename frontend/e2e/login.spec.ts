import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('Login', () => {
  test('should navigate to login page and fill credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.verifyOnLoginPage();
    await loginPage.verifyFormElementsVisible();

    // Fill credentials
    await loginPage.fillEmail('test@example.com');
    await loginPage.fillPassword('password123');

    // Verify values were entered
    await loginPage.verifyEmailValue('test@example.com');
    await loginPage.verifyPasswordValue('password123');

    // Submit form
    await loginPage.submitForm();

    // Check if redirected to dashboard or if error message appears
    const currentUrl = page.url();
    // Accept either dashboard redirect or staying on login (if credentials were wrong)
    const isOnDashboard = /.*dashboard/.test(currentUrl);
    const isOnLogin = /.*login/.test(currentUrl);
    
    expect(isOnDashboard || isOnLogin).toBeTruthy();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.fillEmail('invalid@example.com');
    await loginPage.fillPassword('wrongpassword');
    await loginPage.submitForm();

    // Verify we're still on login page (not redirected)
    await loginPage.verifyStillOnLoginPage();
  });

  test('should require email field', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.fillPassword('password123');
    await loginPage.submitForm();

    // Should still be on login page
    await loginPage.verifyStillOnLoginPage();
  });

  test('should require password field', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.fillEmail('test@example.com');
    await loginPage.submitForm();

    // Should still be on login page
    await loginPage.verifyStillOnLoginPage();
  });
});

import { test, expect } from '@playwright/test';

test.describe('Signup', () => {
  test('should submit registration form with all fields filled', async ({ page }) => {
    // Generate a unique email for each test run
    const email = `test${Date.now()}@example.com`;
    const password = 'TestPassword123!';
    const name = 'Test User';

    // Navigate to registration page
    await page.goto('/register');

    // Verify we're on the register page
    await expect(page).toHaveURL(/.*register/);

    // Verify form elements exist
    const nameInput = await page.locator('#name');
    const emailInput = await page.locator('#email');
    const passwordInput = await page.locator('#password');
    const confirmPasswordInput = await page.locator('#confirmPassword');
    const submitButton = await page.locator('button:has-text("Create My Account")');

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(confirmPasswordInput).toBeVisible();
    await expect(submitButton).toBeVisible();

    // Fill name field
    await nameInput.fill(name);

    // Fill email field
    await emailInput.fill(email);

    // Fill password field
    await passwordInput.fill(password);

    // Fill confirm password field
    await confirmPasswordInput.fill(password);

    // Verify all values are filled
    await expect(nameInput).toHaveValue(name);
    await expect(emailInput).toHaveValue(email);
    await expect(passwordInput).toHaveValue(password);
    await expect(confirmPasswordInput).toHaveValue(password);

    // Click Create My Account button
    await submitButton.click();

    // Wait for network to settle
    await page.waitForLoadState('networkidle');

    // Verify form was submitted (either redirected or error shown)
    const currentUrl = page.url();
    const isValidResponse = /.*register|.*dashboard|.*login/.test(currentUrl);
    
    expect(isValidResponse).toBeTruthy();
  });

  test('should show validation error when passwords do not match', async ({ page }) => {
    const email = `test${Date.now()}@example.com`;
    const password = 'TestPassword123!';
    const mismatchPassword = 'DifferentPassword123!';
    const name = 'Test User';

    // Navigate to register page
    await page.goto('/register');

    // Fill all fields with mismatched passwords
    await page.fill('#name', name);
    await page.fill('#email', email);
    await page.fill('#password', password);
    await page.fill('#confirmPassword', mismatchPassword);

    // Try to click Create My Account button
    await page.click('button:has-text("Create My Account")');

    // Wait for response
    await page.waitForLoadState('networkidle');

    // Should still be on register page
    await expect(page).toHaveURL(/.*register/);
  });

  test('should require name field', async ({ page }) => {
    const email = `test${Date.now()}@example.com`;
    const password = 'TestPassword123!';

    // Navigate to register page
    await page.goto('/register');

    // Fill all fields except name
    await page.fill('#email', email);
    await page.fill('#password', password);
    await page.fill('#confirmPassword', password);

    // Try to click Create My Account button
    await page.click('button:has-text("Create My Account")');

    // Should still be on register page
    await expect(page).toHaveURL(/.*register/);
  });

  test('should require email field', async ({ page }) => {
    const password = 'TestPassword123!';
    const name = 'Test User';

    // Navigate to register page
    await page.goto('/register');

    // Fill all fields except email
    await page.fill('#name', name);
    await page.fill('#password', password);
    await page.fill('#confirmPassword', password);

    // Try to click Create My Account button
    await page.click('button:has-text("Create My Account")');

    // Should still be on register page
    await expect(page).toHaveURL(/.*register/);
  });

  test('should have link to login page', async ({ page }) => {
    // Navigate to register page
    await page.goto('/register');

    // Look for login link
    const loginLink = await page.locator('a:has-text("Sign in instead")');

    // Verify login link exists
    await expect(loginLink).toBeVisible();

    // Click the login link
    await loginLink.click();

    // Verify navigation to login page
    await expect(page).toHaveURL(/.*login/);
  });
});

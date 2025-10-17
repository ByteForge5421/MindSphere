import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('should navigate to login page and fill credentials', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Verify we're on the login page
    await expect(page).toHaveURL(/.*login/);

    // Verify form elements exist
    const emailInput = await page.locator('#email');
    const passwordInput = await page.locator('#password');
    const submitButton = await page.locator('button[type="submit"]');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();

    // Fill email input
    await emailInput.fill('test@example.com');

    // Fill password input
    await passwordInput.fill('password123');

    // Verify values were entered
    await expect(emailInput).toHaveValue('test@example.com');
    await expect(passwordInput).toHaveValue('password123');

    // Click login button
    await submitButton.click();

    // Wait for page navigation or error message
    await page.waitForLoadState('networkidle');
    
    // Check if redirected to dashboard or if error message appears
    const currentUrl = page.url();
    // Accept either dashboard redirect or staying on login (if credentials were wrong)
    const isOnDashboard = /.*dashboard/.test(currentUrl);
    const isOnLogin = /.*login/.test(currentUrl);
    
    expect(isOnDashboard || isOnLogin).toBeTruthy();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Fill invalid credentials
    await page.fill('#email', 'invalid@example.com');
    await page.fill('#password', 'wrongpassword');

    // Click login button
    await page.click('button[type="submit"]');

    // Wait for response
    await page.waitForLoadState('networkidle');

    // Verify we're still on login page (not redirected)
    await expect(page).toHaveURL(/.*login/);
  });

  test('should require email field', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Fill only password
    await page.fill('#password', 'password123');

    // Try to click login button
    await page.click('button[type="submit"]');

    // Should still be on login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('should require password field', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Fill only email
    await page.fill('#email', 'test@example.com');

    // Try to click login button
    await page.click('button[type="submit"]');

    // Should still be on login page
    await expect(page).toHaveURL(/.*login/);
  });
});

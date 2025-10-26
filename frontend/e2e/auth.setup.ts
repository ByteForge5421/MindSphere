import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page, context }) => {
  const testEmail = 'testuser@example.com';
  const testPassword = 'password123';

  // Log network responses
  page.on('response', response => {
    if (response.url().includes('/auth/')) {
      console.log(`[API Response] ${response.status()}`);
    }
  });

  // Navigate to register page and create test user
  await page.goto('/register');
  
  // Check if we're on register page
  if (page.url().includes('/register')) {
    // Try to register
    await page.fill('#name', 'Test User');
    await page.fill('#email', testEmail);
    await page.fill('#password', testPassword);
    await page.fill('#confirmPassword', testPassword);
    await page.click('button:has-text("Create My Account")');
    
    // Wait for response
    await page.waitForTimeout(1500);
  }

  // Navigate to login
  await page.goto('/login');

  // Fill in the login form
  await page.fill('#email', testEmail);
  await page.fill('#password', testPassword);

  // Click the sign in button
  await page.click('button:has-text("Sign In")');

  // Wait for the page to load after login
  await page.waitForTimeout(2000);
  
  console.log(`After login, URL: ${page.url()}`);

  // Check localStorage content before saving
  const storageContent = await page.evaluate(() => {
    const items: Record<string, string> = {};
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key) {
        items[key] = window.localStorage.getItem(key) || '';
      }
    }
    console.log('localStorage:', JSON.stringify(items));
    return items;
  });
  
  console.log('StorageContent keys:', Object.keys(storageContent));
  console.log('Has token:', 'token' in storageContent);

  // Save the storage state (localStorage, sessionStorage, cookies)
  // This will be automatically loaded by other tests that are configured to use it
  await context.storageState({ path: 'playwright/.auth/user.json' });
  console.log('✓ Storage state saved');
});

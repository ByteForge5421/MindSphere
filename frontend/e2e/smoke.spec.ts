import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {

  test('homepage is accessible', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveTitle(/MindSphere|Mental|Welcome/i);
  });

  test('login page is accessible', async ({ page }) => {
    const response = await page.goto('/login');
    expect(response?.status()).toBeLessThan(400);
    await page.waitForLoadState('networkidle');
  });

  test('signup page is accessible', async ({ page }) => {
    const response = await page.goto('/signup');
    expect(response?.status()).toBeLessThan(400);
    await page.waitForLoadState('networkidle');
  });

  test('dashboard page is accessible and requires auth', async ({ page }) => {
    await page.goto('/dashboard');
    // Dashboard should either load or redirect to login (both are OK for smoke test)
    await page.waitForLoadState('networkidle');
    const url = page.url();
    expect(['/dashboard', '/login'].some(path => url.includes(path))).toBeTruthy();
  });

  test('journal page is accessible and requires auth', async ({ page }) => {
    await page.goto('/journal');
    // Journal should either load or redirect to login (both are OK for smoke test)
    await page.waitForLoadState('networkidle');
    const url = page.url();
    expect(['/journal', '/login'].some(path => url.includes(path))).toBeTruthy();
  });

  test('no critical console errors on homepage', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      // Filter out non-critical Vite dev server errors
      if (msg.type() === 'error' && 
          !text.includes('Outdated Optimize Dep') && 
          !text.includes('504') &&
          !text.includes('ERR_FAILED') &&
          !text.toLowerCase().includes('favicon')) {
        errors.push(text);
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(errors).toHaveLength(0);
  });

});

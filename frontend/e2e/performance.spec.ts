import { test, expect } from '@playwright/test';

test.describe('Performance', () => {

  async function measurePageLoad(page, url: string) {
    const start = Date.now();
    await page.goto(url);
    await page.waitForLoadState('networkidle');
    return Date.now() - start;
  }

  test('login page loads quickly', async ({ page }) => {
    const loadTime = await measurePageLoad(page, '/login');
    console.log(`Login page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(3000);
  });

  test('dashboard loads within acceptable time', async ({ page }) => {
    const loadTime = await measurePageLoad(page, '/dashboard');
    console.log(`Dashboard load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(3000);
  });

  test('journal page loads within acceptable time', async ({ page }) => {
    const loadTime = await measurePageLoad(page, '/journal');
    console.log(`Journal page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(3000);
  });

});

import { Page } from '@playwright/test';

export const testCredentials = {
  email: 'testuser@example.com',
  password: 'password123',
  name: 'Test User'
};

/**
 * Register a test user via API
 */
export async function registerTestUser(page: Page, credentials = testCredentials) {
  const response = await page.request.post('http://localhost:5000/api/auth/register', {
    data: {
      name: credentials.name,
      email: credentials.email,
      password: credentials.password,
      role: 'student'
    }
  });

  if (!response.ok() && response.status() !== 400) {
    throw new Error(`Registration failed: ${response.status()}`);
  }

  return response.json();
}

/**
 * Login a test user via API and set token in localStorage
 */
export async function loginTestUser(page: Page, credentials = testCredentials) {
  // First try to login via API
  const loginResponse = await page.request.post('http://localhost:5000/api/auth/login', {
    data: {
      email: credentials.email,
      password: credentials.password
    }
  });

  if (!loginResponse.ok()) {
    // If login fails, try registering first
    await registerTestUser(page, credentials);
    
    // Then try login again
    const retryResponse = await page.request.post('http://localhost:5000/api/auth/login', {
      data: {
        email: credentials.email,
        password: credentials.password
      }
    });

    if (!retryResponse.ok()) {
      throw new Error(`Login failed after registration: ${retryResponse.status()}`);
    }

    const data = await retryResponse.json();
    const token = data.token || data.data?.token;
    
    if (!token) {
      throw new Error('No token in login response');
    }

    // Set token in localStorage
    await page.evaluate((t: string) => {
      localStorage.setItem('token', t);
    }, token);

    return data;
  }

  const data = await loginResponse.json();
  const token = data.token || data.data?.token;
  
  if (!token) {
    throw new Error('No token in login response');
  }

  // Set token in localStorage
  await page.evaluate((t: string) => {
    localStorage.setItem('token', t);
  }, token);

  return data;
}

/**
 * Ensure test user is authenticated before running tests
 */
export async function ensureAuthenticated(page: Page) {
  // First try navigating to a protected page
  await page.goto('/journal', { waitUntil: 'networkidle' });

  // If we're redirected to login, authenticate via API
  if (page.url().includes('/login')) {
    await loginTestUser(page);
    // Reload the page now that we have a token
    await page.goto('/journal', { waitUntil: 'networkidle' });
  }
}

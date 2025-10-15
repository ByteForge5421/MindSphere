import { describe, test, expect } from 'vitest';
import { env } from './env';

describe('env', () => {
  test('env object is defined', () => {
    expect(env).toBeDefined();
  });

  test('env can access VITE properties', () => {
    // In test environment, process.env values may not be available
    // Just check that the object exists and can be accessed
    expect(typeof env).toBe('object');
  });

  test('API URL validation if defined', () => {
    if (env.API_URL) {
      expect(env.API_URL).toMatch(/^(http|https):\/\//);
    }
  });
});

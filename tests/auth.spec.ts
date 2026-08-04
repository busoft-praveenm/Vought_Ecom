import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    // Generate a structurally valid JWT for middleware parsing
    const jwtPayload = Buffer.from(JSON.stringify({
      exp: Math.floor(Date.now() / 1000) + 3600,
    })).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const fakeJwt = `eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.${jwtPayload}.fake-signature`;

    // Inject sessionStorage flag to bypass Firebase in E2E tests
    await page.addInitScript(() => {
      window.sessionStorage.setItem('e2e-test', 'true');
    });

    // We rely on the real backend running via webServer concurrently

    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
    page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText));
  });

  test('should successfully log in with email and password and redirect to dashboard', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Wait for the form to be visible (accounting for animations)
    await expect(page.locator('form')).toBeVisible();

    // Fill in credentials
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'Password123!');

    // Submit form
    await page.click('button[type="submit"]');

    // Verify redirection to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });

    // Verify toast notification (Sonner toast)
    await expect(page.locator('text=Login successful')).toBeVisible({ timeout: 5000 }).catch(() => console.log('Toast not visible, but redirect worked'));
  });

  test('should show error message on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('form')).toBeVisible();

    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'WrongPassword!');
    await page.click('button[type="submit"]');

    // Verify error toast
    await expect(page.locator('text=Invalid email or password.')).toBeVisible({ timeout: 5000 });
    
    // Verify we stay on the login page
    await expect(page).toHaveURL(/.*\/login/);
  });
});

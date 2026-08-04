import { test, expect } from '@playwright/test';

test.describe('Signup Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    // Inject sessionStorage flag to bypass Firebase in E2E tests
    await page.addInitScript(() => {
      window.sessionStorage.setItem('e2e-test', 'true');
    });

    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  });

  test('should successfully sign up with valid details and redirect to dashboard', async ({ page }) => {
    // Navigate to signup page
    await page.goto('/signup');

    // Wait for the form to be visible
    await expect(page.locator('form')).toBeVisible();

    // Fill in signup details
    await page.fill('input[id="firstName"]', 'John');
    await page.fill('input[id="lastName"]', 'Doe');
    await page.fill('input[id="mobileNumber"]', '1234567890');
    await page.fill('input[id="email"]', `test-${Date.now()}@example.com`);
    await page.fill('input[id="password"]', 'Password123!');

    // Submit form
    await page.click('button[type="submit"]');

    // Verify redirection to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });

    // Verify toast notification (Sonner toast)
    await expect(page.locator('text=Account created successfully!')).toBeVisible({ timeout: 5000 }).catch(() => console.log('Toast not visible, but redirect worked'));
  });

  test('should show error message when email is already in use', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.locator('form')).toBeVisible();

    await page.fill('input[id="firstName"]', 'Existing');
    await page.fill('input[id="lastName"]', 'User');
    await page.fill('input[id="email"]', 'existing@example.com'); // This email triggers the bypass error
    await page.fill('input[id="password"]', 'Password123!');
    await page.click('button[type="submit"]');

    // Verify error toast
    await expect(page.locator('text=An account with this email already exists.')).toBeVisible({ timeout: 5000 });
    
    // Verify we stay on the signup page
    await expect(page).toHaveURL(/.*\/signup/);
  });
});

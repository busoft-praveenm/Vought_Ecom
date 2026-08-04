import { test, expect } from '@playwright/test';

test.describe('Dashboard Navigation', () => {

  test.beforeEach(async ({ page }) => {
    // Inject sessionStorage flag to bypass Firebase in E2E tests
    await page.addInitScript(() => {
      window.sessionStorage.setItem('e2e-test', 'true');
    });

    // Login before testing navigation
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard and wait for layout to render
    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Toggle Sidebar' })).toBeVisible({ timeout: 15000 });
  });

  test('should navigate to Products page via sidebar', async ({ page }) => {
    // Open sidebar
    await page.getByRole('button', { name: 'Toggle Sidebar' }).click();
    // Wait for animation to finish
    await page.waitForTimeout(350);
    
    // Click Products link in sidebar using its accessible name
    await page.getByRole('link', { name: 'Products', exact: true }).click({ force: true });
    
    await expect(page).toHaveURL(/.*\/dashboard\/products/);
    await expect(page.locator('h1', { hasText: 'Products' })).toBeVisible();
  });

  test('should navigate to Orders page via sidebar', async ({ page }) => {
    // Open sidebar
    await page.getByRole('button', { name: 'Toggle Sidebar' }).click();
    // Wait for animation to finish
    await page.waitForTimeout(350);

    // Click Orders link in sidebar using its accessible name
    await page.getByRole('link', { name: 'Orders', exact: true }).click({ force: true });
    
    await expect(page).toHaveURL(/.*\/dashboard\/orders/);
    await expect(
      page.locator('h1', { hasText: 'Your Orders' })
        .or(page.locator('h2', { hasText: 'No Orders Found' }))
    ).toBeVisible();
  });

  test('should navigate to Cart page via topbar', async ({ page }) => {
    await page.click('a[href*="/dashboard/cart"]', { force: true });
    
    await expect(page).toHaveURL(/.*\/dashboard\/cart/);
    await expect(page.locator('h1', { hasText: 'Shopping Cart' }).or(page.locator('h2', { hasText: 'Your Cart is Empty' }))).toBeVisible();
  });

  test('should navigate to Profile page via topbar dropdown', async ({ page }) => {
    // Click the user avatar/dropdown
    await page.getByRole('button', { name: 'Profile' }).click({ force: true });
    
    // Click profile link in dropdown
    await page.getByRole('menuitem', { name: 'Profile' }).click({ force: true });
    
    await expect(page).toHaveURL(/.*\/dashboard\/profile/);
    await expect(page.locator('h1', { hasText: 'Profile' }).or(page.locator('h2', { hasText: 'Profile' }))).toBeVisible();
  });

});

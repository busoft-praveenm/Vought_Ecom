import { test, expect } from '@playwright/test';

test.describe('Cart Interactions', () => {

  test.beforeEach(async ({ page }) => {
    // Bypass Firebase
    await page.addInitScript(() => {
      window.sessionStorage.setItem('e2e-test', 'true');
    });

    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Toggle Sidebar' })).toBeVisible({ timeout: 15000 });
  });

  test('should navigate to a product and verify Add to Cart button is present', async ({ page }) => {
    // Go to products page
    await page.goto('/dashboard/products', { waitUntil: 'domcontentloaded' });
    
    // Check if there are products
    const emptyMessage = page.locator('text=No products found.');
    await page.waitForTimeout(1000);
    const hasNoProducts = await emptyMessage.isVisible();

    if (!hasNoProducts) {
      // Click on the first product
      const firstProductLink = page.locator('a[href^="/dashboard/products/"]').first();
      await expect(firstProductLink).toBeVisible();
      await firstProductLink.click({ force: true });

      // Wait for product details page
      await expect(page).toHaveURL(/.*\/dashboard\/products\/\d+/);

      // Verify Add to Cart button exists
      const addToCartButton = page.locator('button', { hasText: 'Add to Cart' });
      await expect(addToCartButton).toBeVisible();
    }
  });

  test('should view empty cart', async ({ page }) => {
    await page.goto('/dashboard/cart');
    
    // Check for either Empty Cart state or Shopping Cart header
    await expect(
      page.locator('h1', { hasText: 'Shopping Cart' }).or(page.locator('h2', { hasText: 'Your Cart is Empty' }))
    ).toBeVisible();
  });
});

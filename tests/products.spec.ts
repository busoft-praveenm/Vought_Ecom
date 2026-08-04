import { test, expect } from '@playwright/test';

test.describe('Products View and Filtering', () => {

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

  test('should display a list of products', async ({ page }) => {
    await page.goto('/dashboard/products', { waitUntil: 'domcontentloaded' });
    
    // Check if the page title is present
    await expect(page.locator('h1', { hasText: 'Products' })).toBeVisible();

    // Check if there are either products loaded or "No products found." message
    const emptyMessage = page.locator('text=No products found.');
    const productCards = page.locator('a[href^="/dashboard/products/"]');

    // Wait a bit for the products to load if needed
    await page.waitForTimeout(1000);

    const hasNoProducts = await emptyMessage.isVisible();
    if (!hasNoProducts) {
      await expect(productCards.first()).toBeVisible({ timeout: 10000 });
      // Count should be > 0 if not empty
      expect(await productCards.count()).toBeGreaterThan(0);
    }
  });

  test('should allow searching for products', async ({ page }) => {
    await page.goto('/dashboard/products', { waitUntil: 'domcontentloaded' });
    
    // Find search input inside the main content area (not the topbar)
    const searchInput = page.locator('main').getByPlaceholder('Search products...');
    await expect(searchInput).toBeVisible();
    
    // Type and press enter
    await searchInput.fill('Nonexistent Product 12345');
    await searchInput.press('Enter');

    // Should update URL with search param
    await expect(page).toHaveURL(/.*search=Nonexistent.*Product.*12345/);

    // Should show no products found
    await expect(page.locator('text=No products found.')).toBeVisible({ timeout: 10000 });
  });
});

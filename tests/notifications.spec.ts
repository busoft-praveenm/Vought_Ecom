import { test, expect } from '@playwright/test';

test.describe('Notifications UI', () => {

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
  });

  test('should display bell icon and open notifications dropdown', async ({ page }) => {
    // Wait for the dashboard to load completely
    await expect(page.getByRole('button', { name: 'Notifications' })).toBeVisible({ timeout: 15000 });

    // Click the bell icon to open the dropdown
    await page.getByRole('button', { name: 'Notifications' }).click();

    // Verify the dropdown contains the "Notifications" header
    await expect(page.locator('text="Notifications"')).toBeVisible();

    // Verify that the dropdown shows either the "No new notifications" text or actual notifications
    const noNotificationsText = page.locator('text="No new notifications"');
    const hasNotifications = await page.locator('text="Mark all as read"').isVisible();
    
    if (hasNotifications) {
      await expect(page.locator('text="Mark all as read"')).toBeVisible();
    } else {
      await expect(noNotificationsText).toBeVisible();
    }
  });

});

import { test, expect } from '@playwright/test';
import { AuthPagePOM } from './pages/AuthPage';

test.describe('Orders', () => {
  test.beforeEach(async ({ page }) => {
    const authPage = new AuthPagePOM(page);
    await authPage.navigateToLogin();
    await authPage.login('alice@example.com', 'Password123!');
  });

  test('shows orders history page', async ({ page }) => {
    await page.goto('/orders');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Your Orders' })).toBeVisible();
  });

  test('shows order items or empty state', async ({ page }) => {
    await page.goto('/orders');
    await page.waitForLoadState('networkidle');
    // Either shows orders or empty state
    const hasOrders = await page.getByText(/Order #/).count();
    const emptyState = await page.getByText('No orders yet').count();
    expect(hasOrders + emptyState).toBeGreaterThan(0);
  });

  test('requires authentication to view orders', async ({ page }) => {
    // Create new context without auth
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    await page.goto('/orders');
    await expect(page).toHaveURL('/login');
  });
});

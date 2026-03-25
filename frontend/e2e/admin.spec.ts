import { test, expect } from '@playwright/test';
import { AuthPagePOM } from './pages/AuthPage';

test.describe('Admin', () => {
  test.beforeEach(async ({ page }) => {
    const authPage = new AuthPagePOM(page);
    await authPage.navigateToLogin();
    await authPage.login('admin@ecommerce.com', 'Password123!');
  });

  test('admin can access dashboard', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();
  });

  test('dashboard shows stats cards', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Total Orders')).toBeVisible();
    await expect(page.getByText('Total Revenue')).toBeVisible();
  });

  test('admin can view products management', async ({ page }) => {
    await page.goto('/admin/products');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
  });

  test('admin products table is visible', async ({ page }) => {
    await page.goto('/admin/products');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('admin can view orders management', async ({ page }) => {
    await page.goto('/admin/orders');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Orders Management' })).toBeVisible();
  });

  test('non-admin gets redirected from admin pages', async ({ page }) => {
    const authPage = new AuthPagePOM(page);
    await authPage.navigateToLogin();
    await authPage.login('alice@example.com', 'Password123!');
    await page.goto('/admin');
    await expect(page).not.toHaveURL('/admin');
  });

  test('admin can open product create form', async ({ page }) => {
    await page.goto('/admin/products');
    await page.waitForLoadState('networkidle');
    await page.getByText('Add Product').click();
    await expect(page.getByText('Add Product')).toBeVisible();
    await expect(page.locator('form')).toBeVisible();
  });
});

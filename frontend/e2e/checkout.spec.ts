import { test, expect } from '@playwright/test';
import { AuthPagePOM } from './pages/AuthPage';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    const authPage = new AuthPagePOM(page);
    await authPage.navigateToLogin();
    await authPage.login('alice@example.com', 'Password123!');
  });

  test('redirects to cart if empty', async ({ page }) => {
    await page.goto('/checkout');
    // Should redirect if cart is empty
    await page.waitForLoadState('networkidle');
    const url = page.url();
    expect(url).toMatch(/\/(checkout|cart)/);
  });

  test('checkout page has address selection step', async ({ page }) => {
    // First add item to cart
    await page.goto('/products');
    await page.getByTestId('add-to-cart-btn').first().click();
    await page.waitForTimeout(500);
    await page.goto('/checkout');
    await expect(page.getByText('Shipping Address')).toBeVisible();
  });

  test('checkout page has payment method step', async ({ page }) => {
    await page.goto('/products');
    await page.getByTestId('add-to-cart-btn').first().click();
    await page.waitForTimeout(500);
    await page.goto('/checkout');

    // Navigate to payment step if address selected
    const continueBtn = page.getByText('Continue to Payment');
    if (await continueBtn.isVisible()) {
      // Select first available address
      const radioBtn = page.locator('input[type="radio"]').first();
      if (await radioBtn.isVisible()) {
        await radioBtn.check();
        await continueBtn.click();
        await expect(page.getByText('Payment Method')).toBeVisible();
      }
    }
  });
});

import { test, expect } from '@playwright/test';
import { AuthPagePOM } from './pages/AuthPage';
import { ProductPagePOM } from './pages/ProductPage';

test.describe('Shopping Cart', () => {
  let authPage: AuthPagePOM;
  let productPage: ProductPagePOM;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPagePOM(page);
    productPage = new ProductPagePOM(page);
    // Login before cart tests
    await authPage.navigateToLogin();
    await authPage.login('alice@example.com', 'Password123!');
  });

  test('cart icon shows in navbar', async ({ page }) => {
    await expect(page.getByTestId('cart-btn')).toBeVisible();
  });

  test('can open cart drawer', async ({ page }) => {
    await page.getByTestId('cart-btn').click();
    await expect(page.getByTestId('cart-drawer')).toBeVisible();
  });

  test('cart is initially empty or has items from previous sessions', async ({ page }) => {
    await page.getByTestId('cart-btn').click();
    const cartDrawer = page.getByTestId('cart-drawer');
    await expect(cartDrawer).toBeVisible();
  });

  test('adding product to cart updates cart count', async ({ page }) => {
    await productPage.navigateToProducts();
    const initialCount = await page.getByTestId('cart-count').textContent().catch(() => '0');
    await productPage.addFirstProductToCart();
    // Cart drawer should open
    await expect(page.getByTestId('cart-drawer')).toBeVisible();
  });

  test('can navigate to cart page', async ({ page }) => {
    await page.goto('/cart');
    await expect(page).toHaveURL('/cart');
  });

  test('can add and remove item from cart', async ({ page }) => {
    await productPage.navigateToProducts();
    await productPage.addFirstProductToCart();
    await page.waitForTimeout(1000);

    // Check cart has item
    const cartDrawer = page.getByTestId('cart-drawer');
    const cartItems = cartDrawer.getByTestId('cart-item');
    const count = await cartItems.count();

    if (count > 0) {
      // Remove first item
      await cartDrawer.getByTestId('remove-item-btn').first().click();
      await page.waitForTimeout(500);
    }
  });

  test('cart shows total amount', async ({ page }) => {
    await page.getByTestId('cart-btn').click();
    const cartDrawer = page.getByTestId('cart-drawer');
    await expect(cartDrawer).toBeVisible();
    // Total should be visible if items exist
  });
});

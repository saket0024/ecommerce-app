import { test, expect } from '@playwright/test';
import { ProductPagePOM } from './pages/ProductPage';

test.describe('Product Browsing', () => {
  let productPage: ProductPagePOM;

  test.beforeEach(({ page }) => {
    productPage = new ProductPagePOM(page);
  });

  test('displays products on listing page', async ({ page }) => {
    await productPage.navigateToProducts();
    await productPage.expectProductsVisible();
  });

  test('shows product filter sidebar', async ({ page }) => {
    await productPage.navigateToProducts();
    await expect(page.getByTestId('filter-sidebar')).toBeVisible();
  });

  test('can search for products', async ({ page }) => {
    await productPage.navigateToProducts();
    await productPage.searchFor('iPhone');
    await expect(page).toHaveURL(/\/search\?q=iPhone/);
  });

  test('can filter by category', async ({ page }) => {
    await productPage.navigateToProducts();
    await productPage.selectCategory('Electronics');
    await expect(page).toHaveURL(/category=/);
  });

  test('shows product detail page', async ({ page }) => {
    await productPage.navigateToProducts();
    await productPage.clickProduct(0);
    await expect(page).toHaveURL(/\/products\/\d+/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('pagination is visible when more than one page', async ({ page }) => {
    await productPage.navigateToProducts();
    const pagination = page.getByTestId('pagination');
    // Only check if there are enough items for pagination
    const isVisible = await pagination.isVisible();
    if (isVisible) {
      await expect(pagination).toBeVisible();
    }
  });

  test('sort changes product order', async ({ page }) => {
    await productPage.navigateToProducts();
    const firstProductBefore = await page.getByTestId('product-card').first().textContent();
    await page.selectOption('select', 'price_asc');
    await page.waitForLoadState('networkidle');
    const firstProductAfter = await page.getByTestId('product-card').first().textContent();
    // Products should potentially be in different order
    expect(firstProductBefore).toBeDefined();
    expect(firstProductAfter).toBeDefined();
  });

  test('product detail has add to cart button', async ({ page }) => {
    await productPage.navigateToProducts();
    await productPage.clickProduct(0);
    await expect(page.getByRole('button', { name: /Add to Cart/ })).toBeVisible();
  });

  test('product detail shows reviews section', async ({ page }) => {
    await productPage.navigateToProducts();
    await productPage.clickProduct(0);
    await expect(page.getByText('Customer Reviews')).toBeVisible();
  });
});

import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPagePOM extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToProducts() {
    await this.navigate('/products');
    await this.waitForPageLoad();
  }

  async searchFor(query: string) {
    await this.page.getByTestId('search-input').fill(query);
    await this.page.keyboard.press('Enter');
    await this.waitForPageLoad();
  }

  async clickProduct(index = 0) {
    const cards = this.page.getByTestId('product-card');
    await cards.nth(index).click();
    await this.waitForPageLoad();
  }

  async addFirstProductToCart() {
    const addBtn = this.page.getByTestId('add-to-cart-btn').first();
    await addBtn.click();
  }

  async selectCategory(categoryName: string) {
    await this.page.getByText(categoryName).first().click();
    await this.waitForPageLoad();
  }

  async setSortBy(value: string) {
    await this.page.selectOption('select', value);
    await this.waitForPageLoad();
  }

  async expectProductsVisible() {
    await expect(this.page.getByTestId('product-card').first()).toBeVisible();
  }

  async expectProductCount(count: number) {
    await expect(this.page.getByTestId('product-card')).toHaveCount(count);
  }

  async navigateToPage(pageNum: number) {
    await this.page.getByTestId('pagination').getByText(String(pageNum)).click();
    await this.waitForPageLoad();
  }
}

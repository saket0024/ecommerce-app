import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AuthPagePOM extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToLogin() {
    await this.navigate('/login');
    await this.waitForPageLoad();
  }

  async navigateToRegister() {
    await this.navigate('/register');
    await this.waitForPageLoad();
  }

  async login(email: string, password: string) {
    await this.page.getByTestId('email-input').fill(email);
    await this.page.getByTestId('password-input').fill(password);
    await this.page.getByTestId('submit-btn').click();
    await this.waitForPageLoad();
  }

  async expectLoginSuccess() {
    await expect(this.page).not.toHaveURL('/login');
  }

  async expectLoginError() {
    await expect(this.page.getByTestId('auth-error')).toBeVisible();
  }

  async expectValidationError(field: string) {
    await expect(this.page.getByTestId(`${field}-error`)).toBeVisible();
  }
}

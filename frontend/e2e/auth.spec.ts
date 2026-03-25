import { test, expect } from '@playwright/test';
import { AuthPagePOM } from './pages/AuthPage';

test.describe('Authentication', () => {
  let authPage: AuthPagePOM;

  test.beforeEach(({ page }) => {
    authPage = new AuthPagePOM(page);
  });

  test.describe('Login', () => {
    test('shows login form', async ({ page }) => {
      await authPage.navigateToLogin();
      await expect(page.getByTestId('login-form')).toBeVisible();
      await expect(page.getByTestId('email-input')).toBeVisible();
      await expect(page.getByTestId('password-input')).toBeVisible();
      await expect(page.getByTestId('submit-btn')).toBeVisible();
    });

    test('shows validation error for empty email', async ({ page }) => {
      await authPage.navigateToLogin();
      await page.getByTestId('submit-btn').click();
      await authPage.expectValidationError('email');
    });

    test('shows validation error for invalid email', async ({ page }) => {
      await authPage.navigateToLogin();
      await page.getByTestId('email-input').fill('not-an-email');
      await page.getByTestId('submit-btn').click();
      await authPage.expectValidationError('email');
    });

    test('shows error for wrong credentials', async ({ page }) => {
      await authPage.navigateToLogin();
      await authPage.login('wrong@test.com', 'wrongpassword');
      await authPage.expectLoginError();
    });

    test('successful login redirects to home', async ({ page }) => {
      await authPage.navigateToLogin();
      await authPage.login('alice@example.com', 'Password123!');
      await expect(page).toHaveURL('/');
    });
  });

  test.describe('Register', () => {
    test('shows registration form', async ({ page }) => {
      await authPage.navigateToRegister();
      await expect(page.getByTestId('register-form')).toBeVisible();
    });

    test('successful registration redirects to home', async ({ page }) => {
      await authPage.navigateToRegister();
      const uniqueEmail = `test${Date.now()}@example.com`;
      await page.fill('[placeholder="First"]', 'Test');
      await page.fill('[placeholder="Last"]', 'User');
      await page.fill('[type="email"]', uniqueEmail);
      const passwordInputs = page.locator('[type="password"]');
      await passwordInputs.nth(0).fill('Password123!');
      await passwordInputs.nth(1).fill('Password123!');
      await page.getByRole('button', { name: 'Create Account' }).click();
      await expect(page).toHaveURL('/');
    });
  });

  test.describe('Logout', () => {
    test.beforeEach(async ({ page }) => {
      await authPage.navigateToLogin();
      await authPage.login('alice@example.com', 'Password123!');
    });

    test('user can logout', async ({ page }) => {
      await page.getByTestId('user-menu-btn').click();
      await page.getByText('Sign Out').click();
      await expect(page.getByText('Hello, Sign in')).toBeVisible();
    });
  });
});

import { test, expect } from '@playwright/test';
import { dismissCookieBanner } from '../../../helpers/cookies.js';
import { studentUser } from '../../../fixtures/test-users.js';

test.describe('Student Login', () => {

  async function openStudentLogin(page) {

    await page.goto('/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    await page.waitForLoadState('networkidle');

    await dismissCookieBanner(page);

    await page.getByRole('link', { name: 'User' }).click();
    await page.getByRole('link', { name: 'Login' }).click();
  }

  test('Login with valid credentials', async ({ page }) => {

  await openStudentLogin(page);

  await page.getByRole('textbox', {
    name: 'Username or Email Address'
  }).fill(studentUser.username);

  await page.getByRole('textbox', {
    name: 'Password'
  }).fill(studentUser.password);

  await page.getByRole('button', {
    name: 'Log In'
  }).click();

  // Attendre que la navigation soit terminée
  await page.waitForLoadState('networkidle');

  // Attendre jusqu'à 60 secondes que l'URL change
  await expect(page).toHaveURL(/wp-admin/, {
    timeout: 60000,
  });

});

  test('Login with wrong password', async ({ page }) => {

    await openStudentLogin(page);

    await page.getByRole('textbox', {
      name: 'Username or Email Address'
    }).fill(studentUser.username);

    await page.getByRole('textbox', {
      name: 'Password'
    }).fill('wrongpassword123');

    await page.getByRole('button', {
      name: 'Log In'
    }).click();

    await expect(page.locator('#login_error')).toContainText(
      'Error: The password you entered for the email address'
    );

  });

  test('Login with unregistered username', async ({ page }) => {

    await openStudentLogin(page);

    await page.getByRole('textbox', {
      name: 'Username or Email Address'
    }).fill('ghost_user_00');

    await page.getByRole('textbox', {
      name: 'Password'
    }).fill('wrongpassword123');

    await page.getByRole('button', {
      name: 'Log In'
    }).click();

    await expect(page.locator('#login_error')).toContainText(
      'Error: The username ghost_user_00 is not registered on this site.'
    );

  });

});

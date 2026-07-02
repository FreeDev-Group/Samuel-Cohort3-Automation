import { test, expect } from '@playwright/test';
import { dismissCookieBanner } from '../../../helpers/cookies.js';

test.describe('Create Account - Student', () => {

  async function openStudentRegistration(page) {

    await page.goto('/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    await page.waitForLoadState('networkidle');

    await dismissCookieBanner(page);

    await page.getByRole('link', { name: 'User' }).click();
    await page.getByRole('link', { name: 'Register as Student' }).click();
  }

  test('Register as Student with valid inputs', async ({ page }) => {

    const uniqueId = Date.now();

    const username = `josue${uniqueId}`;
    const email = `josue${uniqueId}@gmail.com`;

    await openStudentRegistration(page);

    await page.getByRole('textbox', {
      name: 'Username'
    }).fill(username);

    await page.getByRole('textbox', {
      name: 'Email'
    }).fill(email);

    await page.getByRole('button', {
      name: 'Register'
    }).click();

    await expect(page).toHaveURL(/checkemail=registered/i);

  });

  test('Submit with empty username', async ({ page }) => {

    await openStudentRegistration(page);

    await page.getByRole('textbox', {
      name: 'Email'
    }).fill('test@gmail.com');

    await page.getByRole('button', {
      name: 'Register'
    }).click();

    await expect(page.locator('body')).toContainText(
      'Error: Please enter a username.'
    );

  });

  test('Submit with empty email', async ({ page }) => {

    await openStudentRegistration(page);

    await page.getByRole('textbox', {
      name: 'Username'
    }).fill('josueTest');

    await page.getByRole('button', {
      name: 'Register'
    }).click();

    await expect(page.locator('body')).toContainText(
      'Error: Please type your email address.'
    );

  });

  test('Submit with already registered email', async ({ page }) => {

    await openStudentRegistration(page);

    await page.getByRole('textbox', {
      name: 'Username'
    }).fill(`josue${Date.now()}`);

    await page.getByRole('textbox', {
      name: 'Email'
    }).fill('test@gmail.com');

    await page.getByRole('button', {
      name: 'Register'
    }).click();

    await expect(page.locator('body')).toContainText(
      'Error: This email address is already registered.'
    );

  });

});

import { test, expect } from '@playwright/test';
import { studentUser } from '../../../fixtures/test-users.js';
import { dismissCookieBanner } from '../../../helpers/cookies.js';

async function openStudentLogin(page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await dismissCookieBanner(page);

  await page.getByRole('link', { name: 'User', exact: true }).waitFor({
    state: 'visible',
    timeout: 60000,
  });

  await page.getByRole('link', { name: 'User', exact: true }).click();

  await page.getByRole('link', { name: 'Login', exact: true }).click();

  await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
}

async function loginAsStudent(page, username, password) {
  await page.getByRole('textbox', { name: 'Username' }).fill(username);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);

  await page.locator('input[type="submit"], button[type="submit"]').click();
}

test('Login with valid credentials', async ({ page }) => {
  await openStudentLogin(page);

  await loginAsStudent(page, studentUser.username, studentUser.password);

  await expect(page.locator('body')).toContainText(/dashboard|welcome|logout/i);
});

test('Login with valid username but wrong password', async ({ page }) => {
  await openStudentLogin(page);

  await loginAsStudent(page, studentUser.username, 'wrong-password-123');

  await expect(page.locator('body')).toContainText(/error|invalid|incorrect|failed/i);
});

test('Login with unregistered username', async ({ page }) => {
  await openStudentLogin(page);

  await loginAsStudent(page, `unknown-user-${Date.now()}`, 'fake-password-123');

  await expect(page.locator('body')).toContainText(/error|invalid|not found|incorrect|failed/i);
});
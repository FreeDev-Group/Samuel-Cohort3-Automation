import { test, expect } from '@playwright/test';

async function dismissCookieBanner(page) {
  const rejectButton = page.getByRole('button', { name: 'Reject All' });

  if (await rejectButton.isVisible().catch(() => false)) {
    await rejectButton.click();
  }
}

test('Register as Student with valid inputs', async ({ page }) => {
  const timestamp = Date.now();

  const username = `jonathan${timestamp}`;
  const email = `jonathan${timestamp}@test.com`;

  await page.goto('https://student.michaelkentburns.com/');

  await dismissCookieBanner(page);

  await page.getByRole('link', { name: 'User' }).click();
  await page.getByRole('link', { name: 'Register as Student' }).click();

  await page.getByRole('textbox', { name: 'Username' }).fill(username);
  await page.getByRole('textbox', { name: 'Email' }).fill(email);

  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page.locator('body')).toContainText(
    'Registration complete. Please check your email, then visit the login page.'
  );
});

test('Submit with empty username', async ({ page }) => {
  await page.goto('https://student.michaelkentburns.com/');

  await dismissCookieBanner(page);

  await page.getByRole('link', { name: 'User' }).click();
  await page.getByRole('link', { name: 'Register as Student' }).click();

  await page.getByRole('textbox', { name: 'Email' })
    .fill('existing@test.com');

  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page.locator('body')).toContainText(
    'Error: Please enter a username.'
  );
});

test('Submit with empty email', async ({ page }) => {
  await page.goto('https://student.michaelkentburns.com/');

  await dismissCookieBanner(page);

  const username = `jonathan${Date.now()}`;

  await page.getByRole('link', { name: 'User' }).click();
  await page.getByRole('link', { name: 'Register as Student' }).click();

  await page.getByRole('textbox', { name: 'Username' })
    .fill(username);

  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page.locator('body')).toContainText(
    'Error: Please type your email address.'
  );
});

test('Submit with already registered email', async ({ page }) => {
  await page.goto('https://student.michaelkentburns.com/');

  await dismissCookieBanner(page);

  const username = `jonathan${Date.now()}`;

  await page.getByRole('link', { name: 'User' }).click();
  await page.getByRole('link', { name: 'Register as Student' }).click();

  await page.getByRole('textbox', { name: 'Username' })
    .fill(username);

  await page.getByRole('textbox', { name: 'Email' })
    .fill('mbusaabigael@gmail.com');

  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page.locator('body')).toContainText(
    'Error: This email address is already registered.'
  );
});
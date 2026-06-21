import { test, expect } from '@playwright/test';

test.describe('Create Account - Student', () => {

  test('Register as Student with valid inputs', async ({ page }) => {
    const uniqueId = Date.now();

    const username = `josue${uniqueId}`;
    const email = `josue${uniqueId}@gmail.com`;

   await page.goto(
  'https://student.michaelkentburns.com/wp-login.php?action=register',
  { waitUntil: 'domcontentloaded' }
);

    await page.locator('#user_login').fill(username);
    await page.locator('#user_email').fill(email);

    await page.locator('#wp-submit').click();

    await expect(page).toHaveURL(/checkemail=registered/);
  });

  test('Submit with empty username', async ({ page }) => {
    await page.goto(
  'https://student.michaelkentburns.com/wp-login.php?action=register',
  { waitUntil: 'domcontentloaded' }
);

    await page.locator('#user_email')
      .fill('test@gmail.com');

    await page.locator('#wp-submit').click();

    await expect(page.locator('#user_login'))
      .toBeFocused();
  });

  test('Submit with empty email', async ({ page }) => {
  await page.goto(
  'https://student.michaelkentburns.com/wp-login.php?action=register',
  { waitUntil: 'domcontentloaded' }
);

  await page.locator('#user_login')
    .fill('josueTest');

  await page.locator('#wp-submit').click();

  // On doit rester sur la page d'inscription
  await expect(page).toHaveURL(
    /wp-login\.php\?action=register/
  );

  // Le champ email est invalide car il est requis
  const emailIsInvalid = await page
    .locator('#user_email')
    .evaluate(el => !el.checkValidity());

  expect(emailIsInvalid).toBeTruthy();
});

  test('Submit with already registered email', async ({ page }) => {
    await page.goto(
  'https://student.michaelkentburns.com/wp-login.php?action=register',
  { waitUntil: 'domcontentloaded' }
);

    await page.locator('#user_login')
      .fill(`josue${Date.now()}`);

    await page.locator('#user_email')
      .fill('test@gmail.com');

    await page.locator('#wp-submit').click();

    await expect(page.locator('body'))
      .toContainText(/email|already|registered/i);
  });

});
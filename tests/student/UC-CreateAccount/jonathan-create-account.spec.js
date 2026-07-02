import { test, expect } from '@playwright/test';
import { dismissCookieBanner } from '../../../helpers/cookies.js';

const baseUrl = 'https://student.michaelkentburns.com/';

async function openStudentRegistration(page) {
  await page.goto(baseUrl);
  await dismissCookieBanner(page);

  await page.getByRole('link', { name: 'User' }).click();
  await page.getByRole('link', { name: 'Register as Student' }).click();
}

function createStudentData() {
  const timestamp = Date.now();

  return {
    username: `jonathan${timestamp}`,
    email: `jonathan${timestamp}@test.com`,
  };
}

test('Register as Student with valid inputs', async ({ page }) => {
  const student = createStudentData();

  await openStudentRegistration(page);

  await page.getByRole('textbox', { name: 'Username' }).fill(student.username);
  await page.getByRole('textbox', { name: 'Email' }).fill(student.email);

  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page.locator('body')).toContainText(
    'Registration complete. Please check your email, then visit the login page.'
  );
});

test('Submit with empty username', async ({ page }) => {
  const student = createStudentData();

  await openStudentRegistration(page);

  await page.getByRole('textbox', { name: 'Email' }).fill(student.email);

  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page.locator('body')).toContainText(
    'Error: Please enter a username.'
  );
});

test('Submit with empty email', async ({ page }) => {
  const student = createStudentData();

  await openStudentRegistration(page);

  await page.getByRole('textbox', { name: 'Username' }).fill(student.username);

  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page.locator('body')).toContainText(
    'Error: Please type your email address.'
  );
});

test('Submit with already registered email', async ({ page }) => {
  const firstStudent = createStudentData();
  const secondStudent = createStudentData();

  await openStudentRegistration(page);

  await page.getByRole('textbox', { name: 'Username' }).fill(firstStudent.username);
  await page.getByRole('textbox', { name: 'Email' }).fill(firstStudent.email);
  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page.locator('body')).toContainText(
    'Registration complete. Please check your email, then visit the login page.'
  );

  await openStudentRegistration(page);

  await page.getByRole('textbox', { name: 'Username' }).fill(secondStudent.username);
  await page.getByRole('textbox', { name: 'Email' }).fill(firstStudent.email);
  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page.locator('body')).toContainText(
    'Error: This email address is already registered.'
  );
});
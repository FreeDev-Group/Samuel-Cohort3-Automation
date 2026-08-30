import { dismissCookieBanner } from './cookies.js';
import { studentUser, instructorUser } from '../fixtures/test-users.js';

// Both roles use the same WordPress login form.
// The only difference is the account used.
async function login(page, user) {
  await page.goto('/');
  await dismissCookieBanner(page);

  await page.getByRole('link', { name: 'User' }).click();
  await page.getByRole('link', { name: 'Login' }).click();

  await page
    .getByRole('textbox', { name: 'Username or Email Address' })
    .fill(user.username);

  await page
    .getByRole('textbox', { name: 'Password' })
    .fill(user.password);

  await page.getByRole('button', { name: 'Log In' }).click();

  await page.waitForLoadState('domcontentloaded');
}

export async function loginAsStudent(page, user = studentUser) {
  await login(page, user);
}

export async function loginAsInstructor(page, user = instructorUser) {
  await login(page, user);
}
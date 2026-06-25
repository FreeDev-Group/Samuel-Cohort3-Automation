import { dismissCookieBanner } from './cookies.js';
import { studentUser } from '../fixtures/test-users.js';

// Logs in as the shared test student starting from the real homepage.
// Reuse this in any test that needs an authenticated student
// (Provide Feedback, Review Past Feedback, etc.).

export async function loginAsStudent(page, user = studentUser) {
  await page.goto('/');
  await dismissCookieBanner(page);

  await page.getByRole('link', { name: 'User' }).click();
  await page.getByRole('link', { name: 'Login' }).click();

  await page.getByRole('textbox', { name: 'Username' }).fill(user.username);
  await page.getByRole('textbox', { name: 'Password' }).fill(user.password);

  await page.getByRole('button', { name: 'Log In' }).click();
}

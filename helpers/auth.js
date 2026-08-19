import { dismissCookieBanner } from './cookies.js';
import { studentUser, instructorUser } from '../fixtures/test-users.js';

// Both roles log in through the same WordPress login form on the same
// site, they just differ by which account is used.
async function login(page, user) {
  await page.goto('/');
  await dismissCookieBanner(page);

  await page.getByRole('link', { name: 'User' }).click();
  await page.getByRole('link', { name: 'Login' }).click();

  await page.getByRole('textbox', { name: 'Username' }).fill(user.username);
  await page.getByRole('textbox', { name: 'Password' }).fill(user.password);

  await page.getByRole('button', { name: 'Log In' }).click();
}

// Logs in as the shared test student starting from the real homepage.
// Reuse this in any test that needs an authenticated student
// (Provide Feedback, Review Past Feedback, etc.).
export async function loginAsStudent(page, user = studentUser) {
  await login(page, user);
}

// Logs in as the shared test instructor starting from the real homepage.
// Reuse this in any test that needs an authenticated instructor
// (Manage Surveys, etc.).
export async function loginAsInstructor(page, user = instructorUser) {
  await login(page, user);
}

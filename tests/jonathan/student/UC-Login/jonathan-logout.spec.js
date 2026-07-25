import { test, expect } from '@playwright/test';
import { loginAsStudent } from '../../../../helpers/auth.js';

async function logoutStudent(page) {
  const userLink = page.getByRole('link', { name: 'User', exact: true });

  if (await userLink.isVisible().catch(() => false)) {
    await userLink.click();
  }

  const logoutLink = page.locator('a[href*="action=logout"]').first();

  await expect(logoutLink).toHaveAttribute('href', /action=logout/);

  const logoutHref = await logoutLink.getAttribute('href');

  await page.goto(logoutHref);
}

test('Logged-in student logs out successfully', async ({ page }) => {
  await loginAsStudent(page);

  await expect(page.locator('body')).toContainText(/logout|my completed surveys|dashboard/i);

  await logoutStudent(page);

  await expect(page.locator('body')).toContainText(/login|register|user/i);
  await expect(page.locator('body')).not.toContainText(/my completed surveys/i);
});

test('After logout, student-only access is no longer available', async ({ page }) => {
  await loginAsStudent(page);

  await expect(page.locator('body')).toContainText(/logout|my completed surveys|dashboard/i);

  await logoutStudent(page);

  await page.goto('/');

  await expect(page.locator('body')).toContainText(/login|register|user/i);
  await expect(page.locator('body')).not.toContainText(/my completed surveys/i);
});
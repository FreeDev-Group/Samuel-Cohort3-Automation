import { test, expect } from '@playwright/test';

test('staging site is reachable', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/michaelkentburns/);
});

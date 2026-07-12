import { test, expect } from '@playwright/test';
import { loginAsStudent } from '../../../../helpers/auth.js';

test.describe('Student Logout', () => {

    test('Logged-in student logs out successfully', async ({ page }) => {

        // Login using the shared helper
        await loginAsStudent(page);

        // Open student menu
        await page.getByRole('link', { name: 'Student' }).click();

        // Logout
        await page.getByRole('link', { name: 'Logout' }).click();

        // Verify user is returned to public navigation
        await expect(
            page.getByRole('link', { name: 'User' })
        ).toBeVisible();

        await page.getByRole('link', { name: 'User' }).click();

        // Verify login and registration options are available again
        await expect(
            page.getByRole('link', { name: 'Login' })
        ).toBeVisible();

        await expect(
            page.getByRole('link', { name: 'Register as Student' })
        ).toBeVisible();
    });


    test('Logged-out student cannot access protected features', async ({ page }) => {

        // Login using the shared helper
        await loginAsStudent(page);

        // Logout
        await page.getByRole('link', { name: 'Student' }).click();

        await page.getByRole('link', { name: 'Logout' }).click();

        // Open user menu
        await page.getByRole('link', { name: 'User' }).click();

        // Verify the user must login again
        await expect(
            page.getByRole('link', { name: 'Login' })
        ).toBeVisible();

        await expect(
            page.getByRole('link', { name: 'Register as Student' })
        ).toBeVisible();
    });

});

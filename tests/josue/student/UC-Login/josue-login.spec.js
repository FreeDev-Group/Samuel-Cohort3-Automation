import { test, expect } from '@playwright/test';
import { dismissCookieBanner } from '../../../../helpers/cookies.js';
import { studentUser } from '../../../../fixtures/test-users.js';

test.describe('Student Login', () => {

    async function openStudentLogin(page) {
        await page.goto('/', {
            waitUntil: 'domcontentloaded',
            timeout: 60000,
        });

        await dismissCookieBanner(page);

        const userLink = page.getByRole('link', {
            name: 'User',
            exact: true,
        });

        await expect(userLink).toBeVisible({
            timeout: 60000,
        });

        await userLink.click();

        const loginLink = page.getByRole('link', {
            name: 'Login',
            exact: true,
        });

        await expect(loginLink).toBeVisible();

        await loginLink.click();

        await expect(
            page.getByRole('textbox', {
                name: /Username|Username or Email Address/i,
            })
        ).toBeVisible();
    }

    test('Login with valid credentials', async ({ page }) => {

        await openStudentLogin(page);

        await page.getByRole('textbox', {
            name: /Username|Username or Email Address/i,
        }).fill(studentUser.username);

        await page.getByRole('textbox', {
            name: 'Password',
        }).fill(studentUser.password);

        await page.getByRole('button', {
            name: 'Log In',
        }).click();

        await expect(page.locator('body')).toContainText(
            /dashboard|welcome|logout/i,
            {
                timeout: 60000,
            }
        );
    });

    test('Login with wrong password', async ({ page }) => {

        await openStudentLogin(page);

        await page.getByRole('textbox', {
            name: /Username|Username or Email Address/i,
        }).fill(studentUser.username);

        await page.getByRole('textbox', {
            name: 'Password',
        }).fill('wrongpassword123');

        await page.getByRole('button', {
            name: 'Log In',
        }).click();

        await expect(page.locator('#login_error')).toContainText(
            'Error: The password you entered for the email address'
        );
    });

    test('Login with unregistered username', async ({ page }) => {

        await openStudentLogin(page);

        await page.getByRole('textbox', {
            name: /Username|Username or Email Address/i,
        }).fill('ghost_user_00');

        await page.getByRole('textbox', {
            name: 'Password',
        }).fill('wrongpassword123');

        await page.getByRole('button', {
            name: 'Log In',
        }).click();

        await expect(page.locator('#login_error')).toContainText(
            'Error: The username ghost_user_00 is not registered on this site.'
        );
    });

});

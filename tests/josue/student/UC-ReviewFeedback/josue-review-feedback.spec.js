import { test, expect } from '@playwright/test';
import { loginAsStudent } from '../../../../helpers/auth.js';

async function openCompletedSurveys(page) {
  await loginAsStudent(page);

  await page.getByRole('link', { name: 'My Completed Surveys' }).click();

  await expect(page).toHaveURL(/my-completed-surveys/);
}

test.describe.serial('Student Review Past Feedback', () => {

  test('Completed surveys list is displayed', async ({ page }) => {
    await openCompletedSurveys(page);

    const surveys = page.locator('a[href*="/survey/"]');

    await expect(surveys.first()).toBeVisible();
  });

  test('Student can review previously submitted feedback', async ({ page }) => {
    await openCompletedSurveys(page);

    // Open the completed survey used during manual testing
    await page.getByRole('link', {
      name: /Wise _Test_With_Playwright/i,
    }).dblclick();

    // Verify the review page is displayed
    await expect(
      page.getByRole('heading', {
        name: /Your Answers for:/i,
      })
    ).toBeVisible();

    // Verify previously submitted answers are displayed
    await expect(page.locator('body')).toContainText(
      'Have you enjoyed this test?:'
    );
  });

});
import { test, expect } from '@playwright/test';
import { loginAsStudent } from '../../../../helpers/auth.js';

test.describe('Student review past feedback', () => {
  async function openCompletedSurveys(page) {
    await loginAsStudent(page);

    await expect(page.getByRole('link', { name: 'My Completed Surveys' })).toBeVisible();
    await page.getByRole('link', { name: 'My Completed Surveys' }).click();

    await expect(page.locator('body')).toContainText(/Surveys You Have Completed/i);
  }

  function completedSurveyLinks(page) {
    return page
      .locator('a[href*="survey_id="][href*="response_id="]')
      .filter({
        hasNotText: /home|about|all surveys|student|logout|login/i,
      });
  }

  test('Logged-in student can see list of completed surveys', async ({ page }) => {
    await openCompletedSurveys(page);

    await expect(page.locator('body')).toContainText(/Surveys You Have Completed/i);

    const firstCompletedSurvey = completedSurveyLinks(page).first();

    await expect(firstCompletedSurvey).toBeVisible();
  });

  test('Student can open a completed survey and review submitted responses', async ({ page }) => {
    await openCompletedSurveys(page);

    const firstCompletedSurvey = completedSurveyLinks(page).first();
    const surveyTitle = (await firstCompletedSurvey.textContent())?.trim();

    await expect(firstCompletedSurvey).toBeVisible();
    await firstCompletedSurvey.click();

    await expect(page).toHaveURL(/my-completed-surveys\/\?survey_id=\d+&response_id=\d+/);

    if (surveyTitle) {
      await expect(page.locator('body')).toContainText(surveyTitle);
    }

    await expect(page.locator('body')).toContainText(
      /completed|survey|response|responses|answer|question|submitted|Surveys You Have Completed/i
    );
  });
});
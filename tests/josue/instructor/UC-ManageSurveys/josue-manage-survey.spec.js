import { test, expect } from '@playwright/test';
import {
  loginAsInstructor,
  openAllSurveys,
  openAllQuestions,
} from '../../../../helpers/auth.js';

test.describe.serial('Instructor Manage Survey', () => {
  let surveyId;
  let surveyTitle;

  const BASE_URL = 'https://student.michaelkentburns.com';

  /**
   * ---------------------------------------------------------
   * 1. CREATE SURVEY
   * ---------------------------------------------------------
   */
  test('Create Survey successfully', async ({ page }) => {
    surveyTitle = `Josue Manage Survey ${Date.now()}`;

    await loginAsInstructor(page);

    await page.goto(
      `${BASE_URL}/wp-admin/post-new.php?post_type=survey`,
      {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      }
    );

    // Title
    const titleInput = page.getByRole('textbox', {
      name: 'Add title',
    });

    await expect(titleInput).toBeVisible();
    await titleInput.fill(surveyTitle);

    // Description
    const descriptionInput = page.getByRole('textbox', {
      name: 'Description',
    });

    await expect(descriptionInput).toBeVisible();

    await descriptionInput.fill(
      'This survey is created automatically to test the Instructor Manage Survey use case.'
    );

    // Dates
    const startDate = page.getByRole('textbox', {
      name: 'Start Date',
    });

    const endDate = page.getByRole('textbox', {
      name: 'End Date',
    });

    await startDate.fill('2026-08-23');
    await endDate.fill('2026-08-30');

    // Publish
    const publishButton = page.getByRole('button', {
      name: 'Publish',
      exact: true,
    });

    await expect(publishButton).toBeVisible();
    await expect(publishButton).toBeEnabled();

    await publishButton.click();

    // Give WordPress time to save
    await page.waitForTimeout(2000);

    /**
     * IMPORTANT:
     * We do not trust a fixed post ID.
     *
     * We go back to All Surveys and find the survey
     * by its unique title.
     */
    await openAllSurveys(page);

    const surveyLink = page.getByRole('link', {
      name: surveyTitle,
      exact: true,
    });

    await expect(surveyLink).toBeVisible({
      timeout: 15000,
    });

    /**
     * Recover the REAL WordPress edit URL.
     */
    const editUrl = await surveyLink.getAttribute('href');

    expect(editUrl).toBeTruthy();

    console.log(`Survey title: ${surveyTitle}`);
    console.log(`Survey edit URL: ${editUrl}`);

    /**
     * Extract the WordPress post ID.
     *
     * Example:
     * /wp-admin/post.php?post=2719&action=edit
     *
     * => 2719
     */
    const match = editUrl.match(/[?&]post=(\d+)/);

    expect(match).not.toBeNull();

    surveyId = match[1];

    console.log(`Created Survey ID: ${surveyId}`);

    expect(surveyId).toMatch(/^\d+$/);
  });

  /**
   * ---------------------------------------------------------
   * HELPER
   * Wait until the survey appears in Associated Survey
   * ---------------------------------------------------------
   */
  async function openQuestionEditorAndSelectSurvey(page) {
    await loginAsInstructor(page);

    await page.goto(
      `${BASE_URL}/wp-admin/post-new.php?post_type=question`,
      {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      }
    );

    await expect(
      page.getByRole('textbox', {
        name: 'Add title',
      })
    ).toBeVisible();

    const surveySelect = page.getByLabel('Associated Survey');

    await expect(surveySelect).toBeVisible();
    await expect(surveySelect).toBeEnabled();

    /**
     * The survey may need a moment to appear in the
     * Associated Survey select.
     *
     * Instead of immediately calling selectOption(),
     * wait until the option corresponding to surveyId exists.
     */
    await expect
      .poll(
        async () => {
          return await surveySelect.locator(
            `option[value="${surveyId}"]`
          ).count();
        },
        {
          timeout: 30000,
          intervals: [500, 1000, 2000],
        }
      )
      .toBeGreaterThan(0);

    await surveySelect.selectOption(surveyId);

    await expect(surveySelect).toHaveValue(surveyId);

    return surveySelect;
  }

  /**
   * ---------------------------------------------------------
   * 2. MULTIPLE CHOICE
   * ---------------------------------------------------------
   */
  test('Add Multiple Choice question successfully', async ({
    page,
  }) => {
    expect(
      surveyId,
      'Survey ID must come from the Create Survey test'
    ).toBeTruthy();

    const questionTitle =
      'How satisfied are you with this course?';

    const answerOptions =
      'Very satisfied\nSatisfied\nNeutral\nDissatisfied\nVery dissatisfied';

    await openQuestionEditorAndSelectSurvey(page);

    // Question title
    await page
      .getByRole('textbox', {
        name: 'Add title',
      })
      .fill(questionTitle);

    // Question type
    const questionType = page.getByLabel('Question Type');

    await expect(questionType).toBeVisible();
    await expect(questionType).toBeEnabled();

    await questionType.selectOption('multiple_choice');

    await expect(questionType).toHaveValue(
      'multiple_choice'
    );

    // Answer options
    const optionsField = page.getByRole('textbox', {
      name: 'Answer Options',
    });

    await expect(optionsField).toBeVisible();

    await optionsField.fill(answerOptions);

    await expect(optionsField).toHaveValue(answerOptions);

    // Publish
    const publishButton = page.getByRole('button', {
      name: 'Publish',
      exact: true,
    });

    await expect(publishButton).toBeVisible();
    await expect(publishButton).toBeEnabled();

    await publishButton.click();

    await page.waitForTimeout(2000);

    // Verify
    await openAllQuestions(page);

    const questions = page.getByRole('link', {
      name: questionTitle,
      exact: true,
    });

    await expect(questions.last()).toBeVisible({
      timeout: 15000,
    });

    console.log(
      `Multiple Choice question created for survey ${surveyId}`
    );
  });

  /**
   * ---------------------------------------------------------
   * 3. TRUE / FALSE
   * ---------------------------------------------------------
   */
  test('Add True/False question successfully', async ({
    page,
  }) => {
    expect(
      surveyId,
      'Survey ID must come from the Create Survey test'
    ).toBeTruthy();

    const questionTitle =
      'Would you recommend this course to another student?';

    const answerOptions = 'True\nFalse';

    await openQuestionEditorAndSelectSurvey(page);

    // Question title
    await page
      .getByRole('textbox', {
        name: 'Add title',
      })
      .fill(questionTitle);

    // Question type
    const questionType = page.getByLabel('Question Type');

    await expect(questionType).toBeVisible();
    await expect(questionType).toBeEnabled();

    await questionType.selectOption('true_false');

    await expect(questionType).toHaveValue(
      'true_false'
    );

    // Answer options
    const optionsField = page.getByRole('textbox', {
      name: 'Answer Options',
    });

    await expect(optionsField).toBeVisible();

    await optionsField.fill(answerOptions);

    await expect(optionsField).toHaveValue(answerOptions);

    // Publish
    const publishButton = page.getByRole('button', {
      name: 'Publish',
      exact: true,
    });

    await expect(publishButton).toBeVisible();
    await expect(publishButton).toBeEnabled();

    await publishButton.click();

    await page.waitForTimeout(2000);

    // Verify
    await openAllQuestions(page);

    const questions = page.getByRole('link', {
      name: questionTitle,
      exact: true,
    });

    await expect(questions.last()).toBeVisible({
      timeout: 15000,
    });

    console.log(
      `True/False question created for survey ${surveyId}`
    );
  });

  /**
   * ---------------------------------------------------------
   * 4. TEXT QUESTION
   * ---------------------------------------------------------
   */
  test('Add Text question successfully', async ({ page }) => {
    expect(
      surveyId,
      'Survey ID must come from the Create Survey test'
    ).toBeTruthy();

    const questionTitle =
      'What did you like most about this course?';

    await openQuestionEditorAndSelectSurvey(page);

    // Question title
    await page
      .getByRole('textbox', {
        name: 'Add title',
      })
      .fill(questionTitle);

    /**
     * IMPORTANT:
     *
     * Codegen showed that the Text question does not
     * require selecting Question Type.
     *
     * Therefore we deliberately keep the default type.
     */

    // Publish
    const publishButton = page.getByRole('button', {
      name: 'Publish',
      exact: true,
    });

    await expect(publishButton).toBeVisible();
    await expect(publishButton).toBeEnabled();

    await publishButton.click();

    await page.waitForTimeout(2000);

    // Verify
    await openAllQuestions(page);

    const questions = page.getByRole('link', {
      name: questionTitle,
      exact: true,
    });

    await expect(questions.last()).toBeVisible({
      timeout: 15000,
    });

    console.log(
      `Text question created for survey ${surveyId}`
    );
  });
});
import { test, expect } from '@playwright/test';
import { loginAsInstructor } from '../../../../helpers/auth.js';

test.describe.serial('Instructor Manage Survey', () => {
  let surveyTitle;
  let editedSurveyTitle;
  let surveyId;

  const surveyDescription =
    'This survey is created automatically to test the Instructor Manage Survey use case.';

  const multipleChoiceQuestion =
    'How satisfied are you with this course?';

  const multipleChoiceOptions =
    'Very satisfied\nSatisfied\nNeutral\nDissatisfied\nVery dissatisfied';

  const trueFalseQuestion =
    'Would you recommend this course to another student?';

  const trueFalseOptions =
    'True\nFalse';

  const textQuestion =
    'What did you like most about this course?';

  /*
   * ============================================================
   * HELPER: Open All Surveys
   * ============================================================
   */
  async function openAllSurveys(page) {
    await page.goto(
      'https://student.michaelkentburns.com/wp-admin/edit.php?post_type=survey'
    );

    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveURL(/edit\.php\?post_type=survey/);
  }

  /*
   * ============================================================
   * HELPER: Create Survey
   * ============================================================
   */
  async function createSurvey(page) {
    surveyTitle = `Josue Manage Survey ${Date.now()}`;

    await page.goto(
      'https://student.michaelkentburns.com/wp-admin/post-new.php?post_type=survey'
    );

    await page.waitForLoadState('domcontentloaded');

    const titleInput = page.getByRole('textbox', {
      name: 'Add title',
    });

    const descriptionInput = page.getByRole('textbox', {
      name: 'Description',
    });

    const startDateInput = page.getByRole('textbox', {
      name: 'Start Date',
    });

    const endDateInput = page.getByRole('textbox', {
      name: 'End Date',
    });

    await expect(titleInput).toBeVisible();
    await expect(descriptionInput).toBeVisible();
    await expect(startDateInput).toBeVisible();
    await expect(endDateInput).toBeVisible();

    await titleInput.fill(surveyTitle);

    await descriptionInput.fill(surveyDescription);

    await startDateInput.fill('2026-08-21');

    await endDateInput.fill('2026-08-30');

    const publishButton = page.getByRole('button', {
      name: 'Publish',
      exact: true,
    });

    await expect(publishButton).toBeVisible();
    await expect(publishButton).toBeEnabled();

    await publishButton.click();

    await page.waitForLoadState('domcontentloaded');

    console.log(`Created survey: ${surveyTitle}`);
  }

  /*
   * ============================================================
   * HELPER: Find Survey In All Surveys
   * ============================================================
   */
  async function findSurveyRow(page, title) {
    await openAllSurveys(page);

    const surveyRow = page.getByRole('row').filter({
      hasText: title,
    }).first();

    await expect(surveyRow).toBeVisible();

    return surveyRow;
  }

  /*
   * ============================================================
   * HELPER: Get Survey Edit URL
   * ============================================================
   */
  async function getSurveyEditUrl(page, title) {
    const surveyRow = await findSurveyRow(page, title);

    /*
     * IMPORTANT:
     * We use the title link because it has the real WordPress
     * post.php URL.
     */
    const surveyLink = surveyRow.getByRole('link', {
      name: title,
      exact: true,
    });

    await expect(surveyLink).toBeVisible();

    const href = await surveyLink.getAttribute('href');

    expect(href).not.toBeNull();

    console.log(`Survey edit URL: ${href}`);

    return href;
  }

  /*
   * ============================================================
   * HELPER: Open New Question
   * ============================================================
   */
  async function openNewQuestion(page) {
    await page.goto(
      'https://student.michaelkentburns.com/wp-admin/post-new.php?post_type=question'
    );

    await page.waitForLoadState('domcontentloaded');

    const titleInput = page.getByRole('textbox', {
      name: 'Add title',
    });

    const surveySelect = page.getByLabel('Associated Survey');

    await expect(titleInput).toBeVisible();
    await expect(surveySelect).toBeVisible();
    await expect(surveySelect).toBeEnabled();
  }

  /*
   * ============================================================
   * HELPER: Select Our Survey
   * ============================================================
   */
  async function selectCreatedSurvey(page) {
    const surveySelect = page.getByLabel('Associated Survey');

    await expect(surveySelect).toBeVisible();
    await expect(surveySelect).toBeEnabled();

    /*
     * Wait until the survey created by this test exists
     * inside the select.
     */
    await expect
      .poll(
        async () => {
          return await surveySelect
            .locator('option')
            .evaluateAll((options) =>
              options.map((option) => ({
                value: option.value,
                text: option.textContent?.trim(),
              }))
            );
        },
        {
          timeout: 15000,
          intervals: [500, 1000],
        }
      )
      .toContainEqual(
        expect.objectContaining({
          text: surveyTitle,
        })
      );

    const surveyOption = surveySelect.locator('option', {
      hasText: surveyTitle,
    });

    const surveyValue = await surveyOption.getAttribute('value');

    expect(surveyValue).not.toBeNull();

    console.log(`Using survey ID: ${surveyValue}`);

    surveyId = surveyValue;

    await surveySelect.selectOption(surveyValue);

    await expect(surveySelect).toHaveValue(surveyValue);
  }

  /*
   * ============================================================
   * HELPER: Publish Question
   * ============================================================
   */
  async function publishQuestion(page) {
    const publishButton = page.getByRole('button', {
      name: 'Publish',
      exact: true,
    });

    await expect(publishButton).toBeVisible();
    await expect(publishButton).toBeEnabled();

    await publishButton.click();

    await page.waitForLoadState('domcontentloaded');
  }

  /*
   * ============================================================
   * 1. CREATE SURVEY
   * ============================================================
   */
  test('Create Survey successfully', async ({ page }) => {
    await loginAsInstructor(page);

    await createSurvey(page);

    /*
     * Verify that our survey really appears in All Surveys.
     */
    await openAllSurveys(page);

    const surveyLink = page.getByRole('link', {
      name: surveyTitle,
      exact: true,
    });

    await expect(surveyLink).toBeVisible();

    console.log(`Survey created successfully: ${surveyTitle}`);
  });

  /*
   * ============================================================
   * 2. ADD MULTIPLE CHOICE QUESTION
   * ============================================================
   */
  test('Add Multiple Choice question successfully', async ({ page }) => {
    await loginAsInstructor(page);

    await openNewQuestion(page);

    const titleInput = page.getByRole('textbox', {
      name: 'Add title',
    });

    await titleInput.fill(multipleChoiceQuestion);

    await selectCreatedSurvey(page);

    const questionType = page.getByLabel('Question Type');

    await expect(questionType).toBeVisible();
    await expect(questionType).toBeEnabled();

    await questionType.selectOption('multiple_choice');

    const answerOptions = page.getByRole('textbox', {
      name: 'Answer Options',
    });

    await expect(answerOptions).toBeVisible();

    await answerOptions.fill(multipleChoiceOptions);

    await publishQuestion(page);

    /*
     * Verify from Questions list that our question exists.
     */
    await page.goto(
      'https://student.michaelkentburns.com/wp-admin/edit.php?post_type=question'
    );

    await page.waitForLoadState('domcontentloaded');

    const questionRow = page.getByRole('row').filter({
      hasText: multipleChoiceQuestion,
    }).first();

    await expect(questionRow).toBeVisible();

    console.log('Multiple Choice question created successfully.');
  });

  /*
   * ============================================================
   * 3. ADD TRUE/FALSE QUESTION
   * ============================================================
   */
  test('Add True/False question successfully', async ({ page }) => {
    await loginAsInstructor(page);

    await openNewQuestion(page);

    const titleInput = page.getByRole('textbox', {
      name: 'Add title',
    });

    await titleInput.fill(trueFalseQuestion);

    await selectCreatedSurvey(page);

    const questionType = page.getByLabel('Question Type');

    await expect(questionType).toBeVisible();
    await expect(questionType).toBeEnabled();

    await questionType.selectOption('true_false');

    const answerOptions = page.getByRole('textbox', {
      name: 'Answer Options',
    });

    await expect(answerOptions).toBeVisible();

    await answerOptions.fill(trueFalseOptions);

    await publishQuestion(page);

    await page.goto(
      'https://student.michaelkentburns.com/wp-admin/edit.php?post_type=question'
    );

    await page.waitForLoadState('domcontentloaded');

    const questionRow = page.getByRole('row').filter({
      hasText: trueFalseQuestion,
    }).first();

    await expect(questionRow).toBeVisible();

    console.log('True/False question created successfully.');
  });

  /*
   * ============================================================
   * 4. ADD TEXT QUESTION
   * ============================================================
   */
  test('Add Text question successfully', async ({ page }) => {
    await loginAsInstructor(page);

    await openNewQuestion(page);

    const titleInput = page.getByRole('textbox', {
      name: 'Add title',
    });

    await titleInput.fill(textQuestion);

    await selectCreatedSurvey(page);

    /*
     * Text / Short Answer / Essay uses the default text type
     * according to the manual testing findings.
     */
    await publishQuestion(page);

    await page.goto(
      'https://student.michaelkentburns.com/wp-admin/edit.php?post_type=question'
    );

    await page.waitForLoadState('domcontentloaded');

    const questionRow = page.getByRole('row').filter({
      hasText: textQuestion,
    }).first();

    await expect(questionRow).toBeVisible();

    console.log('Text question created successfully.');
  });

  /*
   * ============================================================
   * 5. EDIT SURVEY
   * ============================================================
   */
  test('Edit an existing survey successfully', async ({ page }) => {
    await loginAsInstructor(page);

    /*
     * Find the survey created by this test suite.
     * We NEVER search for an old hardcoded survey.
     */
    const editUrl = await getSurveyEditUrl(page, surveyTitle);

    expect(editUrl).toMatch(
      /post\.php\?post=\d+&action=edit/
    );

    const match = editUrl.match(/post=(\d+)/);

    expect(match).not.toBeNull();

    surveyId = match[1];

    /*
     * Open the real WordPress edit page.
     */
    await page.goto(editUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    await expect(page).toHaveURL(
      new RegExp(`post=${surveyId}&action=edit`)
    );

    const titleInput = page.getByRole('textbox', {
      name: 'Add title',
    });

    await expect(titleInput).toBeVisible();

    editedSurveyTitle = `Josue Edited Survey ${Date.now()}`;

    await titleInput.fill(editedSurveyTitle);

    /*
     * Description exists on the survey editor.
     */
    const descriptionInput = page.getByRole('textbox', {
      name: 'Description',
    });

    if (await descriptionInput.count()) {
      if (await descriptionInput.isVisible()) {
        await descriptionInput.fill(
          'Survey successfully edited automatically.'
        );
      }
    }

    /*
     * Update dates.
     */
    const startDateInput = page.getByRole('textbox', {
      name: 'Start Date',
    });

    const endDateInput = page.getByRole('textbox', {
      name: 'End Date',
    });

    if (await startDateInput.count()) {
      if (await startDateInput.isVisible()) {
        await startDateInput.fill('2026-08-23');
      }
    }

    if (await endDateInput.count()) {
      if (await endDateInput.isVisible()) {
        await endDateInput.fill('2026-08-30');
      }
    }

    /*
     * IMPORTANT:
     * Depending on the WordPress editor state, the button may be
     * "Update" or "Publish".
     */
    const updateButton = page.getByRole('button', {
      name: 'Update',
      exact: true,
    });

    const publishButton = page.getByRole('button', {
      name: 'Publish',
      exact: true,
    });

    if (await updateButton.count() && await updateButton.isVisible()) {
      await expect(updateButton).toBeEnabled();
      await updateButton.click();
    } else if (
      await publishButton.count() &&
      await publishButton.isVisible()
    ) {
      await expect(publishButton).toBeEnabled();
      await publishButton.click();
    } else {
      throw new Error(
        'Neither Update nor Publish button was found on the survey editor.'
      );
    }

    await page.waitForLoadState('domcontentloaded');

    /*
     * Verify the edited title in All Surveys.
     */
    await openAllSurveys(page);

    const editedSurveyLink = page.getByRole('link', {
      name: editedSurveyTitle,
      exact: true,
    });

    await expect(editedSurveyLink).toBeVisible();

    console.log(
      `Survey edited successfully: ${editedSurveyTitle}`
    );
  });

  /*
   * ============================================================
   * 6. DELETE SURVEY
   * ============================================================
   */
  test('Delete Survey successfully', async ({ page }) => {
    await loginAsInstructor(page);

    /*
     * We delete the survey that THIS test suite created and
     * subsequently edited.
     */
    const titleToDelete = editedSurveyTitle || surveyTitle;

    await openAllSurveys(page);

    const surveyRow = page.getByRole('row').filter({
      hasText: titleToDelete,
    }).first();

    await expect(surveyRow).toBeVisible();

    /*
     * Recover the real survey ID from the title link.
     */
    const surveyLink = surveyRow.getByRole('link', {
      name: titleToDelete,
      exact: true,
    });

    await expect(surveyLink).toBeVisible();

    const href = await surveyLink.getAttribute('href');

    expect(href).not.toBeNull();

    const idMatch = href.match(/post=(\d+)/);

    expect(idMatch).not.toBeNull();

    const idToDelete = idMatch[1];

    console.log(`Deleting survey ID: ${idToDelete}`);

    /*
     * Find the Trash link INSIDE THE SAME ROW.
     * This prevents Playwright from deleting another survey.
     */
    const trashLink = surveyRow.getByRole('link', {
      name: /Move .* to the Trash/,
    });

    await expect(trashLink).toBeVisible();

    await trashLink.click();

    await page.waitForLoadState('domcontentloaded');

    /*
     * Verify the survey is no longer present in All Surveys.
     */
    await openAllSurveys(page);

    await expect(
      page.getByRole('link', {
        name: titleToDelete,
        exact: true,
      })
    ).not.toBeVisible();

    console.log(
      `Survey deleted successfully: ${titleToDelete}`
    );
  });
});
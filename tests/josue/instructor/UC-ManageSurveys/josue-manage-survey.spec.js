import { test, expect } from '@playwright/test';
import { loginAsInstructor } from '../../../../helpers/auth.js';

test.describe.serial('Instructor Manage Survey', () => {
  let surveyTitle;
  let surveyId;

  const surveyDescription = 'This is test';

  const multipleChoiceQuestion =
    'How satisfied are you with this course?';

  const multipleChoiceOptions =
    'Very satisfied\nSatisfied\nNeutral\nDissatisfied\nVery dissatisfied';

  // ============================================================
  // CREATE SURVEY
  // ============================================================

  async function createSurvey(page) {
    surveyTitle = `Josue Manage Survey ${Date.now()}`;

    console.log('========== TEST 1: CREATE SURVEY ==========');
    console.log(`Creating survey: ${surveyTitle}`);

    await page.goto(
      '/wp-admin/post-new.php?post_type=survey',
      {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      }
    );

    await expect(
      page.getByRole('textbox', {
        name: 'Add title',
      })
    ).toBeVisible({
      timeout: 30000,
    });

    await page
      .getByRole('textbox', {
        name: 'Add title',
      })
      .fill(surveyTitle);

    await page
      .getByRole('textbox', {
        name: 'Description',
      })
      .fill(surveyDescription);

    await page
      .getByRole('textbox', {
        name: 'Start Date',
      })
      .fill('2026-08-29');

    await page
      .getByRole('textbox', {
        name: 'End Date',
      })
      .fill('2026-09-02');

    const publishButton = page.getByRole('button', {
      name: 'Publish',
      exact: true,
    });

    await expect(publishButton).toBeVisible({
      timeout: 30000,
    });

    await expect(publishButton).toBeEnabled();

    await publishButton.click();

    // WordPress peut rester temporairement sur post-new.php
    // après la publication.
    await page.waitForTimeout(3000);

    console.log(
      `Survey created successfully: ${surveyTitle}`
    );
  }

  // ============================================================
  // FIND CREATED SURVEY
  // ============================================================

  async function findCreatedSurvey(page) {
    console.log('Searching for the created survey...');

    await page.goto(
      '/wp-admin/edit.php?post_type=survey',
      {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      }
    );

    const surveyLink = page.getByRole('link', {
      name: surveyTitle,
      exact: true,
    });

    await expect(surveyLink).toBeVisible({
      timeout: 30000,
    });

    const href = await surveyLink.getAttribute('href');

    expect(href).not.toBeNull();

    console.log(`Survey edit URL: ${href}`);

    const match = href.match(/post=(\d+)/);

    expect(match).not.toBeNull();

    surveyId = match[1];

    console.log(`Created Survey ID: ${surveyId}`);

    return surveyId;
  }

  // ============================================================
  // OPEN ADD NEW QUESTION
  // ============================================================

  async function openNewQuestion(page) {
    console.log('Opening Add New Question...');

    await page.goto(
      '/wp-admin/post-new.php?post_type=question',
      {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      }
    );

    await expect(
      page.getByRole('textbox', {
        name: 'Add title',
      })
    ).toBeVisible({
      timeout: 30000,
    });

    const surveySelect = page.getByLabel(
      'Associated Survey'
    );

    await expect(surveySelect).toBeVisible({
      timeout: 30000,
    });

    await expect(surveySelect).toBeEnabled({
      timeout: 30000,
    });

    console.log(
      'Add New Question page opened successfully.'
    );
  }

  // ============================================================
  // SELECT MANUALLY CREATED SURVEY
  // ============================================================

  async function selectManualSurvey(page) {
    const surveySelect = page.getByLabel(
      'Associated Survey'
    );

    /*
     * IMPORTANT:
     *
     * We intentionally use the survey created manually
     * and confirmed with Playwright Codegen.
     *
     * Survey:
     * Josue Manage Survey
     *
     * Survey ID:
     * 2719
     *
     * Codegen confirmed that this works:
     *
     * await page.getByLabel('Associated Survey')
     *   .selectOption('2719');
     */

    const manualSurveyId = '2719';

    console.log(
      `Selecting manually created survey ID: ${manualSurveyId}`
    );

    await expect(surveySelect).toBeVisible({
      timeout: 30000,
    });

    await expect(surveySelect).toBeEnabled({
      timeout: 30000,
    });

    /*
     * Verify that ID 2719 exists in the dropdown.
     */

    const surveyOption = surveySelect.locator(
      `option[value="${manualSurveyId}"]`
    );

    await expect(surveyOption).toHaveCount(1, {
      timeout: 30000,
    });

    const selectedSurveyTitle =
      await surveyOption.textContent();

    console.log(
      `Survey option found: ${selectedSurveyTitle?.trim()}`
    );

    /*
     * This is the exact Codegen action that worked.
     */

    await surveySelect.selectOption(
      manualSurveyId
    );

    await expect(surveySelect).toHaveValue(
      manualSurveyId
    );

    surveyId = manualSurveyId;

    console.log(
      `Survey selected successfully. Survey ID: ${surveyId}`
    );
  }

  // ============================================================
  // PUBLISH QUESTION
  // ============================================================

  async function publishQuestion(page) {
    const publishButton = page.getByRole('button', {
      name: 'Publish',
      exact: true,
    });

    await expect(publishButton).toBeVisible({
      timeout: 30000,
    });

    await expect(publishButton).toBeEnabled();

    await publishButton.click();

    await page.waitForTimeout(3000);

    console.log(
      'Question published successfully.'
    );
  }

  // ============================================================
  // TEST 1
  // CREATE SURVEY SUCCESSFULLY
  // ============================================================

  test('Create Survey successfully', async ({ page }) => {
    await loginAsInstructor(page);

    await createSurvey(page);

    await findCreatedSurvey(page);

    console.log(
      '=========================================='
    );

    console.log('TEST 1 PASSED');

    console.log(
      `Survey: ${surveyTitle}`
    );

    console.log(
      `Survey ID: ${surveyId}`
    );

    console.log(
      '=========================================='
    );
  });

  // ============================================================
  // TEST 2
  // ADD MULTIPLE CHOICE QUESTION SUCCESSFULLY
  // ============================================================

  test(
    'Add Multiple Choice question successfully',
    async ({ page }) => {

      console.log(
        '========== TEST 2: ADD MULTIPLE CHOICE QUESTION =========='
      );

      await loginAsInstructor(page);

      // ========================================================
      // OPEN ADD NEW QUESTION
      // ========================================================

      await openNewQuestion(page);

      // ========================================================
      // QUESTION TITLE
      // ========================================================

      const titleInput = page.getByRole('textbox', {
        name: 'Add title',
      });

      await expect(titleInput).toBeVisible({
        timeout: 30000,
      });

      await titleInput.fill(
        'How satisfied are you with this course?'
      );

      console.log(
        'Question title entered: How satisfied are you with this course?'
      );

      // ========================================================
      // ASSOCIATED SURVEY
      // ========================================================

      /*
       * IMPORTANT:
       *
       * We use the manually created survey.
       *
       * ID = 2719
       *
       * This follows the exact action recorded by Codegen.
       */

      await selectManualSurvey(page);

      // ========================================================
      // QUESTION TYPE
      // ========================================================

      const questionType =
        page.getByLabel('Question Type');

      await expect(questionType).toBeVisible({
        timeout: 30000,
      });

      await expect(questionType).toBeEnabled({
        timeout: 30000,
      });

      await questionType.selectOption(
        'multiple_choice'
      );

      await expect(questionType).toHaveValue(
        'multiple_choice'
      );

      console.log(
        'Question type selected: Multiple Choice'
      );

      // ========================================================
      // ANSWER OPTIONS
      // ========================================================

      const answerOptions =
        page.getByRole('textbox', {
          name: 'Answer Options',
        });

      await expect(answerOptions).toBeVisible({
        timeout: 30000,
      });

      await answerOptions.fill(
        multipleChoiceOptions
      );

      await expect(answerOptions).toHaveValue(
        multipleChoiceOptions
      );

      console.log(
        'Answer options entered successfully.'
      );

      // ========================================================
      // PUBLISH QUESTION
      // ========================================================

      await publishQuestion(page);

      // ========================================================
      // VERIFY QUESTION
      // ========================================================

      await page.goto(
        '/wp-admin/edit.php?post_type=question',
        {
          waitUntil: 'domcontentloaded',
          timeout: 60000,
        }
      );

      const questionRow =
        page
          .getByRole('row')
          .filter({
            hasText: multipleChoiceQuestion,
          })
          .first();

      await expect(questionRow).toBeVisible({
        timeout: 30000,
      });

      // ========================================================
      // TEST 2 PASSED
      // ========================================================

      console.log(
        '=========================================='
      );

      console.log('TEST 2 PASSED');

      console.log(
        'Multiple Choice question created successfully.'
      );

      console.log(
        `Question: ${multipleChoiceQuestion}`
      );

      console.log(
        'Question Type: multiple_choice'
      );

      console.log(
        `Associated Survey ID: ${surveyId}`
      );

      console.log(
        '=========================================='
      );
    }
  );
});

// ============================================================
// TEST 3
// ADD TRUE/FALSE QUESTION
// ============================================================

test(
  'Add True/False question successfully',
  async ({ page }) => {

    console.log(
      '========== TEST 3: ADD TRUE/FALSE QUESTION =========='
    );

    await loginAsInstructor(page);

    /*
     * Open Add New Question.
     */

    await page.goto(
      '/wp-admin/post-new.php?post_type=question',
      {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      }
    );

    /*
     * ========================================================
     * QUESTION TITLE
     * ========================================================
     */

    const titleInput = page.getByRole('textbox', {
      name: 'Add title',
    });

    await expect(titleInput).toBeVisible({
      timeout: 30000,
    });

    await titleInput.fill(
      'Would you recommend this course to another student?'
    );

    console.log(
      'Question title entered: Would you recommend this course to another student?'
    );

    /*
     * ========================================================
     * ASSOCIATED SURVEY
     * ========================================================
     *
     * Use the manually created survey confirmed by Codegen.
     *
     * Survey ID = 2719
     */

    const surveySelect = page.getByLabel(
      'Associated Survey'
    );

    await expect(surveySelect).toBeVisible({
      timeout: 30000,
    });

    await expect(surveySelect).toBeEnabled({
      timeout: 30000,
    });

    console.log(
      'Selecting manually created survey ID: 2719'
    );

    await surveySelect.selectOption('2719');

    await expect(surveySelect).toHaveValue(
      '2719'
    );

    console.log(
      'Survey 2719 selected successfully.'
    );

    /*
     * ========================================================
     * QUESTION TYPE
     * ========================================================
     */

    const questionType = page.getByLabel(
      'Question Type'
    );

    await expect(questionType).toBeVisible({
      timeout: 30000,
    });

    await expect(questionType).toBeEnabled({
      timeout: 30000,
    });

    await questionType.selectOption(
      'true_false'
    );

    await expect(questionType).toHaveValue(
      'true_false'
    );

    console.log(
      'Question type selected: True/False'
    );

    /*
     * ========================================================
     * ANSWER OPTIONS
     * ========================================================
     */

    const answerOptions = page.getByRole(
      'textbox',
      {
        name: 'Answer Options',
      }
    );

    await expect(answerOptions).toBeVisible({
      timeout: 30000,
    });

    await answerOptions.fill(
      'True / False'
    );

    await expect(answerOptions).toHaveValue(
      'True / False'
    );

    console.log(
      'Answer options entered: True / False'
    );

    /*
     * ========================================================
     * PUBLISH QUESTION
     * ========================================================
     */

    const publishButton = page.getByRole(
      'button',
      {
        name: 'Publish',
        exact: true,
      }
    );

    await expect(publishButton).toBeVisible({
      timeout: 30000,
    });

    await expect(publishButton).toBeEnabled();

    await publishButton.click();

    await page.waitForTimeout(3000);

    console.log(
      'True/False question published successfully.'
    );

    /*
     * ========================================================
     * VERIFY QUESTION
     * ========================================================
     */

    await page.goto(
      '/wp-admin/edit.php?post_type=question',
      {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      }
    );

    const questionRow = page
      .getByRole('row')
      .filter({
        hasText:
          'Would you recommend this course to another student?',
      })
      .first();

    await expect(questionRow).toBeVisible({
      timeout: 30000,
    });

    /*
     * ========================================================
     * TEST 3 RESULT
     * ========================================================
     */

    console.log(
      '=========================================='
    );

    console.log(
      'TEST 3 PASSED'
    );

    console.log(
      'True/False question created successfully.'
    );

    console.log(
      'Question: Would you recommend this course to another student?'
    );

    console.log(
      'Question Type: true_false'
    );

    console.log(
      'Associated Survey ID: 2719'
    );

    console.log(
      '=========================================='
    );
  }
);
// ============================================================
// TEST 4
// ADD TEXT QUESTION
// ============================================================

test(
  'Add Text question successfully',
  async ({ page }) => {

    console.log(
      '========== TEST 4: ADD TEXT QUESTION =========='
    );

    await loginAsInstructor(page);

    /*
     * ========================================================
     * OPEN ADD NEW QUESTION
     * ========================================================
     */

    await page.goto(
      '/wp-admin/post-new.php?post_type=question',
      {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      }
    );

    console.log(
      'Opening Add New Question...'
    );

    /*
     * ========================================================
     * QUESTION TITLE
     * ========================================================
     */

    const titleInput = page.getByRole('textbox', {
      name: 'Add title',
    });

    await expect(titleInput).toBeVisible({
      timeout: 30000,
    });

    await titleInput.fill(
      'What did you like most about this course?'
    );

    console.log(
      'Question title entered: What did you like most about this course?'
    );

    /*
     * ========================================================
     * ASSOCIATED SURVEY
     * ========================================================
     *
     * Use the survey manually created and confirmed
     * through Playwright Codegen.
     *
     * Survey:
     * Josue Manage Survey
     *
     * ID:
     * 2719
     */

    const surveySelect = page.getByLabel(
      'Associated Survey'
    );

    await expect(surveySelect).toBeVisible({
      timeout: 30000,
    });

    await expect(surveySelect).toBeEnabled({
      timeout: 30000,
    });

    console.log(
      'Selecting manually created survey ID: 2719'
    );

    await surveySelect.selectOption('2719');

    await expect(surveySelect).toHaveValue(
      '2719'
    );

    console.log(
      'Survey 2719 selected successfully.'
    );

    /*
     * ========================================================
     * QUESTION TYPE
     * ========================================================
     *
     * For this scenario, the application uses Text for
     * Short Answer / Essay according to our manual testing.
     */

    const questionType = page.getByLabel(
      'Question Type'
    );

    await expect(questionType).toBeVisible({
      timeout: 30000,
    });

    await expect(questionType).toBeEnabled({
      timeout: 30000,
    });

    await questionType.selectOption(
      'text'
    );

    await expect(questionType).toHaveValue(
      'text'
    );

    console.log(
      'Question type selected: Text'
    );

    /*
     * ========================================================
     * PUBLISH QUESTION
     * ========================================================
     *
     * Text questions do not require Answer Options.
     */

    const publishButton = page.getByRole(
      'button',
      {
        name: 'Publish',
        exact: true,
      }
    );

    await expect(publishButton).toBeVisible({
      timeout: 30000,
    });

    await expect(publishButton).toBeEnabled();

    await publishButton.click();

    await page.waitForTimeout(3000);

    console.log(
      'Text question published successfully.'
    );

    /*
     * ========================================================
     * VERIFY QUESTION
     * ========================================================
     */

    await page.goto(
      '/wp-admin/edit.php?post_type=question',
      {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      }
    );

    const questionRow = page
      .getByRole('row')
      .filter({
        hasText:
          'What did you like most about this course?',
      })
      .first();

    await expect(questionRow).toBeVisible({
      timeout: 30000,
    });

    /*
     * ========================================================
     * TEST 4 RESULT
     * ========================================================
     */

    console.log(
      '=========================================='
    );

    console.log(
      'TEST 4 PASSED'
    );

    console.log(
      'Text question created successfully.'
    );

    console.log(
      'Question: What did you like most about this course?'
    );

    console.log(
      'Question Type: text'
    );

    console.log(
      'Associated Survey ID: 2719'
    );

    console.log(
      '=========================================='
    );
  }
);
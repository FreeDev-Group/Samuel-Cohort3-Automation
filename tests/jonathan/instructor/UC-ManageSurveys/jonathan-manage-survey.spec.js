import { test, expect } from '@playwright/test';
import { loginAsInstructor } from '../../../../helpers/auth.js';

const ADMIN_URL = '/wp-admin/';
const SURVEYS_URL = '/wp-admin/edit.php?post_type=survey';
const TRASH_URL = '/wp-admin/edit.php?post_type=survey&post_status=trash';

let surveyTitle;
let editedSurveyTitle;

function dateInputValue(daysFromToday = 0) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + daysFromToday);

  return date.toISOString().slice(0, 10);
}

async function fillSurveyDescription(page, description) {
  const editorFrame = page.locator('.wp-editor-wrap iframe').first();

  await expect(editorFrame).toBeVisible({
    timeout: 15000,
  });

  const frame = editorFrame.contentFrame();

  const editorBody = frame.locator('body#tinymce');

  await expect(editorBody).toBeVisible({
    timeout: 15000,
  });

  await editorBody.fill(description);
}

async function publishPost(page) {
  const publishButton = page.locator('#publish');

  await expect(publishButton).toBeVisible({ timeout: 15000 });
  await publishButton.click({ force: true });

  await page.waitForLoadState('domcontentloaded');

  await expect
    .poll(() => page.url(), { timeout: 15000 })
    .toMatch(/post\.php/);
}
async function saveDraft(page) {
  const saveDraftButton = page.locator('#save-post');

  await expect(saveDraftButton).toBeVisible({
    timeout: 15000,
  });

  await saveDraftButton.click({
    force: true,
  });

  await page.waitForLoadState('domcontentloaded');

  // WordPress saves the draft and returns to the edit screen.
  // We verify the saved state through the resulting URL and then
  // verify the survey exists in the list in the test itself.
  await expect
    .poll(() => page.url(), { timeout: 15000 })
    .toMatch(/post\.php/);
}
async function searchSurvey(page, title) {
  const searchUrl =
    `${SURVEYS_URL}&s=${encodeURIComponent(title)}`;

  await page.goto(searchUrl, {
    waitUntil: 'domcontentloaded',
  });

  return page
    .locator('table.wp-list-table tbody tr')
    .filter({ hasText: title })
    .first();
}

async function openSurveyEdit(page, title) {
  const row = await searchSurvey(page, title);

  await expect(row).toBeVisible({ timeout: 15000 });

  const editLink = row.locator('a.row-title').first();

  await expect(editLink).toBeVisible();

  const editUrl = await editLink.getAttribute('href');

  if (!editUrl) {
    throw new Error(`Could not get edit URL for survey "${title}".`);
  }

    await page.goto(editUrl, {
    waitUntil: 'domcontentloaded',
  });

  await expect(page.locator('#title')).toHaveValue(title, {
    timeout: 15000,
  });
}
async function selectAssociatedSurvey(page, title) {
  const surveySelect = page.locator('#question_parent_survey');

  await expect(surveySelect).toBeVisible({ timeout: 15000 });

  const matchingOption = surveySelect
    .locator('option')
    .filter({ hasText: title })
    .first();

  await expect(matchingOption).toHaveCount(1, {
    timeout: 15000,
  });

  const optionValue = await matchingOption.getAttribute('value');

  if (!optionValue) {
    throw new Error(`Could not get survey option value for "${title}".`);
  }

  await surveySelect.selectOption(optionValue);
}

async function selectQuestionType(page, type) {
  const typeSelect = page
    .locator('select')
    .filter({ hasText: type })
    .first();

  await expect(typeSelect).toBeVisible({ timeout: 15000 });
  await typeSelect.selectOption({ label: type });
}

async function createQuestion(page, type, questionTitle, answerOptions = []) {
  await page.goto('/wp-admin/post-new.php?post_type=question', {
    waitUntil: 'domcontentloaded',
  });

  await expect(page.locator('#title')).toBeVisible({
    timeout: 15000,
  });

  await page.locator('#title').fill(questionTitle);

  await selectAssociatedSurvey(page, surveyTitle);

  await selectQuestionType(page, type);

  if (answerOptions.length > 0) {
    const answerField = page.locator(
      'textarea[name*="answer"], ' +
      'textarea[id*="answer"], ' +
      'textarea[name*="option"], ' +
      'textarea[id*="option"]'
    ).first();

    await expect(answerField).toBeVisible({
      timeout: 15000,
    });

    await answerField.fill(answerOptions.join('\n'));
  }

  await publishPost(page);

  await expect(page.locator('#title')).toHaveValue(questionTitle, {
    timeout: 15000,
  });
}

test.describe.serial('Instructor manage survey', () => {
  test('1. Create survey with valid inputs', async ({ page }) => {
    surveyTitle = `Jonathan Manage Survey ${Date.now()}`;

    await loginAsInstructor(page);

    await page.goto(ADMIN_URL, {
      waitUntil: 'domcontentloaded',
    });

    await page.goto('/wp-admin/post-new.php?post_type=survey', {
      waitUntil: 'domcontentloaded',
    });

    await expect(page.locator('#title')).toBeVisible({
      timeout: 15000,
    });

    await page.locator('#title').fill(surveyTitle);

    await fillSurveyDescription(
      page,
      'This survey was created automatically by the Playwright Manage Surveys test.'
    );

    
    await page.locator('#survey_start_date').fill(dateInputValue(0));
    await page.locator('#survey_end_date').fill(dateInputValue(7));

    await saveDraft(page);

    const draftRow = await searchSurvey(page, surveyTitle);

    await expect(draftRow).toBeVisible({
      timeout: 15000,
    });


    await openSurveyEdit(page, surveyTitle);

    await publishPost(page);

    await expect(page.locator('#message')).toContainText(
      /Post published/i,
      { timeout: 15000 }
    );

   
    const publishedRow = await searchSurvey(page, surveyTitle);

    await expect(publishedRow).toBeVisible({
      timeout: 15000,
    });
  });

  test('2. Add Multiple Choice question to created survey', async ({ page }) => {
    const questionTitle = `${surveyTitle} - Multiple Choice`;

    await loginAsInstructor(page);

    await createQuestion(
      page,
      'Multiple Choice',
      questionTitle,
      ['Option A', 'Option B', 'Option C']
    );
  });

  test('3. Add True/False question to created survey', async ({ page }) => {
    const questionTitle = `${surveyTitle} - True False`;

    await loginAsInstructor(page);

    await createQuestion(
      page,
      'True/False',
      questionTitle
    );
  });

  test('4. Add Text question to created survey', async ({ page }) => {
    const questionTitle = `${surveyTitle} - Text`;

    await loginAsInstructor(page);

    await createQuestion(
      page,
      'Text',
      questionTitle
    );
  });

  test('5. Edit existing survey title and dates', async ({ page }) => {
    editedSurveyTitle = `${surveyTitle} - Edited`;

    await loginAsInstructor(page);

    await openSurveyEdit(page, surveyTitle);

    await page.locator('#title').fill(editedSurveyTitle);

    await page.locator('#survey_start_date').fill(dateInputValue(1));
    await page.locator('#survey_end_date').fill(dateInputValue(14));

    await publishPost(page);

    await expect(page.locator('#message')).toContainText(
      /updated/i,
      { timeout: 15000 }
    );

    const updatedRow = await searchSurvey(page, editedSurveyTitle);

    await expect(updatedRow).toBeVisible({
      timeout: 15000,
    });

       surveyTitle = editedSurveyTitle;
  });

  test('6. Delete survey and confirm removal', async ({ page }) => {
    await loginAsInstructor(page);

    const row = await searchSurvey(page, surveyTitle);

    await expect(row).toBeVisible({
      timeout: 15000,
    });

    await row.hover();

    const trashLink = row
      .locator('a.submitdelete')
      .filter({ hasText: /Trash/i })
      .first();

    if (await trashLink.count()) {
      await trashLink.click();
    } else {
      await row.getByRole('link', { name: /^Trash$/i }).click();
    }

    await page.waitForLoadState('domcontentloaded');

       await page.goto(TRASH_URL, {
      waitUntil: 'domcontentloaded',
    });

    const trashedRow = page
      .locator('table.wp-list-table tbody tr')
      .filter({ hasText: surveyTitle })
      .first();

    await expect(trashedRow).toBeVisible({
      timeout: 15000,
    });

   const deletePermanently = trashedRow
  .locator('a.submitdelete')
  .first();

await expect(deletePermanently).toHaveCount(1, {
  timeout: 15000,
});

const deleteUrl = await deletePermanently.getAttribute('href');

if (!deleteUrl) {
  throw new Error(`Could not get permanent delete URL for "${surveyTitle}".`);
}

// Navigate directly to the WordPress permanent-delete action.
await page.goto(deleteUrl, {
  waitUntil: 'domcontentloaded',
});

    const remainingRow = await searchSurvey(page, surveyTitle);

    await expect(remainingRow).toHaveCount(0, {
      timeout: 15000,
    });
  });
});
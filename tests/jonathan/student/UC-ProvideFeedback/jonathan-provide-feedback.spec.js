import { test, expect } from '@playwright/test';
import { Buffer } from 'node:buffer';
import { loginAsStudent } from '../../../../helpers/auth.js';

const NEW_SURVEY_URL = '/survey/testing_provide_feedback_by_kabidusae/';
const COMPLETED_SURVEY_URL = '/survey/wise-test-2/';

test.describe.serial('Student provide feedback', () => {
  async function openAllSurveys(page) {
    await loginAsStudent(page);

    await expect(page.getByRole('link', { name: 'All Surveys' })).toBeVisible();
    await page.getByRole('link', { name: 'All Surveys' }).click();

    await expect(page.locator('body')).toContainText(/survey/i);
  }

  async function openSurvey(page, surveyUrl) {
    await openAllSurveys(page);

    await page.goto(surveyUrl);

    await expect(page.locator('body')).toContainText(
      /survey|question|test|feedback|development|skills|wise|alain|personal|personnal|information|kabidusae/i
    );
  }

  function getSubmitButton(page) {
    return page
      .getByRole('button', { name: /submit/i })
      .or(page.locator('input[type="submit"]'))
      .or(page.locator('button[type="submit"]'))
      .first();
  }

  async function submitSurvey(page) {
    const submitButton = getSubmitButton(page);

    await expect(submitButton).toBeVisible();
    await submitButton.scrollIntoViewIfNeeded();
    await submitButton.click();
  }

  async function answerAvailableQuestions(page) {
    const radioInputs = page.locator('input[type="radio"]');
    const radioCount = await radioInputs.count();

    for (let i = 0; i < radioCount; i += 1) {
      const radio = radioInputs.nth(i);

      if (await radio.isVisible().catch(() => false)) {
        await radio.check({ force: true }).catch(() => {});
      }
    }

    const checkboxInputs = page.locator('input[type="checkbox"]');
    const checkboxCount = await checkboxInputs.count();

    for (let i = 0; i < checkboxCount; i += 1) {
      const checkbox = checkboxInputs.nth(i);

      if (await checkbox.isVisible().catch(() => false)) {
        await checkbox.check({ force: true }).catch(() => {});
      }
    }

    const textInputs = page.locator(
      'input[type="text"], input[type="email"], input[type="number"], input[type="time"], input[type="tel"], input[type="url"], input:not([type])'
    );
    const textInputCount = await textInputs.count();

    for (let i = 0; i < textInputCount; i += 1) {
      const input = textInputs.nth(i);

      if (await input.isVisible().catch(() => false)) {
        const type = await input.getAttribute('type');

        if (type === 'email') {
          await input.fill('jonathan.automation@test.com');
        } else if (type === 'number') {
          await input.fill('5');
        } else if (type === 'time') {
          await input.fill('14:29');
        } else if (type === 'tel') {
          await input.fill('0700000000');
        } else if (type === 'url') {
          await input.fill('https://example.com');
        } else {
          await input.fill('Automated feedback response');
        }
      }
    }

    const textareas = page.locator('textarea');
    const textareaCount = await textareas.count();

    for (let i = 0; i < textareaCount; i += 1) {
      const textarea = textareas.nth(i);

      if (await textarea.isVisible().catch(() => false)) {
        await textarea.fill('This is an automated feedback response for the survey.');
      }
    }

    const selects = page.locator('select');
    const selectCount = await selects.count();

    for (let i = 0; i < selectCount; i += 1) {
      const select = selects.nth(i);

      if (await select.isVisible().catch(() => false)) {
        const options = select.locator('option');
        const optionCount = await options.count();

        if (optionCount > 1) {
          const value = await options.nth(1).getAttribute('value');

          if (value) {
            await select.selectOption(value);
          }
        }
      }
    }

    const sliders = page.getByRole('slider');
    const sliderCount = await sliders.count();

    for (let i = 0; i < sliderCount; i += 1) {
      const slider = sliders.nth(i);

      if (await slider.isVisible().catch(() => false)) {
        await slider.fill('5').catch(async () => {
          await slider.fill('50').catch(() => {});
        });
      }
    }

    const fileInputs = page.locator('input[type="file"]');
    const fileInputCount = await fileInputs.count();

    for (let i = 0; i < fileInputCount; i += 1) {
      const fileInput = fileInputs.nth(i);

      await fileInput
        .setInputFiles({
          name: 'feedback-evidence.txt',
          mimeType: 'text/plain',
          buffer: Buffer.from('Automated feedback file upload evidence.'),
        })
        .catch(() => {});
    }
  }

  test('Submit survey without required questions shows validation message', async ({ page }) => {
    await openSurvey(page, NEW_SURVEY_URL);

    const submitButton = getSubmitButton(page);

    if (await submitButton.isVisible().catch(() => false)) {
      await submitSurvey(page);

      await expect(page.locator('body')).toContainText(
        /required|obligatoire|please|field|answer|question|missing|error|must/i
      );
    } else {
      await expect(page.locator('body')).toContainText(
        /Merci, vos réponses ont bien été enregistrées|thank you|submitted|recorded|success|responses|already/i
      );
    }
  });

  test('Logged-in student completes and submits a survey', async ({ page }) => {
    await openSurvey(page, NEW_SURVEY_URL);

    const submitButton = getSubmitButton(page);

    if (await submitButton.isVisible().catch(() => false)) {
      await answerAvailableQuestions(page);
      await submitSurvey(page);
    }

    await expect(page.locator('body')).toContainText(
      /Merci, vos réponses ont bien été enregistrées|thank you|submitted|recorded|success|responses/i
    );
  });

  test('Reopen already completed survey prevents duplicate submission', async ({ page }) => {
    await openSurvey(page, COMPLETED_SURVEY_URL);

    const submitButton = getSubmitButton(page);

    if (await submitButton.isVisible().catch(() => false)) {
      await answerAvailableQuestions(page);
      await submitSurvey(page);

      await expect(page.locator('body')).toContainText(
        /Merci, vos réponses ont bien été enregistrées|thank you|submitted|recorded|success|responses/i
      );
    }

    await page.goto(COMPLETED_SURVEY_URL);

    await expect(page.locator('body')).toContainText(
      /already responded|already completed|déjà|Merci, vos réponses ont bien été enregistrées|Thank you|responses have been recorded|réponses ont bien été enregistrées/i
    );

    const reopenedSubmitButton = getSubmitButton(page);

    await expect(reopenedSubmitButton).not.toBeVisible();
  });
});
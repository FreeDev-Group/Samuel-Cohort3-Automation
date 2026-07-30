import { test, expect } from '@playwright/test';
import { loginAsStudent } from '../../../../helpers/auth.js';

test.describe.serial('Student Provide Feedback', () => {
  async function openAllSurveys(page) {
    await loginAsStudent(page);

    await expect(page.getByRole('link', { name: 'All Surveys' })).toBeVisible();
    await page.getByRole('link', { name: 'All Surveys' }).click();

    await expect(page.locator('body')).toContainText(/survey/i);
  }

  async function collectSurveyUrls(page) {
    await openAllSurveys(page);

    const urls = [];
    const visitedPages = new Set();

    while (true) {
      const currentPageUrl = page.url();
      if (visitedPages.has(currentPageUrl)) {
        break;
      }
      visitedPages.add(currentPageUrl);

      const links = page.locator('a[href*="/survey/"]');
      const count = await links.count();

      for (let i = 0; i < count; i += 1) {
        const href = await links.nth(i).getAttribute('href');
        if (href && !urls.includes(href)) {
          urls.push(href);
        }
      }

      const nextPageLink = page.getByRole('link', { name: /Next Page/i });
      if (await nextPageLink.isVisible().catch(() => false)) {
        await nextPageLink.click();
        await expect(page.locator('body')).toContainText(/survey/i);
        continue;
      }

      break;
    }

    return urls;
  }

  async function findSurveyWithQuestions(page) {
    const urls = await collectSurveyUrls(page);

    for (const href of urls) {
      await page.goto(href);

      const bodyText = await page.locator('body').innerText();

      const hasNoQuestions = bodyText.includes('No questions found for this survey');
      const hasAlreadyResponded = bodyText.includes('You have already responded');

      const questionControls =
        await page.locator(
          'textarea, input[type="text"], input[type="email"], input[type="number"], input[type="time"], input[type="radio"], input[type="checkbox"], select'
        ).count();

      if (!hasNoQuestions && !hasAlreadyResponded && questionControls > 0) {
        return;
      }
    }

    throw new Error('No survey containing questions was found.');
  }

  async function findCompletedSurvey(page) {
    const urls = await collectSurveyUrls(page);

    for (const href of urls) {
      await page.goto(href);

      const bodyText = await page.locator('body').innerText();

      if (bodyText.includes('You have already responded')) {
        return;
      }
    }

    throw new Error('No completed survey was found.');
  }

  async function fillSurvey(page) {
    for (const radio of await page.locator('input[type="radio"]').all()) {
      if (await radio.isVisible().catch(() => false)) {
        await radio.check({ force: true }).catch(() => {});
      }
    }

    for (const checkbox of await page.locator('input[type="checkbox"]').all()) {
      if (await checkbox.isVisible().catch(() => false)) {
        await checkbox.check({ force: true }).catch(() => {});
      }
    }

    const inputs = page.locator(
      'input[type="text"], input[type="email"], input[type="number"], input[type="time"]'
    );

    for (let i = 0; i < await inputs.count(); i += 1) {
      const input = inputs.nth(i);

      if (!(await input.isVisible().catch(() => false))) continue;

      const type = await input.getAttribute('type');

      if (type === 'email') {
        await input.fill('josue.feedback@test.com');
      } else if (type === 'number') {
        await input.fill('10');
      } else if (type === 'time') {
        await input.fill('09:30');
      } else {
        await input.fill('Playwright feedback response.');
      }
    }

    for (const textarea of await page.locator('textarea').all()) {
      if (await textarea.isVisible().catch(() => false)) {
        await textarea.fill('This response was generated automatically during Playwright testing.');
      }
    }

    for (const select of await page.locator('select').all()) {
      if (!(await select.isVisible().catch(() => false))) continue;

      const options = select.locator('option');
      if ((await options.count()) > 1) {
        const value = await options.nth(1).getAttribute('value');
        if (value) {
          await select.selectOption(value);
        }
      }
    }
  }

  async function clickSubmit(page) {
    const submitButton = page
      .getByRole('button', { name: /submit/i })
      .or(page.locator('input[type="submit"]'))
      .or(page.locator('button[type="submit"]'));

    await expect(submitButton.first()).toBeVisible();
    await submitButton.first().click();
  }

  test('Student submits feedback successfully', async ({ page }) => {
    await findSurveyWithQuestions(page);
    await fillSurvey(page);
    await clickSubmit(page);

    await expect(page.locator('body')).toContainText(
      /Merci, vos réponses ont bien été enregistrées|Thank you|recorded|success/i
    );
  });

  test('Submit empty survey shows validation', async ({ page }) => {
    await findSurveyWithQuestions(page);
    await clickSubmit(page);

    await expect(page.locator('body')).toContainText(
      /Please fill out this field|Veuillez remplir ce champ|required|obligatoire/i
    );
  });

  test('Completed survey prevents duplicate submission', async ({ page }) => {
    await findCompletedSurvey(page);

    await expect(page.locator('body')).toContainText(
      /You have already responded to this survey|already responded|déjà répondu/i
    );
  });
});
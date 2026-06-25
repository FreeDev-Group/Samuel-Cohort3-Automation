# Student Survey App - Automated E2E Tests (Playwright)

This repository contains the automated end-to-end (E2E) testing suite for the Student Survey Application.  
We use **Playwright** to ensure that our core use cases remain stable and functional across development cycles.  
This is the automation phase following our manual testing effort in the FreeDev mentorship program.

## 🚀 Getting Started

Follow these instructions to run the test suite on your local machine.

### 1. Prerequisites

Ensure you have the following installed:

* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [npm](https://www.npmjs.com/)

### 2. Installation

Clone this repository and install the necessary dependencies:

```bash
git clone https://github.com/FreeDev-Group/Samuel-Cohort3-Automation.git
cd Samuel-Cohort3-Automation
npm install
```

Then install the Playwright browsers: JS(NOT WITH TS)

```bash
npx playwright install
```

### 3. Set up your credentials (`.env`)

Some tests need to log in as an existing student.  
>[!NOTE]
> Credentials are **never** hardcoded, they are read from a local `.env` file that stays on your machine.

Create a `.env` file in the project root with **your own** student account:

```
STUDENT_USER=your_own_username
STUDENT_PASSWORD=your_own_password
```

Then install dotenv (once):

```bash
npm install -D dotenv
```

>[!CAUTION]
> 🔒 Never commit your `.env` file, it is already listed in `.gitignore`.
> In CI, a dedicated shared account is used via GitHub Secrets instead.

### 4. Running Tests

You can run the tests in several ways:

* **UI Mode (Recommended for development):** Opens the Playwright Test Runner where you can watch tests run, step through them, and debug visually.
  ```bash
  npx playwright test --ui
  ```

* **Headless Mode:** Runs all tests in the terminal.
  ```bash
  npx playwright test
  ```

* **Chromium only** (matches what CI runs):
  ```bash
  npx playwright test --project=chromium
  ```

* **View the report** after a headless run:
  ```bash
  npx playwright show-report
  ```

## 📂 Project Structure

Tests are organized first by **user role**, then by their respective **Use Cases** defined in the main project documentation. Each mentee writes their spec file inside the relevant use case folder.  
Shared logic lives in `helpers/` and `fixtures/`.

```
/Samuel-Cohort3-Automation
├── .github/
│   └── workflows/
│       └── playwright.yml          # CI: runs Chromium tests on PRs touching tests/
├── tests/
│   ├── student/                    # Tests for the Student role
│   │   ├── UC-Login/               # Student authentication
│   │   ├── UC-CreateAccount/       # Student registration workflow
│   │   ├── UC-ProvideFeedback/     # Taking and submitting surveys
│   │   └── UC-ReviewFeedback/      # Reviewing past submissions
│   └── instructor/                 # Tests for the Instructor role
│       ├── UC-Login/               # Instructor authentication
│       ├── UC-CreateAccount/       # Instructor registration workflow
│       └── UC-ManageSurveys/       # Survey management (Create/Edit/Delete)
├── helpers/                        # Reusable steps shared across specs
│   ├── cookies.js                  # Dismisses the cookie banner
│   └── auth.js                     # Logs in as a student
├── fixtures/                       # Test data (reads the test account from env)
│   └── test-users.js
├── playwright.config.js            # Playwright configuration (baseURL, projects)
├── package.json                    # Dependencies and test scripts
├── CONTRIBUTING.md                 # Contributing Guide :: Branch & Pull Request Workflow
└── README.md                       # Project instructions
```

| Folder | Use Case |
| --- | --- |
| `student/UC-Login` | Verifies Student authentication and dashboard access. |
| `student/UC-CreateAccount` | Validates the Student registration workflow. |
| `student/UC-ProvideFeedback` | Tests the survey-taking and submission process. |
| `student/UC-ReviewFeedback` | Validates retrieval of historical survey data. |
| `instructor/UC-Login` | Verifies Instructor authentication. |
| `instructor/UC-CreateAccount` | Validates the Instructor registration workflow. |
| `instructor/UC-ManageSurveys` | Tests Instructor capabilities (Create/Edit/Delete). |

## 🧩 Helpers & Fixtures
>[!TIP]
> To avoid duplicating code, reusable steps are centralized:
> 
> * **`helpers/cookies.js`** : : `dismissCookieBanner(page)` handles the cookie consent banner.
> * **`helpers/auth.js`** : : `loginAsStudent(page)` logs in using credentials from the environment.
> * **`fixtures/test-users.js`** : : exposes the test account, reading `STUDENT_USER` / `STUDENT_PASSWORD`.

Example usage in a spec:

```javascript
import { test, expect } from '@playwright/test';
import { loginAsStudent } from '../../../helpers/auth.js';

test('student can open a survey', async ({ page }) => {
  await loginAsStudent(page);
  await page.getByRole('link', { name: 'All Surveys' }).click();
  // ...assertions
});
```

>[!IMPORTANT]
> ⭐ **Rule:** never hardcode credentials in a test.  
> They always come from theenvironment, so the same test runs locally (your `.env`) and in CI (Secrets).

## ⚙️ Configuration

The test environment is configured in `playwright.config.js`.  
The `baseURL` is set so tests can use `page.goto('/')`, and three browser projects are defined (chromium, firefox, webkit).

**URL:** [https://student.michaelkentburns.com/](https://student.michaelkentburns.com/)

## 🔁 Contributing Workflow

>[!WARNING]
> We **never push directly to `main`**. 
Every use case is done on its own branch and merged through a reviewed Pull Request.

1. Create a branch: `yourname/uc-<use-case>` (e.g. `jonathan/uc-login`)
2. Write your test and run it locally until it passes
3. Push the branch and open a Pull Request to `main`
4. CI runs the Chromium suite automatically, a PR can only merge once it's green
5. The mentor reviews and merges

See `CONTRIBUTING.md` for the full step-by-step guide.

## ✍️ Conventions

- Spec files: `mentee-usecase.spec.js` (lowercase, hyphen-separated)
- Branch names: `yourname/uc-<use-case>`
- Commit messages reference the issue number
  > Example: `test: automate student login use case #5`

## 👥 Contributors

* **Mentor:** Samuel
* **Mentees:** Jonathan, Josué

*Built for the FreeDev Group - A-Team.*

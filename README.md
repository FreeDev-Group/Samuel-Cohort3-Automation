# Student Survey App - Automated E2E Tests (Playwright)

This repository contains the automated end-to-end (E2E) testing suite for the
Student Survey Application. We use **Playwright** to ensure that our core use
cases remain stable and functional across development cycles. This is the
automation phase following our manual testing effort in the FreeDev mentorship program.

## 🚀 Getting Started

Follow these instructions to run the test suite on your local machine.

### 1. Prerequisites

Ensure you have the following installed:

* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [npm](https://www.npmjs.com/)

### 2. Installation

Clone this repository and install the necessary dependencies:

```bash
git clone https://github.com/FreeDev-Group/<repo-name>.git
cd <repo-name>
npm install
```

Then install the Playwright browsers:

```bash
npx playwright install
```

### 3. Running Tests

You can run the tests in two ways:

* **UI Mode (Recommended for development):** Opens the Playwright Test Runner
  where you can watch tests run, step through them, and debug visually.
```bash
  npx playwright test --ui
```

* **Headless Mode (Recommended for CI/CD):** Runs all tests in the terminal.
```bash
  npx playwright test
```

* **View the report** after a headless run:
```bash
  npx playwright show-report
```

## 📂 Project Structure

Tests are organized first by **user role**, then by their respective **Use Cases**
defined in the main project documentation. Each mentee writes their spec file
inside the relevant use case folder.

```
/Samuel-Cohort3-Automation
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
├── fixtures/                       # Mock data (test users, survey JSON)
├── playwright.config.js            # Playwright configuration (base URL set here)
├── package.json                    # Dependencies and test scripts
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

## ⚙️ Configuration

The test environment is configured in `playwright.config.js`. By default, the
tests are pointed at the official staging instance:

**URL:** [https://student.michaelkentburns.com/](https://student.michaelkentburns.com/)

## ✍️ Conventions

- Spec files: `mentee-usecase.spec.js` (lowercase, hyphen-separated)
- Commit messages reference the issue number
  > Example: `test: automate student login use case #5`

## 👥 Contributors

* **Mentor:** Samuel
* **Mentees:** Jonathan, Josué

*Built for the FreeDev Group - A-Team.*
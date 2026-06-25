# Contributing Guide — Branch & Pull Request Workflow

Welcome! This guide explains how we contribute automated tests to this
repository. 
We **never push directly to `main`**. Instead, every piece of work goes through its own branch and a Pull Request (PR) that the mentor reviews.

This is the same workflow used in professional software teams. Take your time with it — once you've done it two or three times, it becomes second nature.

---

## 🧭 The Big Picture

```
main  ◄──── Pull Request (mentor reviews) ◄──── your-branch
```

1. You create a **branch** for the use case you're automating.
2. You write your test on that branch.
3. You push the branch and open a **Pull Request** to `main`.
4. The mentor **reviews** it and merges it.

---

## 📝 Step-by-Step

### 1. Make sure your `main` is up to date

Before starting anything new, sync your local `main` with GitHub:

```bash
git checkout main
git pull origin main
```

### 2. Create your branch

Use this naming convention: `<your-name>/uc-<use-case>`

```bash
git checkout -b jonathan/uc-login
```

> Examples:
> - `jonathan/uc-login`
> - `josue/uc-create-account`

### 3. Write your test

Create your spec file in the correct folder, for example:

```
tests/student/UC-Login/jonathan-login.spec.js
```

Run it locally until it passes:

```bash
npx playwright test
```

### 4. Commit your work

Stage your changes and write a clear commit message that references the issue:

```bash
git add .
git commit -m "test: automate student login #1"
```

### 5. Push your branch

```bash
git push origin jonathan/uc-login
```

### 6. Open a Pull Request

1. Go to the repository on GitHub.
2. You'll see a banner: **"Compare & pull request"** — click it.
3. Set the base branch to `main` and the compare branch to your branch.
4. Give the PR a clear title (e.g. `Automate Student Login #1`).
5. In the description, link the issue by writing `Closes #1`.
6. Click **Create pull request**.

### 7. Wait for review

The mentor will review your PR. They may:
- ✅ Approve and merge it, or
- 💬 Request changes — in which case you make the fixes **on the same branch**,
  commit, and push again. The PR updates automatically.

### 8. After your PR is merged

Switch back to `main`, pull the latest, and you're ready for your next task:

```bash
git checkout main
git pull origin main
```

---

## ✅ Quick Rules

- **Never** commit directly to `main`.
- **One branch per use case** — don't mix multiple use cases in one branch.
- **One config to rule them all** — do not commit your own
  `playwright.config.ts` or personal config files. The shared
  `playwright.config.js` is the single source of truth.
- Always run `npx playwright test` locally **before** opening a PR.
- Reference the issue number in your commit message and PR description.

---

## 🆘 Common Situations

**"I started on `main` by mistake."**
Move your changes to a new branch:
```bash
git checkout -b jonathan/uc-login
```
Your uncommitted changes follow you to the new branch.

**"My branch is behind `main`."**
Update it:
```bash
git checkout main
git pull origin main
git checkout your-branch
git merge main
```

**"CI fails on my PR."**
Read the GitHub Actions log, fix the issue locally, commit, and push again.
The PR re-runs automatically.

---

Happy testing! Ask your mentor in the PR comments if anything is unclear. 🚀

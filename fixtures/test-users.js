// Shared test account used by tests that need an already-registered user
// (Login, Provide Feedback, Review Past Feedback, Manage Survey, etc.).
//
// The password is NEVER hardcoded. It comes from:
//   - a local .env file when running on your machine
//   - GitHub Secrets when running in CI
export const studentUser = {
  username: process.env.STUDENT_USER,
  password: process.env.STUDENT_PASSWORD,
};

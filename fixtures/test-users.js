// Shared test accounts used by tests that need an already-registered user
// (Login, Provide Feedback, Review Past Feedback, Manage Survey, etc.).
//
// Passwords are NEVER hardcoded. They come from:
//   - a local .env file when running on your machine
//   - GitHub Secrets when running in CI
export const studentUser = {
  username: process.env.STUDENT_USER,
  password: process.env.STUDENT_PASSWORD,
};

export const instructorUser = {
  username: process.env.INSTRUCTOR_USER,
  password: process.env.INSTRUCTOR_PASSWORD,
};

// Shared test accounts used by automated tests.
//
// Passwords are never hardcoded.
// They come from:
// - .env locally
// - GitHub Secrets in CI

export const studentUser = {
  username: process.env.STUDENT_USER,
  password: process.env.STUDENT_PASSWORD,
};

export const instructorUser = {
  username: process.env.INSTRUCTOR_USER,
  password: process.env.INSTRUCTOR_PASSWORD,
};
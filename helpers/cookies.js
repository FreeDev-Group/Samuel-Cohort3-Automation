// Dismisses the cookie consent banner if it appears.
// Safe to call on every page load — it does nothing if the banner is absent.
export async function dismissCookieBanner(page) {
  const rejectButton = page.getByRole('button', { name: 'Reject All' });
  if (await rejectButton.isVisible().catch(() => false)) {
    await rejectButton.click();
  }
}

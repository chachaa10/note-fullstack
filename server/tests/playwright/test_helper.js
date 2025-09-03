export async function loginWith(page, username, password) {
  await page.getByRole('button', { name: 'login' }).click();

  await page.getByLabel('username').fill(username);
  await page.getByLabel('password').fill(password);

  await page.getByRole('button', { name: 'login' }).click();
}

export async function createNote(page, content) {
  await page.getByRole('button', { name: 'new note' }).click();
  await page.getByRole('textbox', { name: 'content' }).fill(content);
  await page.getByRole('button', { name: 'save' }).click();
  await page.getByText(content).waitFor();
}

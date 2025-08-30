import { expect, test } from '@playwright/test';

async function loggedInUser(page) {
  await page.getByRole('button', { name: 'log in' }).click();

  await page.getByLabel('username').fill('jhin');
  await page.getByLabel('password').fill('4444');

  await page.getByRole('button', { name: 'login' }).click();
}

test.describe('Note App', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset');
    await request.post('http://localhost:3001/api/users', {
      data: {
        username: 'jhin',
        password: '4444',
      },
    });

    await page.goto('http://localhost:5173');
  });

  test('front page can be opened', async ({ page }) => {
    const locator = page.getByText('Notes');
    await expect(locator).toBeVisible();
    await expect(
      page.getByText(
        'Note app, Department of Computer Science, University of Helsinki 2023'
      )
    ).toBeVisible();
  });

  test('user can log in', async ({ page }) => {
    await loggedInUser(page);

    await expect(page.getByText('jhin logged in')).toBeVisible();
  });

  test.describe('when user logged in', () => {
    test.beforeEach(async ({ page }) => {
      await loggedInUser(page);
    });

    test('a new note can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new note' }).click();
      await page
        .getByRole('textbox', { name: 'content' })
        .fill('a new note created by playwright');
      await page.getByRole('button', { name: 'save' }).click();

      await expect(
        page.getByText('a new note created by playwright')
      ).toBeVisible();
    });

    test.describe('and a note exists', () => {
      test.beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'new note' }).click();
        await page
          .getByRole('textbox', { name: 'content' })
          .fill('another note by playwright');
        await page.getByRole('button', { name: 'save' }).click();
      });

      test('importance can be changed', async ({ page }) => {
        await page.getByRole('button', { name: 'make not important' }).click();

        await expect(page.getByText('make important')).toBeVisible();
      });
    });
  });
});

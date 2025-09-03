import { expect, test } from '@playwright/test';
import { createNote, loginWith } from './test_helper';
const { beforeEach, describe } = test;

describe('Note App', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset');
    await request.post('/api/users', {
      data: {
        username: 'jhin',
        password: '4444',
      },
    });

    await page.goto('/');
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

  test('login fails if wrong password', async ({ page }) => {
    await loginWith(page, 'jhin', 'wrong');

    const errorDiv = page.locator('.error');
    await expect(errorDiv).toContainText('wrong credentials');
    await expect(errorDiv).toHaveCSS('border-style', 'solid');
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)');
    await expect(page.getByText('jhin logged in')).not.toBeVisible();
  });

  test('user can log in', async ({ page }) => {
    await loginWith(page, 'jhin', '4444');

    await expect(page.getByText('jhin logged in')).toBeVisible();
  });

  describe('when user logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'jhin', '4444');
    });

    test('a new note can be created', async ({ page }) => {
      await createNote(page, ' a new note created by playwright');

      await expect(
        page.getByText('a new note created by playwright')
      ).toBeVisible();
    });

    describe('and several notes exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'first note');
        await createNote(page, 'second note');
        await createNote(page, 'third note');
      });

      test('one of those notes can be made non-important', async ({ page }) => {
        await page.pause();
        const secondNote = page.getByText('second note').locator('..');

        await secondNote
          .getByRole('button', { name: 'make not important' })
          .click();

        await expect(secondNote.getByText('make important')).toBeVisible();
      });
    });
  });
});

const assert = require('node:assert');
const { test, after, beforeEach, describe } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const { NoteModel } = require('../models/note');
const { initialNotes, nonExistingId, notesInDb } = require('./test_helper');

const api = supertest(app);

describe('when there is initially some notes saved', () => {
  beforeEach(async () => {
    await NoteModel.deleteMany({});
    await NoteModel.insertMany(initialNotes);
  });

  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes');

    assert.strictEqual(response.body.length, initialNotes.length);
  });

  test('a specific note is within the returned notes', async () => {
    const notes = await notesInDb();
    const contents = notes.map((n) => n.content);
    assert(contents.includes('HTML is easy'));
  });

  describe('viewing a specific note', () => {
    test('succeeds with a valid id', async () => {
      const notesAtStart = await notesInDb();
      const noteToView = notesAtStart[0];

      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.deepStrictEqual(resultNote.body, noteToView);
    });

    test('fails with statuscode 404 if note does not exist', async () => {
      const validNonexistingId = await nonExistingId();

      await api.get(`/api/notes/${validNonexistingId}`).expect(404);
    });

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445';

      await api.get(`/api/notes/${invalidId}`).expect(400);
    });
  });

  describe('addition of a new note', () => {
    test('succeeds with valid data', async () => {
      const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
      };

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const notesAtEnd = await notesInDb();
      assert.strictEqual(notesAtEnd.length, initialNotes.length + 1);

      const contents = notesAtEnd.map((n) => n.content);
      assert(contents.includes('async/await simplifies making async calls'));
    });

    test('fails with status code 400 if data is invalid', async () => {
      const newNote = {
        important: true,
      };

      await api.post('/api/notes').send(newNote).expect(400);

      const notesAtEnd = await notesInDb();
      assert.strictEqual(notesAtEnd.length, initialNotes.length);
    });
  });

  describe('deletion of a note', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const notesAtStart = await notesInDb();
      const notesToDelete = notesAtStart[0];

      await api.delete(`/api/notes/${notesToDelete.id}`).expect(204);

      const notesAtEnd = await notesInDb();

      const contents = notesAtEnd.map((n) => n.content);
      assert(!contents.includes(notesToDelete.content));

      assert.strictEqual(notesAtEnd.length, initialNotes.length - 1);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});

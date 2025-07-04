const notesRouter = require('express').Router();
const Note = require('../models/note');
const User = require('../models/user');

// retrieve all notes
notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1,
  });
  response.json(notes);
});

// retrieve one note
notesRouter.get('/:id', async (request, response, next) => {
  const id = request.params.id;

  try {
    const note = await Note.findById(id);

    if (!note) {
      return response.status(404).end();
    }

    response.json(note);
  } catch (error) {
    next(error);
  }
});

// create a new note
notesRouter.post('/', async (request, response) => {
  const { userId, content, important } = request.body;

  if (!content) {
    return response.status(400).json({ error: 'content missing' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' });
  }

  const note = new Note({
    content,
    important: important || false,
    user: user._id,
  });

  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();

  response.status(201).json(savedNote);
});

// delete a note
notesRouter.delete('/:id', async (request, response, next) => {
  const id = request.params.id;

  try {
    await Note.findByIdAndDelete(id);
    response.status(204).end();
  } catch (exception) {
    next(exception);
  }
});

// update a note
notesRouter.put('/:id', async (request, response, next) => {
  const id = request.params.id;
  const { content, important } = request.body;

  try {
    const note = await Note.findById(id);

    note.content = content;
    note.important = important;

    const savedNote = await note.save();

    response.json(savedNote);
  } catch (exception) {
    next(exception);
  }
});

module.exports = notesRouter;

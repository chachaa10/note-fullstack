const notesRouter = require('express').Router();
const { NoteModel } = require('../models/note');

// retrieve all notes
notesRouter.get('/', async (request, response) => {
  const notes = await NoteModel.find({});
  response.json(notes);
});

// retrieve one note
notesRouter.get('/:id', (request, response, next) => {
  try {
    const note = NoteModel.findById(request.params.id);

    if (!note) {
      response.status(404).end();
    }

    response.json(note);
  } catch (exception) {
    next(exception);
  }
});

// create a new note
notesRouter.post('/', async (request, response, next) => {
  const body = request.body;

  const note = new NoteModel({
    content: body.content,
    important: body.important || false,
  });

  try {
    const savedNote = await note.save();
    response.status(201).json(savedNote);
  } catch (exception) {
    next(exception);
  }
});

// delete a note
notesRouter.delete('/:id', async (request, response, next) => {
  const id = request.params.id;

  try {
    await NoteModel.findByIdAndDelete(id);
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
    const note = await NoteModel.findById(id);

    note.content = content;
    note.important = important;

    const savedNote = await note.save();

    response.json(savedNote);
  } catch (exception) {
    next(exception);
  }
});

module.exports = notesRouter;

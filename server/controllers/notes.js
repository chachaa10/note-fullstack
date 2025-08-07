const jwt = require('jsonwebtoken');
const notesRouter = require('express').Router();
const Note = require('../models/note');
const User = require('../models/user');

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 });

  response.json(notes);
});

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

notesRouter.post('/', async (request, response) => {
  const body = request.body;

  const getTokenFrom = (request) => {
    const authorization = request.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '');
    }
    return null;
  };

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const user = await User.findById(decodedToken.id);
  if (!user) {
    return response.status(400).json({ error: 'UserId missing or invalid' });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user._id,
  });

  const savedNote = await note.save();
  user.notes = [...user.notes, savedNote._id];
  await user.save();

  response.status(201).json(savedNote);
});

notesRouter.put('/:id', async (request, response, next) => {
  const { content, important } = request.body;

  const getTokenFrom = (request) => {
    const authorization = request.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '');
    }
    return null;
  };

  try {
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' });
    }

    const user = await User.findById(decodedToken.id);
    if (!user) {
      return response.status(400).json({ error: 'UserId missing or invalid' });
    }

    const note = await Note.findById(request.params.id);

    note.content = content;
    note.important = important;
    note.user = user._id;

    await note.save();
    user.notes = [...user.notes, note._id];
    await user.save();

    response.status(201).json(note);
  } catch (error) {
    next(error);
  }
});

notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

notesRouter.delete('/', async (request, response) => {
  await Note.deleteMany({});
  response.status(204).end();
});

module.exports = notesRouter;

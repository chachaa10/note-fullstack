const { NoteModel } = require('./models/note');
const express = require('express');

const dotenv = require('dotenv');
dotenv.config();

const app = express();

// middlewares
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};

app.use(express.static('./dist'));
app.use(express.json());
app.use(requestLogger);

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

// Retrieve all notes
app.get('/api/notes', (request, response) => {
  NoteModel.find({}).then((notes) => {
    response.json(notes);
  });
});

// Retrieve a specific note
app.get('/api/notes/:id', (request, response, next) => {
  const id = request.params.id;
  NoteModel.findById(id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.statusMessage = 'Note not found';
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

// Create a new note
app.post('/api/notes', (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing',
    });
  }

  const note = new NoteModel({
    content: body.content,
    important: body.important || false,
  });

  note.save().then((savedNote) => {
    response.json(savedNote);
  });
});

// Update a specific note
app.put('/api/notes/:id', (request, response, next) => {
  const id = request.params.id;
  const { content, important } = request.body;

  NoteModel.findById(id)
    .then((note) => {
      if (!note) {
        return response.status(404).json({
          error: 'note not found',
        });
      }

      note.content = content;
      note.important = important;

      return note.save().then((updatedNote) => {
        response.json(updatedNote);
      });
    })
    .catch((error) => {
      next(error);
    });
});

// Delete a specific note
app.delete('/api/notes/:id', (request, response, next) => {
  const id = request.params.id;

  NoteModel.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

// error handlers
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

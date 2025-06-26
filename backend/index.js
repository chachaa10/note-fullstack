const { NoteModel } = require('./models/note');
const express = require('express');

const dotenv = require('dotenv');

dotenv.config();

const app = express();
// app.use(express.static('./dist'));
app.use(express.json());

// Retrieve all notes
app.get('/api/notes', (request, response) => {
  NoteModel.find({})
    .then((notes) => {
      response.json(notes);
    })
    .catch(() => {
      response.status(500).json({ error: 'error fetching notes' });
    });
});

// Retrieve a specific note
app.get('/api/notes/:id', (request, response) => {
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
    .catch(() => {
      response.status(500).json({ error: 'error fetching note' });
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
    date: new Date(),
  });

  note
    .save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch(() => {
      response.status(500).json({ error: 'error creating note' });
    });
});

// Update a specific note
app.put('/api/notes/:id', (request, response) => {
  const id = request.params.id;
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  NoteModel.findByIdAndUpdate(id, note, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch(() => {
      response.status(500).json({ error: 'error updating note' });
    });
});

// Delete a specific note
app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id;

  NoteModel.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end();
    })
    .catch(() => {
      response.status(500).json({ error: 'error deleting note' });
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

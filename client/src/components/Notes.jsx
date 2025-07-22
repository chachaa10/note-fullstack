import { useEffect, useState } from 'react';
import notesService from '../services/notes';
import Note from './Note';
import NoteForm from './NoteForm';

const Notes = ({ setErrorMessage }) => {
  const [notes, setNotes] = useState(null);
  const [showAll, setShowAll] = useState(true);

  useEffect(() => {
    notesService.getAllNotes().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);

  if (!notes) {
    return null;
  }

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  const toggleImportanceOf = (id) => {
    const note = notes.find((note) => note.id === id);
    const changedNote = { ...note, important: !note.important };

    notesService
      .updateNotes(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id === id ? returnedNote : note)));
      })
      .catch(() => {
        setErrorMessage(`Note ${note.content} was already removed from server`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  const deleteNote = (id) => {
    notesService.deleteNotes(id).then(() => {
      setNotes(notes.filter((note) => note.id !== id));
    });
  };

  return (
    <>
      <button onClick={() => setShowAll(!showAll)}>
        show {showAll ? 'important' : 'all'}
      </button>

      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
            deleteNote={() => deleteNote(note.id)}
          />
        ))}
      </ul>

      <NoteForm setNotes={setNotes} notes={notes} />
    </>
  );
};

export default Notes;

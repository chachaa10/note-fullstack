import { useState } from 'react';
import noteService from '../services/notes';

const NoteForm = ({ notes, setNotes }) => {
  const [newNote, setNewNote] = useState('');

  const addNote = async (event) => {
    event.preventDefault();

    const noteObject = {
      content: newNote,
      important: true,
    };

    const returnedNote = await noteService.create(noteObject);
    setNotes([...notes, returnedNote]);

    setNewNote('');
  };

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={(event) => setNewNote(event.target.value)}
        />
        <button type='submit'>save</button>
      </form>
    </div>
  );
};

export default NoteForm;

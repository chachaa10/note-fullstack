import { useState } from 'react';
import noteService from '../services/notes';

const NoteForm = ({ notes, setNotes, toggleVisibilityOfParent }) => {
  const [newNote, setNewNote] = useState('');

  const addNote = async (event) => {
    event.preventDefault();

    toggleVisibilityOfParent();

    const noteObject = {
      content: newNote,
      important: true,
    };

    try {
      const returnedNote = await noteService.create(noteObject);
      setNotes([...notes, returnedNote]);
      setNewNote('');
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={(event) => setNewNote(event.target.value)}
          placeholder='new note content'
        />
        <button type='submit'>save</button>
      </form>
    </div>
  );
};

export default NoteForm;

import { useState } from 'react';

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('');

  const addNote = (event) => {
    event.preventDefault();
    createNote({
      content: newNote,
      important: true,
    });
    setNewNote('');
  };

  return (
    <div>
      <h2>Create a new note</h2>
      <form onSubmit={addNote}>
        <label htmlFor='content'>
          content:{' '}
          <input
            id='content'
            value={newNote}
            onChange={(event) => setNewNote(event.target.value)}
            placeholder='write note content here'
          />
        </label>
        <button type='submit'>save</button>
      </form>
    </div>
  );
};

export default NoteForm;

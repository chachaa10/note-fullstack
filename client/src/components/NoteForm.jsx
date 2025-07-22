import notesService from '../services/notes';
const NoteForm = ({ newNotes, setNewNotes, notes, setNotes }) => {
  const addNote = (event) => {
    event.preventDefault();

    if (newNotes.trim() === '') return;

    const newNote = {
      content: newNotes,
      important: Math.random() < 0.5,
    };

    notesService.createNotes(newNote).then((returnedNote) => {
      setNotes([...notes, returnedNote]);
      setNewNotes('');
    });
  };

  return (
    <>
      <form onSubmit={addNote}>
        <input
          type='text'
          value={newNotes}
          onChange={(event) => setNewNotes(event.target.value)}
        />
        <button type='submit'>save</button>
      </form>
    </>
  );
};

export default NoteForm;

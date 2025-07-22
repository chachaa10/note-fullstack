import notesService from '../services/notes';
import Note from './Note';

const NoteForm = ({
  showAll,
  newNotes,
  setNewNotes,
  setShowAll,
  notes,
  setNotes,
  setErrorMessage,
}) => {
  if (!notes) {
    return null;
  }

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  const addNote = (event) => {
    event.preventDefault();

    if (newNotes.trim() === '') {
      return;
    }

    const newNote = {
      content: newNotes,
      important: Math.random() < 0.5,
    };

    notesService.createNotes(newNote).then((returnedNote) => {
      setNotes([...notes, returnedNote]);
      setNewNotes('');
    });
  };

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
      <div>
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
        <form onSubmit={addNote}>
          <input
            type='text'
            value={newNotes}
            onChange={(event) => setNewNotes(event.target.value)}
          />
          <button type='submit'>save</button>
        </form>
      </div>
    </>
  );
};

export default NoteForm;

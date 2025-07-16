import Note from './Note';

const NoteForm = ({
  showAll,
  notesToShow,
  toggleImportanceOf,
  deleteNote,
  addNote,
  newNotes,
  setNewNotes,
  setShowAll,
}) => {
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

import { useRef, useState } from 'react';
import Footer from './components/Footer';
import LoginForm from './components/LoginForm';
import Note from './components/Note';
import NoteForm from './components/NoteForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import { useNotes } from './hooks/useNotes';
import { useUser } from './hooks/useUser';

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const { user, login, logout } = useUser();
  const { notes, addNote, toggleImportanceOf, deleteNote } = useNotes(user);
  const [showAll, setShowAll] = useState(true);
  const noteFormRef = useRef();

  const handleLogin = async (username, password) => {
    try {
      await login(username, password);
    } catch (exception) {
      setErrorMessage('wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleAddNote = async (noteObject) => {
    try {
      noteFormRef.current.toggleVisibility();
      await addNote(noteObject);
    } catch (error) {
      setErrorMessage('Failed to create note.');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  return (
    <>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {!user ? (
        <Togglable buttonLabel='log in'>
          <LoginForm handleLogin={handleLogin} />
        </Togglable>
      ) : (
        <div>
          <p>
            {user.name} logged in <button onClick={logout}>logout</button>
          </p>
          <Togglable buttonLabel='new note' ref={noteFormRef}>
            <NoteForm createNote={handleAddNote} />
          </Togglable>
        </div>
      )}

      {user && (
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
                handleDelete={() => deleteNote(note.id)}
              />
            ))}
          </ul>
        </div>
      )}
      <Footer />
    </>
  );
};

export default App;

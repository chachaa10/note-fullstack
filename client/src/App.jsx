import { useEffect, useRef, useState } from 'react';
import Footer from './components/Footer';
import LoginForm from './components/LoginForm';
import Note from './components/Note';
import NoteForm from './components/NoteForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import loginService from './services/login';
import noteService from './services/notes';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const noteFormRef = useRef();

  const USER_KEY_LOCAL_STORAGE = 'loggedNoteappUser';

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(USER_KEY_LOCAL_STORAGE);
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const initialNotes = await noteService.getAll();
        setNotes(initialNotes);
      } catch (error) {
        if (error.message === 'Unauthorized: Please log in again.') {
          setUser(null);
          setErrorMessage('Session expired. Please log in again.');
          setTimeout(() => setErrorMessage(null), 5000);
        } else {
          setErrorMessage('Failed to fetch notes.');
          setTimeout(() => setErrorMessage(null), 5000);
          console.error('Error fetching notes:', error);
        }
      }
    };
    if (user) {
      fetchNotes();
    } else {
      setNotes([]);
    }
  }, [user]);

  const toggleImportanceOf = async (id) => {
    const note = notes.find((n) => n.id === id);

    if (!note) {
      console.warn(`Note with id ${id} was not found`);
      return;
    }

    const changedNote = { ...note, important: !note.important };

    try {
      const returnedNote = await noteService.update(id, changedNote);
      setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
    } catch (error) {
      if (error.message === 'Unauthorized: Please log in again.') {
        setUser(null);
        setErrorMessage('Session expired. Please log in again.');
        setTimeout(() => setErrorMessage(null), 5000);
      } else {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        console.error('Error updating note importance:', error);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note? ')) {
      try {
        await noteService.deleteNote(id);
        setNotes(notes.filter((note) => note.id !== id));
      } catch (error) {
        if (error.message === 'Unauthorized: Please log in again.') {
          setUser(null); // Log out the user
          setErrorMessage('Session expired. Please log in again.');
          setTimeout(() => setErrorMessage(null), 5000);
        } else {
          // Original error message for other issues
          setErrorMessage(
            `Failed to delete note. It might have been removed already.`
          );
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
          console.error('Error deleting note', error);
        }
      }
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem(USER_KEY_LOCAL_STORAGE, JSON.stringify(user));
      noteService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setErrorMessage('wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem(USER_KEY_LOCAL_STORAGE);
    noteService.setToken(null);
    setUser(null);
    setNotes([]);
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  const hideNoteForm = () => {
    noteFormRef.current.toggleVisibility();
  };

  const loginForm = () => {
    return (
      <Togglable buttonLabel='log in'>
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={(event) => setUsername(event.target.value)}
          handlePasswordChange={(event) => setPassword(event.target.value)}
          handleSubmit={handleLogin}
        />
      </Togglable>
    );
  };

  return (
    <>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {!user && loginForm()}
      {user && (
        <div>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel='new note' ref={noteFormRef}>
            <NoteForm
              notes={notes}
              setNotes={setNotes}
              toggleVisibilityOfParent={hideNoteForm}
            />
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
                handleDelete={() => handleDelete(note.id)}
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

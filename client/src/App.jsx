import { useEffect, useState } from 'react';
import Footer from './components/Footer';
import LoginForm from './components/LoginForm';
import NoteForm from './components/NoteForm';
import Notification from './components/Notification';
import loginService from './services/login';
import notesService from './services/notes';

const App = () => {
  const [notes, setNotes] = useState(null);
  const [newNotes, setNewNotes] = useState('');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const userKeyStorage = 'user';

  useEffect(() => {
    notesService.getAllNotes().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(userKeyStorage);

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      notesService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem(userKeyStorage, JSON.stringify(user));
      notesService.setToken(user.token);
      setUser(user);

      setUsername('');
      setPassword('');
    } catch (exception) {
      setErrorMessage('Wrong Credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem(userKeyStorage);
    setUser(null);
  };

  return (
    <div>
      <h1>Notes</h1>
      {user && <button onClick={handleLogout}>Logout</button>}

      <Notification message={errorMessage} />

      {user === null ? (
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      ) : (
        <div>
          <p>{user.username} logged-in</p>
          <NoteForm
            showAll={showAll}
            newNotes={newNotes}
            setNewNotes={setNewNotes}
            setShowAll={setShowAll}
            notes={notes}
            setNotes={setNotes}
            setErrorMessage={setErrorMessage}
          />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default App;

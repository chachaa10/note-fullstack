import { useEffect, useState } from 'react';
import Footer from './components/Footer';
import LoginForm from './components/LoginForm';
import Notes from './components/Notes';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import loginService from './services/login';
import notesService from './services/notes';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const USER_KEY_LOCAL_STORAGE = 'user';

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(USER_KEY_LOCAL_STORAGE);

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

      window.localStorage.setItem(USER_KEY_LOCAL_STORAGE, JSON.stringify(user));
      notesService.setToken(user.token);
      setUser(user);

      setUsername('');
      setPassword('');
    } catch {
      setErrorMessage('Wrong Credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem(USER_KEY_LOCAL_STORAGE);
    setUser(null);
  };

  return (
    <>
      <h1>Notes</h1>

      {user === null ? (
        <Togglable buttonLabel='login'>
          <Notification message={errorMessage} />
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
          />
        </Togglable>
      ) : (
        <>
          <button onClick={handleLogout}>Logout</button>
          <p>{user.username} logged-in</p>
          <Notes setErrorMessage={setErrorMessage} />
        </>
      )}

      <Footer />
    </>
  );
};

export default App;

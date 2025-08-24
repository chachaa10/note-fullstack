import { useEffect, useState } from 'react';
import loginService from '../services/login';
import noteService from '../services/notes';

const USER_KEY_LOCAL_STORAGE = 'loggedNoteappUser';

export const useUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(USER_KEY_LOCAL_STORAGE);
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  const login = async (username, password) => {
    const user = await loginService.login({
      username,
      password,
    });
    window.localStorage.setItem(USER_KEY_LOCAL_STORAGE, JSON.stringify(user));
    noteService.setToken(user.token);
    setUser(user);
  };

  const logout = () => {
    window.localStorage.removeItem(USER_KEY_LOCAL_STORAGE);
    noteService.setToken(null);
    setUser(null);
  };

  return {
    user,
    login,
    logout,
  };
};

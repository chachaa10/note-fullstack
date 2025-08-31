// hooks/useUser.js
import { useEffect, useState } from 'react';
import loginService from '../services/login';
import noteService from '../services/notes';

const USER_KEY_LOCAL_STORAGE = 'loggedNoteappUser';

export const useUser = () => {
  const [user, setUser] = useState(null);

  const logout = () => {
    window.localStorage.removeItem(USER_KEY_LOCAL_STORAGE);
    noteService.setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(USER_KEY_LOCAL_STORAGE);
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }

    // Connect the logout function to the note service's interceptor
    noteService.setOnExpiredToken(logout);
  }, []); // Empty array ensures this runs only once on mount

  const login = async (username, password) => {
    const user = await loginService.login({
      username,
      password,
    });

    window.localStorage.setItem(USER_KEY_LOCAL_STORAGE, JSON.stringify(user));
    noteService.setToken(user.token);
    setUser(user);
  };

  return {
    user,
    login,
    logout,
  };
};

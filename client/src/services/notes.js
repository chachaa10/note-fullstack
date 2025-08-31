import axios from 'axios';
const baseUrl = '/api/notes';

let token = null;
let onExpiredTokenCallback = null;

// Create a new Axios instance to attach the interceptor
const notesApi = axios.create({
  baseURL: baseUrl,
});

// Set up the interceptor on the dedicated instance
notesApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If a callback is available, run it to log out the user
      if (onExpiredTokenCallback) {
        onExpiredTokenCallback();
      }
      // Re-throw the error so the component can also handle it if needed
      return Promise.reject(new Error('Unauthorized: Please log in again.'));
    }
    // For all other errors, just pass them along
    return Promise.reject(error);
  }
);

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const setOnExpiredToken = (callback) => {
  onExpiredTokenCallback = callback;
};

const getAll = async () => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await notesApi.get('/', config);
  return response.data;
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await notesApi.post('/', newObject, config);
  return response.data;
};

const update = async (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await notesApi.put(`/${id}`, newObject, config);
  return response.data;
};

const deleteNote = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await notesApi.delete(`/${id}`, config);
  return response.data;
};

export default {
  setToken,
  setOnExpiredToken,
  getAll,
  create,
  update,
  deleteNote,
};

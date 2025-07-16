import axios from 'axios';

const baseUrl = '/api/notes';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAllNotes = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const createNotes = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);

  return response.data;
};

const updateNotes = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data);
};

const deleteNotes = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

export default {
  getAllNotes,
  createNotes,
  updateNotes,
  deleteNotes,
  setToken,
};

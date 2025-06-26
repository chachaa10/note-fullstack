import axios from 'axios';

const baseUrl = '/api/notes';

const getAllNotes = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const createNotes = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
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
};
